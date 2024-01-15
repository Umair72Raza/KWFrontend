/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import Swal from "sweetalert2";
import Feedback from "../../Components/feedback/feedback";
const FinishJob = ({ confirmed, SetConfirm, order, setFinishJobVerified }) => {
  let modal = "false";
  if (confirmed === "true") {
    Swal.fire({
      title: "Finish Confirmed",

      icon: "success",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("confirmed in worker");
        // SetConfirm('')
        //setFinishJobVerified(false);
        modal = true;
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
      {modal && (
        <Feedback
          flag={"true"}
          order={order}
          setFinishOrderReq={""}
          SetConfirm={SetConfirm}
        />
      )}
    </>
  );
};

export default FinishJob;
