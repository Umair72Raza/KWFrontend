import { useEffect, useState } from "react";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Container,
  Row,
  Col,
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom"; // Assuming React Router is properly set up
import { validatePassword, validateEmail, handleNameChange } from "../../utils";
import { RegisterPage } from "../../Constants/Constants";
import { useDispatch, useSelector } from "react-redux";
import { signUpUserAsync } from "../../Redux/Slices/userSlice";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import Map from "../../Components/Map/Map";
import { IoMdClose } from "react-icons/io";
import { allServicesAsync } from "../../Redux/Slices/Admin.js";

const UserRegister = ({ ShowServices }) => {
  let list = useSelector((state) => state?.admin?.services);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    latitude: "",
    longitude: "",
    address: "",
    services: [],
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [isSignupDisabled, setIsSignupDisabled] = useState(true);
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    const isFormValid =
      !passwordError &&
      !confirmPasswordError &&
      !emailError &&
      !phoneError &&
      formData.password &&
      formData.confirmPassword &&
      formData.password === formData.confirmPassword &&
      formData.address.trim() !== "" &&
      formData.firstName.trim() !== "" &&
      formData.lastName.trim() !== "" &&
      (ShowServices ? formData.services.length > 0 : true);
    setIsSignupDisabled(!isFormValid);
  }, [formData, passwordError, confirmPasswordError, emailError, phoneError]);

  useEffect(() => {
    if(ShowServices){
    dispatch(allServicesAsync());
    }
  }, [dispatch]);

  const handlePasswordChange = (e) => {
    const password = e.target.value;

    if (!validatePassword(password)) {
      setPasswordError(RegisterPage.ERROR_MESSAGES.invalidPassword);
    } else {
      setPasswordError("");
    }

    setFormData({
      ...formData,
      password,
    });
  };

  const handleConfirmPasswordChange = (e) => {
    const confirmPassword = e.target.value;

    if (confirmPassword !== formData.password) {
      setConfirmPasswordError(RegisterPage.ERROR_MESSAGES.passwordsNotMatch);
    } else {
      setConfirmPasswordError("");
    }

    setFormData({
      ...formData,
      confirmPassword,
    });
  };

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

    if (!serviceExists) {
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

  const removeService = (serviceName) => {
    const updatedServices = formData.services.filter(
      (service) => service.name !== serviceName
    );

    setFormData({
      ...formData,
      services: updatedServices,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    const result = await dispatch(signUpUserAsync(formData));
    if (result.type === "auth/signup/fulfilled") {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
        latitude: "",
        longitude: "",
        address: "",
        services: [],
      });
      navigate("/auth/login");
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "90vh" }}
    >
      <Row className="w-100 d-flex justify-content-center">
        <Col md={10} lg={8} xl={8}>
          <h2 className="text-center mt-5 mb-4">{RegisterPage.LABELS.TITLE}</h2>
          <Form onSubmit={handleSubmit}>
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
                    placeholder={RegisterPage.INPUT_FIELDS.EMAIL.placeholder}
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
                    placeholder={RegisterPage.INPUT_FIELDS.PHONE.placeholder}
                    value={phoneNumber}
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
              <Col md={6}>
                <FormGroup>
                  <Label className="fw-semibold" for="password">
                    {RegisterPage.LABELS.PASSWORD}
                  </Label>
                  <Input
                    type={RegisterPage.INPUT_FIELDS.PASSWORD.name}
                    name={RegisterPage.INPUT_FIELDS.PASSWORD.name}
                    id={RegisterPage.INPUT_FIELDS.PASSWORD.name}
                    placeholder={RegisterPage.INPUT_FIELDS.PASSWORD.placeholder}
                    value={formData.password}
                    onChange={handlePasswordChange}
                  />
                  {passwordError && (
                    <span className="text-danger">{passwordError}</span>
                  )}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className="fw-semibold" for="confirmPassword">
                    {RegisterPage.LABELS.CONFIRM_PASSWORD}
                  </Label>
                  <Input
                    type={RegisterPage.INPUT_FIELDS.PASSWORD.name}
                    name={RegisterPage.INPUT_FIELDS.CONFIRM_PASSWORD.name}
                    id={RegisterPage.INPUT_FIELDS.CONFIRM_PASSWORD.name}
                    placeholder={
                      RegisterPage.INPUT_FIELDS.CONFIRM_PASSWORD.placeholder
                    }
                    value={formData.confirmPassword}
                    onChange={handleConfirmPasswordChange}
                  />
                  {confirmPasswordError && (
                    <span className="text-danger">{confirmPasswordError}</span>
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
                  <Map setFormData={setFormData} />
                </FormGroup>
              </Col>
            </Row>
            {ShowServices && (
              <>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label className="fw-semibold">
                        {RegisterPage.LABELS.SERVICES}
                      </Label>
                      <Input
                        type={RegisterPage.INPUT_FIELDS.SERVICES.type}
                        name={RegisterPage.INPUT_FIELDS.SERVICES.name}
                        onChange={handleServiceChange}
                        value=""
                      >
                        <option value="" disabled>
                          {RegisterPage.INPUT_FIELDS.SERVICES.placeholder}
                        </option>
                        {list?.length > 0 &&
                          list.map((service) => (
                            <option key={service._id} value={service.name}>
                              {service.name}
                            </option>
                          ))}
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup className="d-flex flex-wrap">
                      {formData.services.map((service) => (
                        <div
                          className="mr-3 mb-2 d-flex align-items-center"
                          key={service.name}
                        >
                          <Label className="fw-semibold me-2">
                            {service.name}:
                          </Label>
                          <Input
                            type="number"
                            min="10"
                            placeholder={`Rate ($/hr)`}
                            value={service.rate || ""}
                            onChange={(e) => handleRateChange(e, service.name)}
                          />
                          <IoMdClose
                            className="ms-2 fs-4 fw-bold text-danger cursor-pointer"
                            onClick={() => removeService(service.name)}
                          />
                        </div>
                      ))}
                    </FormGroup>
                  </Col>
                </Row>
              </>
            )}

            <div className="text-center mb-3">
              {isSignupDisabled && (
                <span className="text-danger">
                  {RegisterPage.ERROR_MESSAGES.enterAllFields}
                </span>
              )}
            </div>
            <Button color="primary" disabled={isSignupDisabled} block>
              {RegisterPage.LABELS.SIGNUP}
            </Button>
          </Form>

          <Col className="mt-4 text-center">
            {RegisterPage.LABELS.MEMBER}
            <Link className="fw-bold" to={RegisterPage.ROUTES.LOGIN}>
              {RegisterPage.LABELS.ACCOUNT}
            </Link>
          </Col>
        </Col>
      </Row>
    </Container>
  );
};

export default UserRegister;
