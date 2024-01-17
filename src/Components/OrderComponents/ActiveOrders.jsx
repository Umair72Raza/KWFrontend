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
  // const user = JSON.parse(localStorage.getItem("user"));
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

  // useEf
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

    //emit the event to socket with User Id and orderId
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
            <Card className="shadow" style={{ backgroundColor: "#f6f8fc" }}>
              <CardBody>
                <Col
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {/* <img
                    src={pastpng}
                    alt="schTask"
                    style={{ height: "27px", marginRight: "10px" }}
                  /> */}
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
                  {/* <img
                    src={checkpng}
                    alt="schTask"
                    style={{
                      height: "25px",
                      marginLeft: "1%",
                      marginTop: "-1%",
                    }}
                  /> */}
                </CardText>
                <CardText>Time: {order.Time}</CardText>
                <CardText>Date: {order.date}</CardText>
                <CardText>Details: {order.details}</CardText>
                <CardText>OrderId: {order._id}</CardText>
                <CardText>
                  {" "}
                  {order.users.map((user) => {
                    if (user.name) {
                      return user.name;
                    } else {
                      return user.firstName;
                    }
                  })}
                </CardText>
                <Col style={{ margin: "2%" }} xs="12" md="3">
                  {" "}
                  {/* Half width on small screens, one-third width on medium and larger screens */}
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
