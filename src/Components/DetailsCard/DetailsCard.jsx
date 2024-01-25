import React, { useEffect, useState } from "react";
import { Button, Modal as RsModal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const DetailsCard = ({
  person,
  setShowDetailsCard,
  orders,
}) => {
  const { firstName, lastName, role } = person;

  const [scheduledCount, setScheduledCount] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [pastCount, setPastCount] = useState(0);
  const [cancelledCount, setCancelledCount] = useState(0);

  const [modalIsOpen, setModalIsOpen] = useState(true);
  const [secondModalIsOpen, setSecondModalIsOpen] = useState(false);
  const [disableScroll, setDisableScroll] = useState(true);

  const updateCounts = (orders) => {
    setScheduledCount(
      orders.filter((order) => order.Status === "Scheduled").length
    );
    setActiveCount(orders.filter((order) => order.Status === "Active").length);
    setPastCount(orders.filter((order) => order.Status === "Past").length);
    setCancelledCount(
      orders.filter((order) => order.Status === "Cancelled").length
    );
  };

  useEffect(() => {
    if (orders !== undefined && orders.length > 0) {
      updateCounts(orders);
    }
  }, [orders]);

  useEffect(() => {
    document.body.style.overflow = disableScroll ? "hidden" : "auto";
  }, [disableScroll]);

  const closeModal = () => {
    setModalIsOpen(false);
    setShowDetailsCard(false);
    setDisableScroll(true);
  };

  const openSecondModal = () => {
    setSecondModalIsOpen(true);
    setDisableScroll(true);
  };

  const closeSecondModal = () => {
    setSecondModalIsOpen(false);
    setDisableScroll(modalIsOpen);
  };

  return (
    <>
      <RsModal isOpen={modalIsOpen} toggle={closeModal} centered>
        <ModalHeader toggle={closeModal}>
          <strong>{firstName}</strong>
        </ModalHeader>
        <ModalBody>
          <p>
            First Name: {firstName} <br />
            Last Name: {lastName} <br />
            Role: {role} <br />
          </p>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={closeModal}>
            Okay
          </Button>
          <Button style={{ backgroundColor: "#5d12cf" }} onClick={openSecondModal}>
            Details
          </Button>
        </ModalFooter>
      </RsModal>

      <RsModal isOpen={secondModalIsOpen} toggle={closeSecondModal} centered>
        <ModalHeader toggle={closeSecondModal}>Order Details</ModalHeader>
        <ModalBody>
          <p>Scheduled: {scheduledCount}</p>
          <p>Active: {activeCount}</p>
          <p>Past: {pastCount}</p>
          <p>Cancelled: {cancelledCount}</p>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={closeSecondModal}>
            Close
          </Button>
        </ModalFooter>
      </RsModal>
    </>
  );
};

export default DetailsCard;
