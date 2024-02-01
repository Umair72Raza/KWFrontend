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
import {
  fetchWorkersAsync,
  togglePersonAccessAsync,
} from "../../Redux/Slices/AdminSlice";
import PeopleDetails from "../../Components/PeopleDetails/PeopleDetails";
import UserNavbar from "../../Components/Navbar/UserNavbar";
import { ADMIN_WORKERS } from "../../Constants/Constants";
import FeedbacksComp from "../../Components/FeedbacksComp/FeedbacksComp";
import DetailsCard from "../../Components/DetailsCard/DetailsCard";
import Swal from "sweetalert2";
import BlockPopUp from "../../Components/BlockPopUp/BlockPopUp";

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
  const [feedbacks, setFeedbacks] = useState([]);
  const [showFeedbacksState, setShowFeedbacksState] = useState(false);
  const [showDetailsCard, setShowDetailsCard] = useState(false);
  const [showBlock, setShowBlock] = useState();
  const [orders, setOrders] = useState();
  const [human, setHuman] = useState();

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

  const toggleAccess = async () => {
    let access;
    human.access === "accepted" ? (access = "denied") : (access = "accepted");
    const id = human._id;
    const data = { token, id, access };
    const result = await dispatch(togglePersonAccessAsync(data));
    if (result.type === "/admin/toggleAccess/fulfilled") {
      // setNewFilPerson(human);
      setNewFilWorkers(human);
    }
  };

  useEffect(() => {
    const disableOtherPopUps = () => {
      console.log("Entering disableOtherPopUps");

      if (showBlock) {
        console.log(
          "Closing other pop-ups: showDetailsCard, showFeedbacksState"
        );
        setShowDetailsCard(false);
        setShowFeedbacksState(false);
      } else if (showDetailsCard) {
        console.log("Closing other pop-ups: showBlock, showFeedbacksState");
        setShowBlock(false);
        setShowFeedbacksState(false);
      } else if (showFeedbacksState) {
        console.log("Closing other pop-ups: showBlock, showDetailsCard");
        setShowBlock(false);
        setShowDetailsCard(false);
      }
    };

    disableOtherPopUps();
  }, [showBlock, showDetailsCard, showFeedbacksState]);

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
      <Col>
        <Button
          style={{
            margin: "10px 10px 0px 10px",
            backgroundColor: "#48629b",
            border: "none",
          }}
          color="danger"
          onClick={() => navigate(-1)}
        >
          {ADMIN_WORKERS.BACK}
        </Button>
      </Col>
      <h1 style={{ textAlign: "center" }}>{ADMIN_WORKERS.WORKERS_HEADING}</h1>
      <Navbar color="light" light expand="md" style={{ marginLeft: "2%" }}>
        <Nav tabs style={{ cursor: "pointer" }}>
          <NavItem></NavItem>
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
          <Row
            xs="1"
            md="2"
            lg="2"
            xl="3"
            style={{ padding: "1% 5% 0% 5%" }}
            className="d-flex"
          >
            {activeTab === "workers"
              ? activeWorkers.map((person, index) => (
                  <Col key={index}>
                    <PeopleDetails
                      key={index}
                      person={person}
                      setNewFilPerson={setNewFilWorkers}
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
              : inactiveWorkers.map((person, index) => (
                  <Col key={index}>
                    <PeopleDetails
                      person={person}
                      setNewFilPerson={setNewFilWorkers}
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
    </>
  );
};

export default AdminWorkers;
