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
} from "reactstrap";
import forgotpng from "../../assets/images/ForgetPasswordpng/forgot.png";
import { failureToast, successToast } from "../../utils";
import {
  requestOTPAsync,
  updateOtpStatus,
} from "../../Redux/Slices/AuthSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { FORGET_PASSWORD } from "../../Constants/Constants.js";

const ForgetPassword = () => {
  // useEffect(() => {
  //   dispatch(updateOtpStatus("idle"));
  // });
  const stateotp = useSelector((state) => state.auth.otp);
  const otpStatus = useSelector((state) => state.auth.otpStatus);
  
  // useEffect(() => {
  //   //as soon as email is sent, the user will b navigated to the newpassword page
  //   // where he/she can verify otp and add a new password
  //   if (otpStatus === "suceeded") {
  //     successToast(FP_FIELDS.FP_TOAST_MSG);
  //     navigate(FORGET_ROUTES.NEW_PASSWORD, { state: { email: email } });
  //   }
  // }, [otpStatus, stateotp]);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  // State to store the email value
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [enableButton, setEnableButton] = useState(false);

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
    try {
      console.log("I ran in send otp")
      console.log("Data to requets otp", email)
      const otpResp = await dispatch(requestOTPAsync(email));
      console.log(otpResp.type, "otp resp type")
      if (otpResp.type === "auth/requestOTPAsync/fulfilled" ) {
        console.log("I ran in disaptch success")
        navigate("/auth/newpassword", { state: { email: email } });
      }
    } catch (error) {
      failureToast("Error sending OTP");
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
              <Col style={{marginLeft:"30%"}}>
              <Button style={{marginRight:"3%"}} color="danger" onClick={()=>navigate(-1)} >
                Back
              </Button>
                <Button
                  disabled={!enableButton}
                  onClick={requestOTP}
                  color="primary"
                >
                  {FORGET_PASSWORD.SEND_OTP_BUTTON}
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
