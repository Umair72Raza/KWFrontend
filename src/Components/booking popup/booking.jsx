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
} from "reactstrap";
import Swal from "sweetalert2";
import { button, heading, Labels, div } from "./constants.js";
import { useDispatch, useSelector } from "react-redux";
import { CreateOrder } from "../../Redux/Slices/BookingSlice.js";
import socket from "../../SocketManager/socketManager.js";
import OfferResult from "../../Components/OfferResult/OfferResult.jsx";
import { failureToast } from "../../utils.js";

const Booking = ({ modal, toggle, worker, chat }) => {
  const { user, token } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDetails, setTaskDetails] = useState(``);
  const [dateTime, setDateTime] = useState("");
  const [amountPerHour, setAmountPerHour] = useState("");
  const [serviceOption, setServiceOption] = useState("none");
  const [params, SetParams] = useState({});
  const [offerResult, setOfferResult] = useState("");
  const dateTimeObject = new Date(dateTime);
  const datePart = dateTimeObject.toLocaleDateString();
  const timePart = dateTimeObject.toLocaleTimeString();
  const [formComplete, setFormComplete] = useState(false);
  const [dateTimeError, setDateTimeError] = useState("");
  
  let removedUsers=useSelector((state) => state?.homepage?.removeWorker);  

  useEffect(() => {
    
    setFormComplete(
      taskTitle.trim() !== "" &&
      taskDetails.trim() !== `` &&
      dateTime !== "" &&
      amountPerHour !== "" &&
      serviceOption !== "none"
    );
  }, [taskTitle, taskDetails, dateTime, amountPerHour, serviceOption]);
  useEffect(() => {
    socket.on("offerResult", (result) => {
      if (result == "accept") {
        setOfferResult('true')
        clear();
      }
      else if (result == "cancel") {
        setOfferResult('false')
      }
    });
    return () => {
      socket.off("offerResult");
    }
  });
  

  useEffect(() => {
    if (user && user._id && offerResult == "true") {
   dispatch(CreateOrder({ params, token }));
    }
  }, [dispatch, offerResult]);


  const handleDateTimeChange = (e) => {
    const selectedDateTime = e.target.value;
    const currentDate = new Date();
    const selectedDate = new Date(selectedDateTime);
    if (selectedDate < currentDate) {
      setDateTimeError('Please choose a future date and time.');
      setDateTime("");
    } else {
      setDateTimeError("");
      setDateTime(selectedDateTime);
    }
  };


  const handleSend = () => {
    const data = {
      Title: taskTitle,
      Status: "Scheduled",
      users: [user._id, worker._id],
      date: datePart,
      time: timePart,
      details: taskDetails.replace(/\n/g, '<br>'),
      amount: amountPerHour,
      service: serviceOption,
    };
    SetParams(data);

    if(removedUsers)
    {
      const present = removedUsers?.findIndex(u => u._id === worker._id);
      if(present !== -1){
        failureToast("Worker Gets Offline!")
        toggle();
      }
      else{
        socket.emit("newOffer", { params: data, Wid: worker._id, chat: chat, user });
      Swal.fire({
        title: "Offer Sent",
        text: "Continue",
        icon: "success",
        confirmButtonText: "Cool",
      });
      toggle();
      return () => {
        socket.off("newOffer");
      }
      }
    }
    else 
    {
      socket.emit("newOffer", { params: data, Wid: worker._id, chat: chat, user });
      Swal.fire({
        title: "Offer Sent",
        text: "Continue",
        icon: "success",
        confirmButtonText: "Cool",
      });
      toggle();
      return () => {
        socket.off("newOffer");
      }
    }
   
    //present = removedUsers?.filter((u)=>u._id === worker._id)
    console.log(present )
    
    
  
 
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

  const handleServiceOptionChange = (e) => {
    const selectedServiceName = e.target.value;
    setServiceOption(selectedServiceName);
    const selectedService = worker.services.find(
      (service) => service.name === selectedServiceName
    );
    if (selectedService) {
      setAmountPerHour(selectedService.rate);
    }
  };

  const resetForm = () => {
    setTaskTitle("");
    setTaskDetails(``);
    setDateTime("");
    setAmountPerHour("");
    setServiceOption("none");
    setDateTimeError("");
    setFormComplete(false);
  };
  const clear =()=>
  {
    resetForm();
  }
  return (
    <div>
      <Modal isOpen={modal} centered>
        <ModalHeader toggle={toggle} className="justify-content-center fw-bold ">
          {heading.book}
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="taskTitle" className="fw-bold">{Labels.taskTitle}</Label>
            <Input
              type="text"
              id="taskTitle"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label className="fw-bold">{Labels.worker}</Label>
            <div className="d-flex flex-column flex-md-row justify-content-start gap-4">
              <div>
                <b>{div.name}</b>
                {worker?.firstName + " " + worker?.lastName + "  "}
              </div>
              <div>
                {" "}
                <b>{div.status}</b>
                {worker?.status}
              </div>
              <div>
                 <b>{div.rating}</b>
                {starRating(worker?.rating)}
              </div>



            </div>
          </FormGroup>
          <FormGroup>
            <Label for="taskDetails" className="fw-bold ">{Labels.taskDetail}</Label>
            <Input
              type="textarea"
              id="taskDetails"
              value={taskDetails}
              onChange={(e) => setTaskDetails(e.target.value)}
            
            />
          </FormGroup>
          <FormGroup>
            <Label for="serviceOption " className="fw-bold">{Labels.service}</Label>
            <Input
              type="select"
              id="serviceOption"
              value={serviceOption}
              onChange={handleServiceOptionChange}
            >
              <option disabled value={"none"}>
                None
              </option>
              {worker?.services?.map((service, key) => (
                <option key={key} value={service?.name}>
                  {service?.name}
                </option>
              ))}
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="dateTime" className="fw-bold">{Labels.datetime}</Label>
            <Input
              type="datetime-local"
              id="dateTime"
              value={dateTime}
              onChange={handleDateTimeChange}
            />
            {dateTimeError && <div style={{ color: 'red' }}>{dateTimeError}</div>}
          </FormGroup>
          <FormGroup>
            <Label for="amountPerHour" className="fw-bold">{Labels.amount}</Label>
            <Input
              type="number"
              id="amountPerHour"
              value={amountPerHour}
              onChange={(e) => setAmountPerHour(e.target.value)}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" disabled={!formComplete} onClick={handleSend}>
            {button.send}
          </Button>{" "}
          <Button color="secondary" onClick={toggle}>
            {button.cancel}
          </Button>
        </ModalFooter>
      </Modal>
      {offerResult ? (
        <>
          <OfferResult
            result={offerResult}
            params={params}
            setOfferResult={setOfferResult}
          />
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Booking;
