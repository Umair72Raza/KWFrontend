import { Route, Routes, Navigate } from "react-router-dom";
import { Container, Row } from "reactstrap";
import AuthRoutes from "../Routes/AuthRoutes";

const Auth = () => {
  const getRoutes = (AuthRoutes) => {
    return AuthRoutes.map((prop, key) => {
      if (prop.layout === "/auth") {
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
            {getRoutes(AuthRoutes)}
            <Route path="*" element={<Navigate to="/auth/login" replace />} />
          </Routes>
        </Row>
      </Container>
    </>
  );
};

export default Auth;
