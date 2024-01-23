import React, { useState } from "react";
import {
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  Container,
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
      <ModalHeader toggle={toggleModal} className="text-center">
        <Container>
          <Row>
            <Col>
              {" "}
              <img
                src={result === "false" ? failure : accpetance}
                alt={result === "false" ? "Failure Image" : "Acceptance Image"}
                className="mx-auto"
              />
            </Col>
            <Col style={{ marginLeft: "2%" }}>
              {result === "false" ? "Offer Cancelled!" : "Offer Accepted!"}
            </Col>
          </Row>
        </Container>
      </ModalHeader>
      <ModalBody className="text-center">
        <b>Title</b>: {params.Title}
        <br />
        <b>Service</b>: {params.service}
        <br />
        <b>Amount</b>: {params.amount}
        <Row>
          <Col>
            {params.details.length > 25 ? (
              <>
              <b>Details: </b>
                {showMoreDetails
                  ? params.details.replace(/<br\s*\/?>/gi, "\n")
                  : truncateText(
                      params.details.replace(/<br\s*\/?>/gi, "\n"),
                      25
                    )}
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
              params.details.replace(/<br\s*\/?>/gi, "\n")
            )}
          </Col>
        </Row>
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
      </ModalBody>
    </Modal>
  );
};

export default OfferResult;
