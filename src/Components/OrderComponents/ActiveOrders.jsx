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
import { truncateText } from "../../utils";

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
  
  const [showFullDetailsMap, setShowFullDetailsMap] = useState({});
  const [finishJobVerified, setFinishJobVerified] = useState(false);
  const [confirmed, SetConfirm] = useState("");

  useEffect(() => {
    const handleFinishJobResult = (data) => {
      if (data.result === "true") {
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
    socket.emit("finishJob-accept-reject", data);
    Swal.fire({
      title: "Finish Request Job Request Sent!",
      icon: "success",
    });
  };

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
      {scheduledOrdersObject.length > 0  ? <>
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
      </>:<>No Active Orders</>}
     
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
