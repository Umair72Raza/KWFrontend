import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, ListGroup, ListGroupItem } from "reactstrap";
import {
  addServiceAsync,
  allServicesAsync,
  deleteServiceAsync,
} from "../../Redux/Slices/Admin";
import { Input, InputGroup, Button, Col, Row } from "reactstrap";
import Swal from "sweetalert2";
import AdminNavbar from "../../Components/AdminNavbar/AdminNavbar";
import cross from "../../assets/cross.png";
import { useNavigate } from "react-router-dom";
const Services = () => {
  const [services, setServices] = useState([]);
  const [showEditButtons, setShowEditButton] = useState(false);
  const [showErrorPopUp, setShowErrorPopUp] = useState(false);
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const id = user._id;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const result = await dispatch(allServicesAsync(token));
        if (result.type === "/admin/getallservices/fulfilled") {
          console.log(result.payload);
          setServices(result.payload);
          console.log(services);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchServices();
  }, [dispatch, token]);

  const [newService, setNewService] = useState("");

  const handleInputChange = (e) => {
    setNewService(e.target.value);
  };

  const displayErrorMessage = (reason) => {
    Swal.fire({
      title: `This Service cannot be added ${reason}!`,
      icon: "error",
    }).then(() => {
      // Reset the error state
      setShowErrorPopUp(false);
    });
  };

  const handleAddService = async () => {
    const MAX_LETTERS = 24; // Adjust the maximum allowed letters as needed
    let reason;
    // Trim the input and remove extra spaces
    const trimmedService = newService.trim();

    if (trimmedService.length > 0 && trimmedService.length <= MAX_LETTERS) {
      // Check for spaces in the service name
      if (trimmedService.includes(" ")) {
        // Show an error for spaces
        reason = "because of spaces!";
        displayErrorMessage(reason);
        return;
      }

      const normalizedNewService = trimmedService.toLowerCase();
      // Check if the service already exists
      if (
        !services.some(
          (service) => service.name.toLowerCase() === normalizedNewService
        )
      ) {
        // Dispatch addServiceAsync with the new service
        const data = { token, name: trimmedService, id };
        const result = await dispatch(addServiceAsync(data));

        if (result.type === "/admin/addServices/fulfilled") {
          console.log(result);

          // Update the local services array
          setServices((prevServices) => [
            ...prevServices,
            { name: trimmedService },
          ]);

          // Clear the input field
          setNewService("");
        }
      } else {
        reason = "because this service already exists!";
        displayErrorMessage(reason);
      }
    } else {
      reason = "because you exceeded letters limit!";
      displayErrorMessage(reason);
    }
  };

  const handleRemoveService = async (service) => {
    const id = service._id;
    const data = { token, id };

    try {
      const result = await dispatch(deleteServiceAsync(data));

      if (result.type === "/admin/deleteService/fulfilled") {
        console.log(result);
        setServices((prevServices) =>
          prevServices.filter((s) => s._id !== service._id)
        );
      }
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };
  const toggleshowEdits = () => {
    setShowEditButton(!showEditButtons);
  };

  return (
    <>
      <AdminNavbar />
      <Container>
        <Row style={{ marginTop: "2%" }}>
          <Col>
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
          </Col>
          <Col>
            <h2>Services</h2>
          </Col>
          <Col>
            {!showEditButtons ? (
              <Button color="primary" onClick={toggleshowEdits}>
                Edit
              </Button>
            ) : (
              <>
                <img src={cross} alt="cross" onClick={toggleshowEdits} />
              </>
            )}
          </Col>
        </Row>

        <ListGroup>
          {services.map((service) => (
            <ListGroupItem key={service._id}>
              <Row>
                <Col> {service.name}</Col>
                {showEditButtons ? (
                  <>
                    <Col>
                      <Button
                        color="danger"
                        size="sm"
                        className="ml-2"
                        onClick={() => handleRemoveService(service)}
                      >
                        Remove
                      </Button>
                    </Col>
                  </>
                ) : (
                  <></>
                )}
              </Row>
            </ListGroupItem>
          ))}
        </ListGroup>
      </Container>

      {showEditButtons ? (
        <InputGroup>
          <Input
            type="text"
            placeholder="Add a new service"
            value={newService}
            onChange={handleInputChange}
          />
          <Button color="primary" onClick={handleAddService}>
            Add New Service
          </Button>
        </InputGroup>
      ) : (
        <></>
      )}

      {/* {showErrorPopUp ? <>{displayErrorMessage()}</> : <></>} */}
    </>
  );
};

export default Services;
