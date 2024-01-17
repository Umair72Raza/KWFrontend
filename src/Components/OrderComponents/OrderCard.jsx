/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

//cards for Scheduled Orders

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";

import completedtask from "../../assets/completedtask.png";
import activeOrder from "../../assets/activestatus.png";
import {
  activateOrderAsync,
  cancelOrderAsync,
  fetchScheduledOrdersAsync,
} from "../../Redux/Slices/orderSlice";
import ModalComponent from "../ModalComponent/ModalComponent";
import socket from "../../SocketManager/socketManager";
const OrderCard = ({
  scheduledOrdersObject,
  toggleCancel,
  setToggleCancel,
  setScheduledOrders,
  setCancelledOrders,
}) => {
  //get these from local storage
  const { user, token } = useSelector((state) => state.auth);
  const userId = user._id;
  const userRole = user.role;
  const userName = user.firstName;

  const [showModal, setShowModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startJobConfirmed, setStartJobConfirmed] = useState(false);
  const openModal = () => setShowModal(true);

  const toggleModal = (order) => {
    setOrderToCancel(order);
    setIsModalOpen(!isModalOpen);
  };

  const closeModal = () => {
    setShowModal(false);
    // Clear the reason input when the modal is closed
    setCancelReason("");
  };

  const dispatch = useDispatch();
  const cancelingOrder = () => {
    //dispatch cancel order
    const order = orderToCancel;
    const data = {
      userId: userId,
      orderId: order._id,
      cancelReason: cancelReason,
      Status: "Cancelled",
    };

    const cancelOrderSocketEvent = () => {
      if (!socket) return;
      socket.emit("cancel-order-user", order);
      return () => {
        socket.off("cancel-order-user");
      };
    };
    const dataWithToken = { token: token, data: data };
    dispatch(cancelOrderAsync(dataWithToken));
    cancelOrderSocketEvent();

    setCancelReason("");
    setIsModalOpen(false);

    setScheduledOrders((prevScheduledOrders) =>
      prevScheduledOrders.filter(
        (scheduledOrder) => scheduledOrder._id !== order._id
      )
    );

    setCancelledOrders((prevCancelledOrders) => [
      ...prevCancelledOrders,
      order,
    ]);
    setToggleCancel(!toggleCancel);
  };

  return (
    <>
      <Container>
        <Row>
          {scheduledOrdersObject?.map((order) => (
            <Col
              key={order._id}
              sm="6"
              md="5"
              lg="5"
              xl="5"
              style={{ marginTop: "10px" }}
            >
              <Card
                className="shadow"
                style={{ backgroundColor: "#f6f8fc", color: "#0d6efd" }}
              >
                <CardBody>
                  <CardTitle>
                    <Col>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <img
                          src={completedtask}
                          alt="schTask"
                          style={{ marginRight: "10px" }}
                        />
                        <h5 style={{ textAlign: "center" }}>{order.Title}</h5>
                      </div>
                    </Col>{" "}
                  </CardTitle>
                  <CardText>
                    <Col>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <span style={{ marginTop: "10px", zIndex: "10" }}>
                          Status: {order.Status}
                        </span>
                        <img
                          src={activeOrder}
                          alt="schTask"
                          style={{
                            height: "12px",
                            marginLeft: "-1%",
                            zIndex: "0",
                            marginTop: "3.75%",
                            opacity: "90%",
                          }}
                        />
                      </div>
                    </Col>
                  </CardText>
                  <CardText>Time: {order.Time}</CardText>
                  <CardText>Date: {order.date}</CardText>
                  <CardText>Details: {order.details}</CardText>
                  <CardText>OrderId: {order._id}</CardText>
                  <CardText>
                    Worker
                    {order.users.map((user) => {
                      if (user.firstName == userName) {
                        //do nothing
                      } else {
                        return user.firstName;
                      }
                    })}
                  </CardText>
                  <Row>
                    <Col></Col>
                    <Col>
                      {" "}
                      {/* Full width on small screens, half width on medium and larger screens */}
                      <CardText>
                        <Button
                          onClick={() => toggleModal(order)}
                          color="danger"
                        >
                          Cancel Order
                        </Button>
                      </CardText>
                    </Col>
                    <Col></Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
      <ModalComponent
        modalHeader={"Order Cancellation"}
        isModalOpen={isModalOpen}
        toggleModal={toggleModal}
        inputLabel={"Reason for Cancellation"}
        modalInputValue={cancelReason}
        modalInputSetter={setCancelReason}
        finalizeFunction={cancelingOrder}
        cancelButtonLabel={"Cancel Order Cancellation"}
        finalizeButtonLabel={"Finalize Order Cancellation"}
        showInput={true}
      />
    </>
  );
};

export default OrderCard;
