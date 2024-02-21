import React, { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardText,
  CardTitle,
  Col,
  Container,
  Input,
  Row,
  Spinner,
} from "reactstrap";
import Booking from "../../Components/booking popup/booking";
import { useDispatch, useSelector } from "react-redux";
import { selectSpinnerVisibility } from "../../Redux/Slices/LoaderSlice";

import completedtask from "../../assets/completedtask.png";

import activeOrderspng from "../../assets/activestatus.png";
import { truncateText } from "../../utils";
import EditOffer from "../../Components/OrderComponents/EditOffer";
import Swal from "sweetalert2";
import { deleteTheOrderAsync } from "../../Redux/Slices/OrderSlice";
import Slider from "react-slick";
import { PopUpState } from "../../Context/PopUpProvider";

const PostedJobs = ({ postedJobs }) => {
  let { setPostedJobs } = PopUpState();
  const { token } = useSelector((state) => state.auth);
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [order, setOrder] = useState(null);
  const spinnerVisible = useSelector(selectSpinnerVisibility);
  const [showFullDetailsMap, setShowFullDetailsMap] = useState({});
  const [fromPostJob, setPostJob] = useState(true);
  const disaptch = useDispatch();

  const toggleModal1 = () => {
    setModal1(!modal1);
  };
  const toggleModal = () => {
    setModal(!modal);
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

        if (result?.type === "orders/deleteOrder/fulfilled") {
          if (result.payload.message === "Order deleted") {
            Swal.fire({
              title: "Deleted!",
              text: "Your Order has been deleted.",
              icon: "success",
            });
            setPostedJobs((prevOrders) =>
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
    setOrder(order);
  };

  const toggleDetails = (orderId) => {
    setShowFullDetailsMap((prevMap) => ({
      ...prevMap,
      [orderId]: !prevMap[orderId],
    }));
  };

  return (
    <div>
      <Container>
        <Row>
          <Col>
            <Button onClick={() => setModal(true)} color="primary">
              Post an open job{" "}
            </Button>
          </Col>
        </Row>
        <Container>
          {postedJobs?.length > 0 ? (
            <>
              <Row>
                {postedJobs?.map((order) => (
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
                                style={{
                                  marginTop: "10px",
                                  marginRight: "1%",
                                }}
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

                        {order?.images?.length > 0 && (
                          <Row className="mb-5 justify-content-center">
                            <CardText>
                              <b>Images:</b>
                            </CardText>
                            <Slider {...settings} className="">
                              {order.images?.map((image, index) => (
                                <div
                                  className="d-flex justify-content-center"
                                  key={index}
                                >
                                  <img
                                    key={index}
                                    src={`${
                                      import.meta.env
                                        .VITE_LOCAL_BACKEND_ENDPOINT
                                    }${image}`}
                                    alt={`Modal Image ${index}`}
                                    className="img-fluid "
                                    style={{
                                      height: "100px",
                                      textAlign: "center",
                                    }}
                                  />
                                </div>
                              ))}
                            </Slider>
                          </Row>
                        )}
                      </CardBody>
                      <CardFooter>
                        <Row>
                          <Col style={{ margin: "2%" }} xs="12" md="5">
                            {" "}
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
                                <Button
                                  onClick={() => editModal(order)}
                                  color="info"
                                >
                                  Edit
                                </Button>
                              </CardText>
                            </Col>
                          </>
                        </Row>
                      </CardFooter>
                    </Card>
                  </Col>
                ))}
                {modal1 == true ? (
                  <EditOffer
                    modal={modal1}
                    toggle={toggleModal1}
                    order={order}
                  />
                ) : (
                  []
                )}
              </Row>
            </>
          ) : (
            <div className="text-center">No Posted Orders</div>
          )}
        </Container>

        <Booking modal={modal} toggle={toggleModal} fromPostJob={fromPostJob} />
      </Container>
    </div>
  );
};

export default PostedJobs;
