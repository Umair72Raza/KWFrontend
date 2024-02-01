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
import {
  fetchUsersAsync,
  togglePersonAccessAsync,
} from "../../Redux/Slices/AdminSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import classnames from "classnames";
import PeopleDetails from "../../Components/PeopleDetails/PeopleDetails";
import UserNavbar from "../../Components/Navbar/UserNavbar";
import { ADMIN_USERS } from "../../Constants/Constants";
import FeedbacksComp from "../../Components/FeedbacksComp/FeedbacksComp";
import DetailsCard from "../../Components/DetailsCard/DetailsCard";
import Swal from "sweetalert2";
import BlockPopUp from "../../Components/BlockPopUp/BlockPopUp";

const AdminUsers = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [apiUsers, setApiUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("users");
  const [newfilUsers, setNewFilUsers] = useState();
  const [activeUsers, setActiveUsers] = useState([]);
  const [inactiveUsers, setInactiveUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState([]);
  const [showFeedbacksState, setShowFeedbacksState] = useState(false);
  const [showDetailsCard, setShowDetailsCard] = useState(false);
  const [orders, setOrders] = useState();
  const [human, setHuman] = useState();
  const [showBlock, setShowBlock] = useState();

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

  const toggleAccess = async () => {
    let access;
    human.access === "accepted" ? (access = "denied") : (access = "accepted");
    const id = human._id;
    const data = { token, id, access };
    const result = await dispatch(togglePersonAccessAsync(data));
    if (result.type === "/admin/toggleAccess/fulfilled") {
      // setNewFilPerson(human);
      setNewFilUsers(human);
    }
  };
  const toggleBlockModal = () => setShowBlock(!showBlock);

  const confirmationPopUp = async () => {
    setShowFeedbacksState(false);
    setShowDetailsCard(false);
  };

  useEffect(() => {
    if (showBlock === true) {
      setShowFeedbacksState(false);
      setShowDetailsCard(false);
    }
  }, [showBlock, showFeedbacksState, showDetailsCard]);

  return (
    <>
      <div>
        <UserNavbar />
      </div>
      <Container>
        <Row>
          <Col>
            <Button
              style={{
                margin: "10px 10px 0px 10px",
                backgroundColor: "#48629b",
                border: "none",
              }}
              onClick={() => navigate(-1)}
            >
              {ADMIN_USERS.BACK}
            </Button>
          </Col>
          <h1 style={{ textAlign: "center" }}>{ADMIN_USERS.USERS_HEADING}</h1>
        </Row>
        <Row>
          <Navbar color="light" light expand="md" style={{ paddingLeft: "2%" }}>
            <Nav tabs style={{ cursor: "pointer" }}>
              <NavItem></NavItem>
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
            <Row
              xs="1"
              md="2"
              lg="2"
              xl="3"
              style={{ padding: "1% 5% 0% 5%" }}
              className="d-flex"
            >
              {activeTab === "users"
                ? activeUsers.map((person, index) => (
                    <Col key={index}>
                      <PeopleDetails
                        key={index}
                        person={person}
                        setNewFilPerson={setNewFilUsers}
                        setHuman={setHuman}
                        showFeedbacksState={showFeedbacksState}
                        setShowFeedbacksState={setShowFeedbacksState}
                        setShowDetailsCard={setShowDetailsCard}
                        setOrders={setOrders}
                        setFeedbacks={setFeedbacks}
                        setShowBlock={setShowBlock}
                      />
                    </Col>
                  ))
                : inactiveUsers.map((person, index) => (
                    <Col key={index}>
                      <PeopleDetails
                        key={index}
                        person={person}
                        setNewFilPerson={setNewFilUsers}
                        setHuman={setHuman}
                        showFeedbacksState={showFeedbacksState}
                        setShowFeedbacksState={setShowFeedbacksState}
                        setShowDetailsCard={setShowDetailsCard}
                        setOrders={setOrders}
                        setFeedbacks={setFeedbacks}
                        setShowBlock={setShowBlock}
                      />
                    </Col>
                  ))}
            </Row>
          )}
        </Row>
        {showDetailsCard === true ? (
          <>
            <DetailsCard
              person={human}
              setShowDetailsCard={setShowDetailsCard}
              orders={orders}
            />
          </>
        ) : (
          <></>
        )}

        {showFeedbacksState ? (
          <>
            <FeedbacksComp
              showFeedbacksState={showFeedbacksState}
              setShowFeedbacksState={setShowFeedbacksState}
              feedbacks={feedbacks}
            />
          </>
        ) : (
          <></>
        )}
        <BlockPopUp
          isOpen={showBlock}
          toggleAccess={toggleAccess}
          toggle={toggleBlockModal}
          onConfirm={confirmationPopUp}
          person={human}
        />
      </Container>
    </>
  );
};

export default AdminUsers;
