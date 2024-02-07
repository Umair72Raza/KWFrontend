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
} from "reactstrap";
import Swal from "sweetalert2";
import { BookingConstants } from "../../Constants/Constants.js";
import { useDispatch, useSelector } from "react-redux";
import { failureToast } from "../../utils.js";
import { PopUpState } from "../../Context/PopUpProvider.jsx";
import { MdCancelPresentation } from "react-icons/md";
import { CreateOrder } from "../../Redux/Slices/BookingSlice.js";

const Booking = ({ modal, toggle, worker, chat, fromPostJob }) => {
  const { user, token } = useSelector((state) => state.auth);
  const socket = useSelector((state) => state?.socket?.socket);
  let list = useSelector((state) => state?.admin?.services);
  const dispatch = useDispatch();
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDetails, setTaskDetails] = useState(``);
  const [dateTime, setDateTime] = useState("");
  const [amountPerHour, setAmountPerHour] = useState(5);
  const [serviceOption, setServiceOption] = useState([]);
  const dateTimeObject = new Date(dateTime);
  const datePart = dateTimeObject.toLocaleDateString();
  const timePart = dateTimeObject.toLocaleTimeString();
  const [formComplete, setFormComplete] = useState(false);
  const [dateTimeError, setDateTimeError] = useState("");
  const [amountError, setAmountError] = useState("");
  let removedUsers = useSelector((state) => state?.homepage?.removeWorker);
  let { SetParam, clear, setClear, SetParams, params } = PopUpState();
  const [taskTime, setTaskTime] = useState(1);
  const [clicked, setClicked] = useState(true);
  const [imageError, setImageError] = useState("");
  const [images, setImages] = useState([]);

  useEffect(() => {
    const isFormComplete =
      taskTitle.trim() !== "" &&
      taskDetails.trim() !== "" &&
      dateTime !== "" &&
      amountPerHour >= 5 &&
      amountPerHour <= 100000 &&
      taskTime >= 1 &&
      taskTime <= 9 &&
      serviceOption.length > 0;

    console.log("Form Complete:", isFormComplete);
    setFormComplete(isFormComplete);
  }, [
    taskTitle,
    taskDetails,
    dateTime,
    amountPerHour,
    taskTime,
    serviceOption,
  ]);

  const handleImageChange = async (e) => {
    const selectedImages = Array.from(e.target.files);
    const totalSize = selectedImages.reduce(
      (acc, image) => acc + image.size,
      0
    );

    if (selectedImages.length > 5) {
      setImageError("You can upload a maximum of 5 images.");
    } else if (totalSize > 5 * 1024 * 1024) {
      setImageError("Total image size cannot exceed 5MB.");
    } else {
      setImages(selectedImages);
      setImageError("");
      await console.log(images, " images");
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

  const handleSend = () => {
    const currentDate = new Date();
    const selectedDate = new Date(dateTime);
    const Users = [user._id, worker._id];
    let status = "Scheduled";
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
        location: user?.location || {}
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

      serviceOption.forEach((s, index) => {
        formData.append(`service`, s);
      });
      images.forEach((image, index) => {
        formData.append(`images`, image);
      });
      SetParam(formData);
      SetParams(data);

      if (amountPerHour >= 5 && amountPerHour <= 100000) {
        if (removedUsers) {
          const present = removedUsers?.findIndex((u) => u._id === worker._id);
          if (present !== -1) {
            failureToast("Worker Gets Offline!");
            toggle();
          } else {
            resetForm();
            socket?.emit("newOffer", {
              params: data,
              Wid: worker._id,
              chat: chat,
              user,
            });
            Swal.fire({
              title: "Offer Sent",
              icon: "success",
              confirmButtonText: "OK",
            });
            toggle();
            return () => {
              socket?.off("newOffer");
            };
          }
        }
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


  const handlePost = async() => {
    const currentDate = new Date();
    const selectedDate = new Date(dateTime);
    const Users = [user._id];
    let status = "Posted";
    if (selectedDate > currentDate) {
      const data = {
        params: {
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
          location: user?.location || {}
        },
        token: token
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

      serviceOption.forEach((s, index) => {
        formData.append(`service`, s);
      });
      images.forEach((image, index) => {
        formData.append(`images`, image);
      });

      if (amountPerHour >= 5 && amountPerHour <= 100000) {
         {
            
           // console.log(params,"params")
            const result = await dispatch(CreateOrder(data))
            console.log(result)
            Swal.fire({
              title: "Job Posted",
              icon: "success",
              confirmButtonText: "OK",
            });
            toggle();
            resetForm();
          }
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

  
  const starRating = (numStars) => {
    const stars = [];
    for (let i = 0; i < numStars; i++) {
      stars.push(
        <span key={i} className="y">
          ★
        </span>
      );
    }
    return stars;
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

  return (
    <div>
      <Modal isOpen={modal} centered>
        <ModalHeader
          toggle={toggle}
          className="justify-content-center fw-bold "
        >
          {BookingConstants.heading.book}
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
            </Label>
            <Input
              type="text"
              id="taskTitle"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              maxLength={50}
            />
            {taskTitle.length >= 50 && (
              <div style={{ color: "red" }}>Cannot exceed 50 characters</div>
            )}
          </FormGroup>
          {!fromPostJob ? (
            <>
              <FormGroup>
                <Label className="fw-bold">
                  {BookingConstants.Labels.worker}
                </Label>
                <div className="d-flex flex-column flex-md-row  gap-md-4">
                  <div>
                    <b>{BookingConstants.div.name}</b>
                    {worker?.firstName + " " + worker?.lastName + "  "}
                  </div>
                  <div>
                    {" "}
                    <b>{BookingConstants.div.status}</b>
                    {worker?.status}
                  </div>
                  <div className="">
                    <b>{BookingConstants.div.rating}</b>
                    {worker?.rating > 0
                      ? starRating(worker.rating)
                      : "not rated yet"}
                  </div>
                </div>
              </FormGroup>
            </>
          ) : (
            <></>
          )}

          <FormGroup>
            <Label className="fw-bold">Address</Label>
            <div>{user.address}</div>
          </FormGroup>
          <FormGroup>
            <Label for="taskDetails" className="fw-bold ">
              {BookingConstants.Labels.taskDetail}
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
          {!fromPostJob ? (
            <>
              <FormGroup>
                <Label for="serviceOption " className="fw-bold">
                  {BookingConstants.Labels.service}
                </Label>

                <div
                  style={{
                    minHeight: "100px",
                    maxHeight: "100px",
                    overflowY: "auto",
                  }}
                >
                  {" "}
                  {worker?.services?.map((service, key) => (
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
                  ))}
                </div>
              </FormGroup>
            </>
          ) : (
            <>
            <FormGroup>
                <Label for="serviceOption " className="fw-bold">
                  {BookingConstants.Labels.service}
                </Label>

                <div
                  style={{
                    minHeight: "100px",
                    maxHeight: "100px",
                    overflowY: "auto",
                  }}
                >
                  {" "}
                  {list?.map((service, key) => (
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
                  ))}
                </div>
              </FormGroup>
            </>
          )}

          <FormGroup>
            <Label for="dateTime" className="fw-bold">
              {BookingConstants.Labels.datetime}
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
              Task Time In Hours
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
            <Label for="images" className="fw-bold">
              {BookingConstants.Labels.images}
            </Label>
            <Input
              type="file"
              id="images"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
            {imageError && <div style={{ color: "red" }}>{imageError}</div>}
            {images.length > 0 && (
              <div>
                <p>Selected Images:</p>
                {images.map((image, index) => (
                  <div key={index} className="d-flex flex-row gap-2 ">
                    <Progress value={100} max={100} className="w-50 mb-2">
                      {image.name}{" "}
                    </Progress>
                    {/* <Button
                        type="button"
                        className="px-0 pt"
                        onClick={() => handleDeleteImage(index)}> */}
                    <MdCancelPresentation
                      onClick={() => handleDeleteImage(index)}
                      text="dark"
                    >
                      {" "}
                    </MdCancelPresentation>
                    {/* </Button> */}
                  </div>
                ))}
              </div>
            )}
          </FormGroup>
        </ModalBody>
        <ModalFooter>
        {!fromPostJob ? <>
          <Button
            color="primary"
            disabled={!formComplete}
            onClick={() => {
              setClicked(false);
              handleSend();
            }}
          >
            {BookingConstants.button.send}
          </Button>{" "}
        </>:
        <>
            <Button
            color="primary"
            disabled={!formComplete}
            onClick={() => {
              setClicked(false);
              handlePost();
            }}
          >
            Post
          </Button>{" "}
        </>}
      
          <Button color="secondary" onClick={toggle}>
            {BookingConstants.button.cancel}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Booking;
