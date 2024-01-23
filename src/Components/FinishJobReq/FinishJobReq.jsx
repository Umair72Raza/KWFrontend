/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  Container,
  Row,
  Col,
} from "reactstrap";
import { changeStatusToPastAsync } from "../../Redux/Slices/OrderSlice";

import Feedback from "../../Components/feedback/feedback";
import { truncateText } from "../../utils";

const FinishJobReq = ({ order, setFinishOrderReq }) => {
  const socket = useSelector((state) => state?.socket?.socket);
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
      console.log(result.payload);
      const data = {
        order: result.payload,
        result: "true",
      };
      socket?.emit("finishjob-response", data);

      setFinishConfirmed(true);
      // setFinishOrderReq(false);
    }
    //
    setModal(true);
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
        <ModalHeader toggle={toggleModal} className="text-center">
          Worker wants to Finish the job!
        </ModalHeader>
        <ModalBody className="text-center">
          <Container>
            <Row>
              <Col>
                <b>Order Title: </b>
                {order.Title}
              </Col>
            </Row>
              <Row>
                <Col>
                  <b>Order Details: </b>

                  {showMoreDetails
                    ? order.details.replace(/<br\s*\/?>/gi, "\n")
                    : truncateText(
                        order.details.replace(/<br\s*\/?>/gi, "\n"),
                        15
                      )}
                </Col>
              </Row>
              <Row>
              {order.details.trim().length > 25 && (
                <Button
                  color="link"
                  onClick={toggleDetails}
                  style={{ marginTop: "10px" }}
                >
                  {showMoreDetails ? "Show Less" : "Show More"}
                </Button>
              )}
            </Row>
          <Row>
            <Col>
            <b>Service:</b> {order.service}
            </Col>
            
          </Row>
          <Row>
            <Col><b>Amount:</b> {order.amount}</Col>
            
          </Row>
          </Container>
          <Container style={{marginTop:"2%"}}>
          <Button color="success" onClick={handleConfirm}>
            Yes, Finish it!
          </Button>{" "}
          <Button color="danger" onClick={handleCancel}>
            No, Cancel
          </Button>
          
          </Container>
        </ModalBody>
      </Modal>
      {finishConfirmed === true && (
        <Feedback
          flag={finishConfirmed}
          order={order}
          setFinishOrderReq={setFinishOrderReq}
          SetConfirm={""}
        />
      )}
    </>
  );
};

export default FinishJobReq;
