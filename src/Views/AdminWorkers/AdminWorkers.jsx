import React, { useEffect, useState } from "react";
import { Button, Col, Nav, NavItem, NavLink, Navbar, Row } from "reactstrap";
import WorkerDetails from "../../Components/WorkerDetails/WorkerDetails";
import { useNavigate } from "react-router-dom";
import classnames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { fetchWorkersAsync } from "../../Redux/Slices/Admin";

const AdminWorkers = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("workers");
  const [newfilWorkers, setNewFilWorkers] = useState();
  const [activeWorkers, setActiveWorkers] = useState([]);
  const [inactiveWorkers, setInactiveWorkers] = useState([]);
  const [apiWorkers, setApiWorkers] = useState([]);

  useEffect(() => {
    const gettingWorkers = async () => {
      await getALLTHEWORKERS();
    };
    gettingWorkers();
    handleButtonClick("workers");
  }, []);

  const handleButtonClick = (tab) => {
    setActiveTab(tab);
  };
  const getALLTHEWORKERS = async () => {
    try {
      const result = await dispatch(fetchWorkersAsync(token));
      if (result.type === "/admin/getWorkers/fulfilled") {
        console.log(result.payload,"ALL Workers")
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
  return (
    <div>
      {
        <>
        <h1 style={{textAlign:"center"}}>Workers</h1>
          <Navbar color="light" light expand="md">
            <Nav tabs>
              <NavItem>
                <Button
                  style={{ marginRight: "10px" ,backgroundColor:"#48629b", border:"none" }}
                  color="danger"
                  onClick={() => navigate(-1)}
                >
                  Back
                </Button>
              </NavItem>
              <NavItem>
                <NavLink
                  onClick={() => handleButtonClick("workers")}
                  className={classnames({ active: activeTab === "workers" })}
                >
                  Active Workers
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  onClick={() => handleButtonClick("inactiveWorkers")}
                  className={classnames({
                    active: activeTab === "inactiveWorkers",
                  })}
                >
                  Inactive Workers
                </NavLink>
              </NavItem>
            </Nav>
          </Navbar>
        </>
      }

      <Row>
        {activeTab === "workers"
          ? activeWorkers.map((person, index) => (
              <Col key={index}>
                <WorkerDetails
                  key={index}
                  person={person}
                  setNewFilWorkers={setNewFilWorkers}
                />
              </Col>
            ))
          : inactiveWorkers.map((person, index) => (
              <Col key={index}>
                <WorkerDetails
                  key={index}
                  person={person}
                  setNewFilWorkers={setNewFilWorkers}
                />
              </Col>
            ))}
      </Row>
    </div>
  );
};

export default AdminWorkers;
