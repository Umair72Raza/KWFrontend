import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { Button, Card, CardBody, Col, Container, Input, Row } from 'reactstrap';
import { RegisterPage } from '../../Constants/Constants';
import { failureToast, successToast } from '../../utils';
import { signUpUserAsync } from '../../Redux/Slices/AuthSlice';

const SignUpOtpVerify = ({formData,setFormData}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [otpVisible, setOtpVisible] = useState(false);
    const [disabledOTP, setDisabledOTP] = useState(false);
    const [otp, setOtp] = useState("");
    const { signupOTP } = useSelector((state) => state.auth);


    const handleChange = (e) => {
        setOtp(e.target.value);
      };
console.log(signupOTP,"opt")
      const VerifyOTPandCreateAccount = async () => {
        // Validate OTP
        if (!/^\d{4}$/.test(otp)) {
          failureToast("OTP must be a valid 4-digit number!");
          return;
        }
      
        // Check OTP
        if (signupOTP != otp) {
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
    <div className="vh-100 d-flex justify-content-center align-items-center">
      <Container>
        <Row>
          <Col md={12} className="mx-auto">
            <Card>
              <CardBody className='d-flex flex-column'>
                <h2 className="text-center mb-4">OTP Verification</h2>
                <div className="text-center mb-4">Email is sent to:<span className=' fw-semibold' >{formData?.email}</span></div>
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
                  onClick={VerifyOTPandCreateAccount}
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
  )
}

export default SignUpOtpVerify