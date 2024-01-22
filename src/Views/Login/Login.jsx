import { useState } from "react";
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
  Spinner
} from "reactstrap";
import {
  LoginPage
} from "../../Constants/Constants"; // Import constants
import { failureToast, successToast, validateEmail } from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import { loginAsync } from "../../Redux/Slices/AuthSlice";
import { setSocket } from "../../Redux/Slices/SocketSlice";

const Login = () => {
  const [formData, setFormData] = useState({
    [LoginPage.FORM_FIELDS.EMAIL]: "",
    [LoginPage.FORM_FIELDS.PASSWORD]: "",
  });
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
 


  const handleEmailChange = (e) => {
    const email = e.target.value;

    if (!validateEmail(email)) {
      setEmailError(LoginPage.ERROR_MESSAGES.invalidEmail);
    } else {
      setEmailError("");
    }

    setFormData({
      ...formData,
      email,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true); // Start loading spinner

      const result = await dispatch(loginAsync(formData));

      if (result.type === "auth/login/fulfilled") {
        setFormData({
          [LoginPage.FORM_FIELDS.EMAIL]: "",
          [LoginPage.FORM_FIELDS.PASSWORD]: "",
        });
        //const { user } = useSelector((state) => state.auth);
        console.log(result)
   //     await dispatch(setSocket(result.payload.user));
       
        successToast("Login successful! Welcome back!")
        navigate("/user/homepage");
      } else {
        failureToast("Login failed! Please try again.")
      }
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "90vh" }}
    >
      <Row className="w-100 d-flex justify-content-center">
        <Col md={6} lg={4} xl={3}>
          <h2 className="text-center mt-5 mb-4">{LoginPage.LABELS.LOGIN}</h2>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label className="fw-semibold" for={LoginPage.FORM_FIELDS.USERNAME}>
                {LoginPage.LABELS.EMAIL}
              </Label>
              <Input
                type="email"
                name={LoginPage.FORM_FIELDS.EMAIL}
                id={LoginPage.FORM_FIELDS.EMAIL}
                placeholder={LoginPage.PLACEHOLDERS.EMAIL}
                value={formData[LoginPage.FORM_FIELDS.EMAIL]}
                onChange={handleEmailChange}
                required
              />
              {emailError && <span className="text-danger">{emailError}</span>}
            </FormGroup>
            <FormGroup>
              <Col className="d-flex flex-row justify-content-between">
              <Label className="fw-semibold" for={LoginPage.FORM_FIELDS.PASSWORD}>
                {LoginPage.LABELS.PASSWORD}
              </Label>
              <Link to={LoginPage.ROUTES.FORGET_PASSWORD}  className="text-primary" >{LoginPage.LABELS.FORGET_PASSWORD}</Link>
              </Col>
              <Input
                type="password"
                name={LoginPage.FORM_FIELDS.PASSWORD}
                id={LoginPage.FORM_FIELDS.PASSWORD}
                placeholder={LoginPage.PLACEHOLDERS.PASSWORD}
                value={formData[LoginPage.FORM_FIELDS.PASSWORD]}
                onChange={handleChange}
                autoComplete="on"
                required
              />
            </FormGroup>
            <Button color="primary" className="w-25" block disabled={loading}>
            {loading ? <Spinner size="sm" color="light" /> : LoginPage.LABELS.LOGIN}
            </Button>
          </Form>
          <Col className="mt-3 text-center">
            {LoginPage.LABELS.MEMBER}{" "}
            <Link className="fw-bold" to={LoginPage.ROUTES.REGISTER}>
              {LoginPage.LABELS.ACCOUNT}
            </Link>
          </Col>

          <Col className="mt-3 text-center">
            {LoginPage.LABELS.WORKER_DESCRIPTION}{" "}
            <Link className="fw-bold" to={LoginPage.ROUTES.WORKER_REGISTER}>
              {LoginPage.LABELS.WORKER_DESCRIPTION2}
            </Link>
          </Col>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
