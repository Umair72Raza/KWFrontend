/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Swal from "sweetalert2";
import Feedback from "../../Components/feedback/feedback";
const FinishJob = ({ confirmed, SetConfirm, order, setFinishJobVerified }) => {
  const [feedback,setfeedback]=useState(false)
  //let modal =false;
  if (confirmed === "true") {
    Swal.fire({
      title: "Finish Confirmed",

      icon: "success",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("confirmed in worker");
        // SetConfirm('')
        setfeedback(true);
       setFinishJobVerified(false);
       
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
  return (
    <>
      {feedback===true ? (
        <Feedback
          flag={feedback}
          order={order}
          setFinishOrderReq={""}
          SetConfirm={SetConfirm}
        />
      ):{}}
    </>
  );
};

export default FinishJob;
