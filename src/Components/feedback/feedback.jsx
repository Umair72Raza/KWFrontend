import React, { useState } from "react";
import {
  Container,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from "reactstrap";
import { FaStar } from "react-icons/fa";
import { heading } from "./constants";
import { useDispatch, useSelector } from "react-redux";
import { AddFeedBack } from "../../Redux/Slices/FeedBackSlice";
const feedback = ({ flag, order, setFinishOrderReq, SetConfirm }) => {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [rateing, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [modal2, setModal] = useState(true);

  const toggle = () => {
    if (user.role === "user") {
      setFinishOrderReq(false);
      setModal(false);
    } else if (user.role === "worker") {
      SetConfirm("");
      setModal(false);
    }
  };
  const send = () => {
    if (user.role === "user") {
      console.log("I reached in user for feedback");
      const params = {
        orderId: order._id,
        feedbackGiver: user._id,
        feedbackReceiver: order.users[1],
        text: comment,
        rating: rateing,
      };
      if (flag == true) {
        dispatch(AddFeedBack({ params, token }));
      }
      setFinishOrderReq(false);
    } else if (user.role === "worker") {
      console.log("feedback in worker");
      const params = {
        orderId: order._id,
        feedbackGiver: user._id,
        feedbackReceiver: order.users[0],
        text: comment,
        rating: rateing,
      };
      if (flag == true) {
        dispatch(AddFeedBack({ params, token }));
        SetConfirm("");
      }
      SetConfirm("");
    }
    toggle();
  };

  return (
    <div>
      <Modal isOpen={modal2} centered>
        {user.role == "user" ? (
          <ModalHeader toggle={toggle} className="justify-content-center">
            {heading.rateService}
          </ModalHeader>
        ) : (
          <ModalHeader toggle={toggle} className="justify-content-center">
            {heading.rateUser}
          </ModalHeader>
        )}
        <ModalBody>
          <Container className="">
            {[...Array(5)].map((item, index) => {
              const givenRating = index + 1;
              return (
                <label>
                  <Input
                    type="radio"
                    value={givenRating}
                    onClick={() => {
                      setRating(givenRating);
                    }}
                    className="d-none"
                  />
                  <FaStar
                    color={
                      givenRating < rateing || givenRating === rateing
                        ? "rgb(255,255,0)"
                        : "rgb(192,192,192)"
                    }
                  />
                </label>
              );
            })}
          </Container>
        </ModalBody>
        <ModalFooter className="justify-content-start">
          <div className="d-flex flex-row ">
            <Input
              type="text"
              className="px-sm-5 text-contain"
              placeholder="Add a comment "
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
              }}
            />
            <Button color="primary" onClick={send}>
              Send
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default feedback;
