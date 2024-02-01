import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Input, Button, Container, Row, Col } from "reactstrap";
import { failureToast, successToast } from "../../utils";
import { changeEmail, changePhone } from "../../Redux/Slices/AuthSlice";
import { useDispatch, useSelector } from "react-redux";

const OTPVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const [otpVisible, setOtpVisible] = useState(false);
  const [disabledOTP, setDisabledOTP] = useState(false);
  const email = location?.state?.email;
  const newMail = location?.state?.newMail;
  const newPhone = location?.state?.newPhone;
  console.log(newMail)
  console.log(newPhone)

  const [otp, setOtp] = useState("");

  const handleChange = (e) => {
    setOtp(e.target.value);
  };

  const verifyandChange = async() => {
    if(newMail === undefined) {
      VerifyOTPandChangePhone();
    }
    else if(newPhone === undefined)
    {
      VerifyOTPandChangeMail();
    }
  }
  const VerifyOTPandChangePhone = async () => {
    // Implement the logic to verify OTP here
    if (!/^[0-9]+$/.test(otp)) {
        failureToast(`OTP must be a valid non-decimal number!`);
        return;
    }
    else if(otp.length > 4)
    {
        failureToast(`OTP must be a 4 digit number!`);
        return;   
    }

    setDisabledOTP(true);
    console.log(newPhone);
    let data = { newPhone, otp ,token};
    console.log("Verifying OTP:", data);

    try {
      const resp = await dispatch(changePhone(data));
      console.log(resp, "response");
      if (resp.type === "auth/otpverifyPhone/fulfilled") {
        if (resp.payload === undefined) {
          console.log(resp, "response on fail");
          failureToast("Phone was not changed!");
        } else {
          console.log(resp, "response on success");
          successToast("Phone changed!");
          user.role === "worker"
          ? navigate("/worker/editprofile")
          : navigate("/user/editprofile ");
        }
      }
    } catch (error) {
      failureToast("Invalid OTP");
    } finally {
      setDisabledOTP(false);
    }
  };

  const VerifyOTPandChangeMail = async () => {
    // Implement the logic to verify OTP here
    if (!/^[0-9]+$/.test(otp)) {
        failureToast(`OTP must be a valid non-decimal number!`);
        return;
    }
    else if(otp.length > 4)
    {
        failureToast(`OTP must be a 4 digit number!`);
        return;   
    }

    setDisabledOTP(true);
    console.log(newMail);
    let data = { newMail, otp ,token};
    console.log("Verifying OTP:", data);

    try {
      const resp = await dispatch(changeEmail(data));
      console.log(resp, "response");
      if (resp.type === "auth/otpverifyEmail/fulfilled") {
        if (resp.payload === undefined) {
          console.log(resp, "response on fail");
          failureToast("email did not changed!");
        } else {
          console.log(resp, "response on success");
          successToast("email changed!");
          user.role === "worker"
          ? navigate("/worker/editprofile")
          : navigate("/user/editprofile ");
        }
      }
    } catch (error) {
      failureToast("Invalid OTP");
    } finally {
      setDisabledOTP(false);
    }
  };

  return (
    <div>
      <div className="pt-4">
        <Button onClick={() => navigate(-1)} className="" color="danger">
          Back
        </Button>
      </div>
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Row>
          <Col md={6} className="mx-auto text-start">
            <h2 className="text-center mb-4">OTP Verification</h2>
            <div className="text-center mb-4">Email is sent to: {email}</div>
            <Input
              type="text"
              placeholder={otpVisible ? "" : "****"}
              value={otp}
              onFocus={() => setOtpVisible(true)}
              onBlur={() => setOtpVisible(false)}
              onChange={handleChange}
              className="mb-3 text-center"
            />
            <Button
              color="primary"
              className="mb-3 text-center"
              onClick={verifyandChange}
              disabled={disabledOTP}
            >
              Verify OTP
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default OTPVerification;
