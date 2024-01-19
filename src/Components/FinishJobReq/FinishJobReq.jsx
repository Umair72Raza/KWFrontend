/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Modal, ModalHeader, ModalBody, Button } from "reactstrap";
import { changeStatusToPastAsync } from "../../Redux/Slices/OrderSlice";
import socket from "../../SocketManager/socketManager";
import Feedback from "../../Components/feedback/feedback";
import { truncateText } from "../../utils";

const FinishJobReq = ({ order, setFinishOrderReq }) => {
  const dispatch = useDispatch();
  const [modal, setModal] = useState(true);
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [finishConfirmed, setFinishConfirmed] = useState(false);

  const toggleDetails = () => {
    setShowMoreDetails(!showMoreDetails);
  };

  const toggleModal = () => {
    setModal(!modal);
  };

  const handleConfirm = async () => {
    const result = await dispatch(
      changeStatusToPastAsync({ orderId: order._id })
    );

    if (
      result.type === "orders/changeToPastOrders/fulfilled" &&
      result.payload.Status === "Past"
    ) {
      const data = {
        order: result.payload,
        result: "true",
      };
      socket.emit("finishjob-response", data);
    }

    setFinishConfirmed(true);
    setModal(false);
  };

  const handleCancel = () => {
    const data = {
      order,
      result: "false",
    };
    socket.emit("finishjob-response", data);
    setFinishOrderReq(false);
  };

  return (
    <>
      <Modal
        isOpen={modal}
        toggle={toggleModal}
        centered
        backdrop="static"
        keyboard={false}
      >
        <ModalHeader toggle={toggleModal}>
          Worker wants to Finish the job!
        </ModalHeader>
        <ModalBody>
          <div>
            <strong>Order Title:</strong> {order.Title}
          </div>
          <div>
            <strong>Order Details:</strong>{" "}
            {showMoreDetails
              ? order.details.replace(/<br\s*\/?>/gi, "\n")
              : truncateText(order.details.replace(/<br\s*\/?>/gi, "\n"), 15)}
            {order.details.length > 15 && (
              <Button
                color="link"
                onClick={toggleDetails}
                style={{ marginTop: "10px" }}
              >
                {showMoreDetails ? "Show Less" : "Show More"}
              </Button>
            )}
          </div>
          <div>
            <strong>Service:</strong> {order.service}
          </div>
          <div>
            <strong>Amount:</strong> {order.amount}
          </div>
          <Button color="success" onClick={handleConfirm}>
            Yes, Finish it!
          </Button>{" "}
          <Button color="danger" onClick={handleCancel}>
            No, Cancel
          </Button>
        </ModalBody>
      </Modal>
      {finishConfirmed && (
        <Feedback
          flag={modal}
          order={order}
          setFinishOrderReq={setFinishOrderReq}
          SetConfirm={""}
        />
      )}
    </>
  );
};

export default FinishJobReq;
