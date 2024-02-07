import React, { useState } from "react";
import { Button, Card, CardBody, CardText, CardTitle, Col, Container, Input, Row, Spinner } from "reactstrap";
import Booking from "../../Components/booking popup/booking";
import { useSelector } from "react-redux";
import { selectSpinnerVisibility } from "../../Redux/Slices/LoaderSlice";

import completedtask from "../../assets/completedtask.png";

import activeOrderspng from "../../assets/activestatus.png";
import { truncateText } from "../../utils";
const PostedJobs = ({postedJobs}) => {
    const [modal,setModal] = useState(false);
    const spinnerVisible = useSelector(selectSpinnerVisibility);
    const [showFullDetailsMap, setShowFullDetailsMap] = useState({});
    const [fromPostJob,setPostJob] = useState(true)
    const toggleModal =() => {
        setModal(!modal)
    }
    const transformOrderDetails = (order) => {
      let transformedDetails = order.details.replace(/<br\s*\/?>/g, "\n");
  
      return showFullDetailsMap[order._id]
        ? order.details
        : truncateText(transformedDetails, 30);
    };
  

  return (
    <div>
      <Container>
        <Row>
          <Col>
            <Button onClick={()=>setModal(true)} color="primary">Post an open job </Button>
          </Col>
        </Row>
        <Container>
        {spinnerVisible ? (
          <div style={{ textAlign: "center" }}>
            <Spinner />
          </div>
        ) : postedJobs?.length > 0 ? (
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

                      <Row>
                        <Col style={{ margin: "2%" }} xs="12" md="5">
                          {" "}
                          {/* Full width on small screens, half width on medium and larger screens */}
                          <CardText>
                            <Button
                              onClick={() => Delete(order)}
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
                                onClick={() => Post(order)}
                                color="info"
                              >
                                Edit
                              </Button>
                            </CardText>
                          </Col>
                        </>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
              ))}
              {modal == true ? (
                <EditOffer modal={modal} toggle={toggleModal} order={order} />
              ) : (
                []
              )}
            </Row>
          </>
        ) : (
          <div>No Posted Orders</div>
        )}
      </Container>

        <Booking
        modal={modal}
        toggle={toggleModal}
        fromPostJob={fromPostJob}
      />
      </Container>
    </div>
  );
};

export default PostedJobs;
