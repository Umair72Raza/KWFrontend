import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  CardText,
  Col,
  Button,
  Container,
  Row,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFeedbacksAsync,
  ordersOfUserByUid,
  togglePersonAccessAsync,
} from "../../Redux/Slices/AdminSlice";
import { capitalizeFirstLetter } from "../../utils";

const PeopleDetails = ({
  person,
  setNewFilPerson,
  setHuman,
  setFeedbacks,
  setOrders,
  setShowFeedbacksState,
  setShowDetailsCard,
  confirmationPopUp
}) => {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [disableFeedbackButton, setDisableFeedbackButton] = useState(false);

  // const confirmationPopUp = async (person) => {
  //   let newAccess;
  //   person.access === "accepted"
  //     ? (newAccess = "Blocked")
  //     : (newAccess = "Unblocked");
  //   try {
  //     const result = await Swal.fire({
  //       title: "Are you sure?",
  //       text: `${person.firstName} will be ${newAccess}`,
  //       icon: "warning",
  //       showCancelButton: true,
  //       confirmButtonColor: "#3085d6",
  //       cancelButtonColor: "#d33",
  //       confirmButtonText: "Yes",
  //     });

  //     if (result.isConfirmed) {
  //       await toggleAccess();
  //       Swal.fire({
  //         title: `${newAccess}`,
  //         icon: "success",
  //       });
  //     }
  //   } finally {
  //   }
  // };
  // const showConfirmation = () =>{
  //   setHuman(person);
  //   confirmationPopUp()
  // }

  const toggleAccess = async () => {
    let access;
    person.access === "accepted" ? (access = "denied") : (access = "accepted");
    const id = person._id;
    const data = { token, id, access };
    const result = await dispatch(togglePersonAccessAsync(data));
    if (result.type === "/admin/toggleAccess/fulfilled") {
      setNewFilPerson(person);
    }
  };

  const getOrders = async (person) => {
    setHuman(person);
    setShowDetailsCard(true);
    setShowFeedbacksState(false);

    const id = person._id;
    const data = { token, id };
    try {
      const result = await dispatch(ordersOfUserByUid(data));
      if (result.type === "/admin/getOrdersofUsers/fulfilled") {
        setOrders(result.payload);
        setShowDetailsCard(true);
      }
    } finally {
    }
  };

  const seeFeedbacks = async (person) => {
    setHuman(person);
    setShowFeedbacksState(true);
    setShowDetailsCard(false);
    setDisableFeedbackButton(true);
    const _id = person._id;
    const data = { token, _id };
    try {
      const result = await dispatch(fetchFeedbacksAsync(data));
      if (result.type === "/admin/getFeedbacks/fulfilled") {
        setFeedbacks(result.payload);
        setShowFeedbacksState(true);
      }
    } finally {
      setDisableFeedbackButton(false);
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
    <Row>
      <Col>
        <Card className="mb-4" style={{ width: "100%" }}>
          <CardBody>
            <CardTitle tag="h5">{`${person.firstName} ${person.lastName}`}</CardTitle>
            <CardText>
              <b>Role: </b>
              {capitalizeFirstLetter(person.role)}
            </CardText>
            <CardText>
              <b>Access: </b>
              {capitalizeFirstLetter(person.access)}
            </CardText>
            <CardText>
              <b>Rating:</b>{" "}
              {person.rating > 0 ? starRating(person.rating) : "Not Rated Yet!"}
            </CardText>
            <CardText>
              <Row>
                <Col className="d-flex flex-column gap-2 flex-sm-column flex-md-column flex-lg-row">
                  <Button
                    color={person.access === "accepted" ? "danger" : "success"}
                    // onClick={() => confirmationPopUp(person)}
                    onClick={() => showConfirmation(person)}
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
                    onClick={() => seeFeedbacks(person)}
                    disabled={disableFeedbackButton}
                  >
                    See Feedbacks
                  </Button>
                </Col>
              </Row>
            </CardText>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default PeopleDetails;
