import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { LoginPage, RegisterPage } from "../../Constants/Constants"; // Import constants
import {
  emailPattern,
  failureToast,
  successToast,
  validateEmail,
} from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import { loginAsync, toggleStatusAsync } from "../../Redux/Slices/AuthSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { PopUpState } from "../../Context/PopUpProvider";

const Login = () => {
  const [formData, setFormData] = useState({
    [LoginPage.FORM_FIELDS.EMAIL]: "",
    [LoginPage.FORM_FIELDS.PASSWORD]: "",
  });
  let { isOn, setIsOn } = PopUpState();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");
  const [loginDisabled, setLoginDisabled] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const socket = useSelector((state) => state?.socket?.socket);

  useEffect(() => {
    const isFormValid = !errors.email && formData.email && formData.password;
    setLoginDisabled(!isFormValid);
  }, [errors, formData]);

  const handleEmailChange = (e) => {
    setErrors({ ...errors, email: "" });
    setFormData({
      ...formData,
      email: e.target.value,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const FormValidation = (formData) => {
    const errors = {};
    if (!emailPattern(formData.email)) {
      errors.email = RegisterPage.ERROR_MESSAGES.invalidEmail;
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const validationErrors = FormValidation(formData);
    setErrors(validationErrors);

    try {
      if (Object.keys(validationErrors).length === 0) {
        const result = await dispatch(loginAsync(formData));

        if (result.type === "auth/login/fulfilled") {
          if (result.payload) {
            setFormData({
              [LoginPage.FORM_FIELDS.EMAIL]: "",
              [LoginPage.FORM_FIELDS.PASSWORD]: "",
            });
            successToast("Login successful! Welcome back!");

            const id = result.payload.user._id;
            const data = { id, status: "online", token: result.payload.token };
            const Result = await dispatch(toggleStatusAsync(data));
            await socket?.emit("online-offline", Result.payload.updatedStatus);
            if (result.payload.user.role == "worker") {
              await setIsOn(true);
              navigate("/worker/workerHomepage");
            } else {
              navigate("/user/homepage");
            }
          }
        } else if (result.type === "auth/login/rejected") {
          failureToast(result.payload);
        }
      }
    } catch (error) {
      console.log("Error login:", error);
    } finally {
      setLoading(false); // Stop loading spinner after API response
    }
  };

  return (
    <Container
      className="d-flex flex-column gap-5 justify-content-center align-items-center"
      style={{ minHeight: "90vh" }}
    >
      <Row>
        <Col>
          <h1>{LoginPage.TITLE}</h1>
        </Col>
      </Row>
      <Row className="w-100 d-flex justify-content-center">
        <Col md={6} lg={4} xl={3}>
          <h2 className="text-center mt-5 mb-4">{LoginPage.LABELS.LOGIN}</h2>
          <Form
            onSubmit={handleSubmit}
            autoComplete="off"
            style={{ userSelect: "none" }}
          >
            <FormGroup>
              <Label
                className="fw-semibold"
                for={LoginPage.FORM_FIELDS.USERNAME}
              >
                {LoginPage.LABELS.EMAIL}
              </Label>
              <Input
                type="email"
                name={LoginPage.FORM_FIELDS.EMAIL}
                id={LoginPage.FORM_FIELDS.EMAIL}
                placeholder={LoginPage.PLACEHOLDERS.EMAIL}
                maxLength={70}
                disabled={loading}
                value={formData[LoginPage.FORM_FIELDS.EMAIL]}
                onChange={handleEmailChange}
                onKeyDown={(event) => {
                  if (event.key === " ") {
                    event.preventDefault();
                  }
                }}
                autoComplete="new-email"
              />
              {errors.email && (
                <span className="text-danger">{errors.email}</span>
              )}
            </FormGroup>
            <FormGroup>
              <Col>
                <Label
                  className="fw-semibold"
                  for={LoginPage.FORM_FIELDS.PASSWORD}
                >
                  {LoginPage.LABELS.PASSWORD}
                </Label>
              </Col>
              <div className="password-input-wrapper">
                <Input
                  type={showPassword ? "text" : "password"}
                  name={LoginPage.FORM_FIELDS.PASSWORD}
                  id={LoginPage.FORM_FIELDS.PASSWORD}
                  placeholder={LoginPage.PLACEHOLDERS.PASSWORD}
                  maxLength={12}
                  disabled={loading}
                  value={formData[LoginPage.FORM_FIELDS.PASSWORD]}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                />
                {formData.password && formData.password.length > 0 && (
                  <div
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <FontAwesomeIcon
                      icon={showPassword ? faEye : faEyeSlash}
                      className="password-icon"
                    />
                  </div>
                )}
              </div>
            </FormGroup>
            <Link id="Login" style={{ textDecoration: "none" }}>
              <Button
                color="primary"
                className="w-25 hover-pointer"
                type="submit"
                block
                onClick={handleSubmit}
                disabled={loginDisabled || loading}
              >
                {loading ? (
                  <Spinner size="sm" color="light" />
                ) : (
                  LoginPage.LABELS.LOGIN
                )}
              </Button>
            </Link>
            <Link
              to={LoginPage.ROUTES.FORGET_PASSWORD}
              className="text-primary fw-bold mt-2 d-block text-center"
              style={{ textDecoration: "none" }} // Remove underline by default
            >
              <span className="forget-password-link">
                {LoginPage.LABELS.FORGET_PASSWORD}
              </span>
            </Link>
            <Tooltip
              placement="right"
              autohide={false}
              isOpen={tooltipOpen && loginDisabled}
              target="Login"
              toggle={() => setTooltipOpen(!tooltipOpen)}
            >
              Enter all fields to login!
            </Tooltip>
          </Form>
          <Col className="mt-3 text-center fw-medium">
            {LoginPage.LABELS.MEMBER}{" "}
            <Link
              className="fw-bold links-hover"
              to={LoginPage.ROUTES.REGISTER}
            >
              {LoginPage.LABELS.ACCOUNT}
            </Link>
          </Col>

          <Col className="mt-3 text-center fw-medium">
            {LoginPage.LABELS.WORKER_DESCRIPTION}{" "}
            <Link
              className="fw-bold links-hover"
              to={LoginPage.ROUTES.WORKER_REGISTER}
            >
              {LoginPage.LABELS.WORKER_DESCRIPTION2}
            </Link>
          </Col>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
