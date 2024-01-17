/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

//cards for Scheduled Orders
import socket from "../../SocketManager/socketManager";
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
import activeOrderspng from "../../assets/activestatus.png";
import { cancelOrderAsync } from "../../Redux/Slices/orderSlice";
import Swal from "sweetalert2";

const ScheduledOrdersCardWorker = ({
  scheduledOrdersObject,
  setScheduledOrders,
  setCancelledOrders,
  cancelledOrders,
  setLatestOrders,
  latestOrder,
  setUpdateScheduled,
  updateScheduled,
  activeOrder,
}) => {
  const { user } = useSelector((state) => state.auth);
  const { token } = useSelector((state) => state.auth);
  const userId = user._id;
  const userRole = user.role;
  const userName = user.firstName;

  const [showModal, setShowModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
  //const user = localStorage.getItem('user')
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
    // there could be problem down here
    const cancelSocketEvent = () => {
      if (!socket) return;
      socket.emit("cancel-order", order);
      return () => {
        socket.off("cancel-order");
      };
    }
    cancelSocketEvent();  
    const dataWithToken = {token:token,data:data}  
    dispatch(cancelOrderAsync(dataWithToken));
    setCancelReason("");
    //send the event to show order cancelled
    setIsModalOpen(false);
    setScheduledOrders((prevScheduledOrders) =>
      prevScheduledOrders.filter(
        (scheduledOrder) => scheduledOrder._id !== order._id
      )
    );
    setUpdateScheduled(false);
    setCancelledOrders((prevCancelledOrders) => [
      ...prevCancelledOrders,
      order,
    ]);
  };

  const sendStartRequest = async (order, Uid) => {
    //  emit socket event to show Worker wants to start the job modal.
    
    const data = {
      order,
      Uid,
    };
    console.log(data);
    socket.emit("startJob-accept-reject", data);
    Swal.fire({
      title: "Start Job request sent!",
      icon: "success",
    });
  };

  useEffect(() => {
    if (updateScheduled === true) {
      setScheduledOrders((prevScheduledOrders) => [
        ...prevScheduledOrders, // Use empty array if prevScheduledOrders is null or undefined
        latestOrder,
      ]);
    }
    setUpdateScheduled(false);
  }, [updateScheduled]);

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
                          src={activeOrderspng}
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
                    Order By:{" "}
                    {order.users.length > 0 && order.users[0].firstName}
                  </CardText>
                  <Row>
                    <Col style={{ margin: "2%" }} xs="12" md="5">
                      {" "}
                      {/* Full width on small screens, half width on medium and larger screens */}
                      <CardText>
                        <Button
                          onClick={() => toggleModal(order)}
                          color="danger"
                        >
                          Cancel Job
                        </Button>
                      </CardText>
                    </Col>

                    <>
                      <Col style={{ margin: "2%" }} xs="12" md="5">
                        {" "}
                        {/* Half width on small screens, one-third width on medium and larger screens */}
                        <CardText>
                          <Button
                            onClick={() =>
                              sendStartRequest(order, order.users[0]._id)
                            }
                            color="success"
                            className={activeOrder.length > 0 ? "disabled" : ""}
                          >
                            Start Job
                          </Button>
                        </CardText>
                      </Col>
                    </>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      <Modal isOpen={isModalOpen} toggle={toggleModal} centered>
        <ModalHeader toggle={toggleModal}>Order Cancellation</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="cancelReason">Reason for Cancellation</Label>
              <Input
                type="text"
                id="cancelReason"
                placeholder="Enter reason"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleModal}>
            Cancel Order Cancellation
          </Button>
          <Button color="danger" onClick={cancelingOrder}>
            Finalize Order Cancellation
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default ScheduledOrdersCardWorker;
