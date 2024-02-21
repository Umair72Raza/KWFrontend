import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AuthLayout from "./Layouts/AuthLayout";
import UserLayout from "./Layouts/UserLayout";
import { checkRole, checkToken } from "./utils";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Worker from "./Layouts/WorkerLayout";
import AdminLayout from "./Layouts/AdminLayout";
import { Spinner } from "reactstrap";
import ChatPopup from "./Components/Chat Box/ChatPop";
import ModalComponent from "./Components/ModalComponent/ModalComponent";
import FinishJobReq from "./Components/FinishJobReq/FinishJobReq";
import Swal from "sweetalert2";
import OfferResult from "./Components/OfferResult/OfferResult";
import { PopUpState } from "./Context/PopUpProvider";
import OpenJobRqst from "./Components/OpenJobRqst/OpenJobRqst";

function App() {
  const [authenticated, setAuthenticated] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState(null);
  let { loginStatus } = useSelector((state) => state.auth);
  const socket = useSelector((state) => state?.socket?.socket);
  let { setScheduledOrders, setCancelledOrders, scheduledOrders } =
    PopUpState();

  // /// cancel order message
  useEffect(() => {
    socket?.on("order-canceled", (data) => {
      const Corder = data.order;
      let reason = data.reason;
      Corder.cancelReason = {
        reason: reason,
      };
      // Check if reason is empty and set a default message
      if (!reason || !reason?.length) {
        reason = "Reason not mentioned";
      }

      if (Corder) {
        Swal.fire({
          title: "Order Cancelled",
          html: `
            <div class="custom-align-left swal-text-content">
              <strong class="custom-align-left">Order Title:</strong> ${Corder.Title}
            </div>
    
            <div class="custom-align-left swal-text-content">
              <strong class="custom-align-left">Order Details:</strong> ${Corder.details}
            </div>
    
            <div class="custom-align-left swal-text-content">
              <strong class="custom-align-left">Service:</strong> ${Corder.service}
            </div>
    
            <div class="custom-align-left swal-text-content">
              <strong class="custom-align-left">Amount:</strong> ${Corder.amount}
            </div>
           
            <div class="custom-align-left swal-text-content">
              <strong class="custom-align-left">Reasons:</strong> ${reason}
            </div>
          `,
          icon: "error",
          customClass: {
            content: "swal-content-custom", // You can add a custom class for the content
          },
          allowOutsideClick: false,
        });

        setScheduledOrders((prevScheduledOrders) =>
          prevScheduledOrders.filter(
            (scheduledOrder) => scheduledOrder._id !== Corder._id
          )
        );

        setCancelledOrders((prevCancelledOrders) => [
          ...prevCancelledOrders,
          Corder,
        ]);
      }
    });
    return () => {
      socket?.off("order-canceled");
    };
  }, [socket, setScheduledOrders, setCancelledOrders]);

  useEffect(() => {
    let isMounted = true;
    // console.log(isMounted);
    const fetchData = async () => {
      if (isMounted) {
        const authenticated = checkToken();
        setAuthenticated(authenticated);
        if (authenticated) {
          const loginRole = checkRole();
          setRole(loginRole);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [loginStatus]);

  useEffect(() => {
    setIsLoading(false);
  }, [authenticated, role]);

  let routes;

  if (isLoading) {
    return <Spinner />;
  }

  if (!authenticated) {
    routes = (
      <>
        <Route path="/auth/*" element={<AuthLayout />} />
        <Route path="*" element={<Navigate to="/auth/login" />} />
      </>
    );
  } else if (role === "user") {
    routes = (
      <>
        <Route path="/user/*" element={<UserLayout />} />
        <Route path="*" element={<Navigate to="/user/homepage" />} />
      </>
    );
  } else if (role === "worker") {
    routes = (
      <>
        <Route path="/worker/*" element={<Worker />} />
        <Route path="*" element={<Navigate to="/worker/workerHomepage" />} />
      </>
    );
  } else if (role === "admin") {
    routes = (
      <>
        <Route path="/admin/*" element={<AdminLayout />} />
        <Route path="*" element={<Navigate to="/admin/homePageAdmin" />} />
      </>
    );
  }

  return (
    <>
      <BrowserRouter>
        {authenticated && (
          <>
            {" "}
            <ChatPopup />
            <ModalComponent />
            <FinishJobReq />
            <OfferResult />
            <OpenJobRqst />
          </>
        )}

        <Routes>{routes}</Routes>
      </BrowserRouter>
    </>
    // <>APPS</>
  );
}

export default App;
