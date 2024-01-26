import React, { useState } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { truncateText } from "../../utils";

const FeedbacksComp = ({
  feedbacks,
  showFeedbacksState,
  setShowFeedbacksState,
}) => {
  const [showFullTextMap, setShowFullTextMap] = useState({});
  const toggleText = (feedbackId) => {
    setShowFullTextMap((prevMap) => ({
      ...prevMap,
      [feedbackId]: !prevMap[feedbackId],
    }));
  };

  const toggle = () => {
    setShowFeedbacksState(!showFeedbacksState);
  };

  const starRating = (numStars) => {
    const stars = [];
    for (let i = 0; i < numStars; i++) {
      stars.push(
        <span key={i} className="y">
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <Modal isOpen={showFeedbacksState} toggle={toggle} backdrop="static">
      <ModalHeader toggle={toggle}>Feedbacks</ModalHeader>
      <ModalBody>
        {feedbacks && feedbacks.length > 0 ? (
          <ul>
            {feedbacks?.map((feedback) => (
              <li style={{ margin: "2%" }} key={feedback._id}>
                <strong>{feedback.feedbackGiver.firstName}:</strong>{" "}

                {truncateText(feedback.text, 5)} (
                  <b>Rating:{" "}</b>
                {starRating(feedback.rating)})
                <span>
                  {feedback.text.length > 5 && (
                    <Button color="info" onClick={() => toggleText(feedback._id)}>
                      {showFullTextMap[feedback._id] ? "Show Less" : "Show More"}
                    </Button>
                  )}
                </span>
                {showFullTextMap[feedback._id] && (
                  <div style={{ whiteSpace: "pre-wrap" }}>{feedback.text}</div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No Feedback is available.</p>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="primary" outline onClick={toggle}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default FeedbacksComp;
