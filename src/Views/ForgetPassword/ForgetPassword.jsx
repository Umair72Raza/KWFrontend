/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  Form,
  FormGroup,
  Input,
  Button,
  Label,
  FormText,
  Container,
  Row,
  Col,
} from "reactstrap";
import forgotpng from "../../assets/images/ForgetPasswordpng/forgot.png";
import { FORGET_ROUTES, FP_FIELDS } from "./constants";
import { failureToast, successToast } from "../../utils";
import { requestOTPAsync,updateOtpStatus } from "../../Redux/Slices/AuthSlice.js";
import { useDispatch, useSelector } from "react-redux";

const ForgetPassword = () => {
  useEffect(() => {
    dispatch(updateOtpStatus("idle"));
  });
  const stateotp = useSelector((state) => state.auth.otp);
  const otpStatus = useSelector((state) => state.auth.otpStatus);
  useEffect(() => {
    //as soon as email is sent, the user will b navigated to the newpassword page
    // where he/she can verify otp and add a new password
    if (otpStatus === "suceeded") {
      successToast(FP_FIELDS.FP_TOAST_MSG);
      navigate(FORGET_ROUTES.NEW_PASSWORD, { state: { email: email } });
    }
  }, [otpStatus, stateotp]);

  // State to store the email value
  const [email, setEmail] = useState("");
  const [enableButton, setEnableButton] = useState(false);

  // Handle change function to update the email state
  const handleChange = (e) => {
    setEnableButton(true);
    setEmail(e.target.value);
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const requestOTP = async () => {
    //dispatch the api to send the otp
    try {
      dispatch(requestOTPAsync(email));
      if (otpStatus === "suceeded") {
        navigate(FORGET_ROUTES.NEW_PASSWORD, { state: { email: email } });
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
                        {FP_FIELDS.EMAIL}
                        <br />
                        {FP_FIELDS.MSG}
                      </h4>
                      <Input
                        id="exampleEmail"
                        name="email"
                        placeholder={FP_FIELDS.EG_MAIL}
                        type="email"
                        onChange={handleChange}
                        style={{
                          fontSize: "1rem",
                          padding: "10px",
                          border: "1px solid #ccc",
                          borderRadius: "5px",
                          width: "70%",
                          marginTop: "5%",
                          marginLeft: "15%",
                        }}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </FormGroup>
            <Row style={{ textAlign: "center" }}>
              <Col>
                <Button
                  disabled={!enableButton}
                  onClick={requestOTP}
                  color="primary"
                >
                  Send OTP
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
