import React, { useEffect } from 'react'
import { Route, Routes, Navigate } from "react-router-dom";
import { Container, Row } from "reactstrap";
import WorkerRoutes from '../Routes/WorkerRoutes';
import { setSocket } from "../Redux/Slices/SocketSlice";
import { useDispatch, useSelector } from "react-redux";
const Worker = () => {
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
  return (
    <>
      <Container fluid className="mt-8 pb-5">
        <Row className="justify-content-center">
          <Routes>
            {getRoutes(WorkerRoutes)}
            <Route path="*" element={<Navigate to="/worker/workerhomepage" replace />} />
          </Routes>
        </Row>
      </Container>
    </>
  )
}

export default Worker
