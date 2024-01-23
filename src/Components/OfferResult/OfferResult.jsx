import React, { useState } from "react";
import {
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  Container,
  CardBody,
  CardTitle,
  Card,
  CardText,
} from "reactstrap";
import { truncateText } from "../../utils";
import accpetance from "../../assets/images/OfferResultpngs/acceptance.png";
import failure from "../../assets/images/OfferResultpngs/failure.png";

const OfferResult = ({ result, params, setOfferResult }) => {
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [modalOpen, setModalOpen] = useState(true); // Open the modal by default

  const toggleDetails = () => {
    setShowMoreDetails(!showMoreDetails);
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

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
                    src={result === "false" ? failure : accpetance}
                    alt={
                      result === "false" ? "Failure Image" : "Acceptance Image"
                    }
                    className="mx-auto"
                  />
                  {result === "false" ? "Offer Cancelled!" : "Offer Accepted!"}
                </Col>
              </CardTitle>
              <CardText>
                {" "}
                <b>Title</b>: {params.Title}
              </CardText>
              <CardText>
                <b>Service</b>: {params.service}
              </CardText>
              <CardText>
                {" "}
                <b>Amount</b>: {params.amount}
              </CardText>
              <CardText>
                {" "}
                <Row>
                  <Col>
                    {params.details.length > 25 ? (
                      <>
                        <b>Details: </b>
                        <div
                              style={{
                                maxHeight: showMoreDetails ? '200px' : '80px', // Set your desired height
                                overflowY: 'auto',
                              }}
                              dangerouslySetInnerHTML={{
                                __html: showMoreDetails
                                  ? params.details
                                  : truncateText(params.details, 25),
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
                      <div
                        dangerouslySetInnerHTML={{ __html: params.details }}
                      />
                    )}
                  </Col>
                </Row>
              </CardText>
              <CardText>
                <Row>
                  <Col>
                    <Button
                      color="primary"
                      onClick={() => setOfferResult(false)}
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
