import React from 'react'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const FeedbacksComp = ({feedbacks, showFeedbacksState,setShowFeedbacksState }) => {

  const toggle =()=> {
    setShowFeedbacksState(!showFeedbacksState);
  }

  return (
    <Modal isOpen={showFeedbacksState} toggle={toggle}>
      <ModalHeader toggle={toggle}>Feedbacks</ModalHeader>
      <ModalBody>
        <ul>
          {feedbacks?.map((feedback) => (
            <li key={feedback._id}>
              <strong>{feedback.feedbackGiver.firstName}:</strong>{" "}
              {feedback.text} (Rating: {feedback.rating})
            </li>
          ))}
        </ul>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );

};

export default FeedbacksComp