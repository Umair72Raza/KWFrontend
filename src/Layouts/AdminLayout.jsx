import { Route, Routes, Navigate } from "react-router-dom";
import { Container, Row } from "reactstrap";
import routes from "../routes.Admin";


const AdminLayout = () => {

    const getRoutes = (routes) => {
        return routes.map((prop, key) => {
          if (prop.layout === "/admin") {
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
        <Route path="*" element={<Navigate to="/admin/homepage" replace />} />
      </Routes>
    </Row>
  </Container>
  </>
  )
}

export default AdminLayout