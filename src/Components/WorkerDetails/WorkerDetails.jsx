/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// PersonDetails.jsx
import React, { useState } from "react";
import { Card, CardBody, CardTitle, CardText, Col, Button } from "reactstrap";
import DetailsCard from "../DetailsCard/DetailsCard";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchFeedbacksAsync,
  ordersOfUserByUid,
  togglePersonAccessAsync,
} from "../../Redux/Slices/AdminSlice";
import FeedbacksComp from "../FeedbacksComp/FeedbacksComp";
import Swal from "sweetalert2";

const WorkerDetails = ({ person, setNewFilWorkers }) => {

  const [orders, setOrders] = useState();
  const [feedbacks, setFeedbacks] = useState([]);
  const dispatch = useDispatch();
  const [showFeedbacksState,setShowFeedbacksState] = useState(false);
  const [showDetailsCard, setShowDetailsCard] = useState(false);
  const { token } = useSelector((state) => state.auth);

  const confirmationPop = (person) => { 
    let newAccess;
    person.access === "accepted" ? (newAccess = "Blocked") : (newAccess = "Unblocked");
    Swal.fire({
      title: "Are you sure?",
      text:   `${person.firstName} will be ${newAccess}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes"
    }).then((result) => {
      if (result.isConfirmed) {
        toggleAccess();
        Swal.fire({
          title: `${newAccess}`,
          icon: "warning"
        });
      }
    })
  }
  const toggleAccess = async () => {
    let access;
    person.access === "accepted" ? (access = "denied") : (access = "accepted");
    const id = person._id;
    const data = { token, id, access };


    const result = await dispatch(togglePersonAccessAsync(data));
    if (result.type === "/admin/toggleAccess/fulfilled") {
      setNewFilWorkers(person);
    }
  };
  const getOrders = async (person) => {

    const id = person._id;
    const data = { token, id };
    const result = await dispatch(ordersOfUserByUid(data));
    if (result.type === "/admin/getOrdersofUsers/fulfilled") {
      setOrders(result.payload);
      setShowDetailsCard(true);
    }
  };

  const seeFeedbacks = async(person) => {
    // Fetch feedbacks for the person using _id
    const _id = person._id;

    const data = { token, _id };
    const result = await dispatch(fetchFeedbacksAsync(data));
    if (result.type==="/admin/getFeedbacks/fulfilled") {
      setFeedbacks(result.payload);
      setShowFeedbacksState(true)
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
            <Col>
            <Button
              color={person.access === "accepted" ? "danger" : "success"}
              style={{ margin: "10px" }}
              onClick={()=>confirmationPop(person)}
            >
              {person.access === "accepted" ? "Block" : "Unblock"}
            </Button>

            <Button style={{backgroundColor:"#5dafff", border:"none"}}  onClick={() => getOrders(person)}>See More Details</Button>
            <Button color="warning"  style={{ margin: "10px", color:"" }} onClick={()=>seeFeedbacks(person)}>See Feedbacks</Button>
            </Col>
          </CardBody>
        </Card>
      </Col>
      {showDetailsCard === true ? (
        <>
          <DetailsCard
            person={person}
            setShowDetailsCard={setShowDetailsCard}
            orders={orders}
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
            feedbacks={feedbacks}
          />
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default WorkerDetails;
