//cards for cancelled orders
import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  CardText,
  Container,
  Row,
  Col,
  Button,
  Spinner,
} from "reactstrap";
import cancelled from "../../assets/cancelled.png";
import { useSelector } from "react-redux";
import { truncateText } from "../../utils";
const CancelledOrders = ({ scheduledOrdersObject, spinnerVisible }) => {
  const { user } = useSelector((state) => state.auth);
  const [showFullDetailsMap, setShowFullDetailsMap] = useState({});
  const userRole = user.role;
  let person = null;
  if (userRole === "user") {
    person = "Was Assigned to";
  } else {
    person = "Was Assigned By";
  }

  const [showFullReasonMap, setShowFullReasonMap] = useState({});

  const transformCancelReason = (reason, orderId) => {
    return showFullReasonMap[orderId] ? reason : truncateText(reason, 100);
  };

  const toggleCancelReason = (orderId) => {
    setShowFullReasonMap((prevMap) => ({
      ...prevMap,
      [orderId]: !prevMap[orderId],
    }));
  };

  const transformOrderDetails = (order) => {
    let transformedDetails = order.details.replace(/<br\s*\/?>/g, "\n");

    return showFullDetailsMap[order._id]
      ? order.details
      : truncateText(transformedDetails, 30);
  };

  const toggleDetails = (orderId) => {
    setShowFullDetailsMap((prevMap) => ({
      ...prevMap,
      [orderId]: !prevMap[orderId],
    }));
  };
  // useEffect (() => {
  //   console.log("scheduledOrdersObject",scheduledOrdersObject)
  // },[scheduledOrdersObject])
  return (
    <Container>
      {spinnerVisible ? (
        <div style={{ textAlign: "center" }}>
          <Spinner />
        </div>
      ) : scheduledOrdersObject?.length > 0 ? (
        <>
          {" "}
          <Row>
            {scheduledOrdersObject?.map((order) => (
              <Col
                key={order._id}
                sm="6"
                md="6"
                lg="3"
                style={{ marginTop: "10px" }}
              >
                <Card className="shadow" style={{ backgroundColor: "#f6f8fc" }}>
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
                          <h5
                            style={{
                              marginTop: "4%",
                              textAlign: "center",
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                              maxWidth: "100%",
                            }}
                          >
                            {order.Title}
                          </h5>
                        </span>
                      </Col>{" "}
                    </CardTitle>
                    <CardText>
                      <b>Status:</b> {order.Status}
                    </CardText>
                    <CardText>
                      <b>Date:</b> {order.date}
                    </CardText>
                    <CardText>
                      <b>Time:</b> {order.time}
                    </CardText>
                    <CardText>
                      <b>Amount:</b> ${order.amount}
                    </CardText>
                    {/* <CardText>
                        <b>Details:</b>{" "}
                        <div
                          style={{
                            maxHeight: "100px",
                            overflowY: "auto",
                          }}
                        >
                          {showFullDetailsMap[order._id] ? (
                            <div
                              dangerouslySetInnerHTML={{
                                __html: order.details,
                              }}
                            />
                          ) : (
                            transformOrderDetails(order)
                          )}
                          {order.details.length > 30 && (
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
                        </div>
                      </CardText> */}
                    <CardText>
                      <div>
                        <Row>
                          <Col>
                            <b>Details:</b>
                          </Col>
                          <Col>
                            {order.details.length > 30 && (
                              <Button
                                style={{
                                  marginTop: "-5px",
                                  marginLeft: "10px",
                                }} // Adjust spacing as needed
                                color="link"
                                onClick={() => toggleDetails(order?._id)}
                              >
                                {showFullDetailsMap[order?._id]
                                  ? "Show Less"
                                  : "Show More"}
                              </Button>
                            )}
                          </Col>
                        </Row>
                      </div>
                      <div
                        style={{
                          maxHeight: "100px",
                          overflowY: "auto",
                        }}
                      >
                        {showFullDetailsMap[order?._id] ? (
                          <div
                            dangerouslySetInnerHTML={{
                              __html: order?.details,
                            }}
                          />
                        ) : (
                          transformOrderDetails(order).slice(0, 30) // Truncate details
                        )}
                      </div>
                    </CardText>
                    <hr />

                    {order?.cancelReason?.reason?.length > 0 ? (
                      <>
                        <CardText>
                          <b>Cancellation Reason:</b>{" "}
                          <div
                            style={{
                              maxHeight: "100px",
                              overflowY: "auto",
                            }}
                          >
                            <div>
                              {transformCancelReason(
                                order?.cancelReason?.reason,
                                order._id
                              )}
                            </div>

                            {order?.cancelReason?.reason?.length > 30 && (
                              <Button
                                style={{ marginTop: "-5px" }}
                                color="link"
                                onClick={() => toggleCancelReason(order._id)}
                              >
                                {showFullReasonMap[order._id]
                                  ? "Show Less"
                                  : "Show More"}
                              </Button>
                            )}
                          </div>
                        </CardText>
                      </>
                    ) : (
                      <>
                        <CardText>
                          <b>Cancellation Reason: </b> Not Mentioned
                        </CardText>
                      </>
                    )}
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      ) : (
        <>No Cancelled Orders</>
      )}
    </Container>
  );
};

export default CancelledOrders;
