import { Route, Routes } from "react-router-dom";
import { Row } from "reactstrap";
import AdminRoutes from "../Routes/AdminRoutes";

const AdminLayout = () => {
  const getRoutes = (AdminRoutes) => {
    return AdminRoutes.map((prop, key) => {
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
      <div className="mt-8 pb-5">
        <Row className="justify-content-center">
          <Routes>
            {getRoutes(AdminRoutes)}
            {/* <Route
              path="*"
              element={<Navigate to="/admin/homepage" replace />}
            /> */}
          </Routes>
        </Row>
      </div>
    </>
  );
};

export default AdminLayout;
