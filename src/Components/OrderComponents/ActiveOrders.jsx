import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardText,
  Col,
  Container,
  Row,
  Spinner,
} from "reactstrap";
import FinishJob from "../FinishJob/FinishJob";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { truncateText } from "../../utils";

const ActiveOrders = ({
  scheduledOrdersObject,
  setPastOrders,
  updateActiveOrders,
  spinnerVisible,
}) => {
  const { user } = useSelector((state) => state.auth);
  const [order, SetOrder] = useState(null);
  let isUser;
  if (user.role === "user") {
    isUser = true;
  }

  const [showFullDetailsMap, setShowFullDetailsMap] = useState({});
  const [finishJobVerified, setFinishJobVerified] = useState(false);
  const [disableFinishButton,setDisableFinishButton] = useState(false)
  const [confirmed, SetConfirm] = useState("");
  const socket = useSelector((state) => state?.socket?.socket);
  useEffect(() => {
    const handleFinishJobResult = (data) => {
      if (data.result === "true") {
        setDisableFinishButton(false)
        SetConfirm("true");
        SetOrder(data.order);
        setFinishJobVerified(true);
        // Assuming scheduledOrdersObject is an array of orders
        const updatedOrders = scheduledOrdersObject.filter(
          (o) => o._id !== data.order._id
        );

        updateActiveOrders(updatedOrders);

        // Add the removed order to the past orders
        setPastOrders((prevPastOrders) => [...prevPastOrders, data.order]);
      } else if (data.result === "false") {
        setDisableFinishButton(false)
        SetConfirm("false");
        SetOrder(data.order);
        setFinishJobVerified(true);
      }
    };

    socket?.on("finishjob-result", handleFinishJobResult);

    return () => {
      socket?.off("finishjob-result", handleFinishJobResult);
    };
  }, [scheduledOrdersObject, setPastOrders]);

  const sendFinishRequest = (order, UserId) => {
    //send event to finish the job
    setDisableFinishButton(true);
    setTimeout(() => {
      setDisableFinishButton(false); // Enable the button after 1 minute
    }, 60000);
    const data = {
      order,
      Uid: UserId,
    };
    socket.emit("finishJob-accept-reject", data);
    Swal.fire({
      title: "Finish Job Request Sent!",
      icon: "success",
    });
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
  return (
    <Container>
      {spinnerVisible ? (
        <div style={{ textAlign: "center" }}>
          <Spinner />
        </div>
      ) : scheduledOrdersObject.length > 0 ? (
        <>
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
                        <b>Status: Active</b>
                      </span>
                    </CardText>
                    <CardText>
                      <b>Time:</b> {order.time}
                    </CardText>
                    <CardText>
                      <b>Date:</b> {order.date}
                    </CardText>
                    <CardText>
                      <b>Amount:</b> ${order.amount}
                    </CardText>
                    <CardText>
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
                    </CardText>
                    <CardText>
                      {" "}
                      {isUser ? (
                        <>
                          <b>Worker:</b> {order.users[1].firstName}{order.users[1]?.lastName}
                        </>
                      ) : (
                        <>
                          <b>User:</b> {order.users[0].firstName}{order.users[0]?.lastName}
                        </>
                      )}
                    </CardText>
                    <Col style={{ margin: "2%" }} xs="12" md="3">
                      {" "}
                      <CardText>
                        {!isUser ? (
                          <>
                            <Button
                              style={{
                                backgroundColor: "#48a8ef",
                                border: "2px solid #24aed8",
                              }}
                              disabled={disableFinishButton}
                              onClick={() =>
                                sendFinishRequest(order, order.users[0])
                              }
                            >
                              Finish Job
                            </Button>
                          </>
                        ) : (
                          <></>
                        )}
                      </CardText>
                    </Col>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      ) : (
        <>No Active Orders</>
      )}

      {finishJobVerified && !isUser ? (
        <>
          <FinishJob
            confirmed={confirmed}
            order={order}
            SetConfirm={SetConfirm}
            setFinishJobVerified={setFinishJobVerified}
          />
        </>
      ) : (
        <></>
      )}
    </Container>
  );
};

export default ActiveOrders;
