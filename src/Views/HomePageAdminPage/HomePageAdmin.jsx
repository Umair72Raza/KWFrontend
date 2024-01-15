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
import { fetchUsersAsync, fetchWorkersAsync } from "../../Redux/Slices/Admin";
import { useNavigate } from "react-router-dom";
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
  const [apiUsers, setApiUsers] = useState([]);
  const [apiWorkers, setApiWorkers] = useState([]);

  //gets users from the api
  const getALLTHEUSERS = async () => {
    try {
      const result = await dispatch(fetchUsersAsync(token));
      if (result.type === "/admin/getUsers/fulfilled") {
        //console.log(result.payload)
        setApiUsers(result.payload);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // gets users from the state that is feeded by the api
  const getALLUSERS = () => {
    if (apiUsers !== null) {
      const filteredActiveUsers = Object.values(apiUsers)?.filter(
        (person) => person.access === "accepted"
      );

      const filteredInactiveUsers = Object.values(apiUsers).filter(
        (person) => person.access === "denied"
      );

      setActiveUsers(filteredActiveUsers);
      setInactiveUsers(filteredInactiveUsers);
    }
  };

  useEffect(() => {
    getALLUSERS();
  }, [apiUsers]);

  const getALLTHEWORKERS = async () => {
    try {
      const result = await dispatch(fetchWorkersAsync(token));
      if (result.type === "/admin/getWorkers/fulfilled") {
        setApiWorkers(result.payload);
      }
    } catch (error) {
      console.error("Error fetching workers:", error);
    }
  };

  const getALLWORKERS = () => {
    if (apiWorkers !== null) {
      const filteredActiveWorkers = Object.values(apiWorkers).filter(
        (person) => person.access === "accepted"
      );

      const filteredInactiveWorkers = Object.values(apiWorkers).filter(
        (person) => person.access === "denied"
      );

      setActiveWorkers(filteredActiveWorkers);
      setInactiveWorkers(filteredInactiveWorkers);
    }
  };

  useEffect(() => {
    getALLWORKERS();
  }, [apiWorkers]);

  useEffect(() => {
    if (newfilWorkers) {
      // Toggle the access property
      const updatedWorker = {
        ...newfilWorkers,
        access: newfilWorkers.access === "accepted" ? "denied" : "accepted",
      };

      // Remove the worker from the current list
      setInactiveWorkers((prevInactiveWorkers) =>
        updatedWorker.access === "denied"
          ? [...prevInactiveWorkers, updatedWorker]
          : prevInactiveWorkers.filter(
              (person) => person._id !== updatedWorker._id
            )
      );

      setActiveWorkers((prevActiveWorkers) =>
        updatedWorker.access === "accepted"
          ? [...prevActiveWorkers, updatedWorker]
          : prevActiveWorkers.filter(
              (person) => person._id !== updatedWorker._id
            )
      );
    }
  }, [newfilWorkers]);

  useEffect(() => {
    if (newfilUsers) {
      // Toggle the access property
      const updatedUser = {
        ...newfilUsers,
        access: newfilUsers.access === "accepted" ? "denied" : "accepted",
      };

      // Remove the user from the current list
      setInactiveUsers((prevInactiveUsers) =>
        updatedUser.access === "denied"
          ? [...prevInactiveUsers, updatedUser]
          : prevInactiveUsers.filter((person) => person._id !== updatedUser._id)
      );

      setActiveUsers((prevActiveUsers) =>
        updatedUser.access === "accepted"
          ? [...prevActiveUsers, updatedUser]
          : prevActiveUsers.filter((person) => person._id !== updatedUser._id)
      );
    }
  }, [newfilUsers]);

  const handleButtonClick = (tab) => {
    setActiveTab(tab);
  };

  const handleUsers = async () => {
    await getALLTHEUSERS();
    setShowWorkerNavbar(false);
    setShowNavbar(true);
    handleButtonClick("users");
    console.log(activeUsers)
  };

  const handleWorkers = async () => {
    await getALLTHEWORKERS();
    setShowNavbar(false);
    setShowWorkerNavbar(true);
    handleButtonClick("workers");
    console.log()
  };

  const goToServices = async () => {
    navigate('/admin/services')
  };
  return (
    <div>
      <AdminNavbar />
      <Container>
        <Row style={{ marginTop: "10px" }}>
          <Col>
            <Button color="primary" onClick={handleUsers}>
              Users
            </Button>{" "}
          </Col>
          <Col>
            <Button color="primary" onClick={handleWorkers}>
              Workers
            </Button>{" "}
          </Col>
          <Col>
            <Button onClick={goToServices} color="primary">Services Types</Button>
          </Col>
        </Row>
      </Container>

      {showNavbar === true ? (
        <>
          <Navbar color="light" light expand="md">
            <Nav navbar>
              <NavItem>
                <NavLink onClick={() => handleButtonClick("users")}>
                  Active Users
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink onClick={() => handleButtonClick("inactiveUsers")}>
                  Inactive Users
                </NavLink>
              </NavItem>
            </Nav>
          </Navbar>
        </>
      ) : (
        <></>
      )}
      <div>
        {showWorkerNavbar === true ? (
          <>
            <Navbar color="light" light expand="md">
              <Nav navbar>
                <NavItem>
                  <NavLink onClick={() => handleButtonClick("workers")}>
                    Active Workers
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink onClick={() => handleButtonClick("inactiveUsers")}>
                    Inactive Workers
                  </NavLink>
                </NavItem>
              </Nav>
            </Navbar>
          </>
        ) : (
          <></>
        )}
      </div>
      <Container>
        <Row>
          {showNavbar && !showWorkerNavbar ? (
            activeTab === "users" ? (
              activeUsers.map((person, index) => (
                <Col key={index}>
                  <PersonDetails
                    key={index}
                    person={person}
                    setNewFilUsers={setNewFilUsers}
                  />
                </Col>
              ))
            ) : (
              inactiveUsers.map((person, index) => (
                <Col key={index}>
                  <PersonDetails
                    key={index}
                    person={person}
                    setNewFilUsers={setNewFilUsers}
                  />
                </Col>
              ))
            )
          ) : (
            <></>
          )}
        </Row>
        <Row>
          {!showNavbar && showWorkerNavbar ? (
            activeTab === "workers" ? (
              activeWorkers.map((person, index) => (
                <Col key={index}>
                  <WorkerDetails
                    key={index}
                    person={person}
                    setNewFilWorkers={setNewFilWorkers}
                  />
                </Col>
              ))
            ) : (
              inactiveWorkers.map((person, index) => (
                <Col key={index}>
                  <WorkerDetails
                    key={index}
                    person={person}
                    setNewFilWorkers={setNewFilWorkers}
                  />
                </Col>
              ))
            )
          ) : (
            <></>
          )}
        </Row>
      </Container>
    </div>
  );
};

export default HomePageAdmin;
