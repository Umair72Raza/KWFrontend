/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

//cards for cancelled orders
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
import cancelled from "../../assets/cancelled.png";
import { useSelector } from "react-redux";
import { truncateText } from "../../utils";
const CancelledOrders = ({ scheduledOrdersObject }) => {
  const { user } = useSelector((state) => state.auth);
  const [showFullDetailsMap, setShowFullDetailsMap] = useState({});
  const userRole = user.role;
  let person = null;
  if (userRole === "user") {
    person = "Was Assigned to";
  } else {
    person = "Was Assigned By";
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
    <Container style={{}}>
      <Row>
        {scheduledOrdersObject?.map((order) => (
          <Col
            key={order._id}
            sm="6"
            md="4"
            lg="3"
            style={{ marginTop: "10px" }}
          >
            <Card className="shadow" style={{ backgroundColor: "#f6f8fc",height:"100%" }}>
              <CardBody>
                <CardTitle>
                  <Col>
                    <span
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src={cancelled}
                        alt="schTask"
                        style={{ height: "27px", marginRight: "10px" }}
                      />
                      <h5 style={{ marginTop: "4%", textAlign: "center" }}>
                        {order.Title}
                      </h5>
                    </span>
                  </Col>{" "}
                </CardTitle>
                <CardText>Status: {order.Status}</CardText>
                <CardText>Date and Time: {order.date}</CardText>
                <CardText>
                    Details:{" "}
                    {showFullDetailsMap[order._id]
                      ? (
                          <div
                            dangerouslySetInnerHTML={{
                              __html: order.details,
                            }}
                          />
                        )
                      : transformOrderDetails(order)}
                    {order.details.length > 5 && (
                     <Button
                     style={{ marginTop: "-5px" }}
                     color="link"
                     onClick={() => toggleDetails(order._id)}
                   >
                     {showFullDetailsMap[order._id] ? "Show Less" : "Show More"}
                   </Button>
                    )}
                  </CardText>
                {order.cancelReason ? (
                  <>
                    <CardText>
                      Cancelled By: {order.cancelReason?.c_id?.firstName}
                    </CardText>
                    <CardText>
                      Cancelation Reason: {order.cancelReason.reason}
                    </CardText>
                  </>
                ) : (
                  <>
                    <CardText>Refresh To see the detail </CardText>
                  </>
                )}
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default CancelledOrders;
