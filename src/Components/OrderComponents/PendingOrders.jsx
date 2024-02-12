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
import {
  cancelOrderAsync,
  deleteTheOrderAsync,
} from "../../Redux/Slices/OrderSlice";
import Swal from "sweetalert2";
import { truncateText } from "../../utils";
import { PopUpState } from "../../Context/PopUpProvider.jsx";
import { selectSpinnerVisibility } from "../../Redux/Slices/LoaderSlice";
import EditOffer from "./EditOffer.jsx";
import Slider from "react-slick";

const PendingOrders = ({ pendingOrders }) => {
  let { setPendingOrders } = PopUpState();
  const { user, token } = useSelector((state) => state.auth);
  const [order, setOrder] = useState(null);
  const socket = useSelector((state) => state?.socket?.socket);
  const [showFullDetailsMap, setShowFullDetailsMap] = useState({});
  const disaptch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const spinnerVisible = useSelector(selectSpinnerVisibility);
  let {} = PopUpState();

  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const Post = (order) => {
    setOrder(order);
    toggleModal();
  };
  const toggleModal = () => {
    setModal(!modal);
  };
  const toggleModal1 = () => {
    setModal1(!modal1);
  }
  const toggleDetails = (orderId) => {
    setShowFullDetailsMap((prevMap) => ({
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

  const deleteAlert = async (order) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      allowOutsideClick: false,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const id = order._id;
        const data = { id: id, token: token };
        const result = await disaptch(deleteTheOrderAsync(data));
        console.log(result?.payload, "payload");
        if (result?.type === "orders/deleteOrder/fulfilled") {
          if (result.payload.message === "Order deleted") {
            Swal.fire({
              title: "Deleted!",
              text: "Your Order has been deleted.",
              icon: "success",
            });
            setPendingOrders((prevOrders) =>
              prevOrders.filter((prevOrder) => prevOrder._id !== order._id)
            );
          }
        } else {
          Swal.fire({
            title: "Not Deleted!",
            text: "Your Order was not deleted.",
            icon: "error",
          });
        }
      }
    });
  };

  const settings = {
    dots: true,
    infinite: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
     autoplaySpeed: 2000,
  };

  const editModal = (order) => {
    setModal1(true);
    setOrder(order)

  }
  return (
    <>
      <Container>
        {spinnerVisible ? (
          <div style={{ textAlign: "center" }}>
            <Spinner />
          </div>
        ) : pendingOrders.length > 0 ? (
          <>
            <Row>
              {pendingOrders?.map((order) => (
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
                      {order?.images?.length > 0 && (
                        <CardText className="mb-3">
                          <b>Images:</b>
                          <Row>
                            <Slider {...settings} className="">
                              {order.images?.map((image, index) => (
                                <div className="text-center" key={index}>
                                  <img
                                    key={index}
                                    src={`${
                                      import.meta.env
                                        .VITE_LOCAL_BACKEND_ENDPOINT
                                    }${image}`}
                                    alt={`Modal Image ${index}`}
                                    className="img-fluid"
                                    style={{
                                      height: "100px",
                                      textAlign: "center",
                                    }}
                                  />
                                </div>
                              ))}
                            </Slider>
                          </Row>
                        </CardText>
                      )}

                      <Row>
                        <Col style={{ margin: "2%" }} xs="12" md="5">
                          {" "}
                          {/* Full width on small screens, half width on medium and larger screens */}
                          <CardText>
                            <Button
                              onClick={() => deleteAlert(order)}
                              color="danger"
                            >
                              Delete
                            </Button>
                          </CardText>
                        </Col>

                        <>
                          <Col style={{ margin: "2%" }} xs="12" md="5">
                            {" "}
                            {/* Half width on small screens, one-third width on medium and larger screens */}
                            <CardText>
                            <Button onClick={()=>editModal(order)} color="info">Post</Button>
                            </CardText>
                          </Col>
                        </>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
              ))}
              {modal1 == true ? (
                <EditOffer modal={modal1} toggle={toggleModal1} order={order} />
              ) : (
                []
              )}
            </Row>
          </>
        ) : (
          <div>No Pending Orders</div>
        )}
      </Container>

      {/* <Booking
        modal={modal}
        toggle={toggleModal}
        worker={bookingWorker}
        chat={chat}
      /> */}
      {/* <Modal isOpen={isModalOpen} toggle={toggleModal} centered>
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
      </Modal> */}
    </>
  );
};

export default PendingOrders;
