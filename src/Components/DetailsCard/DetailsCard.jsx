/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const DetailsCard = ({
  person,
  setShowDetailsCard,
  setShowFeedbacksState,
  orders,
}) => {
  const { _id, firstName, lastName, role, status } = person;

  const [scheduledCount, setScheduledCount] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [pastCount, setPastCount] = useState(0);
  const [cancelledCount, setCancelledCount] = useState(0);

  useEffect(() => {
    if (orders !== undefined && orders.length > 0) {
      updateCounts(orders);
    }
  }, [orders]);

  useEffect(() => {
    Swal.fire({
      title: `<strong> ${firstName}</strong>`,
      icon: "info",
      html: `
        First Name: ${firstName}  </br>
        Last Name: ${lastName} </br>
        Status: ${status} </br>
        Role: ${role} </br>
        ID: ${_id}</br>
        </br>
      `,
      focusConfirm: false,
      confirmButtonText: `
        Okay
      `,
      confirmButtonAriaLabel: "Thumbs up, great!",
      showCancelButton: true,
      showCloseButton: false, // Don't show the close button
      allowOutsideClick: false, // Don't close on clicking outsid
      cancelButtonText: `
        Show Order Details
      `,
      cancelButtonAriaLabel: "Show Order Details",
    }).then((result) => {
      if (result.isConfirmed) {
        setShowDetailsCard(false);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        setShowDetailsCard(false);
        showOrderDetails();
      }
    });
  }, [scheduledCount, activeCount, pastCount, cancelledCount]);

  const updateCounts = (orders) => {
    setScheduledCount(
      orders.filter((order) => order.Status === "Scheduled").length
    );
    setActiveCount(orders.filter((order) => order.Status === "Active").length);
    setPastCount(orders.filter((order) => order.Status === "Past").length);
    setCancelledCount(
      orders.filter((order) => order.Status === "Cancelled").length
    );
  };

  const showOrderDetails = () => {
    // Show another Swal.fire with the updated counts
    Swal.fire({
      title: "Order Details",
      html: `
        <p>Scheduled: ${scheduledCount}</p>
        <p>Active: ${activeCount}</p>
        <p>Past: ${pastCount}</p>
        <p>Cancelled: ${cancelledCount}</p>
      `,
      icon: "info",
    }).then(() => {
      // After clicking OK, set setShowDetailsCard(false)
      setShowDetailsCard(false);
    });
  };

  return <div></div>;
};

export default DetailsCard;
