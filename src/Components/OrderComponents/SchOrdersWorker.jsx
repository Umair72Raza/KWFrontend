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
  Spinner,
} from "reactstrap";

import completedtask from "../../assets/completedtask.png";
import activeOrderspng from "../../assets/activestatus.png";
import { cancelOrderAsync } from "../../Redux/Slices/OrderSlice";
import Swal from "sweetalert2";
import { truncateText } from "../../utils";

const ScheduledOrdersCardWorker = ({
  scheduledOrdersObject,
  setScheduledOrders,
  setCancelledOrders,
  latestOrder,
  setUpdateScheduled,
  updateScheduled,
  activeOrder,
  spinnerVisible,
}) => {
  const { user } = useSelector((state) => state.auth);
  const { token } = useSelector((state) => state.auth);
  const userId = user._id;
  const socket = useSelector((state) => state?.socket?.socket);
  const [showFullDetailsMap, setShowFullDetailsMap] = useState({});
  const [cancelReason, setCancelReason] = useState("");
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleDetails = (orderId) => {
    setShowFullDetailsMap((prevMap) => ({
      ...prevMap,
      [orderId]: !prevMap[orderId],
    }));
  };

  const toggleModal = (order) => {
    setOrderToCancel(order);
    setIsModalOpen(!isModalOpen);
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

    const resonWithOrdertoCancel = {
      reason: cancelReason,
      order: order,
    };

    // there could be problem down here
    const cancelSocketEvent = () => {
      if (!socket) return;
      socket?.emit("cancel-order", resonWithOrdertoCancel);
      return () => {
        socket?.off("cancel-order");
      };
    };
    cancelSocketEvent();
    const dataWithToken = { token: token, data: data };
    dispatch(cancelOrderAsync(dataWithToken));
    setCancelReason("");
    //send the event to show order cancelled
    setIsModalOpen(false);
    setScheduledOrders((prevScheduledOrders) =>
      prevScheduledOrders.filter(
        (scheduledOrder) => scheduledOrder._id !== order._id
      )
    );
    //setUpdateScheduled(false);
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

  const transformOrderDetails = (order) => {
    let transformedDetails = order.details.replace(/<br\s*\/?>/g, "\n");

    return showFullDetailsMap[order._id]
      ? order.details
      : truncateText(transformedDetails, 25);
  };

  return (
    <>
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
                  lg="4"
                  xl="4"
                  style={{ marginTop: "10px" }}
                >
                  <Card
                    className="shadow"
                    style={{ backgroundColor: "#f6f8fc", height: "100%" }}
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
                            <span
                              style={{ marginTop: "10px", marginRight: "1%" }}
                            >
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
                      <CardText>Time: {order.time}</CardText>
                      <CardText>Date: {order.date}</CardText>
                      <CardText>
                        Details:{" "}
                        <div
                          style={{
                            maxHeight: "100px",
                            overflowY: "auto",
                          }}
                        >
                          {showFullDetailsMap[order._id] ? (
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
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
                        </div>
                      </CardText>
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
                                className={
                                  activeOrder.length > 0 ? "disabled" : ""
                                }
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
          </>
        ) : (
          <div>No Scheduled Orders</div>
        )}
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
