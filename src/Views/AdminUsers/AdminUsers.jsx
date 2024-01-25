import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Nav,
  NavItem,
  NavLink,
  Navbar,
  Row,
  Spinner,
} from "reactstrap";
import { fetchUsersAsync } from "../../Redux/Slices/AdminSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import classnames from "classnames";
import PeopleDetails from "../../Components/PeopleDetails/PeopleDetails";
import UserNavbar from "../../Components/Navbar/UserNavbar";
import { ADMIN_USERS } from "../../Constants/Constants";

const AdminUsers = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [apiUsers, setApiUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("users");
  const [newfilUsers, setNewFilUsers] = useState();
  const dispatch = useDispatch();
  const [activeUsers, setActiveUsers] = useState([]);
  const [inactiveUsers, setInactiveUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const handleButtonClick = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    const gettingUsers = async () => {
      try {
        setLoading(true); // Set loading to true when fetching starts
        const result = await dispatch(fetchUsersAsync(token));
        if (result.type === "/admin/getUsers/fulfilled") {
          setApiUsers(result.payload);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false); // Set loading to false when fetching is done
        handleButtonClick("users");
      }
    };
    gettingUsers();
  }, [dispatch, token]);

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

  return (
    <>
    <div>
      <UserNavbar />
      </div>
      <Container>
        <Row>
          <h1 style={{ textAlign: "center" }}>{ADMIN_USERS.USERS_HEADING}</h1>
        </Row>
        <Row>
          <Navbar color="light" light expand="md" style={{ paddingLeft: "2%" }}>
            <Nav tabs style={{ cursor: "pointer" }}>
              <NavItem>
                <Button
                  style={{
                    marginRight: "10px",
                    backgroundColor: "#48629b",
                    border: "none",
                  }}
                  onClick={() => navigate(-1)}
                >
                  {ADMIN_USERS.BACK}
                </Button>
              </NavItem>
              <NavItem>
                <NavLink
                  onClick={() => handleButtonClick("users")}
                  className={classnames({ active: activeTab === "users" })}
                >
                  {ADMIN_USERS.ACTIVE_USERS}
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  onClick={() => handleButtonClick("inactiveUsers")}
                  className={classnames({
                    active: activeTab === "inactiveUsers",
                  })}
                >
                  {ADMIN_USERS.INACTIVE_USERS}
                </NavLink>
              </NavItem>
            </Nav>
          </Navbar>
        </Row>
        <Row>
          {loading ? (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: "200px" }}
            >
              <Spinner
                color="primary"
                style={{ width: "3rem", height: "3rem" }}
              />
            </div>
          ) : activeTab === "users" && activeUsers.length === 0 ? (
            <p style={{ textAlign: "center", marginTop: "20px" }}>
              {ADMIN_USERS.NO_ACTIVE_USERS}
            </p>
          ) : activeTab === "inactiveUsers" && inactiveUsers.length === 0 ? (
            <p style={{ textAlign: "center", marginTop: "20px" }}>
              {ADMIN_USERS.NO_INACTIVE_USERS}
            </p>
          ) : (
            <Row xs="1" md="2" lg="3">
              {activeTab === "users"
                ? activeUsers.map((person, index) => (
                  <Col key={index}>
                    <PeopleDetails
                      key={index}
                      person={person}
                      setNewFilPerson={setNewFilUsers}
                    />
                  </Col>
                ))
                : inactiveUsers.map((person, index) => (
                  <Col key={index}>
                    <PeopleDetails
                      key={index}
                      person={person}
                      setNewFilPerson={setNewFilUsers}
                    />
                  </Col>
                ))}
            </Row>
          )}
        </Row>
      </Container>
    </>
  );
};

export default AdminUsers;
