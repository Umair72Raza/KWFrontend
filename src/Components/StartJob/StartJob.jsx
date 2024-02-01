import React from "react";
import Swal from "sweetalert2";

const StartJob = ({ confirmed, orderId, setStartJobVerified }) => {
  if (confirmed === "true")
    Swal.fire({
      title: "Start job Request Confirmed",
      text: `Great news! The user has approved your request to start the job.`,
      icon: "success",
    }).then((result) => {
      if (result.isConfirmed) {
        // User clicked "OK"
        setStartJobVerified(false);
      }
    });
  else if (confirmed === "false") {
    Swal.fire({
      title: "Start job Request Denied",
      text: `Unfortunately, the user has declined your job start request.`,
      icon: "error",
    }).then((result) => {
      if (result.isConfirmed) {
        // User clicked "OK"
        setStartJobVerified(false);
      }
    });
  }
  return <div></div>;
};

export default StartJob;
