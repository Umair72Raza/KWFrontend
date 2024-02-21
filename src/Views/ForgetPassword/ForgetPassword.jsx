import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  FormGroup,
  Input,
  Button,
  Container,
  Row,
  Col,
  Spinner,
} from "reactstrap";
import forgotpng from "../../assets/images/ForgetPasswordpng/forgot.png";
import { failureToast, successToast } from "../../utils";
import {
  requestOTPAsync,
  updateOtpStatus,
} from "../../Redux/Slices/AuthSlice.js";
import { useDispatch } from "react-redux";
import {
  FORGET_PASSWORD,
  forgetPasswordConstants,
} from "../../Constants/Constants.js";
import { hideSpinner, showSpinner } from "../../Redux/Slices/LoaderSlice.js";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [enableButton, setEnableButton] = useState(false);
  const [disableBack, setDisableBack] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const enteredEmail = e.target.value;
    setEmail(enteredEmail);
    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Check if entered email matches the regex
    const isValid = emailRegex.test(enteredEmail);
    setIsValidEmail(isValid);
    setEnableButton(isValid);
  };

  const requestOTP = async () => {
    //dispatch the api to send the otp
    setEnableButton(false);
    setDisableBack(true);
    setIsLoading(true);
    try {
      dispatch(showSpinner());
      const otpResp = await dispatch(requestOTPAsync(email));
      if (otpResp.type === "auth/requestOTPAsync/fulfilled") {
        console.log(otpResp, "otprespo");
        if (otpResp.payload.data && otpResp.payload.status) {
          navigate("/auth/newpassword", { state: { email: email } });
          successToast("OTP sent successfully!");
        } else {
          failureToast("Email not registered");
        }
      }
    } catch (error) {
      failureToast("Error sending OTP");
    } finally {
      setIsLoading(false);
      setDisableBack(false);
      dispatch(hideSpinner());
    }
  };

  return (
    <Container>
      <Row style={{ marginTop: "50px !important" }}>
        <Col>
          <Form
            style={{
              marginTop: "10%",
              padding: "2%",
              background: "#f5f5f5",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <FormGroup>
              <Row>
                <Col style={{ textAlign: "center", marginBottom: "20px" }}>
                  <Row>
                    <Col xs={12} md={12} lg={6} xl={4}>
                      <img
                        src={forgotpng}
                        alt="forgotpng"
                        style={{ height: "250px" }}
                      />
                    </Col>

                    <Col style={{ marginTop: "5%" }}>
                      <h4 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                        {forgetPasswordConstants.FP_FIELDS.EMAIL}
                        <br />
                        {forgetPasswordConstants.FP_FIELDS.MSG}
                      </h4>
                      <Input
                        id="exampleEmail"
                        name="email"
                        placeholder={forgetPasswordConstants.FP_FIELDS.EG_MAIL}
                        type="email"
                        onChange={handleChange}
                        style={{
                          fontSize: "1rem",
                          padding: "10px",
                          border: `1px solid ${isValidEmail ? "#ccc" : "red"}`,
                          borderRadius: "5px",
                          width: "70%",
                          marginTop: "5%",
                          marginLeft: "15%",
                        }}
                      />
                      {!isValidEmail && (
                        <div style={{ color: "red", marginTop: "5px" }}>
                          Please enter a valid email address.
                        </div>
                      )}
                    </Col>
                  </Row>
                </Col>
              </Row>
            </FormGroup>
            <Row style={{ textAlign: "center" }}>
              <Col style={{ marginLeft: "30%" }}>
                <Button
                  style={{ marginRight: "3%" }}
                  color="danger"
                  onClick={() => navigate(-1)}
                  disabled={disableBack}
                >
                  Back
                </Button>

                <Button
                  disabled={!enableButton}
                  onClick={requestOTP}
                  color="primary"
                >
                  {isLoading ? (
                    <>
                      <Button color="primary" size="sm">
                        <Spinner />
                      </Button>{" "}
                    </>
                  ) : (
                    <>
                      <div>{FORGET_PASSWORD.SEND_OTP_BUTTON}</div>
                    </>
                  )}
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ForgetPassword;
