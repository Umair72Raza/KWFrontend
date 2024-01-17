/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// PersonDetails.jsx
import React, { useState } from "react";
import { Card, CardBody, CardTitle, CardText, Col, Button } from "reactstrap";
import "./styles.css";
import DetailsCard from "../DetailsCard/DetailsCard";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFeedbacksAsync,
  ordersOfUserByUid,
  togglePersonAccessAsync,
} from "../../Redux/Slices/AdminSlice";
import FeedbacksComp from "../FeedbacksComp/FeedbacksComp";
import Swal from "sweetalert2";
const PersonDetails = ({ person, setNewFilUsers }) => {
  const [orders, setOrders] = useState();
  const [feedbacks, setFeedbacks] = useState([]);
  const [showFeedbacksState, setShowFeedbacksState] = useState(false);
  const dispatch = useDispatch();
  const [showDetailsCard, setShowDetailsCard] = useState(false);
  const { token } = useSelector((state) => state.auth);

  const confirmationPopUp = (person) => {
    let newAccess;
    person.access === "accepted"
      ? (newAccess = "Blocked")
      : (newAccess = "Unblocked");
    Swal.fire({
      title: "Are you sure?",
      text: `${person.firstName} will be ${newAccess}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        toggleAccess();
        Swal.fire({
          title: "Blocked!",
          icon: "warning",
        });
      }
    });
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

  const toggleAccess = async () => {
    let access;
    person.access === "accepted" ? (access = "denied") : (access = "accepted");
    const id = person._id;
    //dispatch the change status api here
    const data = { token, id, access };
    const result = await dispatch(togglePersonAccessAsync(data));
    if (result.type === "/admin/toggleAccess/fulfilled") {
      setNewFilUsers(person);
    }
  };
  const getOrders = async (person) => {
    setShowDetailsCard(true);
    const id = person._id;
    const data = { token, id };
    const result = await dispatch(ordersOfUserByUid(data));
    if (result.type === "/admin/getOrdersofUsers/fulfilled") {
      setOrders(result.payload);
    }
  };

  const seeFeedbacks = async (person) => {
    // Fetch feedbacks for the person using _id
    const _id = person._id;

    const data = { token, _id };
    const result = await dispatch(fetchFeedbacksAsync(data));
    if (result.type === "/admin/getFeedbacks/fulfilled") {
      setFeedbacks(result.payload);
      setShowFeedbacksState(true);
    }
  };

  return (
    <div>
      <Col xs="12" sm="10" md="10" lg="10">
        <Card className="mb-4" style={{ width: "100%" }}>
          <CardBody>
            <CardTitle tag="h5">{`${person.firstName} ${person.lastName}`}</CardTitle>
            <CardText>Role: {person.role}</CardText>
            <CardText>Access: {person.access}</CardText>
            <CardText>
              {" "}
              <b>Rating:</b>{" "}
              {person.rating > 0 ? starRating(person.rating) : "Not Rated Yet!"}
            </CardText>
            <Button
              color={person.access === "accepted" ? "danger" : "success"}
              style={{ margin: "10px" }}
              onClick={() => confirmationPopUp(person)}
            >
              {person.access === "accepted" ? "Block" : "Unblock"}
            </Button>

            <Button
              style={{ backgroundColor: "#5dafff", border: "none" }}
              onClick={() => getOrders(person)}
            >
              See More Details
            </Button>

            <Button
             color="warning"  style={{ margin: "10px", color:"" }}
              onClick={() => seeFeedbacks(person)}
            >
              See Feedbacks
            </Button>
          </CardBody>
        </Card>
      </Col>
      {showDetailsCard === true ? (
        <>
          <DetailsCard
            person={person}
            setShowDetailsCard={setShowDetailsCard}
            setShowFeedbacksState={setShowFeedbacksState}
          />
        </>
      ) : (
        <></>
      )}
      {showFeedbacksState ? (
        <>
          <FeedbacksComp
            showFeedbacksState={showFeedbacksState}
            setShowFeedbacksState={setShowFeedbacksState}
            see
          />
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default PersonDetails;
