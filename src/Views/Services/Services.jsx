import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, ListGroup, ListGroupItem } from "reactstrap";
import {
  addServiceAsync,
  allServicesAsync,
  deleteServiceAsync,
  updateServiceAsync,
} from "../../Redux/Slices/AdminSlice";
import { Input, InputGroup, Button, Col, Row } from "reactstrap";
import Swal from "sweetalert2";
import AdminNavbar from "../../Components/AdminNavbar/AdminNavbar";
import cross from "../../assets/images/servicespngs/cross.png";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../../Components/Navbar/UserNavbar";
import { SERVICE_CONSTS } from "../../Constants/Constants";
const Services = () => {
  const [services, setServices] = useState([]);
  const [addButtonDisabled, setAddButtonDisabled] = useState(false);
  const [showEditButtons, setShowEditButton] = useState(false);
  const [showErrorPopUp, setShowErrorPopUp] = useState(false);
  const [editedService, setEditedService] = useState({ id: null, name: "" });
  const [updateButtonDisabled, setUpdateButtonDisabled] = useState(false);
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const id = user._id;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const result = await dispatch(allServicesAsync(token));
        if (result.type === "/admin/getallservices/fulfilled") {
          setServices(result.payload);
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

  const handleEditInputChange = (e) => {
    setEditedService({ ...editedService, name: e.target.value });
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
    setAddButtonDisabled(true); // Disable the button
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

      if (
        !services.some(
          (service) =>
            service.name.toLowerCase() === normalizedNewService ||
            service.name.toLowerCase().startsWith(normalizedNewService + " ")
        )
      ) {
        // Dispatch addServiceAsync with the new service
        const data = { token, name: trimmedService, id };
        const result = await dispatch(addServiceAsync(data));

        if (result.type === "/admin/addServices/fulfilled") {
          setServices((prevServices) => [
            ...prevServices,
            { name: trimmedService },
          ]);
          setNewService("");
          setAddButtonDisabled(false); // Enable the button
        }
      } else {
        displayErrorMessage("because this service already exists!");
        setAddButtonDisabled(false); // Enable the button
      }
    } else {
      reason = "because you exceeded letters limit!";
      displayErrorMessage(reason);
      setAddButtonDisabled(false); // Enable the button
    }
  };

  const handleRemoveService = async (service) => {
    const id = service._id;
    const data = { token, id };

    // Display a confirmation popup
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to remove this service?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const removeResult = await dispatch(deleteServiceAsync(data));

          if (removeResult.type === '/admin/deleteService/fulfilled') {
            setServices((prevServices) =>
              prevServices.filter((s) => s._id !== service._id)
            );
            Swal.fire('Removed!', 'The service has been removed.', 'success');
          } else {
            Swal.fire('Error!', 'An error occurred during removal.', 'error');
          }
        } catch (error) {
          console.error('Error removing service:', error);
          Swal.fire('Error!', 'An error occurred during removal.', 'error');
        }
      }
    });
  };

  const toggleshowEdits = () => {
    setShowEditButton(!showEditButtons);
  };

  const handleEditService = async () => {
    setUpdateButtonDisabled(true);
    // Validate the edited service name
    const MAX_LETTERS = 24;
    const trimmedEditedService = editedService.name.trim();

    if (
      trimmedEditedService.length > 0 &&
      trimmedEditedService.length <= MAX_LETTERS
    ) {
      const normalizedEditedService = trimmedEditedService.toLowerCase();

      if (
        !services.some(
          (s) =>
            s.name.toLowerCase() === normalizedEditedService &&
            s._id !== editedService.id
        )
      ) {
        // Dispatch updateServiceAsync with the edited service
        try {
          // Dispatch updateServiceAsync with the edited service
          const data = {
            token,
            name: trimmedEditedService,
            id: editedService.id,
          };
          const result = await dispatch(updateServiceAsync(data));

          if (result.type === "/admin/updateService/fulfilled") {
            setServices((prevServices) =>
              prevServices.map((s) =>
                s._id === editedService.id
                  ? { ...s, name: trimmedEditedService }
                  : s
              )
            );
            setEditedService({ id: null, name: "" });
          } else {
            displayErrorMessage("because this service cannot be updated!");
          }
        } catch (error) {
          console.error("Error updating service:", error);
          displayErrorMessage("because an error occurred during update!");
        } finally {
          setUpdateButtonDisabled(false);
        }
      } else {
        displayErrorMessage("because this service already exists!");
        setUpdateButtonDisabled(false);
      }
    } else {
      displayErrorMessage("because you exceeded letters limit!");
    }
  };

  const startEditingService = (service) => {
    setEditedService({ id: service._id, name: service.name });
  };

  const handleCancelEdit = () => {
    setEditedService({ id: null, name: "" });
  };
  return (
    <>
      <UserNavbar />
      <Container style={{ padding: "4%" }}>
        <Row style={{ marginTop: "1%", textAlign: "center" }}>
          <Col>
            <Button
              style={{
                marginRight: "",
                backgroundColor: "#48629b",
                border: "none",
              }}
              onClick={() => navigate(-1)}
            >
              {SERVICE_CONSTS.BACK}
            </Button>
          </Col>
          <Col>
            <h2>{SERVICE_CONSTS.SERVICES_HEADING}</h2>
          </Col>
          <Col>
            {!showEditButtons ? (
              <Button
                color="success"
                onClick={toggleshowEdits}
              >
                {SERVICE_CONSTS.ADD_A_SERVICE}
              </Button>
            ) : (
              <>
                <img  src={cross} alt="cross" onClick={toggleshowEdits} />
              </>
            )}
          </Col>
        </Row>

        {showEditButtons ? (
        <InputGroup style={{padding:"1%"}}>
          <Input
            type="text"
            placeholder="Add a new service"
            value={newService}
            onChange={handleInputChange}
          />
          <Button color="primary" onClick={handleAddService}>
            {SERVICE_CONSTS.ADD_NEW_SERVICE}
          </Button>
        </InputGroup>
      ) : (
        <></>
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
                    <Button
                      color="danger"
                      size="sm"
                      className="ml-2"
                      onClick={() => handleRemoveService(service)}
                    >
                      {SERVICE_CONSTS.REMOVE}
                    </Button>
                  </Col>
                  <Col>
                    {editedService.id === service._id ? (
                      <>
                        <Button
                        style={{marginRight:"2%", marginBottom:"1%"}}
                          color="primary"
                          onClick={() => handleEditService(service)}
                        >
                          {SERVICE_CONSTS.EDIT}
                        </Button>
                        <Button   color="secondary" onClick={handleCancelEdit}>
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
                </Row>
              </ListGroupItem>
            ))}
          </ListGroup>
          )}
        </ListGroup>
      </Container>
    </>
  );
};

export default Services;
