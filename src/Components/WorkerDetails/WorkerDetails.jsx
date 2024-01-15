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
} from "../../Redux/Slices/Admin";
import FeedbacksComp from "../FeedbacksComp/FeedbacksComp";

const WorkerDetails = ({ person, setNewFilWorkers }) => {
  const [orders, setOrders] = useState();
  const [feedbacks, setFeedbacks] = useState([]);
  const dispatch = useDispatch();
  const [showFeedbacksState,setShowFeedbacksState] = useState(false);
  const [showDetailsCard, setShowDetailsCard] = useState(false);
  const { token } = useSelector((state) => state.auth);
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
      console.log(result.payload,"details feedb");
      setFeedbacks(result.payload);
      setShowFeedbacksState(true)
    }
  };

  return (
    <div>
      <Col xs="12" sm="8" md="8" lg="10">
        <Card className="mb-4" style={{ width: "100%" }}>
          <CardBody>
            <CardTitle tag="h5">{`${person.firstName} ${person.lastName}`}</CardTitle>
            <CardText>Role: {person.role}</CardText>
            <CardText>Access: {person.access}</CardText>
            <Col>
            <Button
              color={person.access === "accepted" ? "success" : "danger"}
              style={{ margin: "10px" }}
              onClick={toggleAccess}
            >
              {person.access === "accepted" ? "Block" : "UnBlock"}
            </Button>

            <Button onClick={() => getOrders(person)}>See More Details</Button>
            <Button style={{ margin: "10px" }} onClick={()=>seeFeedbacks(person)}>See Feedbacks</Button>
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
