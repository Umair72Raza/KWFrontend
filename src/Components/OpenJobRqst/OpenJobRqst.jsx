import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { PopUpState } from "../../Context/PopUpProvider";
import {  schedulizeOrderAsync } from "../../Redux/Slices/OrderSlice";
import { set } from "lodash";

const OpenJobRqst = () => {
    const dispatch = useDispatch();
  const { openJobs, setOpenJobs, postedJobs, setPostedJobs, setScheduledOrders } = PopUpState();
  const {token} = useSelector((state)=>state.auth);
  const [modalHeader, setModalHeader] = useState("");
  const [isFinalize, setIsFinalize] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cancelButtonLabel, setCancelButtonLabel] = useState("");
  const [finalizeButtonLabel, setFinalizeButtonLabel] = useState("");
  const [order, setOrder] = useState(null);
  const [workerId, setWorkerId] = useState(null);
  const [workerfirstName, setWorkerfirstName] = useState(null);
  const [workerlastName, setWorkerlastName] = useState(null);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const socket = useSelector((state) => state?.socket?.socket);
  useEffect(() => {
    socket?.on("startBid-request", (data) => {
      setWorkerId(data?.worker?.workerId);
      setWorkerfirstName(data?.worker?.firstName);
      setWorkerlastName(data?.worker?.lastName)

      
      setOrder(data?.order);
      setModalHeader(
        `Order Bid by ${data?.worker?.workerfirstName} ${data?.worker?.workerlastName}`
      );
      setIsFinalize(true);
      setFinalizeButtonLabel("Yes");
      setCancelButtonLabel("Cancel");
      toggleModal();
      setTimeout(() => {  
        setIsModalOpen(false);
      }, 120000);
    });
    return () => {
      socket?.off("startBid-request");
    };
  });

  const schedulingOrder = async () => {
    const data = { orderId: order._id, token: token, workerId };
    // api should add the workers/ id in the users array
    const result = await dispatch(schedulizeOrderAsync(data));
    if (result.type === "orders/schedulizeOrder/fulfilled") {
      if (result.payload.Status === "Scheduled") {
        const data = {
          order: result?.payload,
          result: "true",
          workerId: workerId
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
        //  order.status = "Scheduled";
        setScheduledOrders((prevSchOrders) => [...prevSchOrders, data?.order]);

        setIsFinalize(false);
        setOrder(null);
        setWorkerId(null);
      }
    }
  };

  const Cancel = async () => {
    const data = {
      result: "false",
      order: order,
      workerId,
    };
    socket?.emit("startBid-response", data);
    setIsFinalize(false);
    setOrder(null);
    toggleModal();
    return () => {
      socket?.off("startBid-response");
    };
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
          onClick={() => {
            Cancel();
            toggleModal();
          }}
        >
          {cancelButtonLabel}
        </Button>
        <Button
          color="danger"
          onClick={() => {
            schedulingOrder();
            toggleModal();
          }}
        >
          {finalizeButtonLabel}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default OpenJobRqst;
