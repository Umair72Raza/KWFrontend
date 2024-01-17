/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import AdminNavbar from "../../Components/AdminNavbar/AdminNavbar";
import {
  Button,
  Col,
  Container,
  Nav,
  NavItem,
  NavLink,
  Navbar,
  Row,
} from "reactstrap";
import PersonDetails from "../../Components/PersonDetails/PersonDetails";
import WorkerDetails from "../../Components/WorkerDetails/WorkerDetails";
import { fetchUsersAsync, fetchWorkersAsync } from "../../Redux/Slices/AdminSlice";
import { useNavigate } from "react-router-dom";
import CustomAdminCard from "../../Components/CustomAdminCard/CustomAdminCard";
import man from "../../assets/images/man.png";
import workerspng from "../../assets/images/workers.png";
import servicepng from "../../assets/images/service.png";
const HomePageAdmin = () => {
  const [activeTab, setActiveTab] = useState("workers");
  const [showNavbar, setShowNavbar] = useState(false);
  const [showWorkerNavbar, setShowWorkerNavbar] = useState(false);
  const { user, token } = useSelector((state) => state.auth);
  const [newfilUsers, setNewFilUsers] = useState();
  const [activeUsers, setActiveUsers] = useState([]);
  const [inactiveUsers, setInactiveUsers] = useState([]);
  const [newfilWorkers, setNewFilWorkers] = useState();
  const [activeWorkers, setActiveWorkers] = useState([]);
  const [inactiveWorkers, setInactiveWorkers] = useState([]);
  const dispatch = useDispatch();

  const navigate = useNavigate();


  const handleUsers = async () => {
    navigate('/admin/adminusers')
  };

  const handleWorkers = async () => {
    navigate('/admin/adminworkers')
  };

  const goToServices = async () => {
    navigate("/admin/services");
  };
  return (
    <div>
      <AdminNavbar />

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
  );
};

export default HomePageAdmin;
