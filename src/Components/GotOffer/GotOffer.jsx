import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

const GotOffer = ({ formattedOfferDetails, onConfirm, onCancel }) => {
  const [modal, setModal] = useState(true);
  const [fullDetailsModal, setFullDetailsModal] = useState(false);

  const toggle = () => setModal(!modal);
  const toggleFullDetailsModal = () => setFullDetailsModal(!fullDetailsModal);

  const handleConfirm = () => {
    
    if (onConfirm) {
      onConfirm();
    }
    toggle();
  };

  const handleCancel = () => {
   
    if (onCancel) {
      onCancel();
    }
    toggle();
  };

  const formattedDetails = formattedOfferDetails?.details || "";
  const truncatedDetails =
    formattedDetails.length > 20
      ? formattedDetails.slice(0, 20) + "..."
      : formattedDetails;

  return (
    <div>
      <Modal
        isOpen={modal}
        toggle={toggle}
        backdrop="static"
        keyboard={false}
        centered
      >
        <ModalHeader toggle={toggle}>
          Do you want to Accept the Offer?
        </ModalHeader>
        <ModalBody>
          <p>
            <strong>Title:</strong> {formattedOfferDetails?.Title}
          </p>
          <p>
            <strong>Date:</strong> {formattedOfferDetails?.date}
          </p>
          <p>
            <strong>Time:</strong> {formattedOfferDetails?.time}
          </p>
          <p>
            <strong>Amount:</strong> {formattedOfferDetails?.amount}
          </p>
          <p>
            <strong>Service:</strong> {formattedOfferDetails?.service}
          </p>
          <p>
            <strong>Details:</strong>{" "}
            <div style={{ whiteSpace: "pre-wrap" }}>
              {truncatedDetails.replace(/<br\s*\/?>/gi, "\n")}
            </div>
          </p>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleConfirm}>
            Acept Offer
          </Button>{" "}
          <Button color="danger" onClick={handleCancel}>
            Reject Offer
          </Button>{" "}
          <Button color="info" onClick={toggleFullDetailsModal}>
            See Full Details
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={fullDetailsModal} toggle={toggleFullDetailsModal}>
        <ModalHeader toggle={toggleFullDetailsModal}>Full Details</ModalHeader>
        <ModalBody>
          <p>
            <strong>Full Details:</strong>{" "}
            <div style={{ whiteSpace: "pre-wrap" }}>
              {formattedDetails.replace(/<br\s*\/?>/gi, "\n")}
            </div>
          </p>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={toggleFullDetailsModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default GotOffer;
