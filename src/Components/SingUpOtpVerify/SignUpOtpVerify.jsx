import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { Button, Card, CardBody, Col, Container, Input, Row } from "reactstrap";
import { RegisterPage } from "../../Constants/Constants";
import { failureToast, successToast } from "../../utils";
import {
  changeEmailStatus,
  signUpUserAsync,
} from "../../Redux/Slices/AuthSlice";
import { jwtDecode } from "jwt-decode";

const SignUpOtpVerify = ({ formData, setFormData }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [otpVisible, setOtpVisible] = useState(false);
  const [disabledOTP, setDisabledOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const [decodedData, setDecodedData] = useState("");

  const { encrptedEmail } = useParams();

 useEffect(() => {
    const handleRedirectToLogin = () => {
      navigate(RegisterPage.ROUTES.LOGIN);
    };

    const decodeAndRedirect = () => {
      try {
        const decodedEmail = jwtDecode(encrptedEmail);
        if (!decodedEmail) {
          handleRedirectToLogin();
          return;
        }
        setDecodedData(decodedEmail);
      } catch (error) {
        console.error("Error decoding token:", error.message);
        handleRedirectToLogin();
      }
    };

    if (!encrptedEmail) {
      handleRedirectToLogin();
      return;
    }

    decodeAndRedirect();
  }, [encrptedEmail, navigate]);
  
  if (!decodedData) {
    return null; // Do not render the component if decoded email does not exist
  }
  const handleChange = (e) => {
    setOtp(e.target.value);
  };

  const VerifyOTP = async () => {
    // Validate OTP
    if (!/^\d{4}$/.test(otp)) {
      failureToast("OTP must be a valid 4-digit number!");
      return;
    }

    // Check OTP
    if (decodedData.otp != otp) {
      failureToast("Invalid OTP");
      return;
    }

    // Disable OTP input during sign-up process
    setDisabledOTP(true);

    try {
      const email = decodedData.email;
      console.log(email, "email");

      dispatch(changeEmailStatus({ email })).then((result) => {
        if (result.type === "auth/changeEmailStatus/fulfilled") {
          successToast("Email verified successfully.");
          navigate(RegisterPage.ROUTES.LOGIN);
        }
      });
    } catch (error) {
      // Display error message if an error occurs during signup process
      failureToast(
        "An error occurred during email verification! Please try again."
      );
    } finally {
      // Re-enable OTP input
      setDisabledOTP(false);
    }
  };

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center">
      <Container>
        <Row>
          <Col md={12} className="mx-auto">
            <Card>
              <CardBody className="d-flex flex-column">
                <h2 className="text-center mb-4">OTP Verification</h2>
                <div className="text-center mb-4">
                  Email is sent to:<span className=" fw-semibold"></span>
                </div>
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
                />
                <Button
                  color="primary"
                  className="mb-3 text-center align-self-center"
                  onClick={VerifyOTP}
                  disabled={disabledOTP}
                >
                  Verify OTP
                </Button>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SignUpOtpVerify;
