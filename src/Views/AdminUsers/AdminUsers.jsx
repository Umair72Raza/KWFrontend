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
} from "reactstrap";
import { fetchUsersAsync } from "../../Redux/Slices/AdminSlice";
import { useDispatch, useSelector } from "react-redux";
import PersonDetails from "../../Components/PersonDetails/PersonDetails";
import { useNavigate } from "react-router-dom";
import classnames from "classnames";

const AdminUsers = () => {
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  const [apiUsers, setApiUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("users");
  const [newfilUsers, setNewFilUsers] = useState();
  const dispatch = useDispatch();
  const [activeUsers, setActiveUsers] = useState([]);
  const [inactiveUsers, setInactiveUsers] = useState([]);

  const handleButtonClick = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    const gettingUsers = async () => {
      await getALLTHEUSERS();
    };
    gettingUsers();
    handleButtonClick("users");
  }, []);

  //gets users from the db
  const getALLTHEUSERS = async () => {
    try {
      const result = await dispatch(fetchUsersAsync(token));
      if (result.type === "/admin/getUsers/fulfilled") {
        console.log(result.payload, "ALL Users");
        setApiUsers(result.payload);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

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
    <Container>
      <Row>
      <h1 style={{ textAlign: "center" }}>Users</h1>
      </Row>
      <Row>
      <Navbar color="light" light expand="md">
        <Nav tabs>
          <NavItem>
            <Button
              style={{
                marginRight: "10px",
                backgroundColor: "#48629b",
                border: "none",
              }}
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
          </NavItem>
          <NavItem>
            <NavLink
              onClick={() => handleButtonClick("users")}
              className={classnames({ active: activeTab === "users" })}
            >
              Active Users
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              onClick={() => handleButtonClick("inactiveUsers")}
              className={classnames({ active: activeTab === "inactiveUsers" })}
            >
              Inactive Users
            </NavLink>
          </NavItem>
        </Nav>
      </Navbar>
      </Row>
      <Row>
        {activeTab === "users"
          ? activeUsers.map((person, index) => (
              <Col key={index}>
                <PersonDetails
                  key={index}
                  person={person}
                  setNewFilUsers={setNewFilUsers}
                />
              </Col>
            ))
          : inactiveUsers.map((person, index) => (
              <Col key={index}>
                <PersonDetails
                  key={index}
                  person={person}
                  setNewFilUsers={setNewFilUsers}
                />
              </Col>
            ))}
      </Row>
    </Container>
  );
};

export default AdminUsers;
