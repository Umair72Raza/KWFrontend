import React, { useState } from "react";
import { Card, CardBody, CardTitle, CardText, Col, Button, Container } from "reactstrap";
import DetailsCard from "../DetailsCard/DetailsCard";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFeedbacksAsync,
  ordersOfUserByUid,
  togglePersonAccessAsync,
} from "../../Redux/Slices/AdminSlice";
import FeedbacksComp from "../FeedbacksComp/FeedbacksComp";
import Swal from "sweetalert2";
import { capitalizeFirstLetter } from "../../utils";
const PeopleDetails = ({ person, setNewFilPerson }) => {

  const [orders, setOrders] = useState();
  const [feedbacks, setFeedbacks] = useState([]);
  const [disableFeedbackButton, setDisableFeebackButton] = useState(false);
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
          title: `${newAccess}`,
          icon: "warning",
        });
      }
    });
  };

  const toggleAccess = async () => {
    let access;
    person.access === "accepted" ? (access = "denied") : (access = "accepted");
    const id = person._id;
    //dispatch the change status api here
    const data = { token, id, access };
    const result = await dispatch(togglePersonAccessAsync(data));
    if (result.type === "/admin/toggleAccess/fulfilled") {
      setNewFilPerson(person);
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

  const seeFeedbacks = async (person) => {
    // Fetch feedbacks for the person using _id
    const _id = person._id;
    const data = { token, _id };
    const result = await dispatch(fetchFeedbacksAsync(data));
    if (result.type === "/admin/getFeedbacks/fulfilled") {
      setFeedbacks(result.payload);
      setShowFeedbacksState(true);
      setDisableFeebackButton(false);
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
  const feedbackfunction = (person) => {
    setDisableFeebackButton(true);
    seeFeedbacks(person);
  }


  return (
    <Container>
      <Col xs="12" sm="12" md="12" lg="8">
        <Card className="mb-4" style={{ width: "100%" }}>
          <CardBody>
            <CardTitle tag="h5">{`${person.firstName} ${person.lastName}`}</CardTitle>
            <CardText>Role: {capitalizeFirstLetter(person.role)}</CardText>
            <CardText>Access: {capitalizeFirstLetter(person.access)}</CardText>
            <CardText>
              {" "}
              <b>Rating:</b>{" "}
              {person.rating > 0 ? starRating(person.rating) : "Not Rated Yet!"}
            </CardText>
            <Col className="d-flex flex-column gap-2 flex-md-row ">
              <Button
                color={person.access === "accepted" ? "danger" : "success"}

                onClick={() => confirmationPopUp(person)}
              >
                {person.access === "accepted" ? "Block" : "Unblock"}
              </Button>

              <Button
                style={{ backgroundColor: "#5d12cf", border: "none" }}
                onClick={() => getOrders(person)}
              >
                See More Details
              </Button>

              <Button
                color="warning"
                onClick={() => feedbackfunction(person)}
                disabled={disableFeedbackButton}
              >
                See Feedbacks
              </Button>
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
    </Container>
  );
};

export default PeopleDetails;
