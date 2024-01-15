import React from 'react'
import { Route, Routes, Navigate } from "react-router-dom";
import { Container, Row } from "reactstrap";
import routes from '../routes.Worker';
const Worker = () => {
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
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
            {getRoutes(routes)}
            <Route path="*" element={<Navigate to="/worker/workerhomepage" replace />} />
          </Routes>
        </Row>
      </Container>
    </>
  )
}

export default Worker
