/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import Swal from "sweetalert2";

//shows that either the offer was rejected or accepted for an order
const OfferResult = ({ result,params,setOfferResult }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user.role;
  console.log(userId)
  if (result === "false") {
    Swal.fire({
      icon: "error",
      title: "Offer Cancelled!",
      html: `<b>Your offer was rejected!</b><br />
      <b>Title</b>: ${params.Title}<br />
      <b>Details</b>: ${params.details}<br />
      <b>Service</b>: ${params.service}<br />
      <b>Amount</b>: ${params.amount}`,
      allowOutsideClick: false, 
    }).then((result) => {
      if (result.isConfirmed) {
        // User clicked "OK"
        setOfferResult(false);
      }
    });
  } else {
    Swal.fire({
        icon: "success",
        title: "Offer Accepted!",
        html: `<b>Your offer was accepted!</b><br />
        <b>Title</b>: ${params.Title}<br />
        <b>Details</b>: ${params.details}<br />
        <b>Service</b>: ${params.service}<br />
        <b>Amount</b>: ${params.amount}`,
        allowOutsideClick: false, 
      }).then((result) => {
        if (result.isConfirmed) {
          // User clicked "OK"
          //disptach the create order here.
          setOfferResult(false);
        }
      });

  }
  return <div></div>;
};

export default OfferResult;
