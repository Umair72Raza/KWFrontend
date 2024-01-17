/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupText,
  Label,
  Row,
} from "reactstrap";
import { OTPverify, newPasswordSetter } from "../../APIs/auth";
import { NP_CONSTANTS } from "./constants";
import resetpasswordpng from "../../assets/images/NewPasswordpngs/resetpassword.png";
import confirmpassword from "../../assets/images/NewPasswordpngs/confirmpassword.png";
import otppng from "../../assets/images/NewPasswordpngs/securedata.png";
import { failureToast, successToast } from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import { requestOTPverification, setNewPassAsync } from "../../Redux/Slices/userSlice";
const NewPassword = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const email = location.state.email;
  // console.log(email);
  const [OTP, setOTP] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState(null);
  const [notEqualError, setNotEqualError] = useState(null);
  const navigate = useNavigate();
  const [otpVerified, setOtpVerified] = useState(false);

  const resetOTP = useSelector((state)=>state.auth.resetOtp)
  const newpass = useSelector((state)=>state.auth.newpass)
  //console.log(resetOTP);
  console.log(newpass)
    
  useEffect(()=>{
    if(newpass===200){
      successToast("Password Changed Successfully!")
      navigate("/auth/login");
    }
  },[newpass])

  useEffect(() => {
    if (newPassword !== confirmNewPassword) {
      setNotEqualError("Both Passwords must match");
    } else {
      setNotEqualError(null);
    }
  }, [newPassword, confirmNewPassword]);

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    // Password regex pattern: Requires at least one special character, one uppercase character, and one number
    const passwordPattern = /^(?=.*[!@#$%^&*?])(?=.*[A-Z])(?=.*[0-9]).{8,}$/;

    if (!password.match(passwordPattern)) {
      setPasswordError(
        "Password must contain at least one special character, one uppercase letter, one number, and be at least 8 characters long."
      );
    } else {
      setPasswordError("");
    }
    setNewPassword(password);
  };

  const handleConfirmNewPassword = (e) => {
    setConfirmNewPassword(e.target.value);
  };

  const verifyOTPSENT = async (e) => {
    //send the otp to the backend for the confirmation to reset the password

    e.preventDefault();
    try {
      dispatch(requestOTPverification(OTP))
      successToast("OTP verified, Enter new Password")
      setOtpVerified(true)
    } catch (error) {
      failureToast("Inavlid OTP");
    }
  };

  const saveNewPassword = async (e) => {
    e.preventDefault();
    const data = {email,newPassword}

    try {
      dispatch(setNewPassAsync(data));

    } catch (error) {
      failureToast("OTP expired");
    }
  };

  return (
      <Container
        style={{
          backgroundColor: "#f0f0f0",
          marginTop: "5%",
          textAlign: "center",
          borderRadius: "10px",
        }}
      >
        <h3>{NP_CONSTANTS.NP_HEADING}</h3>

        <>
          <Row>
            <Col>
              <Form
                style={{
                  marginTop: "3%",
                }}
              >
                {!otpVerified ? (
                  <>
                    <FormGroup>
                      <Row>
                        <Col
                          style={{ textAlign: "center" }}
                          md={{
                            offset: 3,
                            size: 6,
                          }}
                        >
                          {" "}
                          <Label for="otp">
                            {NP_CONSTANTS.PROVIDE_OTP_LABEL}
                          </Label>
                          <InputGroup>
                            <InputGroupText>
                              <img src={otppng} alt="otppng" />
                            </InputGroupText>
                            <Input
                              style={{ textAlign: "center" }}
                              id="otp"
                              name="otp"
                              placeholder="****"
                              type="text"
                              onChange={(e) => setOTP(e.target.value)}
                            />
                          </InputGroup>
                        </Col>
                      </Row>
                    </FormGroup>
                    <Row style={{ textAlign: "center" }}>
                      <Col
                        md={{
                          offset: 3,
                          size: 6,
                        }}
                      >
                        {" "}
                        <Button
                          onClick={verifyOTPSENT}
                          color="success"
                          disabled={notEqualError}
                        >
                          {NP_CONSTANTS.VERIFYOTP}
                        </Button>
                      </Col>
                    </Row>
                  </>
                ) : (
                  <>
                    {/* if the otp is not verified it will not be shown*/}
                    <Row style={{ marginTop: "0px !important" }}>
                      <Col>
                        <Form
                          style={{
                            marginTop: "2%",
                            padding: "2%",
                          }}
                        >
                          <FormGroup>
                            <Row>
                              <Col
                                style={{ textAlign: "center" }}
                                md={{
                                  offset: 3,
                                  size: 6,
                                }}
                              >
                                {" "}
                                <Label className="fw-semibold" for="password">
                                  {NP_CONSTANTS.NEWPASSWORD}
                                </Label>
                                <InputGroup>
                                  <InputGroupText addonType="prepend">
                                    <img
                                      src={resetpasswordpng}
                                      alt="newpswrd"
                                    />
                                  </InputGroupText>
                                  <Input
                                    style={{ textAlign: "center" }}
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder={NP_CONSTANTS.PASSWORD_PH}
                                    value={newPassword}
                                    onChange={handlePasswordChange}
                                  />
                                </InputGroup>
                                {passwordError && (
                                  <span className="text-danger">
                                    {passwordError}
                                  </span>
                                )}
                                <br></br>
                                <Label
                                  className="fw-semibold"
                                  for="confirmNewPassword"
                                >
                                  {NP_CONSTANTS.CONFIRMPASSWORD}
                                </Label>
                                <InputGroup>
                                  <InputGroupText>
                                    <img
                                      src={confirmpassword}
                                      alt="confirmpswrd"
                                    />
                                  </InputGroupText>
                                  <Input
                                    style={{ textAlign: "center" }}
                                    type="password"
                                    id="confirmNewPassword"
                                    name="confirmNewPassword"
                                    placeholder={
                                      NP_CONSTANTS.CONFIRMPASSWORD_PH
                                    }
                                    value={confirmNewPassword}
                                    onChange={handleConfirmNewPassword}
                                  />
                                </InputGroup>
                                {notEqualError && (
                                  <span className="text-danger">
                                    {notEqualError}
                                  </span>
                                )}
                              </Col>
                            </Row>
                          </FormGroup>
                          <Button
                            onClick={saveNewPassword}
                            color="success"
                            disabled={notEqualError}
                          >
                            {NP_CONSTANTS.SAVEBUTTON}
                          </Button>
                        </Form>
                      </Col>
                    </Row>
                  </>
                )}
              </Form>
            </Col>
          </Row>
        </>
      </Container>
  );
};

export default NewPassword;
