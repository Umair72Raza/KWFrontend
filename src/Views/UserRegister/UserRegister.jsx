import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Container,
  Row,
  Col,
  Spinner,
  Tooltip,
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom"; // Assuming React Router is properly set up
import {
  validatePassword,
  validateEmail,
  handleNameChange,
  successToast,
  failureToast,
  hasOnlyWhiteSpace,
} from "../../utils";
import { RegisterPage } from "../../Constants/Constants";
import { useDispatch, useSelector } from "react-redux";
import { signUpUserAsync } from "../../Redux/Slices/AuthSlice.js";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import Map from "../../Components/Map/Map";
import { allServicesAsync } from "../../Redux/Slices/AdminSlice.js";
import CustomServiceDropdown from "../../Components/Services CheckList/CustomServicesDropdown.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { has } from "lodash";

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
    country: "",
    services: [],
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isSignupDisabled, setIsSignupDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);

  const isFormValid = useMemo(() => {
    const errorFields = [
      "email",
      "phone",
      "password",
      "confirmPassword",
      "allField",
      "address",
      "firstName",
      "lastName",
      "services",
    ];
    const formDataFields = [
      "firstName",
      "lastName",
      "address",
      "email",
      "password",
      "confirmPassword",
      "phoneNumber",
    ];

    const isErrorsEmpty = errorFields.every((field) => !errors[field]);
    const isFormDataValid = formDataFields.every(
      (field) => !hasOnlyWhiteSpace(formData[field])
    );
    const isServicesValid = ShowServices ? formData.services.length > 0 : true;

    return isErrorsEmpty && isFormDataValid && isServicesValid;
  }, [errors, formData, ShowServices]);

  useEffect(() => {
    setIsSignupDisabled(!isFormValid);
  }, [isFormValid]);

  useEffect(() => {
    if (ShowServices) {
      dispatch(allServicesAsync());
    }
  }, [dispatch]);

  const handlePasswordChange = (e) => {
    let password = e.target.value;
password = password.replace(/\s/g, '');
    setErrors({ ...errors, password: "" });

    setFormData({
      ...formData,
      password,
    });
  };

  const handleConfirmPasswordChange = (e) => {
    let confirmPassword = e.target.value;
confirmPassword = confirmPassword.replace(/\s/g, '');
    setErrors({ ...errors, confirmPassword: "" });

    setFormData({
      ...formData,
      confirmPassword,
    });
  };

  const handleEmailChange = (e) => {
    setErrors({ ...errors, email: "" });
    let email = e.target.value;
    email = email.replace(/\s/g, '');
    setFormData((prevFormData) => ({
      ...prevFormData,
      email,
    }));
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

  // const isFormDataFilled = (formData) => {
  //   for (const field in formData) {
  //     if (!formData[field]) {
  //       // Field is empty
  //       return false;
  //     }
  //   }
  //   return true;
  // };

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
      errors.services = "Please select at least one service.";
    }

    if (!validatePassword(formData.password)) {
      errors.password = RegisterPage.ERROR_MESSAGES.invalidPassword;
    }

    if (formData.confirmPassword !== formData.password) {
      errors.confirmPassword = RegisterPage.ERROR_MESSAGES.passwordsNotMatch;
    }

    // if (!isFormDataFilled(formData)) {
    //   errors.allField = RegisterPage.ERROR_MESSAGES.enterAllFields;
    // }
    if (hasOnlyWhiteSpace(formData.firstName)) {
      errors.firstName = "First Name cannot be empty";
    }
    if (hasOnlyWhiteSpace(formData.lastName)) {
      errors.lastName = "Last Name cannot be empty";
    }
    if (hasOnlyWhiteSpace(formData.address)) {
      errors.address = "Address cannot be empty";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Start loading spinner
    setLoading(true);
  
    // Perform form validation
    const validationErrors = FormValidation(formData);
    setErrors(validationErrors);
  
    // Check if there are validation errors
    if (Object.keys(validationErrors).length === 0) {
      try {
        // Dispatch the signup action
        const result = await dispatch(signUpUserAsync(formData));
  
        if (result.type === "auth/signup/fulfilled") {
          // Reset form data on successful signup
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
            country: "",
            services: [],
          });
          successToast("SignUP Successful!");
          navigate("/auth/login");
        } else if (result.type === "auth/signup/rejected") {
          failureToast(result.payload);
        }
      } catch (error) {
        console.log("Error in sign up!", error);
      } finally {
        // Stop loading spinner
        setLoading(false);
      }
    } else {
      // Stop loading spinner if there are validation errors
      setLoading(false);
    }
  };
  

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "90vh" }}
    >
      <Row className="w-100 d-flex justify-content-center">
        <Col md={10} lg={8} xl={6}>
          <h2 className="text-center mt-5 mb-4">
            {ShowServices
              ? RegisterPage.LABELS.WORKER_TITLE
              : RegisterPage.LABELS.USER_TITLE}
          </h2>
          <Form onSubmit={handleSubmit} style={{ userSelect: "none" }}>
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
                    value={formData.firstName || ""}
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
                  {errors.lastName && (
                    <span className="text-danger">{errors.lastName}</span>
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
                    value={formData.lastName || ""}
                    onChange={(e) =>
                      handleNameChange(
                        formData,
                        setFormData,
                        setErrors,
                        errors,
                        "lastName",
                        e
                      )
                    }
                  />{" "}
                  {errors.firstName && (
                    <span className="text-danger">{errors.firstName}</span>
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
                    value={formData.email || ""}
                    maxLength={70}
                    onChange={handleEmailChange}
                    autoComplete="new-email"
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
                    placeholder={RegisterPage.INPUT_FIELDS.PHONE.placeholder}
                    value={formData.phoneNumber || ""}
                    maxLength={20}
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
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label className="fw-semibold" for="password">
                    {RegisterPage.LABELS.PASSWORD}
                  </Label>
                  <div className="password-input-wrapper">
                    <Input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      id="password"
                      placeholder={
                        RegisterPage.INPUT_FIELDS.PASSWORD.placeholder
                      }
                      maxLength={12}
                      value={formData.password}
                      onChange={handlePasswordChange}
                      autoComplete="new-password"
                    />
                    <div
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <FontAwesomeIcon
                        icon={showPassword ? faEye : faEyeSlash}
                        className="password-icon"
                      />
                    </div>
                  </div>
                  {errors.password && (
                    <span className="text-danger">{errors.password}</span>
                  )}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className="fw-semibold" for="confirmPassword">
                    {RegisterPage.LABELS.CONFIRM_PASSWORD}
                  </Label>
                  <div className="password-input-wrapper">
                    <Input
                      type={showPassword ? "text" : "password"}
                      name={RegisterPage.INPUT_FIELDS.CONFIRM_PASSWORD.name}
                      id={RegisterPage.INPUT_FIELDS.CONFIRM_PASSWORD.name}
                      placeholder={
                        RegisterPage.INPUT_FIELDS.CONFIRM_PASSWORD.placeholder
                      }
                      value={formData.confirmPassword || ""}
                      maxLength={12}
                      onChange={handleConfirmPasswordChange}
                      autoComplete="new-password"
                    />
                    <div
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <FontAwesomeIcon
                        icon={showPassword ? faEye : faEyeSlash}
                        className="password-icon"
                      />
                    </div>
                  </div>
                  {errors.confirmPassword && (
                    <span className="text-danger">
                      {errors.confirmPassword}
                    </span>
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
                        selectedServices={formData?.services}
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
                  <Map
                    setFormData={setFormData}
                    errors={errors}
                    setErrors={setErrors}
                  />
                </FormGroup>
              </Col>
            </Row>

            <div className="text-center mb-3">
              {errors.allField && (
                <span className="text-danger">{errors.allField}</span>
              )}
            </div>
            <Link id="Signup">
              <Button
                color="primary"
                disabled={isSignupDisabled || loading}
                block
                onClick={handleSubmit}
              >
                {loading ? (
                  <Spinner size="sm" color="light" />
                ) : (
                  RegisterPage.LABELS.SIGNUP
                )}
              </Button>
            </Link>
            <Tooltip
              placement="top"
              autohide={false}
              isOpen={tooltipOpen && isSignupDisabled}
              target="Signup"
              toggle={toggle}
            >
              Enter all fields to sign up!
            </Tooltip>
          </Form>

          <Col className="mt-4 text-center fw-medium">
            {RegisterPage.LABELS.MEMBER}
            <Link
              className="fw-bold links-hover"
              to={RegisterPage.ROUTES.LOGIN}
            >
              {RegisterPage.LABELS.ACCOUNT}
            </Link>
          </Col>
        </Col>
      </Row>
    </Container>
  );
};

export default UserRegister;
