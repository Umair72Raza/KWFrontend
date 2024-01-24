import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Feedback from "../../Components/feedback/feedback";

const FinishJob = ({ confirmed, SetConfirm, order, setFinishJobVerified }) => {
  const [feedback, setFeedback] = useState(false);

  // useEffect(() => {
  //   if (confirmed === "false") {
  //     setFeedback(false);
  //     setFinishJobVerified(false);
  //   }
  // }, [confirmed, setFinishJobVerified]);

  useEffect(() => {
    if (confirmed === "true") {
      Swal.fire({
        title: "Finish Confirmed",
        icon: "success",
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          setFeedback(true);
          //setFinishJobVerified(false);
        }
      });
    } else if (confirmed === "false") {
      Swal.fire({
        title: "Finish was not Confirmed!",
        icon: "error",
      }).then((result) => {
        if (result.isConfirmed) {
          SetConfirm("");
          setFinishJobVerified(false);
        }
      });
    }
  }, [confirmed, SetConfirm, setFinishJobVerified]);

  return (
    <>
      {confirmed =="true" && (
        <Feedback
          flag={feedback}
          order={order}
          setFinishOrderReq={""} // Ensure you pass a function that can update the state
          SetConfirm={SetConfirm}
        />
      )}
    </>
  );
};

export default FinishJob;