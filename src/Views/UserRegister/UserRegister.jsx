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
  validateField,
  validateServices,
  validatePhoneNumber,
  passwordPattern,
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
import { FaCheckCircle } from "react-icons/fa";
import { set } from "lodash";
import Dropdowns from "../../Components/CountrySelector/DropDowns.jsx";
import { City } from "country-state-city";

const UserRegister = ({ ShowServices }) => {
  let list = useSelector((state) => state?.admin?.services);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    location: {},
    // latitude: "",
    // longitude: "",
    address: "",
    optionalAddress: "",
    country: "",
    region_state: "",
    city: "",
    services: [],
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isSignupDisabled, setIsSignupDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordInfo, setPasswordInfo] = useState("");
  const [confirmPasswordInfo, setConfirmPasswordInfo] = useState("");
  const [passwordValid, setPasswordValid] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [listLoading, setListLoading] = useState(true);
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
      "rate",
    ];
    const formDataFields = [
      "firstName",
      "lastName",
      "address",
      "email",
      "password",
      "confirmPassword",
      "phoneNumber",
      "country",
      "region_state",
      "city",
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
    const fetchData = async () => {
      try {
        if (ShowServices) {
          await dispatch(allServicesAsync());
        }
      } catch (error) {
        console.error("Error fetching services", error);
      } finally {
        setListLoading(false);
      }
    };

    fetchData();
  }, [dispatch, ShowServices]);

  const handlePasswordChange = (e) => {
    let password = e.target.value;
    password = password.replace(/\s/g, "");
    if (!passwordPattern(password)) {
      setPasswordValid(false);
      setPasswordInfo(RegisterPage.ERROR_MESSAGES.invalidPassword);
    } else {
      setPasswordValid(true);
      setPasswordInfo(RegisterPage.SUCCESS_MESSAGES.PASSWORD_VALID); // Change this text as needed
    }

    setErrors({ ...errors, confirmPassword: "", password: "" });

    setFormData({
      ...formData,
      password,
    });
  };

  const handleConfirmPasswordChange = (e) => {
    let confirmPassword = e.target.value;
    confirmPassword = confirmPassword.replace(/\s/g, "");
    if (confirmPassword !== formData.password) {
      setConfirmPasswordInfo(RegisterPage.ERROR_MESSAGES.passwordsNotMatch);
    } else if (confirmPassword === "") {
      setConfirmPasswordInfo("");
    } else {
      setConfirmPasswordInfo(RegisterPage.SUCCESS_MESSAGES.CONFIRMPASSWORD);
    }

    setErrors({ ...errors, confirmPassword: "", password: "" });

    setFormData({
      ...formData,
      confirmPassword,
    });
  };

  const handleEmailChange = (e) => {
    setErrors({ ...errors, email: "" });
    let email = e.target.value;
    setIsSignupDisabled(false);
    email = email.replace(/\s/g, "");
    setFormData((prevFormData) => ({
      ...prevFormData,
      email,
    }));
  };

  const handlePhoneChange = (value) => {
    setErrors({ ...errors, phone: "" });
    setIsSignupDisabled(false);
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
    setErrors({ ...errors, [serviceName]: "" });
    const updatedServices = formData.services.map((service) =>
      service.name === serviceName ? { ...service, rate: value } : service
    );

    setFormData({
      ...formData,
      services: updatedServices,
    });
  };

  const handleOptionalAddress = (e) => {
    const value = e.target.value.trimStart().replace(/\s{2,}/g, " ");
    setFormData({
      ...formData,
      optionalAddress: value,
    });
  };
  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    const isValidImage = ["image/jpeg", "image/png", "image/gif"].includes(
      file.type
    );

    if (!isValidImage) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        profilePicture: "Please select a valid image file (JPEG, PNG, or GIF).",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        profilePicture: null,
      }));
      setProfilePicture(file);
    }
  };

  const FormValidation = (formData) => {
    const errors = {};

    validateEmail(formData.email, errors);
    validatePhoneNumber(formData.phoneNumber, errors);
    validateServices(ShowServices, formData.services, errors);
    validatePassword(formData.password, formData.confirmPassword, errors);
    validateField(
      formData.firstName,
      "firstName",
      RegisterPage.ERROR_MESSAGES.invalidFirstName,
      errors
    );
    validateField(
      formData.lastName,
      "lastName",
      RegisterPage.ERROR_MESSAGES.invalidLastName,
      errors
    );
    validateField(
      formData.address,
      "address",
      RegisterPage.ERROR_MESSAGES.invalidAddress,
      errors
    );

    errors.country = !formData.country ? "Country is required" : "";
    errors.region_state = !formData.region_state
      ? "Region/State is required"
      : "";

    if (
      formData.region &&
      City.getCitiesOfState(formData.country, formData.region_state).length ===
        0
    ) {
      errors.city = "";
    } else {
      errors.city = !formData.city ? "City is required" : "";
    }

    if (!profilePicture) {
      errors.profilePicture = "Profile picture is required";
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
        console.log("Form data", formData);
        // Dispatch the signup action
        const result = await dispatch(signUpUserAsync(formData));

        if (result.type === "auth/signup/fulfilled") {
          console.log("Sign up successful!", formData);
          // Reset form data on successful signup
          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            password: "",
            confirmPassword: "",
            location: {},
            // latitude: "",
            // longitude: "",
            address: "",
            optionalAddress: "",
            country: "",
            region_state: "",
            city: "",
            services: [],
          });
          const successMessage = ShowServices
            ? RegisterPage.SUCCESS_MESSAGES.WORKER_SIGNUP
            : RegisterPage.SUCCESS_MESSAGES.USER_SIGNUP;

          successToast(successMessage);

          navigate("/auth/login");
        } else if (result.type === "auth/signup/rejected") {
          setIsSignupDisabled(true);
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
                <FormGroup disabled={loading}>
                  <Label className="fw-semibold" for="firstName">
                    {RegisterPage.LABELS.FIRST_NAME}
                    <span className="text-danger fw-bold fs-5">
                      {RegisterPage.FORM_FIELDS.REQUIRED}
                    </span>
                  </Label>
                  <Input
                    invalid={errors.firstName ? true : false}
                    type={RegisterPage.INPUT_FIELDS.FIRST_NAME.type}
                    name={RegisterPage.INPUT_FIELDS.FIRST_NAME.name}
                    id={RegisterPage.INPUT_FIELDS.FIRST_NAME.name}
                    placeholder={
                      RegisterPage.INPUT_FIELDS.FIRST_NAME.placeholder
                    }
                    required
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
                  {errors.firstName && (
                    <span className="text-danger">{errors.firstName}</span>
                  )}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup disabled={loading}>
                  <Label className="fw-semibold" for="lastName">
                    {RegisterPage.LABELS.LAST_NAME}
                    <span className="text-danger fw-bold fs-5">
                      {RegisterPage.FORM_FIELDS.REQUIRED}
                    </span>
                  </Label>
                  <Input
                    invalid={errors.lastName ? true : false}
                    type={RegisterPage.INPUT_FIELDS.LAST_NAME.type}
                    name={RegisterPage.INPUT_FIELDS.LAST_NAME.name}
                    id={RegisterPage.INPUT_FIELDS.LAST_NAME.name}
                    placeholder={
                      RegisterPage.INPUT_FIELDS.LAST_NAME.placeholder
                    }
                    required
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
                <FormGroup disabled={loading}>
                  <Label className="fw-semibold" for="email">
                    {RegisterPage.LABELS.EMAIL}
                    <span className="text-danger fw-bold fs-5">
                      {RegisterPage.FORM_FIELDS.REQUIRED}
                    </span>
                  </Label>
                  <Input
                    invalid={errors.email ? true : false}
                    type={RegisterPage.INPUT_FIELDS.EMAIL.name}
                    name={RegisterPage.INPUT_FIELDS.EMAIL.name}
                    id={RegisterPage.INPUT_FIELDS.EMAIL.name}
                    placeholder={RegisterPage.INPUT_FIELDS.EMAIL.placeholder}
                    value={formData.email || ""}
                    maxLength={70}
                    required
                    onChange={handleEmailChange}
                    autoComplete="new-email"
                    onKeyDown={(event) => {
                      if (event.key === " ") {
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
                <FormGroup disabled={loading}>
                  <Label className="fw-semibold" for="phoneNumber">
                    {RegisterPage.LABELS.PHONE}
                    <span className="text-danger fw-bold fs-5">
                      {RegisterPage.FORM_FIELDS.REQUIRED}
                    </span>
                  </Label>
                  <PhoneInput
                    invalid={errors.phone ? true : false}
                    defaultCountry="PK"
                    id={RegisterPage.INPUT_FIELDS.PHONE.name}
                    placeholder={RegisterPage.INPUT_FIELDS.PHONE.placeholder}
                    value={formData.phoneNumber || ""}
                    maxLength={20}
                    required
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
                <FormGroup disabled={loading}>
                  <Label className="fw-semibold" for="password">
                    {RegisterPage.LABELS.PASSWORD}
                    <span className="text-danger fw-bold fs-5">
                      {RegisterPage.FORM_FIELDS.REQUIRED}
                    </span>
                  </Label>
                  <div className="password-input-wrapper">
                    <Input
                      invalid={errors.password ? true : false}
                      type={showPassword ? "text" : "password"}
                      name="password"
                      id="password"
                      placeholder={
                        RegisterPage.INPUT_FIELDS.PASSWORD.placeholder
                      }
                      required
                      maxLength={24}
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
                        className="password-icon pe-4"
                      />
                    </div>
                  </div>
                  {passwordInfo && passwordValid ? (
                    <span className="text-success fw-bold">
                      <FaCheckCircle /> {passwordInfo}
                    </span>
                  ) : (
                    <span
                      className={`fw-bold ${
                        errors.password ? "text-danger" : "text-info"
                      }`}
                    >
                      {passwordInfo}
                    </span>
                  )}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup disabled={loading}>
                  <Label className="fw-semibold" for="confirmPassword">
                    {RegisterPage.LABELS.CONFIRM_PASSWORD}
                    <span className="text-danger fw-bold fs-5">
                      {RegisterPage.FORM_FIELDS.REQUIRED}
                    </span>
                  </Label>
                  <div className="password-input-wrapper ">
                    <Input
                      invalid={errors.confirmPassword ? true : false}
                      type={showConfirmPassword ? "text" : "password"}
                      name={RegisterPage.INPUT_FIELDS.CONFIRM_PASSWORD.name}
                      id={RegisterPage.INPUT_FIELDS.CONFIRM_PASSWORD.name}
                      placeholder={
                        RegisterPage.INPUT_FIELDS.CONFIRM_PASSWORD.placeholder
                      }
                      required
                      value={formData.confirmPassword || ""}
                      maxLength={24}
                      onChange={handleConfirmPasswordChange}
                      autoComplete="new-password"
                    />
                    <div
                      className="password-toggle"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      <FontAwesomeIcon
                        icon={showConfirmPassword ? faEye : faEyeSlash}
                        className="password-icon pe-4"
                      />
                    </div>
                  </div>
                  {confirmPasswordInfo &&
                  confirmPasswordInfo === "Password Matched." ? (
                    <span className=" fw-bold text-success">
                      <FaCheckCircle /> {confirmPasswordInfo}
                    </span>
                  ) : (
                    <span className="text-danger">{confirmPasswordInfo}</span>
                  )}
                  {/* {errors?.confirmPassword && (<span className="text-danger">{errors?.confirmPassword}</span>)} */}
                </FormGroup>
              </Col>
            </Row>
            {ShowServices && (
              <>
                <Row className="my-4">
                  <Label className="fw-semibold">
                    {RegisterPage.LABELS.SERVICES}
                    <span className="text-danger fw-bold fs-5">
                      {RegisterPage.FORM_FIELDS.REQUIRED}
                    </span>
                  </Label>
                  <Col
                    md={12}
                    className="d-flex flex-row Service-overflow-y-scroll"
                  >
                    <FormGroup className="d-flex w-100" disabled={loading}>
                      {listLoading && ShowServices ? (
                        <div className="text-center w-100">
                          <Spinner />
                          <p>{RegisterPage.LOADER_MESSAGES.SERVICES_LOADING}</p>
                        </div>
                      ) : (
                        <CustomServiceDropdown
                          list={list}
                          selectedServices={formData?.services}
                          handleServiceChange={handleServiceChange}
                          handleRateChange={handleRateChange}
                          errors={errors}
                        />
                      )}
                    </FormGroup>
                  </Col>
                  <Col className="text-center mt-3">
                    {formData.services.length === 5 && !errors.services ? (
                      <span className="text-info fw-semibold">
                        {RegisterPage.SERVICES_INFO.SERVICES_SELECTION_LIMIT}
                      </span>
                    ) : (
                      <span className="text-danger">{errors.services}</span>
                    )}
                  </Col>
                </Row>
              </>
            )}
            <Row>
              <Col md={6}>
                <FormGroup disabled={loading}>
                  <Label className="fw-semibold" for="address">
                    {RegisterPage.LABELS.ADDRESS}
                  </Label>
                  <Input
                    type="text"
                    placeholder="Enter your address(Optional)."
                    value={formData.optionalAddress}
                    onChange={handleOptionalAddress}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup disabled={loading}>
                  <Label className="fw-semibold" for="profilePicture">
                    Profile Picture{" "}
                    <span className="text-danger fw-bold fs-5">
                      {RegisterPage.FORM_FIELDS.REQUIRED}
                    </span>
                  </Label>
                  <Input
                    invalid={errors.profilePicture ? true : false}
                    type="file"
                    id="profilePicture"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    required
                  />
                  {errors.profilePicture && (
                    <span className="text-danger">{errors.profilePicture}</span>
                  )}
                </FormGroup>
              </Col>
              <Col md={12}>
                <FormGroup disabled={loading}>
                <Dropdowns
                  setFormData={setFormData}
                  errors={errors}
                  setErrors={setErrors}
                />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormGroup disabled={loading}>
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
              {RegisterPage.TOOLTIPS.ALL_FIELDS}
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
