import React from 'react'
import { Route, Routes, Navigate } from "react-router-dom";
import { Container, Row } from "reactstrap";
import WorkerRoutes from '../Routes/WorkerRoutes';
const Worker = () => {
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
      <Container className="mt-8 pb-5">
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
