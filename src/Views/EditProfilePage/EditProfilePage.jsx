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
  Spinner,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faTimes } from "@fortawesome/free-solid-svg-icons";
import UserNavbar from "../../Components/Navbar/UserNavbar";
import {
  fetchUsersDataAsync,
  updateProfileAsync,
} from "../../Redux/Slices/EditProfileSlice";
import { EDITPROFILE_PAGE, RegisterPage } from "../../Constants/Constants";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import Map from "../../Components/Map/Map";
import {
  failureToast,
  handleNameChange,
  hasOnlyWhiteSpace,
  successToast,
  validateEmail,
} from "../../utils";
import { useNavigate } from "react-router-dom";
import CustomServiceDropdown from "../../Components/Services CheckList/CustomServicesDropdown";
import { allServicesAsync } from "../../Redux/Slices/AdminSlice";

const EditProfilePage = ({ ShowServices }) => {
  const { user, token } = useSelector((state) => state.auth);
  const { UsersData } = useSelector((state) => state.editProfile);
  const list = useSelector((state) => state?.admin?.services);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
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

  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (UsersData) {
      const isFormValid =
        !errors.email &&
        !errors.phone &&
        !hasOnlyWhiteSpace(formData?.address) &&
        !hasOnlyWhiteSpace(formData?.firstName) &&
        !hasOnlyWhiteSpace(formData?.lastName) &&
        (ShowServices ? formData.services.length > 0 : true);

      setIsSaveDisabled(!isFormValid);
    }
  }, [formData, errors.email, errors.phone]);

  useEffect(() => {
    if (user && user._id) {
      dispatch(fetchUsersDataAsync({ id: user._id, token }));
    }
  }, [dispatch, user, token]);

  useEffect(() => {
    if (ShowServices) {
      dispatch(allServicesAsync());
    }
  }, [dispatch, ShowServices]);

  const handleEmailChange = (e) => {
    setErrors({ ...errors, email: "" });
    setFormData({
      ...formData,
      email: e.target.value,
    });
  };

  const handlePhoneChange = (value) => {
    setErrors({ ...errors, phone: "" });
    setFormData({
      ...formData,
      phoneNumber: value,
    });
  };

  const handleServiceChange = (e) => {
    const selectedService = e.target.value;
    const serviceExists = formData.services.some(
      (service) => service.name === selectedService
    );

    const updatedServices = serviceExists
      ? formData.services.filter((service) => service.name !== selectedService)
      : [...formData.services, { name: selectedService, rate: 10 }];

    setFormData({
      ...formData,
      services: updatedServices,
    });
  };

  const handleRateChange = (e, serviceName) => {
    const value = parseFloat(e.target.value);
    const updatedServices = formData.services.map((service) =>
      service.name === serviceName ? { ...service, rate: value } : service
    );

    setFormData({
      ...formData,
      services: updatedServices,
    });
  };

  const FormValidation = (formData) => {
    const errors = {};
    if (!validateEmail(formData.email)) {
      errors.email = RegisterPage.ERROR_MESSAGES.invalidEmail;
    }
    if (!formData.email.includes(".com")) {
      errors.email = "Invalid email address";
    }

    if (formData.phoneNumber && typeof formData.phoneNumber === "string") {
      isValidPhoneNumber(formData.phoneNumber)
        ? setErrors({ ...errors, phone: "" })
        : (errors.phone = RegisterPage.ERROR_MESSAGES.invalidPhoneNumber);
    } else {
      errors.phone = "Phone number is required";
    }

    if (ShowServices && formData.services.length === 0) {
      console.error("Please select at least one service.");
      errors.services = "Please select at least one service.";
    }

    return errors;
  };
  const handleKeyPress = (e) => {
    // Check if the pressed key is "Enter" (key code 13)
    if (e.key === 'Enter') {
      // Prevent the default form submission behavior
      e.preventDefault();
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = FormValidation(formData);
    setErrors(validationErrors);

    // Wait for the state to be updated
    setTimeout(() => {
      if (Object.keys(validationErrors).length === 0) {
        try {
          setLoading(true);
          const data = { id: UsersData?._id, token, formData };
          dispatch(updateProfileAsync(data))
            .then((result) => {
              if (result.type === "/UpdateProfile/fulfilled") {
                successToast("Profile Updated Successfully!");
                setFormData({
                  firstName: UsersData?.firstName,
                  lastName: result.payload?.lastName,
                  email: result.payload?.email,
                  phoneNumber: result.payload?.phoneNumber,
                  latitude: result.payload?.latitude,
                  longitude: result.payload?.longitude,
                  country: result.payload?.country,
                  address: result.payload?.address,
                  services: result.payload?.services || [],
                });
                setEditMode(false);
              } else if (result.type === "/UpdateProfile/rejected") {
                failureToast(result.payload);
              }
            })
            .catch((err) => {
              console.log("Error updating profile:", err);
            });
        } finally {
          setLoading(false);
        }
      }
    }, 0);
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
            {!editMode && (
              <Col xs={2} md={1} className="text-start">
                <Button color="danger" onClick={handleGoBack}>
                  <FontAwesomeIcon icon={faArrowLeft} />
                </Button>
              </Col>
            )}
            <Col className="fw-bold fs-3">
              {EDITPROFILE_PAGE.LABELS.TITLE}
            </Col>
          </Row>
          <Row>
            {editMode ? (
              <Form className="mt-5" onSubmit={handleSubmit} onKeyDown={handleKeyPress}>
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
                        required
                        value={formData.firstName}
                        onChange={(e) =>
                          handleNameChange(
                            formData,
                            setFormData,
                            setErrors,
                            errors,
                            "firstName",
                            e
                          )
                        }
                      />{" "}
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
                        required
                        value={formData.lastName}
                        onChange={(e) =>
                          handleNameChange(formData, setFormData, setErrors,
                            errors, "lastName", e)
                        }
                      />{" "}
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
                        maxLength={70}
                        value={formData.email}
                        onChange={handleEmailChange}
                        onKeyDown={ (event) => {
                          if (event.key === ' ') {
                            event.preventDefault();
                          }
                        }}
                      />
                      {errors.email && (
                        <span className="text-danger">{errors.email}</span>
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
                        maxLength={20}
                        required
                        value={formData.phoneNumber}
                        onChange={handlePhoneChange}
                        international
                        countryCallingCodeEditable={false}
                      />
                      {errors.phone && (
                        <span className="text-danger">{errors.phone}</span>
                      )}
                    </FormGroup>
                  </Col>
                </Row>
                {ShowServices && (
                  <>
                    <Row className="my-4">
                      <Label className="fw-semibold">
                        {RegisterPage.LABELS.SERVICES}
                      </Label>
                      <Col
                        md={12}
                        className="d-flex flex-row Service-overflow-y-scroll"
                      >
                        <FormGroup>
                          <CustomServiceDropdown
                            list={list}
                            selectedServices={formData.services}
                            handleServiceChange={handleServiceChange}
                            handleRateChange={handleRateChange}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </>
                )}
                <Row>
                  <Col>
                    <FormGroup>
                      <Label className="fw-semibold" for="address">
                        {RegisterPage.LABELS.ADDRESS}
                      </Label>
                      {editMode && (
                        // Render map only when in edit mode
                        <Map
                          setFormData={setFormData}
                          formData={formData}
                          editMode={editMode}
                          setErrors={setErrors}
                          errors={errors}
                        />
                      )}
                    </FormGroup>
                  </Col>
                </Row>
                <Button
                  type="submit"
                  color="primary"
                  disabled={isSaveDisabled || loading}
                  className="me-2"
                >
                  {loading ? <Spinner size="sm" color="light" /> : <>{EDITPROFILE_PAGE.BUTTONS.SAVE}</>}
                </Button>
                <Button
                  color="danger"
                  onClick={handleCancelEdit}
                  disabled={loading}
                >
                  <FontAwesomeIcon icon={faTimes} /> {EDITPROFILE_PAGE.BUTTONS.CANCEL}
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
                      <p className="fw-semibold">{EDITPROFILE_PAGE.CARD_LABELS.FIRST_NAME}</p>
                      <p className="w-100">{UsersData?.firstName}</p>
                    </Col>
                    <Col xs={6}>
                      <p className="fw-semibold">{EDITPROFILE_PAGE.CARD_LABELS.LAST_NAME}</p>
                      <p className="w-100">{UsersData?.lastName}</p>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={6}>
                      <p className="fw-semibold">{EDITPROFILE_PAGE.CARD_LABELS.EMAIL}</p>
                      <p className="w-100">{UsersData?.email}</p>
                    </Col>
                    <Col xs={6}>
                      <p className="fw-semibold">{EDITPROFILE_PAGE.CARD_LABELS.PHONE}</p>
                      <p className="w-100">{UsersData?.phoneNumber}</p>
                    </Col>
                  </Row>
                  <Row>
                  {ShowServices && (
                    <Col>
                  <p className="fw-semibold">{EDITPROFILE_PAGE.CARD_LABELS.SERVICES}</p>
                  <ol >
                    {UsersData?.services?.map((service) => (
                      <li className="pb-2" key={service.name}>
                        {service.name} - {service.rate} {EDITPROFILE_PAGE.CARD_LABELS.RATE}
                      </li>
                    ))}
                    </ol>
                  </Col>
                    )}
                    <Col>
                      <p className="fw-semibold">{EDITPROFILE_PAGE.CARD_LABELS.ADDRESS}</p>
                      <p className="w-100">{UsersData?.address}</p>
                    </Col>
                  
                  </Row>
                  <Button color="primary" onClick={handleEditModeToggle}>{EDITPROFILE_PAGE.BUTTONS.EDIT}</Button>
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
