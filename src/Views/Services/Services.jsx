import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, ListGroup, ListGroupItem, Spinner } from "reactstrap";
import {
  addServiceAsync,
  allServicesAsync,
  deleteServiceAsync,
  updateServiceAsync,
} from "../../Redux/Slices/AdminSlice";
import { Input, InputGroup, Button, Col, Row } from "reactstrap";
import Swal from "sweetalert2";
import cross from "../../assets/images/servicespngs/cross.png";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../../Components/Navbar/UserNavbar";
import { SERVICE_CONSTS } from "../../Constants/Constants";
const Services = () => {
  const [services, setServices] = useState([]);
  const [showEditButtons, setShowEditButton] = useState(false);
  const [editedService, setEditedService] = useState({ id: null, name: "" });
  const [updateButtonDisabled, setUpdateButtonDisabled] = useState(false);
  const [showEditors, setShowEditors] = useState(false);
  const [addButtonDisabled, setAddButtonDisabled] = useState(true);
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const id = user._id;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const result = await dispatch(allServicesAsync(token));
        if (result.type === "/admin/getallservices/fulfilled") {
          setServices(result.payload);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
        setLoading(false);
      }
    };

    fetchServices();
  }, [dispatch, token]);

  const [newService, setNewService] = useState("");

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setNewService(e.target.value);
    setAddButtonDisabled(
      inputValue.length > 24 ||
        inputValue.trim() === "" ||
        inputValue.length === 0
    );
  };

  const handleEditInputChange = (e) => {
    setEditedService({ ...editedService, name: e.target.value });
  };

  const displayErrorMessage = (reason) => {
    Swal.fire({
      title: `${reason}!`,
      allowOutsideClick: false,
      icon: "error",
    });
  };
  const displayEditErrorMessage = (reason) => {
    return new Promise((resolve) => {
      Swal.fire({
        title: `${reason}!`,
        allowOutsideClick: false,
        icon: "error",
      }).then(() => {
        resolve();
      });
    });
  };

  const handleAddService = async () => {
    setShowEditors(false);
    setShowEditButton(true);
    setEditedService({ id: null, name: "" });

    setAddButtonDisabled(true); // Disable the button
    const MAX_LETTERS = 24; // Adjust the maximum allowed letters as needed
    let reason;
    const trimmedService = newService.trim();

    if (trimmedService.length > 0 && trimmedService.length <= MAX_LETTERS) {
      const normalizedNewService = normalizeServiceName(trimmedService);

      if (
        !services.some(
          (service) =>
            normalizeServiceName(service.name) === normalizedNewService
        )
      ) {
        // Dispatch addServiceAsync with the new service
        const data = { token, name: trimmedService, id };
        const result = await dispatch(addServiceAsync(data));

        if (result.type === "/admin/addServices/fulfilled") {
          setServices((prevServices) => [...prevServices, result.payload]);
          setNewService("");
          setAddButtonDisabled(false); // Enable the button
        }
      } else {
        displayErrorMessage(
          "Service already exists! Please try a different service name!"
        );
        setAddButtonDisabled(false); // Enable the button
      }
    } else {
      reason = "Cannot add service' exceeded character limit";
      displayErrorMessage(reason);
      setAddButtonDisabled(false); // Enable the button
    }
  };

  const normalizeServiceName = (serviceName) => {
    // Remove extra spaces, convert to lowercase, and remove spaces between characters
    return serviceName
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/(.)(?=.)/g, "$1 ");
  };

  const handleRemoveService = async (service) => {
    const id = service._id;
    const serviceName = service.name;
    const data = { token, id, serviceName };

    // Display a confirmation popup
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to remove this service?",
      icon: "warning",
      showCancelButton: true,
      allowOutsideClick: false,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const removeResult = await dispatch(deleteServiceAsync(data));

          if (removeResult.type === "/admin/deleteService/fulfilled") {
          
            if (removeResult.payload === undefined) {
              Swal.fire("Cannot Remove!", "This service is taken.", "error");
            } else {
              setServices((prevServices) =>
                prevServices.filter((s) => s._id !== service._id)
              );
              Swal.fire("Removed!", "The service has been removed.", "success");
            }
            // Update the state correctly
          } else {
            Swal.fire("Error!", "An error occurred during removal.", "error");
          }
        } catch (error) {
          console.error("Error removing service:", error);
          Swal.fire("Error!", "An error occurred during removal.", "error");
        }
      }
    });
  };

  const toggleshowEdits = () => {
    setShowEditors(false);
    setShowEditButton(!showEditButtons);
  };

  
  const handleEditService = async (service) => {
    setUpdateButtonDisabled(true);
    const servName = service.name;
    const normalizeServiceName = (serviceName) => {
      // Remove extra spaces, convert to lowercase, and remove spaces between characters
      return serviceName
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace(/(.)(?=.)/g, "$1 ");
    };

    // Validate the edited service name
    const MAX_LETTERS = 24;
    const trimmedEditedService = editedService.name.trim();

    if (
      trimmedEditedService.length > 0 &&
      trimmedEditedService.length <= MAX_LETTERS
    ) {
      const normalizedEditedService =
        normalizeServiceName(trimmedEditedService);

      if (
        !services.some(
          (s) =>
            normalizeServiceName(s.name) === normalizedEditedService &&
            s._id !== editedService.id
        )
      ) {
        try {
          // Dispatch updateServiceAsync with the edited service
          const data = {
            token,
            name: trimmedEditedService,
            id: editedService.id,
            servName: servName,
          };
          const result = await dispatch(updateServiceAsync(data));
          if (result.type === "/admin/updateService/fulfilled") {
       
            if (result.payload.message === "Required") {
              setEditedService({ id: null, name: "" });
      
              await displayEditErrorMessage(
                "Name is required for updating a service"
              );
              return
            } else if (
              result.payload.message === "taken"
            ) {
           
              setEditedService({ id: null, name: "" });
              await displayEditErrorMessage(
                "Service is taken by a worker. Cannot Update"
              );
              return
            }
            else {
              setServices((prevServices) =>
              prevServices.map((s) =>
                s._id === editedService.id
                  ? { ...s, name: trimmedEditedService }
                  : s
              )
            );
            setEditedService({ id: null, name: "" });
            }
           
          } else {
            displayErrorMessage("Failed to update the service!");
          }
        } catch (error) {
          console.error("Error updating service:", error);
          displayErrorMessage(
            "An error occurred during update! Please try again"
          );
        } finally {
          setUpdateButtonDisabled(false);
        }
      } else {
        displayErrorMessage(
          "Service already exists! Please add a different service name"
        );
        setUpdateButtonDisabled(false);
      }
    } else {
      displayErrorMessage("Character limit was not met");
      setUpdateButtonDisabled(false);
    }
  };

  const startEditingService = (service) => {
    setShowEditors(true);
    setShowEditButton(false);
    setEditedService({ id: service._id, name: service.name });
  };

  const handleCancelEdit = () => {
    setEditedService({ id: null, name: "" });
  };
  return (
    <>
      <div>
        <UserNavbar />
      </div>
      <Container style={{ padding: "1%" }}>
        <Col>
          <Button
            style={{
              backgroundColor: "#48629b",
              border: "none",
            }}
            onClick={() => navigate(-1)}
          >
            {SERVICE_CONSTS.BACK}
          </Button>
        </Col>

        {loading ? (
          <div style={{ textAlign: "center" }}>
            <Spinner color="primary" />
          </div>
        ) : (
          <>
            <Row style={{ marginTop: "1%", textAlign: "center" }}>
              <Col xs={{ size: 6, offset: 3 }}>
                <h2>{SERVICE_CONSTS.SERVICES_HEADING}</h2>
              </Col>
              <Col xs="auto">
                {!showEditButtons ? (
                  <Button color="success" onClick={toggleshowEdits}>
                    {SERVICE_CONSTS.ADD_A_SERVICE}
                  </Button>
                ) : (
                  <>
                    <img
                      className="pointerCursor"
                      src={cross}
                      alt="cross"
                      onClick={toggleshowEdits}
                    />
                  </>
                )}
              </Col>
            </Row>

            {showEditButtons && (
              <>
                <InputGroup style={{ padding: "1%" }}>
                  <Col>
                    <Input
                      type="text"
                      placeholder="Add a new service"
                      value={newService}
                      onChange={handleInputChange}
                    />
                    {newService.length > 24 && (
                      <div
                        style={{
                          color: "red",
                          fontSize: "12px",
                          marginTop: "4px",
                        }}
                      >
                        Input must be 24 characters or less.
                      </div>
                    )}
                  </Col>
                  <Button
                    className="custom-margin-service"
                    color="primary"
                    onClick={handleAddService}
                    disabled={addButtonDisabled}
                  >
                    {SERVICE_CONSTS.ADD_NEW_SERVICE}
                  </Button>
                </InputGroup>
              </>
            )}

            <ListGroup>
              {services.length === 0 ? (
                <ListGroupItem style={{ textAlign: "center" }}>
                  {SERVICE_CONSTS.NO_SERVICES}
                </ListGroupItem>
              ) : (
                <ListGroup>
                  {services.map((service) => (
                    <ListGroupItem key={service._id}>
                      <Row style={{ textAlign: "center" }}>
                        <Col>
                          {editedService.id === service._id ? (
                            <Input
                              type="text"
                              value={editedService.name}
                              onChange={handleEditInputChange}
                            />
                          ) : (
                            <span onClick={() => startEditingService(service)}>
                              {service.name}
                            </span>
                          )}
                        </Col>

                        <Col>
                          {showEditors === true &&
                          editedService.id === service._id ? (
                            <>
                              <Button
                                style={{
                                  marginRight: "2%",
                                  marginBottom: "1%",
                                }}
                                color="primary"
                                onClick={() => handleEditService(service)}
                              >
                                {SERVICE_CONSTS.UPDATE}
                              </Button>
                              <Button
                                color="secondary"
                                onClick={handleCancelEdit}
                              >
                                {SERVICE_CONSTS.CANCEL}
                              </Button>
                            </>
                          ) : (
                            <Button
                              color="primary"
                              onClick={() => startEditingService(service)}
                            >
                              {SERVICE_CONSTS.EDIT}
                            </Button>
                          )}
                        </Col>
                        <Col>
                          <Button
                            color="danger"
                            size="sm"
                            className="ml-2"
                            onClick={() => handleRemoveService(service)}
                          >
                            {SERVICE_CONSTS.REMOVE}
                          </Button>
                        </Col>
                      </Row>
                    </ListGroupItem>
                  ))}
                </ListGroup>
              )}
            </ListGroup>
          </>
        )}
      </Container>
    </>
  );
};

export default Services;
