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
import { newpasswordConstants } from "../../Constants/Constants";
import resetpasswordpng from "../../assets/images/NewPasswordpngs/resetpassword.png";
import confirmpassword from "../../assets/images/NewPasswordpngs/confirmpassword.png";
import otppng from "../../assets/images/NewPasswordpngs/securedata.png";
import { failureToast, successToast } from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import {
  requestOTPverification,
  setNewPassAsync,
} from "../../Redux/Slices/AuthSlice";

const NewPassword = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const email = location?.state?.email;
  const [OTP, setOTP] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [notEqualError, setNotEqualError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const [otpVerified, setOtpVerified] = useState(false);
  const [saveClicked, setSaveClicked] = useState(false);
  const [disabledOTP, setDisabledOTP] = useState(false);
  const { otpStatus } = useSelector((state) => state?.auth);
  const [otpVisible, setOtpVisible] = useState(false);
  const [showPassPlaceholder, setShowPassPlaceHolder] = useState(false);
  const [showConfPassPlaceholer,setShowConfPassPlaceholer] = useState(false)

  useEffect(() => {
    if (otpStatus === "succeeded") {
    } else {
      navigate("/auth/login");
    }
  }, [otpStatus]);

  useEffect(() => {
    if (newPassword !== confirmNewPassword) {
      setNotEqualError("Both Passwords must match");
    } else {
      setNotEqualError(null);
    }
  }, [newPassword, confirmNewPassword]);

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setNewPassword(password);
  };

  const handleConfirmNewPassword = (e) => {
    setConfirmNewPassword(e.target.value);
  };

  const verifyOTPSENT = async (e) => {
    //send the otp to the backend for the confirmation to reset the password

    e.preventDefault();
    try {
      setDisabledOTP(true);
      const resp = await dispatch(requestOTPverification(OTP));
      if (resp.payload === 200) {
        successToast("OTP verified, Enter new Password");
        setOtpVerified(true);
      } else {
        failureToast("Invalid OTP");
      }
    } catch (error) {
      failureToast("Invalid OTP");
    } finally {
      setDisabledOTP(false);
    }
  };

  const saveNewPassword = async (e) => {
    e.preventDefault();
    setSaveClicked(true);
    const passwordPattern = /^(?=.*[!@#$%^&*?])(?=.*[A-Z])(?=.*[0-9]).{8,}$/;
    if (!newPassword.match(passwordPattern)) {
      failureToast(
        "Password must contain at least one special character, one uppercase letter, one number, and be at least 8 characters long."
      );
      return; // Stop execution if validation fails
    }
    try {
      if (email && newPassword === confirmNewPassword) {
        const data = { email, newPassword };
        const resp = dispatch(setNewPassAsync(data));
        successToast("Password Reset Successful!");
        navigate("/auth/login");
      }
    } catch (error) {
      failureToast("OTP expired");
    }
  };

  return (
    <>
      <Container
        style={{
          backgroundColor: "#f0f0f0",
          marginTop: "5%",
          textAlign: "center",
          borderRadius: "10px",
        }}
      >
        <Row style={{ padding: "4%" }}>
          <Col xs="auto">
            <Button
              onClick={() => navigate(-1)}
              style={{ zIndex: "100" }}
              color="danger"
            >
              Back
            </Button>
          </Col>
        </Row>

        <>
          <Row>
            <Col>
              <Row
                style={{
                  marginTop: "3%",
                }}
              >
                {!otpVerified ? (
                  <>
                    <Col xs="auto" className="mx-auto">
                      <h3>{newpasswordConstants.NP_CONSTANTS.NP_HEADING}</h3>
                    </Col>
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
                            {
                              newpasswordConstants.NP_CONSTANTS
                                .PROVIDE_OTP_LABEL
                            }
                          </Label>
                          <InputGroup>
                            <InputGroupText>
                              <img src={otppng} alt="otppng" />
                            </InputGroupText>
                            <Input
                              style={{ textAlign: "center" }}
                              id="otp"
                              name="otp"
                              placeholder={otpVisible ? "" : "****"}
                              type="text"
                              value={OTP}
                              onFocus={() => setOtpVisible(true)}
                              onBlur={() => setOtpVisible(false)}
                              onChange={(e) => setOTP(e.target.value)}
                            />
                          </InputGroup>
                        </Col>
                      </Row>
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
                            disabled={!OTP || OTP.trim() === "" || disabledOTP}
                            style={{ marginTop: "2%" }}
                          >
                            {newpasswordConstants.NP_CONSTANTS.VERIFYOTP}
                          </Button>
                        </Col>
                      </Row>
                    </FormGroup>
                  </>
                ) : (
                  <>
                    {/* if the otp is not verified it will not be shown*/}
                    <Col xs="auto" className="mx-auto">
                      <h3>
                        {newpasswordConstants.NP_CONSTANTS.ADD_NEW_PASS_HEADING}
                      </h3>
                    </Col>
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
                                  {
                                    newpasswordConstants.NP_CONSTANTS
                                      .NEWPASSWORD
                                  }
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
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    id="password"
                                    onFocus={() => setShowPassPlaceHolder(true)}
                                    onBlur={() => setShowPassPlaceHolder(false)}
                                    placeholder={showPassPlaceholder ? "" : newpasswordConstants.NP_CONSTANTS
                                    .PASSWORD_PH}
                                    value={newPassword}
                                    onChange={handlePasswordChange}
                                  />
                                  <InputGroupText>
                                    <Button
                                      color=""
                                      onClick={() =>
                                        setShowPassword(!showPassword)
                                      }
                                      style={{
                                        border: "none",
                                        background: "none",
                                      }}
                                    >
                                      {showPassword ? "Hide" : "Show"}
                                    </Button>
                                  </InputGroupText>
                                </InputGroup>
                                <br></br>
                                <Label
                                  className="fw-semibold"
                                  for="confirmNewPassword"
                                >
                                  {
                                    newpasswordConstants.NP_CONSTANTS
                                      .CONFIRMPASSWORD
                                  }
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
                                    type={
                                      showConfirmPassword ? "text" : "password"
                                    }
                                    id="confirmNewPassword"
                                    name="confirmNewPassword"
                                    onFocus={() => setShowConfPassPlaceholer(true)}
                                    onBlur={() => setShowConfPassPlaceholer(false)}
                                    placeholder={showConfPassPlaceholer ? "" : newpasswordConstants.NP_CONSTANTS
                                    .CONFIRMPASSWORD_PH
                                    .PASSWORD_PH}
                                    value={confirmNewPassword}
                                    onChange={handleConfirmNewPassword}
                                  />
                                  <InputGroupText>
                                    <Button
                                      color=""
                                      onClick={() =>
                                        setShowConfirmPassword(
                                          !showConfirmPassword
                                        )
                                      }
                                      style={{
                                        border: "none",
                                        background: "none",
                                      }}
                                    >
                                      {showConfirmPassword ? "Hide" : "Show"}
                                    </Button>
                                  </InputGroupText>
                                </InputGroup>
                                {notEqualError && saveClicked && (
                                  <span className="text-danger">
                                    {notEqualError}
                                  </span>
                                )}
                              </Col>
                            </Row>
                          </FormGroup>
                          <Button onClick={saveNewPassword} color="success">
                            {newpasswordConstants.NP_CONSTANTS.SAVEBUTTON}
                          </Button>
                        </Form>
                      </Col>
                    </Row>
                  </>
                )}
              </Row>
            </Col>
          </Row>
        </>
      </Container>
    </>
  );
};

export default NewPassword;
