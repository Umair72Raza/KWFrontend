import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Label,
  FormGroup,
  Progress,
  Col,
  Row,
} from "reactstrap";

import { BookingConstants } from "../../Constants/Constants.js";
import { useDispatch, useSelector } from "react-redux";
import { failureToast } from "../../utils.js";
import { PopUpState } from "../../Context/PopUpProvider.jsx";
import { MdCancelPresentation } from "react-icons/md";
import { allServicesAsync } from "../../Redux/Slices/AdminSlice.js";
import {
  CreateOrder,
  editOrderAsync,
} from "../../Redux/Slices/BookingSlice.js";
import Slider from "react-slick";

const EditOffer = ({ modal, toggle, order }) => {
  const { user, token } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  let {
    SetParam,
    clear,
    setClear,
    SetParams,
    servicelist,
    postedJobs,
    setPostedJobs,
    pendingOrders,
    setPendingOrders,
  } = PopUpState();
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDetails, setTaskDetails] = useState(``);
  const [dateTime, setDateTime] = useState("");
  const [amountPerHour, setAmountPerHour] = useState(5);
  const [orderId, setOrderId] = useState(null);
  const dateTimeObject = new Date(dateTime);
  const datePart = dateTimeObject.toLocaleDateString();
  const timePart = dateTimeObject.toLocaleTimeString();
  const [formComplete, setFormComplete] = useState(false);
  const [dateTimeError, setDateTimeError] = useState("");
  const [amountError, setAmountError] = useState("");

  const [taskTime, setTaskTime] = useState(1);
  const [clicked, setClicked] = useState(true);
  const [imageError, setImageError] = useState("");
  const [images, setImages] = useState([]);

  useEffect(() => {
    dispatch(allServicesAsync());
  }, []);
  const list = useSelector((state) => state?.admin?.services);
  const [serviceOption, setServiceOption] = useState([]);

  useEffect(() => {
    if (order) {
      setTaskTitle(order.Title);
      setTaskDetails(order.details);
      setDateTime("");
      setAmountPerHour(5);
      setServiceOption(order.service);
      setTaskTime(1);
      setImages(order.images);
      setOrderId(order._id);
    }
  }, [order]);

  useEffect(() => {
    const isFormComplete =
      taskTitle?.trim() !== "" &&
      taskDetails?.trim() !== "" &&
      dateTime !== "" &&
      amountPerHour >= 5 &&
      amountPerHour <= 100000 &&
      taskTime >= 1 &&
      taskTime <= 9 &&
      serviceOption.length > 0;

    setFormComplete(isFormComplete);
  }, [
    taskTitle,
    taskDetails,
    dateTime,
    amountPerHour,
    taskTime,
    serviceOption,
  ]);

  const handleImageChange = (e) => {
    const selectedImages = Array.from(e.target.files);
    setTimeout(() => {
      setImageError("");
    }, 3000);

    // Filter images that are less than or equal to 1MB
    const filteredImages = selectedImages.filter(
      (image) => image.size <= 1024 * 1024
    );

    // Limit the selected images to the number needed to reach 5
    const remainingSlots = 5 - images?.length || 0;
    const limitedFilteredImages = filteredImages.slice(0, remainingSlots);

    if (remainingSlots > 0) {
      // All selected images are within the size limit, update the images state
      setImages((prevImages) => [...prevImages, ...limitedFilteredImages]);
      setImageError(""); // Clear any previous error message
      e.target.value = null;
    }
    // If there are images exceeding the size limit, set the error message
    if (filteredImages?.length !== selectedImages?.length) {
      setImageError("Each image must be less than 1MB.");
      // Clear the input value
      e.target.value = null;
    }
    // Check if selecting additional images exceeds the limit after adding filtered images
    if (
      selectedImages.length > 5 ||
      images?.length + selectedImages?.length > 5
    ) {
      setImageError("You can select only five images.");
      e.target.value = null; // Clear the input value
    }
  };

  const handleDateTimeChange = (e) => {
    const selectedDateTime = e.target.value;
    const currentDate = new Date();
    const selectedDate = new Date(selectedDateTime);
    if (selectedDate < currentDate) {
      setDateTimeError("Please choose a future date and time.");
      setDateTime("");
    } else {
      setDateTimeError("");
      setDateTime(selectedDateTime);
    }
  };

  const Post = async () => {
    const currentDate = new Date();
    const selectedDate = new Date(dateTime);
    const Users = [user._id];
    let status = "Posted";
    if (selectedDate > currentDate) {
      const data = {
        Title: taskTitle,
        Status: status,
        users: Users,
        date: datePart,
        time: timePart,
        details: taskDetails.replace(/\n/g, "<br>"),
        amount: amountPerHour,
        service: serviceOption,
        address: user.address,
        tasktime: taskTime,
        images,
        // location: user.location,
      };
      const formData = new FormData();

      for (const key in data) {
        if (data.hasOwnProperty(key) && key != "users" && key != "service") {
          formData.append(key, data[key]);
        } else {
          Users.forEach((u, index) => {
            formData.append(`users`, u);
          });
        }
      }

      // Append location coordinates to FormData
      if (user.location && user.location.coordinates) {
        formData.append("location[type]", "Point");
        formData.append(
          "location[coordinates][]",
          user.location.coordinates[0]
        );
        formData.append(
          "location[coordinates][]",
          user.location.coordinates[1]
        );
      }

      serviceOption.forEach((s, index) => {
        formData.append(`service`, s);
      });
      images.forEach((image, index) => {
        formData.append(`images`, image);
      });

      SetParam(formData);
      SetParams(data);

      if (amountPerHour >= 5 && amountPerHour <= 100000) {
        if (orderId) {
          const data = { formData, token, id: orderId };
          const result = await dispatch(editOrderAsync(data));

          if (result.payload) {
            if (order.Status === "Posted") {
              setPostedJobs(
                postedJobs?.map((job) =>
                  job._id === result.payload._id ? result.payload : job
                )
              );
            } else if (order.Status === "Pending") {
              setPendingOrders(
                pendingOrders.filter(
                  (pendingOrder) => pendingOrder._id !== orderId
                )
              );

              // Add the order to postedJobs
              setPostedJobs([...postedJobs, result.payload]);
            }
          }
        } else {
          dispatch(CreateOrder({ formData, token }));
        }

        resetForm();
        toggle();
      } else {
        setAmountError("Enter amount in range 5-100000");
        setClicked(true);
      }

      //setClicked(true)
    } else {
      failureToast("Time is in past! select the future time");
      setDateTime("");
      setClicked(false);
      setFormComplete(false);
    }
  };

  const handleServiceOptionChange = (serviceName) => {
    const isSelected = serviceOption.includes(serviceName);

    if (isSelected) {
      setServiceOption(
        serviceOption.filter((service) => service !== serviceName)
      );
    } else {
      if (serviceOption.length < 2) {
        setServiceOption([...serviceOption, serviceName]);
      }
    }
  };
  useEffect(() => {
    if (clear == true) {
      resetForm();
      setClear(false);
    }
  }, [clear]);
  const resetForm = () => {
    setTaskTitle("");
    setTaskDetails(``);
    setDateTime("");
    setAmountPerHour(5);
    setServiceOption([]);
    setDateTimeError("");
    setTaskTime(1);
    setImages([]);
    setFormComplete(false);
  };
  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };
  const handleAmountChange = (e) => {
    const enteredValue = e.target.value;
    setAmountPerHour(enteredValue);
    if (enteredValue >= 5 && enteredValue <= 100000) {
      setAmountError("");
    } else {
      setAmountError("Enter amount in range 5-100000");
      //setAmountPerHour()
    }
  };
  const handleDeleteImage = (index) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
  };

  const settings = {
    dots: true,
    infinite: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  return (
    <div>
      <Modal isOpen={modal} centered>
        <ModalHeader
          toggle={toggle}
          className="justify-content-center fw-bold "
        >
          Post A Job
        </ModalHeader>
        <ModalBody
          style={{
            minHeight: "300px",
            maxHeight: "450px",
            overflowY: "scroll",
          }}
        >
          <FormGroup>
            <Label for="taskTitle" className="fw-bold">
              {BookingConstants.Labels.taskTitle}
              <span style={{ color: "red" }}>*</span>
            </Label>
            <Input
              type="text"
              id="taskTitle"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              maxLength={50}
            />
            {taskTitle?.length >= 50 && (
              <div style={{ color: "red" }}>Cannot exceed 50 characters</div>
            )}
          </FormGroup>

          <FormGroup>
            <Label className="fw-bold">Address</Label>
            <div>{user?.address}</div>
          </FormGroup>
          <FormGroup>
            <Label for="taskDetails" className="fw-bold ">
              {BookingConstants.Labels.taskDetail}
              <span style={{ color: "red" }}>*</span>
            </Label>
            <Input
              type="textarea"
              id="taskDetails"
              value={taskDetails}
              onChange={(e) => setTaskDetails(e.target.value)}
              maxLength={1000}
              style={{ minHeight: "100px", maxHeight: "100px" }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              {taskDetails.length}/1000
            </div>
            {taskDetails.length >= 1000 && (
              <div style={{ color: "red" }}>Cannot exceed 1000 characters</div>
            )}
          </FormGroup>
          <FormGroup>
            <Label for="serviceOption " className="fw-bold">
              {BookingConstants.Labels.service} (Max. 2 services)
              <span style={{ color: "red" }}>*</span>
            </Label>

            <div
              style={{
                minHeight: "100px",
                maxHeight: "100px",
                overflowY: "auto",
              }}
            >
              {" "}
              {list.length > 0
                ? list.map((service, key) => (
                    <div key={key} className="form-check">
                      <Input
                        type="checkbox"
                        id={`serviceCheckbox_${key}`}
                        className="form-check-input"
                        value={service.name}
                        checked={serviceOption.includes(service.name)}
                        onChange={() => handleServiceOptionChange(service.name)}
                      />

                      <Label
                        htmlFor={`serviceCheckbox_${key}`}
                        className="form-check-label"
                      >
                        {service.name}
                      </Label>
                    </div>
                  ))
                : []}
            </div>
          </FormGroup>
          <FormGroup>
            <Label for="dateTime" className="fw-bold">
              {BookingConstants.Labels.datetime}
              <span style={{ color: "red" }}>*</span>
            </Label>
            <Input
              type="datetime-local"
              id="dateTime"
              value={dateTime}
              onChange={handleDateTimeChange}
              min={getCurrentDateTime()} // Set the minimum date and time
            />
            {dateTimeError && (
              <div style={{ color: "red" }}>{dateTimeError}</div>
            )}
          </FormGroup>
          <FormGroup>
            <Label for="taskTime" className="fw-bold">
              Task Time In Hours<span style={{ color: "red" }}>*</span>
            </Label>
            <Input
              type="number"
              id="taskTime"
              value={taskTime}
              onChange={(e) => setTaskTime(e.target.value)}
              min={1}
              max={8}
              onKeyDown={(e) => {
                if (taskTime.length > 1 && e.key !== "Backspace") {
                  e.preventDefault();
                }
              }}
            />
            {taskTime.length > 1 && (
              <div style={{ color: "red" }}>Task time should be 1-8 hours </div>
            )}
          </FormGroup>
          <FormGroup>
            <Label for="amountPerHour" className="fw-bold">
              {BookingConstants.Labels.amount}
              <span style={{ color: "red" }}>*</span>
            </Label>
            <Input
              type="number"
              id="amountPerHour"
              value={amountPerHour}
              onChange={(e) => handleAmountChange(e)}
              min={5}
              max={100000}
              onKeyDown={(e) => {
                if (amountPerHour.length >= 6 && e.key !== "Backspace") {
                  e.preventDefault();
                }
              }}
            />
            {amountError && <div style={{ color: "red" }}>{amountError}</div>}
          </FormGroup>
          <FormGroup>
            {!order ? (
              <>
                <Label for="images" className="fw-bold">
                  {BookingConstants?.Labels?.images}
                </Label>

                <Input
                  type="file"
                  id="images"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                />
              </>
            ) : (
              <></>
            )}

            {imageError && <div style={{ color: "red" }}>{imageError}</div>}
            {images.length > 0 && (
              <div>
                <p>Selected Images:</p>
                {order?.images?.length > 0 && (
                  <div className="mb-3">
                    <b>Images:</b>
                    <Row style={{ width: "100%" }}>
                      <Slider {...settings} className="">
                        {order.images?.map((image, index) => (
                          <div className="text-center" key={index}>
                            <img
                              key={index}
                              src={`${
                                import.meta.env.VITE_LOCAL_BACKEND_ENDPOINT
                              }${image}`}
                              alt={`Modal Image ${index}`}
                              className="img-fluid"
                              style={{
                                height: "100px",
                                textAlign: "center",
                              }}
                            />
                          </div>
                        ))}
                      </Slider>
                    </Row>
                  </div>
                )}
              </div>
            )}
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            disabled={!formComplete}
            onClick={() => {
              setClicked(false);
              Post();
            }}
          >
            Post
          </Button>{" "}
          <Button color="secondary" onClick={toggle}>
            {BookingConstants.button.cancel}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default EditOffer;
