import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";
import WorkerRoutes from "../Routes/WorkerRoutes";
import { setSocket } from "../Redux/Slices/SocketSlice";
import { useDispatch, useSelector } from "react-redux";
import SidebarWorker from "../Components/SidebarWorker/SidebarWorker";
import { PopUpState } from "../Context/PopUpProvider";
import UserNavbar from "../Components/Navbar/UserNavbar";
const Worker = () => {
  let { sidebarVisible, setSidebarVisible } = PopUpState();
  let { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setSocket(user));
    return () => {
      if (user) {
        dispatch(setSocket(null)); // Disconnect socket on unmount
      }
    };
  }, []);
  const getRoutes = (WorkerRoutes) => {
    return WorkerRoutes.map((prop, key) => {
      if (prop.layout === "/worker") {
        return (
          <Route path={prop.path} element={prop.component} key={key} exact />
        );
      } else {
        return null;
      }
    });
  };

  const [isLargeScreen, setIsLargeScreen] = useState(true);

  useEffect(() => {
    // Function to handle visibility of sidebar based on screen size
    const handleResize = () => {
      let isLargeScreen = window.innerWidth >= 768; // 768 is the bootstrap 'md' breakpoint
      setSidebarVisible(isLargeScreen);
    };

    // Call handleResize initially and add event listener for window resize
    handleResize();
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  // return (
  //   <>

  //     <Container fluid className="mt-8 pb-5">
  //       <Row>
  //         {sidebarVisible && (
  //           <Col md={3} className={sidebarVisible ? "" : "d-none"}>
  //             <SidebarWorker />
  //           </Col>
  //         )}
  //         <Col md={sidebarVisible ? 9 : 12}>
  //           <Row>
  //             <UserNavbar />
  //           </Row>
  //           <Row className="justify-content-center">
  //             {/* Your Routes */}
  //             <Routes>
  //               {getRoutes(WorkerRoutes)}
  //               <Route
  //                 path="*"
  //                 element={<Navigate to="/worker/workerhomepage" replace />}
  //               />
  //             </Routes>
  //           </Row>
  //         </Col>
  //       </Row>
  //     </Container>

  //   </>
  // );
  return (
    <Container fluid className="">
      <Row>
        <Col>
          <UserNavbar />
        </Col>
      </Row>
      <Row className="">
        {sidebarVisible && (
          <Col xs={12} sm={3} md={3} className="mb-3 mb-md-0">
            <SidebarWorker />
          </Col>
        )}
        <Col xs={12} sm={sidebarVisible ? 6 : 12}>
          <Routes>
            {getRoutes(WorkerRoutes)}
            <Route
              path="*"
              element={<Navigate to="/worker/workerhomepage" replace />}
            />
          </Routes>
        </Col>
      </Row>
    </Container>
  );
};

export default Worker;
