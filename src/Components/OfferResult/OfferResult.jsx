import React, { useState } from "react";
import {Row, Col, Modal, ModalHeader, ModalBody, Button } from "reactstrap";
import { truncateText } from "../../utils";

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
      <ModalHeader toggle={toggleModal}>
        {result === "false" ? "Offer Cancelled!" : "Offer Accepted!"}
      </ModalHeader>
      <ModalBody>
        <b>Title</b>: {params.Title}
        <br />
        <b>Details</b>:{" "}
        {showMoreDetails
          ? params.details.replace(/<br\s*\/?>/gi, "\n")
          : truncateText(params.details.replace(/<br\s*\/?>/gi, "\n"), 15)}
        <br />
        <b>Service</b>: {params.service}
        <br />
        <b>Amount</b>: {params.amount}
        <Row>
          <Col>
          <Button
            color="primary"
            onClick={toggleDetails}
            style={{ marginTop: "10px" }}
          >
            
            {showMoreDetails ? "Show Less" : "Show More"}
          </Button>
          </Col>
          <Col>
          <Button
            color="primary"
            onClick={() => setOfferResult(false)}
            style={{ marginTop: "10px", marginLeft: "10px" }}
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
