import React from "react";
import AdminNavbar from "../../Components/AdminNavbar/AdminNavbar";
import { Button, Col, Container, Row } from "reactstrap";
import { useNavigate } from "react-router-dom";
import CustomAdminCard from "../../Components/CustomAdminCard/CustomAdminCard";
import man from "../../assets/images/AdminPngs/man.png";
import workerspng from "../../assets/images/AdminPngs/workers.png";
import servicepng from "../../assets/images/AdminPngs/service.png";
const HomePageAdmin = () => {
  const navigate = useNavigate();

  const handleUsers = async () => {
    navigate("/admin/adminusers");
  };

  const handleWorkers = async () => {
    navigate("/admin/adminworkers");
  };

  const goToServices = async () => {
    navigate("/admin/services");
  };
  return (
    <>
      <AdminNavbar />
      <div>
      <Container>
        <Row className="justify-content-center mt-5">
          <Col sm="12" md="6" lg="4">
            <CustomAdminCard
              logoSrc={man}
              title="Users"
              buttonText="Users"
              buttonColor="primary"
              onClickHandler={handleUsers}
            />
          </Col>
          <Col sm="12" md="6" lg="4">
            <CustomAdminCard
              logoSrc={workerspng}
              title="Workers"
              buttonText="Workers"
              buttonColor="primary"
              onClickHandler={handleWorkers}
            />
          </Col>
          <Col sm="12" md="6" lg="4">
            <CustomAdminCard
              logoSrc={servicepng}
              title="Services"
              buttonText="Services"
              buttonColor="primary"
              onClickHandler={goToServices}
            />
          </Col>
        </Row>
      </Container>
      </div>
    </>
  );
};

export default HomePageAdmin;
