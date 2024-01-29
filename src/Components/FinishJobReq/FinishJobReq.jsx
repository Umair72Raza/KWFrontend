import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  Container,
  Row,
  Col,
  ModalFooter,
} from "reactstrap";
import { changeStatusToPastAsync } from "../../Redux/Slices/OrderSlice";

import Feedback from "../../Components/feedback/feedback";
import { truncateText } from "../../utils";
import { PopUpState } from "../../Context/PopUpProvider";

const FinishJobReq = () => {
  let { fOrder,
    setFOrder,
    finishOrderReq,
    setFinishOrderReq } = PopUpState();

    useEffect(() => {
      if (!socket) return;
      socket?.on("finishjob-request", (order) => {
        setFinishOrderReq(true);
        setFOrder(order);
      });
      return () => {
        socket?.off("finishjob-request");
      };
    });
  const socket = useSelector((state) => state?.socket?.socket);
  const dispatch = useDispatch();
  const [modal, setModal] = useState(finishOrderReq);
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [finishConfirmed, setFinishConfirmed] = useState(false);

  const toggleDetails = () => {
    setShowMoreDetails(!showMoreDetails);
  };

  const toggleModal = () => {
    setModal(!modal);
    setFinishOrderReq(!finishOrderReq)
  };

  const handleConfirm = async () => {
    const result = await dispatch(
      changeStatusToPastAsync({ orderId: fOrder._id })
    );

    if (
      result.type === "orders/changeToPastOrders/fulfilled" &&
      result?.payload?.Status === "Past"
    ) {
      const data = {
        order: result.payload,
        result: "true",
      };
      socket?.emit("finishjob-response", data);

      setFinishConfirmed(true);
    }
    setModal(true);
  };

  const handleCancel = () => {
    const data = {
      order:fOrder,
      result: "false",
    };
    console.log(fOrder,"order in cancel")
    socket.emit("finishjob-response", data);
    setFinishOrderReq(false);
  };

  return (
    <>
      <Modal
        isOpen={finishOrderReq}
        toggle={toggleModal}
        centered
        backdrop="static"
        keyboard={false}
      >
        <ModalHeader  className="text-center">
          Worker wants to Finish the job!
        </ModalHeader>
        <ModalBody style={{ maxHeight: "200px", overflowY: "auto" }}>
          <Container>
            <Row>
              <Col>
                <b>Order Title: </b>
                {fOrder.Title}
              </Col>
            </Row>
            <Row>
              <Col>
                <b>Service:</b> {fOrder.service}
              </Col>

            </Row>
            <Row>
              <Col><b>Amount:</b> {fOrder.amount}</Col>

            </Row>
            <Row>
              <Col>
                <b>Order Details: </b>

                {showMoreDetails
                  ? fOrder?.details?.replace(/<br\s*\/?>/gi, "\n")
                  : truncateText(
                    fOrder?.details?.replace(/<br\s*\/?>/gi, "\n"),
                    55
                  )}
              </Col>
            </Row>
            <Row>
              {fOrder?.details?.trim()?.length > 55 && (
                <Button
                  color="link"
                  onClick={toggleDetails}
                  style={{ marginTop: "10px" }}
                >
                  {showMoreDetails ? "Show Less" : "Show More"}
                </Button>
              )}
            </Row>

          </Container>

        </ModalBody>

        <ModalFooter style={{ textAlign: "center" }}>
          <Container style={{ marginTop: "2%" }}>
            <Button color="success" onClick={handleConfirm}>
              Yes, Finish it!
            </Button>{" "}
            <Button color="danger" onClick={handleCancel}>
              No, Cancel
            </Button>

          </Container>
        </ModalFooter>
      </Modal>
      {finishConfirmed === true && (
        <Feedback
          flag={finishConfirmed}
          order={fOrder}
          setFinishOrderReq={setFinishOrderReq}
          SetConfirm={""}
        />
      )}
    </>
  );
};

export default FinishJobReq;
