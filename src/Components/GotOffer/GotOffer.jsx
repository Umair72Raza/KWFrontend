import React, { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import { ChatState } from "../../Context/ChatProvider";
import { GOTOFFER } from "../../Constants/Constants";

const GotOffer = ({ formattedOfferDetails, onConfirm, onCancel }) => {
  const [showModal, setShowModal] = useState(true);
  const [fullDetailsModal, setFullDetailsModal] = useState(false);
  let { setGotOffer, } = ChatState();
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
    setGotOffer(false)
    closeModal();

  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    setGotOffer(false)
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
        <ModalHeader >
          {GOTOFFER.OFFER_HEADER}
        </ModalHeader>
        <ModalBody>
          <p>
            <strong>{GOTOFFER.OFFER_TITLE}</strong> {formattedOfferDetails?.Title}
          </p>
          <p>
            <strong>{GOTOFFER.OFFER_DATE}</strong> {formattedOfferDetails?.date}
          </p>
          <p>
            <strong>{GOTOFFER.OFFER_TIME}</strong> {formattedOfferDetails?.time}
          </p>
          <p>
            <strong>{GOTOFFER.OFFER_AMOUNT}</strong>${formattedOfferDetails?.amount}
          </p>
          <p>
            <strong>{GOTOFFER.OFFER_SERVICE}</strong> {formattedOfferDetails?.service}
          </p>
          <p>
            <strong>{GOTOFFER.OFFER_DETAILS}</strong>{" "}
            <div style={{ whiteSpace: "pre-wrap" }}>
              {truncatedDetails.replace(/<br\s*\/?>/gi, "\n")}
            </div>
          </p>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleConfirm}>
            {GOTOFFER.ACCEPT_BUTTON}
          </Button>{" "}
          <Button color="danger" onClick={handleCancel}>
            {GOTOFFER.REJECT_BUTTON}
          </Button>{" "}
          <Button color="info" onClick={toggleFullDetailsModal}>
            {GOTOFFER.SEE_DETAILS_BUTTON}
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={fullDetailsModal} toggle={toggleFullDetailsModal}>
        <ModalHeader toggle={toggleFullDetailsModal}>{GOTOFFER.FULL_DETAILS}</ModalHeader>
        <ModalBody style={{ maxHeight: '20vh', overflowY: 'auto' }}>
          <p>
            <strong>{GOTOFFER.FULL_DETAILS_HEADING}</strong>{" "}
            <div style={{ whiteSpace: "pre-wrap" }}>
              {formattedDetails.replace(/<br\s*\/?>/gi, "\n")}
            </div>
          </p>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={toggleFullDetailsModal}>
            {GOTOFFER.CLOSE_BUTTON}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default GotOffer;
