/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

//cards for the past orders
import React from "react";
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
const SimpleOrdersCard = ({ scheduledOrdersObject }) => {
  const { user } = useSelector((state) => state.auth);
  const userId = user._id;
  const userRole = user.role;
  let person = null;
  if (userRole === "user") {
    person = "Was completed by: ";
  } else {
    person = "Was Assigned By";
  }

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
            <Card className="shadow" style={{ backgroundColor: "#f6f8fc" }}>
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
                <CardText>Time: {order.Time}</CardText>
                <CardText>Date: {order.date}</CardText>
                <CardText>Details: {order.details}</CardText>
                <CardText>OrderId: {order._id}</CardText>
                <CardText>
                  {person}{" "}
                  {order.users.map((user) => {
                    if (user.name) {
                      return user.name;
                    } else {
                      return user.firstName;
                    }
                  })}
                </CardText>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default SimpleOrdersCard;
