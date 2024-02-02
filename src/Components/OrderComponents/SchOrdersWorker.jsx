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
  const [startButtonDisabledMap, setStartButtonDisabledMap] = useState({});
  const [globalStartButtonDisabled, setGlobalStartButtonDisabled] =
    useState(false);

  const [formattedAddress, setFormattedAddress] = useState(null);
  const loc = {
    type: "Point",
    coordinates: [74.24510699999999, 31.4717778],
    address: "", // Add an empty address property
  };

  const fetchAddressFromCoordinates = (coordinates) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode(
      { location: { lat: coordinates[1], lng: coordinates[0] } },
      (results, status) => {
        if (status === "OK") {
          if (results && results.length > 0) {
            const address = results[0].formatted_address;
            setFormattedAddress(address);

            // Update the loc object with the address
            loc.address = address;
          } else {
            console.error("No results found");
          }
        } else {
          console.error("Geocoder failed due to:", status);
        }
      }
    );
  };
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${
      import.meta.env.VITE_GOOGLE_API
    }&libraries=${import.meta.env.VITE_GOOGLE_API_LIBARARY}`;
    script.async = true;
    script.defer = true;
    script.addEventListener("load", () => {
      // Initialize the fetchAddressFromCoordinates function here
      fetchAddressFromCoordinates(loc.coordinates);
    });
    document.head.appendChild(script);

    return () => {
      // Remove the script when the component unmounts
      document.head.removeChild(script);
    };
  }, [loc.coordinates]);

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

    if (user.status !== "online") {
      return Swal.fire({
        title: "You are not online",
        icon: "error",
      });
    }
    setGlobalStartButtonDisabled(true);
    setStartButtonDisabledMap((prevMap) => ({
      ...prevMap,
      [order._id]: true,
    }));

    const data = {
      order,
      Uid,
    };

    setTimeout(() => {
      setGlobalStartButtonDisabled(false);
      setStartButtonDisabledMap((prevMap) => ({
        ...prevMap,
        [order._id]: false,
      }));
    }, 60000); // 1 minute

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
      : truncateText(transformedDetails, 30);
  };

  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps?q=${loc.coordinates[1]},${loc.coordinates[0]}`;
    window.open(url, "_blank");
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
          {console.log(scheduledOrdersObject)}
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
                              <b>Status: </b>
                              {order.Status}
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
                        <b>Order By:</b>{" "}
                        {order.users.length > 0 && order.users[0].firstName}
                      </CardText>
                      <CardText>
                        <b>Formatted Address:</b>{" "}
                        {formattedAddress ? (
                          <>
                            <p>{formattedAddress}</p>
                            <Button onClick={openGoogleMaps} color="primary">
                              Open in Google Maps
                            </Button>
                          </>
                        ) : (
                          <p>Loading address...</p>
                        )}
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
                                  globalStartButtonDisabled ||
                                  startButtonDisabledMap[order._id] ||
                                  activeOrder.length > 0
                                    ? "disabled"
                                    : ""
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
