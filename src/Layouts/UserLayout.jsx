import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { Container, Row } from "reactstrap";
import UserRoutes from "../Routes/UserRoutes";
const User = () => {
  const getRoutes = (UserRoutes) => {
    return UserRoutes.map((prop, key) => {
      if (prop.layout === "/user") {
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
      <Container fluid  className="mt-8 pb-5">
        <Row className="justify-content-center">
          <Routes>
            {getRoutes(UserRoutes)}
            <Route
              path="*"
              element={<Navigate to="/user/homepage" replace />}
            />
          </Routes>
        </Row>
      </Container>
    </>
  );
};

export default User;
