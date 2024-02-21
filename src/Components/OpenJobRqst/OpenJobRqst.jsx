import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { PopUpState } from "../../Context/PopUpProvider";
import { schedulizeOrderAsync } from "../../Redux/Slices/OrderSlice";
import { set } from "lodash";

const OpenJobRqst = () => {
  const dispatch = useDispatch();
  const { setScheduledOrders, setPostedJobs } = PopUpState();
  const { token } = useSelector((state) => state.auth);
  const [modals, setModals] = useState([]);
  const [openModals, setOpenModals] = useState([]); // State to keep track of open modals
  const socket = useSelector((state) => state?.socket?.socket);

  useEffect(() => {
    socket?.on("startBid-request", (data) => {
      const newModal = {
        order: data?.order,
        workerId: data?.worker?.workerId,
        workerfirstName: data?.worker?.workerfirstName,
        workerlastName: data?.worker?.workerlastName,
      };
      setModals((prevModals) => [newModal, ...prevModals]); // Insert new modal at the beginning of the array
      setOpenModals((prevOpenModals) => [
        newModal.order._id,
        ...prevOpenModals,
      ]); // Open the new modal
    });
    return () => {
      socket?.off("startBid-request");
    };
  }, [socket]);

  const toggleModal = (orderId) => {
    setOpenModals((prevOpenModals) =>
      prevOpenModals.filter((modalId) => modalId !== orderId)
    );
  };

  const schedulingOrder = async (order, workerId) => {
    const data = { orderId: order._id, token: token, workerId };
    // api should add the workers/ id in the users array
    const result = await dispatch(schedulizeOrderAsync(data));
    if (result.type === "orders/schedulizeOrder/fulfilled") {
      if (result.payload.Status === "Scheduled") {
        const data = {
          order: result?.payload,
          result: "true",
          workerId: workerId,
        };
        if (socket) {
          socket.emit("startBid-response", data);
        }
        setPostedJobs((prevPostedJobs) =>
          prevPostedJobs.filter(
            (postedJob) => postedJob._id !== data?.order._id
          )
        );
        // Cancel other modals with the same order ID and different worker ID
        modals.forEach((modal) => {
          if (modal.order._id === order._id && modal.workerId !== workerId) {
            cancelOrder(modal, modal.workerId);
          }
        });

        setScheduledOrders((prevSchOrders) => [...prevSchOrders, data?.order]);
        setModals((prevModals) =>
          prevModals.filter((modal) => modal.order._id !== order._id)
        );
        setOpenModals((prevOpenModals) =>
          prevOpenModals.filter((modalId) => modalId !== order._id)
        );
      }
    }
  };
  const cancelOrder = (modal, workerId) => {
    const data = {
      result: "false",
      order: modal.order,
      workerId,
    };
    if (socket) {
      socket.emit("startBid-response", data);
    }

    // Filter out only the modal being canceled
    setModals((prevModals) =>
      prevModals.filter((m) => m.order._id !== modal.order._id)
    );

    // Remove only the modal being canceled from the open modals state
    setOpenModals((prevOpenModals) =>
      prevOpenModals.filter((modalId) => modalId !== modal.order._id)
    );
  };

  return (
    <>
      {modals.map((modal, index) => (
        <Modal
          key={index}
          isOpen={openModals.includes(modal.order._id)} // Check if the modal's order ID is in the openModals state
          toggle={() => toggleModal(modal.order._id)}
          centered
          backdrop="static"
          keyboard={false}
        >
          <ModalHeader>
            {`Order Request by ${modal.workerfirstName} ${modal.workerlastName}`}
          </ModalHeader>
          <ModalBody style={{ maxHeight: "200px", overflowY: "auto" }}>
            <>
              <div>
                <strong>Order Title:</strong> {modal.order?.Title}
              </div>
              <div>
                <strong>Service:</strong> {modal.order?.service}
              </div>
              <div>
                <strong>Amount:</strong> ${modal.order?.amount}
              </div>
              <div>
                <strong>Order Details:</strong>{" "}
                {modal.order.details.replace(/<br\s*\/?>/g, "\n")}
              </div>
            </>
          </ModalBody>
          <ModalFooter>
            <Button
              color="secondary"
              onClick={() => cancelOrder(modal, modal.workerId)}
            >
              Cancel
            </Button>

            <Button
              color="danger"
              onClick={() => schedulingOrder(modal.order, modal.workerId)}
            >
              Yes
            </Button>
          </ModalFooter>
        </Modal>
      ))}
    </>
  );
};

export default OpenJobRqst;
