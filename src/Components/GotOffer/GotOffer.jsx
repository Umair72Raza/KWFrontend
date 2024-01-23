import React, { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

const GotOffer = ({ formattedOfferDetails, onConfirm, onCancel }) => {
  const [showModal, setShowModal] = useState(true);
  const [fullDetailsModal, setFullDetailsModal] = useState(false);

  useEffect(() => {
    const openModal = () => {
      setShowModal(true);
      document.body.style.overflow = "hidden";
    };
    
    const closeModal = () => {
      setShowModal(false);
      document.body.style.overflow = "";
    };
  
    openModal();
  
    // Clean up function
    return () => {
      closeModal();
    };
  }, []);
  const closeModal = () => {
    setShowModal(false);
    document.body.style.overflow = "auto";
  };

  const toggleFullDetailsModal = () => {
    setFullDetailsModal(!fullDetailsModal);
    document.body.style.overflow = "auto";
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    closeModal();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    closeModal();
  };

  const formattedDetails = formattedOfferDetails?.details || "";
  const truncatedDetails =
    formattedDetails.length > 20
      ? formattedDetails.slice(0, 20) + "..."
      : formattedDetails;

  return (
    <div>
      <Modal isOpen={showModal} keyboard={false} centered>
        <ModalHeader>
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
            Accept Offer
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
