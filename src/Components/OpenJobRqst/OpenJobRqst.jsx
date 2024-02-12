import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { PopUpState } from "../../Context/PopUpProvider";

const OpenJobRqst = () => {
  const { openJobs, setOpenJobs, postedJobs, setPostedJobs } = PopUpState();
  const [modalHeader, setModalHeader] = useState("");
  const [isFinalize, setIsFinalize] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cancelButtonLabel, setCancelButtonLabel] = useState("");
  const [finalizeButtonLabel, setFinalizeButtonLabel] = useState("");
  const [order,setOrder] = useState(null)
  const [workerId,setWorkerId] = useState(null);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const socket = useSelector((state) => state?.socket?.socket);
  useEffect(() => {
    socket?.on("startBid-request", (data) => {
        setWorkerId(data?.workerId)
      setOrder(data?.order);
      setModalHeader("Order Bid");
      setIsFinalize(true);
      setFinalizeButtonLabel("Yes");
      setCancelButtonLabel("Cancel");
      toggleModal();
    });
    return () => {
      socket?.off("startBid-request");
    };
  });

  const schedulingOrder = async () => {
    const data = { orderId: order._id, token: token };
    // api should add the workers/ id in the users array
    const result = await dispatch(activateOrderAsync(data));
    if (result.type === "orders/activateOrders/fulfilled") {
      if (result.payload.Status === "Active") {
        const data = {
          order: order,
          result: "true",
        };
        const startJobSocket = () => {
          if (!socket) return;
          socket?.emit("startBid-response", data);

          toggleModal();
          return () => {
            socket?.off("startBid-response");
          };
        };
        startJobSocket();

        setPostedJobs((prevPostedJobs) =>
          prevPostedJobs.filter((postedJob) => postedJob._id !== order._id)
        );

        setScheduledOrders((prevSchOrders) => [...prevSchOrders, order]);

        setIsFinalize(false);
        setOrder(null);
      }
    }
  };

  const Cancel = async () => {
    const data = {
      result: "false",
      order: order,
      workerId
    };
    socket?.emit("startBid-response", data);
    setIsFinalize(false);
    setOrder(null);
    toggleModal();
    return () => {
      socket?.off("startBid-response");
    };
  };

  const cancel = () => {
    setOrderToCancel(null);
    setModalHeader("");
    setFinalizeButtonLabel("");
    setCancelButtonLabel("");
    setFinalizeFunction(false);
    toggleModal();
  };
  return (
    <Modal
      isOpen={isModalOpen}
      toggle={toggleModal}
      centered
      backdrop="static"
      keyboard={false}
    >
      <ModalHeader>{modalHeader}</ModalHeader>
      <ModalBody style={{ maxHeight: "200px", overflowY: "auto" }}>
        {order && (
          <>
            <div>
              <strong>Order Title:</strong> {order?.Title}
            </div>
            <div>
              <strong>Service:</strong> {order?.service}
            </div>
            <div>
              <strong>Amount:</strong> ${order?.amount}
            </div>
            <div>
              <strong>Order Details:</strong>{" "}
              {order.details.replace(/<br\s*\/?>/g, "\n")}
            </div>
          </>
        )}
      </ModalBody>
      <ModalFooter>
        <Button
          color="secondary"
          onClick={
            isFinalize
              ? () => {
                  Cancel();
                  toggleModal();
                }
              : cancel
          }
        >
          {cancelButtonLabel}
        </Button>
        <Button
          color={isFinalize ? "success" : "danger"}
          onClick={
            isFinalize
              ? () => {
                  schedulingOrder();
                  toggleModal();
                }
              : () => {
                  setFinalizeFunction(true);
                  toggleModal();
                }
          }
        >
          {finalizeButtonLabel}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default OpenJobRqst;
