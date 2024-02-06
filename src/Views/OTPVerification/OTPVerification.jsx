import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Input, Button, Container, Row, Col } from "reactstrap";
import { failureToast, successToast } from "../../utils";
import { changeEmail, changePhone } from "../../Redux/Slices/AuthSlice";
import { useDispatch, useSelector } from "react-redux";

const OTPVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token,signupOTP } = useSelector((state) => state.auth);
  const [otpVisible, setOtpVisible] = useState(false);
  const [disabledOTP, setDisabledOTP] = useState(false);
  const email = location?.state?.email;
  const newMail = location?.state?.newMail;
  const newPhone = location?.state?.newPhone;

  useEffect(()=>{
    if(!email)
    {
      if(user.role==="worker")
      {
        navigate('/worker/homepage')
      }
      else if (user.role==="user")
      {
        navigate("/user/homepage")
      }
      
    }

  },[email])

  const [otp, setOtp] = useState("");

  const handleChange = (e) => {
    const inputValue = e.target.value.replace(
      /\D/g,
      ""
    ); // Remove non-numeric characters
    setOtp(inputValue);
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

  const VerifyOTPandCreateAccount = async () => {
    // Validate OTP
    if (!/^\d{4}$/.test(otp)) {
      failureToast("OTP must be a valid 4-digit number!");
      return;
    }
  
    // Check OTP
    if (signupOTP !== otp) {
      failureToast("Invalid OTP");
      return;
    }
  
    // Disable OTP input during sign-up process
    setDisabledOTP(true);
  
    try {
      const result = await dispatch(signUpUserAsync(formData));
  
      if (result.type === "auth/signup/fulfilled") {
        console.log("Sign up successful!", formData);
  
        // Display success message
        const successMessage = ShowServices
          ? RegisterPage.SUCCESS_MESSAGES.WORKER_SIGNUP
          : RegisterPage.SUCCESS_MESSAGES.USER_SIGNUP;
  
        successToast(successMessage);
  
        // Navigate to login page after successful signup
        navigate("/auth/login");
      } else if (result.type === "auth/signup/rejected") {
        // Display error message if signup is rejected
        failureToast(result.payload);
      }
    } catch (error) {
      // Display error message if an error occurs during signup process
      failureToast("An error occurred while signing up");
    } finally {
      // Re-enable OTP input
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
              maxLength={4} // Restrict input to maximum 4 characters
              pattern="\d*" // Only allow digits
              onPaste={(e) => {
                e.preventDefault();
                const pastedText =
                  e.clipboardData.getData("text/plain");
                const numericValue = pastedText.replace(
                  /\D/g,
                  ""
                ); // Remove non-numeric characters
                document.execCommand(
                  "insertText",
                  false,
                  numericValue
                );
                setOtp(numericValue);
              }}
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
