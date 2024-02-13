import React from "react";
import Swal from "sweetalert2";

const OpenJobResult = ({ confirmed, orderId, setStartBidVerified }) => {
  if (confirmed === "true")
    Swal.fire({
      title: "Start job Request Confirmed",
      text: `Great news! The user has approved your request for the job.`,
      icon: "success",
    }).then((result) => {
      if (result.isConfirmed) {
        // User clicked "OK"
        setStartBidVerified(false);
      }
    });
  else if (confirmed === "false") {
    Swal.fire({
      title: "Start job Request Denied",
      text: `Unfortunately, the user has declined your job request.`,
      icon: "error",
    }).then((result) => {
      if (result.isConfirmed) {
        // User clicked "OK"
        setStartBidVerified(false);
      }
    });
  }
  return <div></div>;
};

export default OpenJobResult;
