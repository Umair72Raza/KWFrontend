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
  setHuman,
  setFeedbacks,
  setOrders,
  setShowFeedbacksState,
  setShowDetailsCard,
  setShowBlock
}) => {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [disableFeedbackButton, setDisableFeedbackButton] = useState(false);
  const [disableDetailsButton, setDisableDetailsButton] = useState(false);
  const [disableBlockButton,setDisableBlockButton] = useState(false)


  const showConfirmation = () =>{
    setHuman(person);
    setDisableBlockButton(true);
    setShowDetailsCard(false);
    setShowFeedbacksState(false);
    setShowBlock(true);
    setDisableBlockButton(false);
  }


  const getOrders = async (person) => {
    setHuman(person);
    setDisableDetailsButton(true);
    setShowFeedbacksState(false);
    setShowBlock(false);
    const id = person._id;
    const data = { token, id };
    try {
      const result = await dispatch(ordersOfUserByUid(data));
      if (result.type === "/admin/getOrdersofUsers/fulfilled") {
        setOrders(result.payload);
        setDisableDetailsButton(true);
        setShowFeedbacksState(false);
        setShowBlock(false);
        setShowDetailsCard(true);
      }
    } finally {
      setDisableDetailsButton(false)
    }
  };

  const seeFeedbacks = async (person) => {
    setHuman(person);
    setShowBlock(false);
    setShowDetailsCard(false);
    //setShowFeedbacksState(true);
    setDisableFeedbackButton(true);
    const _id = person._id;
    const data = { token, _id };
    try {
      const result = await dispatch(fetchFeedbacksAsync(data));
      if (result.type === "/admin/getFeedbacks/fulfilled") {
        setFeedbacks(result.payload);
        setShowBlock(false);
        setShowDetailsCard(false);
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
                    onClick={() => showConfirmation(person)}
                    disabled={disableBlockButton}
                  >
                    {person.access === "accepted" ? "Block" : "Unblock"}
                  </Button>

                  <Button
                    style={{ backgroundColor: "#5d12cf", border: "none" }}
                    onClick={() => getOrders(person)}
                    disabled={disableDetailsButton}
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
