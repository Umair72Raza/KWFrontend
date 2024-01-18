import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Row,
  Col,
  Card,
  CardBody,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faTimes } from "@fortawesome/free-solid-svg-icons";
import UserNavbar from "../../Components/Navbar/UserNavbar";
import { fetchUsersDataAsync } from "../../Redux/Slices/EditProfileSlice";
import { RegisterPage } from "../../Constants/Constants";
import PhoneInput, { isValidPhoneNumber,parsePhoneNumber } from "react-phone-number-input";
import Map from "../../Components/Map/Map";
import { handleNameChange, validateEmail } from "../../utils";
import { useNavigate } from "react-router-dom";

const EditProfilePage = () => {
  const { user, token } = useSelector((state) => state.auth);
  const { UsersData } = useSelector((state) => state.editProfile);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [editedName, setEditedName] = useState(user.firstName);
  const [editedLastName, setEditedLastName] = useState(user.lastName);
  const [formData, setFormData] = useState({
    firstName: UsersData?.firstName,
    lastName: UsersData?.lastName,
    email: UsersData?.email,
    phoneNumber: UsersData?.phoneNumber,
    latitude: UsersData?.latitude,
    longitude: UsersData?.longitude,
    country: UsersData?.country,
    address: UsersData?.address,
    services: UsersData?.services || [],
  });

  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && user._id) {
      const data = {
        id: user._id,
        token: token,
      };
      dispatch(fetchUsersDataAsync(data));
    }
  }, []);

  useEffect(() => {
    if (formData && formData.phoneNumber) {
      try {
        const phoneNumberInfo = parsePhoneNumber(formData.phoneNumber);
        console.log("PhoneNumberInfo:", phoneNumberInfo);
  
        if (phoneNumberInfo) {
          setFormData({
            ...formData,
            country: phoneNumberInfo.country,
          });
        }
      } catch (error) {
        console.error("Error parsing phone number:", error);
      }
    }
  }, [formData]);
  

  const handleEmailChange = (e) => {
    const email = e.target.value;

    if (!validateEmail(email)) {
      setEmailError(RegisterPage.ERROR_MESSAGES.invalidEmail);
    } else {
      setEmailError("");
    }

    setFormData({
      ...formData,
      email,
    });
  };
  const handlePhoneChange = (value) => {
    setPhoneNumber(value);

    setFormData({
      ...formData,
      phoneNumber: value,
    });

    if (value && typeof value === "string") {
      isValidPhoneNumber(value)
        ? setPhoneError("")
        : setPhoneError(RegisterPage.ERROR_MESSAGES.invalidPhoneNumber);
    } else {
      // Handle the case where the value is empty
      setPhoneError("phone number is required");
    }
  };

  //If worker is registering
  const handleServiceChange = (e) => {
    const selectedService = e.target.value;

    // Check if the service is already in the list
    const serviceExists = formData.services.some(
      (service) => service.name === selectedService
    );

    if (serviceExists) {
      // Uncheck: Remove the service from the list
      const updatedServices = formData.services.filter(
        (service) => service.name !== selectedService
      );

      setFormData({
        ...formData,
        services: updatedServices,
      });
    } else {
      // Check: Add the service to the list with a default rate of 10
      const updatedServices = [
        ...formData.services,
        { name: selectedService, rate: 10 },
      ];

      setFormData({
        ...formData,
        services: updatedServices,
      });
    }
  };

  const handleRateChange = (e, serviceName) => {
    let { value } = e.target;
    value = parseFloat(value);
    const updatedServices = formData.services.map((service) =>
      service.name === serviceName ? { ...service, rate: value } : service
    );

    setFormData({
      ...formData,
      services: updatedServices,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // try {
    //   setLoading(true); // Start loading spinner

    // const result = await dispatch(signUpUserAsync(formData));

    //    if (result.type === "auth/signup/fulfilled") {
    // setFormData({
    //   firstName: "",
    //   lastName: "",
    //   email: "",
    //   phoneNumber: "",
    //   password: "",
    //   confirmPassword: "",
    //   latitude: "",
    //   longitude: "",
    //   address: "",
    //   services: [],
    // });
    // successToast("SignUP Successful!");
    //       navigate("/auth/login");
    //   } else {
    //   failureToast("SignUP Failed Please Try Again!");
    //   }
    //   } finally {
    //  setLoading(false); // Stop loading spinner
    //  }
  };

  const handleEditModeToggle = () => {
    setFormData({
      firstName: UsersData?.firstName,
      lastName: UsersData?.lastName,
      email: UsersData?.email,
      phoneNumber: UsersData?.phoneNumber,
      latitude: UsersData?.latitude,
      longitude: UsersData?.longitude,
      country: UsersData?.country,
      address: UsersData?.address,
      services: UsersData?.services || [],
    });
    setEditMode(!editMode);
  };

  const handleCancelEdit = () => {
    setFormData({
      firstName: UsersData?.firstName,
      lastName: UsersData?.lastName,
      email: UsersData?.email,
      phoneNumber: UsersData?.phoneNumber,
      latitude: UsersData?.latitude,
      longitude: UsersData?.longitude,
      country: UsersData?.country,
      address: UsersData?.address,
      services: UsersData?.services || [],
    });
    setEditMode(false);
  };
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <>
      <UserNavbar />
      <Container className="d-flex justify-content-center mt-5 vh-100">
        <Container>
          <Row className="d-flex flex-row  align-items-center">
            {" "}
           {!editMode && 
            <Col xs={2} md={1} className="text-start">
            <Button color="danger" onClick={handleGoBack}>
              <FontAwesomeIcon icon={faArrowLeft} />
            </Button>
          </Col>
          }
            <Col className="fw-bold fs-3">Your Profile</Col>
          </Row>
          <Row>
          
            {editMode ? (
              <Form className="mt-5" onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label className="fw-semibold" for="firstName">
                        {RegisterPage.LABELS.FIRST_NAME}
                      </Label>
                      <Input
                        type={RegisterPage.INPUT_FIELDS.FIRST_NAME.type}
                        name={RegisterPage.INPUT_FIELDS.FIRST_NAME.name}
                        id={RegisterPage.INPUT_FIELDS.FIRST_NAME.name}
                        placeholder={
                          RegisterPage.INPUT_FIELDS.FIRST_NAME.placeholder
                        }
                        maxLength={12}
                        value={formData.firstName}
                        onChange={(e) =>
                          handleNameChange(
                            formData,
                            setFormData,
                            setFirstNameError,
                            "firstName",
                            e
                          )
                        }
                      />{" "}
                      {firstNameError && (
                        <span className="text-danger">{firstNameError}</span>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label className="fw-semibold" for="lastName">
                        {RegisterPage.LABELS.LAST_NAME}
                      </Label>
                      <Input
                        type={RegisterPage.INPUT_FIELDS.LAST_NAME.type}
                        name={RegisterPage.INPUT_FIELDS.LAST_NAME.name}
                        id={RegisterPage.INPUT_FIELDS.LAST_NAME.name}
                        placeholder={
                          RegisterPage.INPUT_FIELDS.LAST_NAME.placeholder
                        }
                        maxLength={12}
                        value={formData.lastName}
                        onChange={(e) =>
                          handleNameChange(
                            formData,
                            setFormData,
                            setLastNameError,
                            "lastName",
                            e
                          )
                        }
                      />{" "}
                      {lastNameError && (
                        <span className="text-danger">{lastNameError}</span>
                      )}
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label className="fw-semibold" for="email">
                        {RegisterPage.LABELS.EMAIL}
                      </Label>
                      <Input
                        type={RegisterPage.INPUT_FIELDS.EMAIL.name}
                        name={RegisterPage.INPUT_FIELDS.EMAIL.name}
                        id={RegisterPage.INPUT_FIELDS.EMAIL.name}
                        placeholder={
                          RegisterPage.INPUT_FIELDS.EMAIL.placeholder
                        }
                        value={formData.email}
                        onChange={handleEmailChange}
                      />
                      {emailError && (
                        <span className="text-danger">{emailError}</span>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label className="fw-semibold" for="phoneNumber">
                        {RegisterPage.LABELS.PHONE}
                      </Label>
                      <PhoneInput
                        defaultCountry="PK"
                        id={RegisterPage.INPUT_FIELDS.PHONE.name}
                        placeholder={
                          RegisterPage.INPUT_FIELDS.PHONE.placeholder
                        }
                        value={formData.phoneNumber}
                        onChange={handlePhoneChange}
                        international
                        countryCallingCodeEditable={false}
                      />
                      {phoneError && (
                        <span className="text-danger">{phoneError}</span>
                      )}
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <FormGroup>
                      <Label className="fw-semibold" for="address">
                        {RegisterPage.LABELS.ADDRESS}
                      </Label>
                      <Map setFormData={setFormData} formData={formData} />
                    </FormGroup>
                  </Col>
                </Row>

                <Button type="submit" color="primary" className="me-2">
                  Save
                </Button>
                <Button color="danger" onClick={handleCancelEdit}>
                  <FontAwesomeIcon icon={faTimes} /> Cancel
                </Button>
              </Form>
            ) : (
              <Card
                className="my-4"
                style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
              >
                <CardBody>
                  <Row>
                    <Col xs={6}>
                      <p className="fw-semibold">First Name:</p>
                      <p className="w-100">{UsersData?.firstName}</p>
                    </Col>
                    <Col xs={6}>
                      <p className="fw-semibold">Last Name:</p>
                      <p className="w-100">{UsersData?.lastName}</p>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={6}>
                      <p className="fw-semibold">Email:</p>
                      <p className="w-100">{UsersData?.email}</p>
                    </Col>
                    <Col xs={6}>
                      <p className="fw-semibold">Phone:</p>
                      <p className="w-100">{UsersData?.phoneNumber}</p>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <p className="fw-semibold">Address:</p>
                      <p className="w-100">{UsersData?.address}</p>
                    </Col>
                  </Row>
                  <Button onClick={handleEditModeToggle}>Edit Profile</Button>
                </CardBody>
              </Card>
            )}
          </Row>
        </Container>
      </Container>
    </>
  );
};

export default EditProfilePage;

{
  /* //   <Form onSubmit={handleSubmit}>
        //     <FormGroup className="mb-3">
        //       <Label for="editedName" className="mb-1 fw-semibold">
        //         First Name
        //         <Input type="text" id="editedName" value={editedName} onChange={handleNameChange} />
        //       </Label>
        //     </FormGroup>
        //     <FormGroup className="mb-3">
        //       <Label for="editedLastName" className="mb-1 fw-semibold">
        //         Last Name
        //         <Input type="text" id="editedLastName" value={editedLastName} onChange={handleLastNameChange} />
        //       </Label>
        //     </FormGroup>
        //     <Button type="submit" color="primary" className="me-2">
        //       Save
        //     </Button>
        //     <Button color="danger" onClick={handleCancelEdit}>
        //       <FontAwesomeIcon icon={faTimes} /> Cancel
        //     </Button>
        //   </Form> */
}
