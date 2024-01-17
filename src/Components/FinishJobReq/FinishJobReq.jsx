/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { changeStatusToPastAsync } from "../../Redux/Slices/OrderSlice";
import socket from "../../SocketManager/socketManager";
import Feedback from "../../Components/feedback/feedback";
const FinishJobReq = ({ order, setFinishOrderReq }) => {
  let modal = "false";
  const dispatch = useDispatch();
  Swal.fire({
    title: "Worker want to Finish?",
    html: `<div>
        <strong>Order Title:</strong> ${order.Title}
      </div>
      <div>
        <strong>Order Details:</strong> ${order.details}
      </div>
      <div>
        <strong>Service:</strong> ${order.service}
      </div>
      <div>
        <strong>Amount:</strong> ${order.amount}
      </div>`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Finish it!",
    allowOutsideClick: false,
  }).then(async (result) => {
    if (result.isConfirmed) {
      const result = await dispatch(
        changeStatusToPastAsync({ orderId: order._id })
      );
      console.log(result);
      if (result.type === "orders/changeToPastOrders/fulfilled") {
        if (result.payload.Status === "Past") {
          const data = {
            order: result.payload,
            result: "true",
          };
          socket.emit("finishjob-response", data);
        }
      }

      Swal.fire({
        title: "Finished!",
        text: "Your Order was completed.",
        icon: "success",
      }).then(async (result) => {
        if (result.isConfirmed) {
          console.log("if true");
          // Use the callback function of setModal to ensure the state is updated before rendering Feedback
          modal = true;
        }
      });

      console.log("after popup");
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      const data = {
        order,
        result: "false",
      };
      socket.emit("finishjob-response", data);
      setFinishOrderReq(false);
    }
  });
  return (
    <>
      {modal && (
        <Feedback
          flag={"true"}
          order={order}
          setFinishOrderReq={setFinishOrderReq}
          SetConfirm={""}
        />
      )}
    </>
  );
};

export default FinishJobReq;
