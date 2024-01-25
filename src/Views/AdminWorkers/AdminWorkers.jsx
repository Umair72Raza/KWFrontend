import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Nav,
  NavItem,
  NavLink,
  Navbar,
  Row,
  Spinner,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import classnames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { fetchWorkersAsync } from "../../Redux/Slices/AdminSlice";
import PeopleDetails from "../../Components/PeopleDetails/PeopleDetails";
import UserNavbar from "../../Components/Navbar/UserNavbar";
import { ADMIN_WORKERS } from "../../Constants/Constants";

const AdminWorkers = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("workers");
  const [newfilWorkers, setNewFilWorkers] = useState();
  const [activeWorkers, setActiveWorkers] = useState([]);
  const [inactiveWorkers, setInactiveWorkers] = useState([]);
  const [apiWorkers, setApiWorkers] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const gettingWorkers = async () => {
      try {
        setLoading(true); // Set loading to true when fetching starts
        const result = await dispatch(fetchWorkersAsync(token));
        if (result.type === "/admin/getWorkers/fulfilled") {
          setApiWorkers(result.payload);
        }
      } catch (error) {
        console.error("Error fetching workers:", error);
      } finally {
        setLoading(false); // Set loading to false when fetching is done
        handleButtonClick("workers");
      }
    };
    gettingWorkers();
  }, [dispatch, token]);

  const handleButtonClick = (tab) => {
    setActiveTab(tab);
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

  return (
    <>
    <div>
      <UserNavbar />
      </div>
      <h1 style={{ textAlign: "center" }}>{ADMIN_WORKERS.WORKERS_HEADING}</h1>
      <Navbar color="light" light expand="md" style={{marginLeft:"2%"}}>
        <Nav tabs style={{cursor:"pointer"}}>
          <NavItem>
            <Button
              style={{
                marginRight: "10px",
                backgroundColor: "#48629b",
                border: "none",
              }}
              color="danger"
              onClick={() => navigate(-1)}
            >
              {ADMIN_WORKERS.BACK}
            </Button>
          </NavItem>
          <NavItem>
            <NavLink
              onClick={() => handleButtonClick("workers")}
              className={classnames({ active: activeTab === "workers" })}
            >
             {ADMIN_WORKERS.ACTIVE_WORKERS}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              onClick={() => handleButtonClick("inactiveWorkers")}
              className={classnames({
                active: activeTab === "inactiveWorkers",
              })}
            >
              {ADMIN_WORKERS.INACTIVE_WORKERS}
            </NavLink>
          </NavItem>
        </Nav>
      </Navbar>
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
        ) : activeTab === "workers" && activeWorkers.length === 0 ? (
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            {ADMIN_WORKERS.NO_ACTIVE_WORKERS}
          </p>
        ) : activeTab === "inactiveWorkers" && inactiveWorkers.length === 0 ? (
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            {ADMIN_WORKERS.NO_INACTIVE_WORKERS}
          </p>
        ) : (
          <Row xs="1" md="2" lg="3">
            {activeTab === "workers"
              ? activeWorkers.map((person, index) => (
                <Col key={index}>
                  <PeopleDetails
                    key={index}
                    person={person}
                    setNewFilPerson={setNewFilWorkers}
                  />
                </Col>
              ))
              : inactiveWorkers.map((person, index) => (
                <Col key={index}>
                  <PeopleDetails
                    key={index}
                    person={person}
                    setNewFilPerson={setNewFilWorkers}
                  />
                </Col>
              ))}
          </Row>
        )}
      </Row>
    </>
  );
};

export default AdminWorkers;
