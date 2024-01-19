/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

//cards for the past orders
import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  CardText,
  Container,
  Row,
  Col,
  Button,
} from "reactstrap";
import pastpng from "../../assets/past.png";
import checkpng from "../../assets/check.png";
import { useSelector } from "react-redux";
import { truncateText } from "../../utils";

const PastOrdersCard = ({ scheduledOrdersObject }) => {
  const [showFullDetailsMap, setShowFullDetailsMap] = useState({});
  const { user } = useSelector((state) => state.auth);
  const userRole = user.role;
  let person = null;
  if (userRole === "user") {
    person = "Was completed by: ";
  } else {
    person = "Was Assigned By";
  }
  let isUser;
  if (user.role === "user") {
    isUser = true;
  }

  const transformOrderDetails = (order) => {
    let transformedDetails = order.details.replace(/<br\s*\/?>/g, "\n");

    return showFullDetailsMap[order._id]
      ? order.details
      : truncateText(transformedDetails, 5);
  };

  const toggleDetails = (orderId) => {
    setShowFullDetailsMap((prevMap) => ({
      ...prevMap,
      [orderId]: !prevMap[orderId],
    }));
  };
  return (
    <Container>
      <Row>
        {scheduledOrdersObject?.map((order) => (
          <Col
            key={order._id}
            sm="6"
            md="4"
            lg="3"
            style={{ marginTop: "10px" }}
          >
            <Card
              className="shadow"
              style={{ backgroundColor: "#f6f8fc", height: "100%" }}
            >
              <CardBody>
                <Col
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={pastpng}
                    alt="schTask"
                    style={{ height: "27px", marginRight: "10px" }}
                  />
                  <h5 style={{ marginTop: "4%", textAlign: "center" }}>
                    {order.Title}
                  </h5>
                </Col>{" "}
                <CardText
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {" "}
                  <span style={{ marginTop: "10px" }}>
                    Status: {order.Status}
                  </span>
                  <img
                    src={checkpng}
                    alt="schTask"
                    style={{
                      height: "25px",
                      marginLeft: "1%",
                      marginTop: "-1%",
                    }}
                  />
                </CardText>
                <CardText>Time: {order.time}</CardText>
                <CardText>Date: {order.date}</CardText>
                <CardText>
                  Details:{" "}
                  {showFullDetailsMap[order._id] ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: order.details,
                      }}
                    />
                  ) : (
                    transformOrderDetails(order)
                  )}
                  {order.details.length > 5 && (
                    <Button
                      style={{ marginTop: "-5px" }}
                      color="link"
                      onClick={() => toggleDetails(order._id)}
                    >
                      {showFullDetailsMap[order._id]
                        ? "Show Less"
                        : "Show More"}
                    </Button>
                  )}
                </CardText>
                <CardText>OrderId: {order._id}</CardText>
                <CardText>
                  {person}{" "}
                  {isUser
                    ? `Worker: 
                   ${order?.users[1]?.firstName}
                  `
                    : `User: 
                   ${order?.users[0]?.firstName}
                  `}
                </CardText>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default PastOrdersCard;
