import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Modal,
  Button,
  CardBody,
  CardTitle,
  Card,
  CardText,
} from "reactstrap";
import { truncateText } from "../../utils";
import accpetance from "../../assets/images/OfferResultpngs/acceptance.png";
import failure from "../../assets/images/OfferResultpngs/failure.png";
import { CreateOrder } from "../../Redux/Slices/BookingSlice";
import { PopUpState } from "../../Context/PopUpProvider";
import { useDispatch, useSelector } from "react-redux";

const OfferResult = () => {
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [modalOpen, setModalOpen] = useState(false); // Open the modal by default
  const [offerResult, setOfferResult] = useState("");
  const [result, setResult] = useState("");
  const { user, token } = useSelector((state) => state.auth);
  let { params, clear, setClear ,param,SetParam } = PopUpState();
  const { newOrder } = useSelector((state) => state.booking);

  const socket = useSelector((state) => state?.socket?.socket);
  const dispatch = useDispatch();
  useEffect(() => {
    socket?.on("offerResult", (result) => {
      // setModalOpen(true);
      // setResult(result);
      if (result == "accept") {
        setModalOpen(true);
        setResult(result);
        setOfferResult("true");
        setClear(true);
      } else if (result == "cancel") {
        setModalOpen(true);
        setResult(result);
        setOfferResult("false");
      }
      else if(result == "timeup")
      {
        console.log("offer expired time up")
        setOfferResult("timeup");
      }
    });
    return () => {
      socket?.off("offerResult");
    };
  });

  useEffect(() => {
    if (user && user._id && offerResult == "true") {
      dispatch(CreateOrder({ param, token }));
      setOfferResult("");
    }
    else if(user && user._id && offerResult == "false" || offerResult == "timeup")
    {
      
  
      const data = params
      const param = new FormData();
      for (const key in data) {
        if (data.hasOwnProperty(key) && key != 'users' && key!= 'Status') {
          param.append(key, data[key]);
        }
        else {
          data.users.forEach((u, index) => {
            param.append(`users`, u);
          })
        }
      }
      param.append(`Status`, 'Pending');
      data.images.forEach((image, index) => {
        param.append(`images`, image);
      });
      

      //SetParam(formData);
      
      dispatch(CreateOrder({ param, token }));
      setOfferResult("");
}
    
  }, [offerResult]);

  const toggleDetails = () => {
    setShowMoreDetails(!showMoreDetails);
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  useEffect(() => {
    if (newOrder !== null) {
      const data = { newOrder: newOrder, Uid: newOrder.users[1]._id };

      socket?.emit("new-order-created", data);
    }
    return () => {
      socket?.off("new-order-created");
    };
  }, [newOrder]);
  return (
    <Modal
      isOpen={modalOpen}
      toggle={toggleModal}
      backdrop="static"
      centered={true}
    >
      <Row>
        <Col>
          {" "}
          <Card>
            <CardBody className="custom-align-left">
              <CardTitle>
                <Col>
                  <img
                    src={result === "cancel" ? failure : accpetance}
                    alt={
                      result === "cancel" ? "Failure Image" : "Acceptance Image"
                    }
                    className="mx-auto"
                  />
                  {result === "cancel" ? (
                    <>
                      <b>Offer Cancelled!</b>
                    </>
                  ) : (
                    <>
                      <b>Offer Accepted!!</b>
                    </>
                  )}
                </Col>
              </CardTitle>
              <CardText>
                {" "}
                <b>Title</b>: {params?.Title}
              </CardText>
              <CardText>
                <b>Service</b>: {params?.service}
              </CardText>
              <CardText>
                {" "}
                <b>Amount</b>: ${params?.amount}
              </CardText>
              <CardText>
                {" "}
                <b>Time</b>: {params?.time}
              </CardText>
              <CardText>
                {" "}
                <Row>
                  <Col>
                    {params?.details?.length > 25 ? (
                      <>
                        <b>Details: </b>
                        <div
                          style={{
                            maxHeight: showMoreDetails ? "200px" : "80px", // Set your desired height
                            overflowY: "auto",
                          }}
                          dangerouslySetInnerHTML={{
                            __html: showMoreDetails
                              ? params?.details
                              : truncateText(params?.details, 25),
                          }}
                        />
                        <br />
                        <Button
                          color="primary"
                          onClick={toggleDetails}
                          style={{ marginTop: "10px" }}
                        >
                          {showMoreDetails ? "Show Less" : "Show More"}
                        </Button>
                      </>
                    ) : (
                      <>
                        <b>Details: </b>
                        <div
                          dangerouslySetInnerHTML={{ __html: params?.details }}
                        />
                      </>
                    )}
                  </Col>
                </Row>
              </CardText>
              <CardText>
                <Row>
                  <Col>
                    <Button
                      color="primary"
                      onClick={() => {
                        setOfferResult(false);
                        toggleModal();
                      }}
                      style={{ marginTop: "10px", marginLeft: "" }}
                    >
                      OK
                    </Button>
                  </Col>
                </Row>
              </CardText>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Modal>
  );
};

export default OfferResult;
