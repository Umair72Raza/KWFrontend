// import React, { useState } from "react";
// import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

// const FeedbacksComp = ({
//   feedbacks,
//   showFeedbacksState,
//   setShowFeedbacksState,
// }) => {
//   const [showFullText, setShowFullText] = useState(false);

//   const toggleText = () => {
//     setShowFullText(!showFullText);
//   };

//   const truncateText = (text, maxLength) => {
//     if (text.length > maxLength) {
//       return showFullText ? text : `${text.slice(0, maxLength)}...`;
//     }
//     return text;
//   };

//   const toggle = () => {
//     setShowFeedbacksState(!showFeedbacksState);
//   };
//   const starRating = (numStars) => {
//     const stars = [];
//     for (let i = 0; i < numStars; i++) {
//       stars.push(
//         <span key={i} className="y">
//           ★
//         </span>
//       );
//     }
//     return stars;
//   };

//   return (
//     <Modal isOpen={showFeedbacksState} toggle={toggle}>
//       <ModalHeader toggle={toggle}>Feedbacks</ModalHeader>
//       <ModalBody>
//         <ul>
//           {feedbacks?.map((feedback) => (
//             <li key={feedback._id}>
//               <strong>{feedback.feedbackGiver.firstName}:</strong>{" "}
//               {/* {feedback.text} (Rating: {starRating(feedback.rating)}) */}
//               {truncateText(feedback.text, 100)} (Rating:{" "}
//               {starRating(feedback.rating)})
//               {feedback.text.length > 5 && (
//                 <button onClick={toggleText}>
//                   {showFullText ? "Show Less" : "Show More"}
//                 </button>
//               )}
//             </li>
//           ))}
//         </ul>
//       </ModalBody>
//       <ModalFooter>
//         <Button color="secondary" onClick={toggle}>
//           Close
//         </Button>
//       </ModalFooter>
//     </Modal>
//   );
// };

// export default FeedbacksComp;

import React, { useState } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

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

  const truncateText = (feedback, maxLength) => {
    return showFullTextMap[feedback._id]
      ? feedback.text
      : feedback.text.length > maxLength
      ? `${feedback.text.slice(0, maxLength)}...`
      : feedback.text;
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
    <Modal isOpen={showFeedbacksState} toggle={toggle}>
      <ModalHeader toggle={toggle}>Feedbacks</ModalHeader>
      <ModalBody>
      {feedbacks && feedbacks.length > 0 ? (
        <ul>
          {feedbacks?.map((feedback) => (
            <li style={{margin:"2%"}} key={feedback._id}>
              <strong>{feedback.feedbackGiver.firstName}:</strong>{" "}
              {truncateText(feedback, 45)} (Rating:{" "}
              {starRating(feedback.rating)})
              <span >
              {feedback.text.length > 45 && (
                <Button color="info" onClick={() => toggleText(feedback._id)}>
                  {showFullTextMap[feedback._id] ? "Show Less" : "Show More"}
                </Button>
              )}
              </span>
            </li>
          ))}
        </ul>
        ) : (
          <p>No feedbacks available.</p>
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
