import React, { useEffect } from "react";
import {
  Button,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import { PopUpState } from "../../Context/PopUpProvider";
import { activateOrderAsync } from "../../Redux/Slices/OrderSlice.js";
import { useDispatch, useSelector } from "react-redux";
const ModalComponent = () => {
  const socket = useSelector((state) => state?.socket?.socket);
  const dispatch = useDispatch();
  let {
    modalHeader,
    isFinalize,
    isModalOpen,
    inputLabel,
    modalInputValue,
    setModalInputValue,
    cancelButtonLabel,
    finalizeButtonLabel,
    showInput,
    order,
    toggleModal,
    cancel,
    setFinalizeFunction,
    setIsFinalize,
    setOrder,
    setModalHeader,
    setFinalizeButtonLabel,
    setCancelButtonLabel,
    setScheduledOrders,
    setActiveOrder,
  } = PopUpState();
  const { token } = useSelector((state) => state.auth);
  useEffect(() => {
    socket?.on("startjob-request", (order) => {
      setOrder(order);
      setModalHeader("Order Activation");
      setIsFinalize(true);
      setFinalizeButtonLabel("Yes");
      setCancelButtonLabel("Cancel");
      toggleModal();
    });
    return () => {
      socket?.off("startjob-request");
    };
  });

  const activatingOrder = async () => {
    const data = { orderId: order._id, token: token };
    const result = await dispatch(activateOrderAsync(data));
    if (result.type === "orders/activateOrders/fulfilled") {
      if (result.payload.Status === "Active") {
        const data = {
          order: order,
          result: "true",
        };
        //the resulted order should have the worker id at users[1]
        const startJobSocket = () => {
          if (!socket) return;
          socket?.emit("startjob-response", data);

          toggleModal();
          return () => {
            socket?.off("startjob-response");
          };
        };
        startJobSocket();

        setScheduledOrders((prevScheduledOrders) =>
          prevScheduledOrders.filter(
            (scheduledOrder) => scheduledOrder._id !== order._id
          )
        );

        setActiveOrder((prevActiveOrders) => [...prevActiveOrders, order]);

        setIsFinalize(false);
        setOrder(null);
      }
    }
  };

  const Cancel = async () => {
    const data = {
      result: "false",
      order: order,
    };
    socket?.emit("startjob-response", data);
    setIsFinalize(false);
    setOrder(null);
    toggleModal();
    return () => {
      socket?.off("startjob-response");
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
              <strong>Order Title:</strong> {order.Title}
            </div>
            <div>
              <strong>Service:</strong> {order.service}
            </div>
            <div>
              <strong>Amount:</strong> ${order.amount}
            </div>
            <div>
              <strong>Order Details:</strong>{" "}
              {order.details.replace(/<br\s*\/?>/g, "\n")}
            </div>
          </>
        )}

        {showInput && (
          <Form>
            <FormGroup>
              <Label for="cancelReason">{inputLabel}</Label>
              <Input
                type="text"
                id="cancelReason"
                placeholder="Enter reason"
                value={modalInputValue}
                onChange={(e) => setModalInputValue(e.target.value)}
              />
            </FormGroup>
          </Form>
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
                  activatingOrder();
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

export default ModalComponent;
