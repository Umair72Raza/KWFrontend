/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardText,
  Col,
  Container,
  Row,
} from "reactstrap";
import FinishJob from "../FinishJob/FinishJob";
import Swal from "sweetalert2";
import socket from "../../SocketManager/socketManager";
import { useSelector } from "react-redux";

const ActiveOrders = ({
  scheduledOrdersObject,
  setPastOrders,
  updateActiveOrders,
}) => {
  const { user } = useSelector((state) => state.auth);
  const [order, SetOrder] = useState(null);
  let isUser;
  if (user.role === "user") {
    isUser = true;
  }
  const [finishJobVerified, setFinishJobVerified] = useState(false);
  const [confirmed, SetConfirm] = useState("");

  useEffect(() => {
    const handleFinishJobResult = (data) => {
      if (data.result === "true") {
        console.log("true");
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
        console.log("finish job false");
        SetConfirm("false");
        SetOrder(data.order);
        setFinishJobVerified(true);
      }
    };

    socket.on("finishjob-result", handleFinishJobResult);

    return () => {
      socket.off("finishjob-result", handleFinishJobResult);
    };
  }, [scheduledOrdersObject, setPastOrders]);

  const sendFinishRequest = (order, UserId) => {
    //send event to finish the job
    const data = {
      order,
      Uid: UserId,
    };
    console.log(data);
    socket.emit("finishJob-accept-reject", data);
    Swal.fire({
      title: "Finish Request Job Request Sent!",
      icon: "success",
    });
  };
  return (
    <Container>
      {console.log(scheduledOrdersObject)}
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
                </CardText>
                <CardText>Time: {order.Time}</CardText>
                <CardText>Date: {order.date}</CardText>
                <CardText>Details: {order.details}</CardText>
                <CardText>OrderId: {order._id}</CardText>
                <CardText>
                  {" "}
                  {isUser ? `Worker: ${order.users[1].firstName}`:`User: ${order.users[0].firstName}`}
                  
                </CardText>
                <Col style={{ margin: "2%" }} xs="12" md="3">
                  {" "}
                  <CardText>
                    {!isUser ? (
                      <>
                        <Button
                          style={{
                            backgroundColor: "#48c8ef",
                            border: "2px solid #24aed8",
                          }}
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
