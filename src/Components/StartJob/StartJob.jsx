/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import Swal from "sweetalert2";

const StartJob = ({confirmed, orderId, setStartJobVerified}) => {
  if (confirmed === "true")
    Swal.fire({
      title: "Start Confirmed",
      text: `You can start working on requested order`,
      icon: "success",
    }).then((result) => {
        if (result.isConfirmed) {
          // User clicked "OK"
          setStartJobVerified(false);
        }
      });
  else  if (confirmed === "false")  {
    Swal.fire({
      title: "Start was not Confirmed!",
      text: `You cannot start working on requested order yet`,
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
