import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Row,
  Col,
  Card,
  CardBody,
  Spinner,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faTimes } from "@fortawesome/free-solid-svg-icons";
import UserNavbar from "../../Components/Navbar/UserNavbar";
import {
  fetchUsersDataAsync,
  updateProfileAsync,
} from "../../Redux/Slices/EditProfileSlice";
import { EDITPROFILE_PAGE, RegisterPage } from "../../Constants/Constants";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import Map from "../../Components/Map/Map";
import {
  failureToast,
  handleNameChange,
  hasOnlyWhiteSpace,
  infoToast,
  successToast,
  validateEmail,
} from "../../utils";
import { useNavigate } from "react-router-dom";
import CustomServiceDropdown from "../../Components/Services CheckList/CustomServicesDropdown";
import { allServicesAsync } from "../../Redux/Slices/AdminSlice";
import { set } from "lodash";
import { hideSpinner, showSpinner } from "../../Redux/Slices/LoaderSlice";
import {
  requestOTPforEmailAsync,
  requestOTPforPhoneAsync,
} from "../../Redux/Slices/AuthSlice";

const EditProfilePage = ({ ShowServices }) => {
  const { user, token } = useSelector((state) => state.auth);
  const { UsersData } = useSelector((state) => state.editProfile);
  const list = useSelector((state) => state?.admin?.services);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    // email: "",
    // phoneNumber: "",
    location: {},
    // latitude:"",
    // longitude:"",
    country: "",
    address: "",
    services: [],
  });
  const [phoneEdit, setPhoneEdit] = useState(false);
  const [newPhone, setNewPhone] = useState("");
  const [validnewPhone, setValidNewPhone] = useState(false);
  const [emailEdit, setEmailEdit] = useState(false);
  const [newMail, setNewMail] = useState("");
  const [disableUpdateEmail, setDisableUpdateEmail] = useState(true);
  const [disableUpdatePhone, setDisableUpdatePhone] = useState(true);
  const [newMailError, setNewMailError] = useState("");
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [userDataLoading, setUserDataLoading] = useState(true);
  const [UserInfo, setUserInfo] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");

  useEffect(() => {
    if (UsersData) {
      const isFormValid =
        // !errors.email &&
        // !errors.phone &&
        !hasOnlyWhiteSpace(formData?.address) &&
        !hasOnlyWhiteSpace(formData?.firstName) &&
        !hasOnlyWhiteSpace(formData?.lastName) &&
        (ShowServices ? formData.services.length > 0 : true);

      setIsSaveDisabled(!isFormValid);
    }
  }, [formData, errors.email, errors.phone]);

  useEffect(() => {
    if (user && user._id) {
      setUserDataLoading(true);
      dispatch(fetchUsersDataAsync({ id: user._id, token }))
        .then((result) => {
          const { _id, ...userDataWithoutId } = result.payload;
          setUserInfo(userDataWithoutId);
          setUserDataLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setUserDataLoading(false);
        });
    }
  }, [dispatch, user, token]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (ShowServices) {
          await dispatch(allServicesAsync());
        }
      } catch (error) {
        console.error("Error fetching services", error);
      } finally {
        setListLoading(false); // Set loading to false when the data is fetched or if there's an error
      }
    };

    fetchData();
  }, [dispatch, ShowServices]);

  // const handleEmailChange = (e) => {
  //   setErrors({ ...errors, email: "" });
  //   setFormData({
  //     ...formData,
  //     email: e.target.value,
  //   });
  // };

  // const handlePhoneChange = (value) => {
  //   setErrors({ ...errors, phone: "" });
  //   setFormData({
  //     ...formData,
  //     phoneNumber: value,
  //   });
  // };

  const handleServiceChange = (e) => {
    const selectedService = e.target.value;
    const serviceExists = formData.services.some(
      (service) => service.name === selectedService
    );

    const updatedServices = serviceExists
      ? formData.services.filter((service) => service.name !== selectedService)
      : [...formData.services, { name: selectedService, rate: 10 }];

    setFormData({
      ...formData,
      services: updatedServices,
    });
  };

  const handleRateChange = (e, serviceName) => {
    const value = parseFloat(e.target.value);
    const updatedServices = formData.services.map((service) =>
      service.name === serviceName ? { ...service, rate: value } : service
    );

    setFormData({
      ...formData,
      services: updatedServices,
    });
  };

  const FormValidation = (formData) => {
    const errors = {};
    // if (!validateEmail(formData.email)) {
    //   errors.email = RegisterPage.ERROR_MESSAGES.invalidEmail;
    // }
    // if (!formData.email.includes(".com")) {
    //   errors.email = RegisterPage.ERROR_MESSAGES.invalidEmail;
    // }

    // if (formData.phoneNumber && typeof formData.phoneNumber === "string") {
    //   isValidPhoneNumber(formData.phoneNumber)
    //     ? setErrors({ ...errors, phone: "" })
    //     : (errors.phone = RegisterPage.ERROR_MESSAGES.invalidPhoneNumber);
    // } else {
    //   errors.phone = RegisterPage.ERROR_MESSAGES.emptyPhone;
    // }

    if (ShowServices && formData.services.length === 0) {
      errors.services = RegisterPage.ERROR_MESSAGES.invalidService;
    }

    const areObjectsDifferent =
      UserInfo &&
      formData &&
      Object.keys(UserInfo).some((key) => {
        return formData[key] !== UserInfo[key];
      });
    if (!areObjectsDifferent) {
      errors.noChanges = "No Changes Made";
    }

    return errors;
  };
  const handleKeyPress = (e) => {
    // Check if the pressed key is "Enter" (key code 13)
    if (e.key === "Enter") {
      // Prevent the default form submission behavior
      e.preventDefault();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = FormValidation(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      if (validationErrors.noChanges) {
        infoToast(validationErrors.noChanges);
        setEditMode(false);
      }
      return; // Early return for validation errors
    }

    setLoading(true);

    try {
      const data = { id: UsersData?._id, token, formData };
      const result = await dispatch(updateProfileAsync(data));
      if (result.type === "/UpdateProfile/fulfilled") {
        console.log("result.payload", result.payload);
        const {
          firstName,
          lastName,
          // email,
          // phoneNumber,
          location,
          // latitude,
          // longitude,
          country,
          address,
          services,
        } = result.payload || {};
        successToast("Profile Updated Successfully!");
        setFormData({
          firstName,
          lastName,
          // email,
          // phoneNumber,
          location,
          // latitude,
          // longitude,
          country,
          address,
          services: services || [],
        });
        setEditMode(false);
      } else if (result.type === "/UpdateProfile/rejected") {
        failureToast(result.payload);
      }
    } catch (err) {
      console.log("Error updating profile:", err);
    } finally {
      setLoading(false);
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const validationErrors = FormValidation(formData);
  //   setErrors(validationErrors);

  //   try {
  //     if (Object.keys(validationErrors).length === 0) {
  //       setLoading(true);
  //       const data = { id: UsersData?._id, token, formData };
  //       const result = await dispatch(updateProfileAsync(data));

  //       if (result.type === "/UpdateProfile/fulfilled") {
  //         successToast("Profile Updated Successfully!");
  //         setFormData({
  //           firstName: UsersData?.firstName,
  //           lastName: result.payload?.lastName,
  //           email: result.payload?.email,
  //           phoneNumber: result.payload?.phoneNumber,
  //           latitude: result.payload?.latitude,
  //           longitude: result.payload?.longitude,
  //           country: result.payload?.country,
  //           address: result.payload?.address,
  //           services: result.payload?.services || [],
  //         });
  //         setEditMode(false);
  //       } else if (result.type === "/UpdateProfile/rejected") {
  //         failureToast(result.payload);
  //       }
  //     }
  //   } catch (err) {
  //     console.log("Error updating profile:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleEditModeToggle = () => {
    setEditMode(true);
    setFormData({
      firstName: UsersData?.firstName,
      lastName: UsersData?.lastName,
      // email: UsersData?.email,
      // phoneNumber: UsersData?.phoneNumber,
      location: UsersData?.location,
      // latitude: UsersData?.latitude,
      // longitude: UsersData?.longitude,
      country: UsersData?.country,
      address: UsersData?.address,
      services: UsersData?.services || [],
    });
  };

  const handleCancelEdit = () => {
    setFormData({
      firstName: UsersData?.firstName,
      lastName: UsersData?.lastName,
      // email: UsersData?.email,
      // phoneNumber: UsersData?.phoneNumber,
      location: UsersData?.location,
      // latitude: UsersData?.latitude,
      // longitude: UsersData?.longitude,
      country: UsersData?.country,
      address: UsersData?.address,
      services: UsersData?.services || [],
    });
    setEditMode(false);
  };

  const handleGoBack = () => {
    if (user?.role === "user") {
      navigate(EDITPROFILE_PAGE.ROUTES.BACK_USER);
    } else if (user?.role === "worker") {
      navigate(EDITPROFILE_PAGE.ROUTES.BACK_WORKER);
    }
  };

  const showEmailEdits = () => {
    setEmailEdit(true);
    setPhoneEdit(false);
  };
  const showPhoneEdits = () => {
    setEmailEdit(false);
    setPhoneEdit(true);
  };

  const toggleEditEmail = () => {
    setEmailEdit(!emailEdit);
  };

  const toggleEditPhone = () => {
    setPhoneEdit(!phoneEdit);
  };

  const requestOTP = async () => {
    //dispatch the api to send the otp
    const mail = UsersData?.email;
    const data = { mail, token, newMail };
    console.log(newMail);
    try {
      dispatch(showSpinner());
      const otpResp = await dispatch(requestOTPforEmailAsync(data));
      if (otpResp.type === "auth/requestOTPforEmailAsync/fulfilled") {
        console.log(otpResp, "response of otp[");
        if (
          otpResp?.payload?.data?.message ===
          "New Email already taken by someone else."
        ) {
          const msg = `${newMail} is already taken by someone else.`;
          setShowModal(false);
          return failureToast(msg);
        } else {
          successToast("OTP sent successfully!");
          setShowModal(false);
          user.role === "worker"
            ? navigate("/worker/otpVerification", {
                state: { email: UsersData.email, newMail: newMail },
              })
            : navigate("/user/otpVerification ", {
                state: { email: UsersData.email, newMail: newMail },
              });
        }
      }
    } catch (error) {
      console.log(error);
      failureToast("Error sending OTP");
    } finally {
      dispatch(hideSpinner());
      setDisableUpdateEmail(false);
    }
  };

  const requestOTPforPhone = async () => {
    //dispatch the api to send the otp
    setDisableUpdatePhone(false);
    const mail = UsersData?.email;
    const data = { mail, token, newPhone };
    console.log(newPhone);
    try {
      dispatch(showSpinner());
      const otpResp = await dispatch(requestOTPforPhoneAsync(data));
      if (otpResp.type === "auth/requestOTPforPhoneAsync/fulfilled") {
        if (
          otpResp?.payload?.data?.message ===
          "New Phone already taken by someone else."
        ) {
          const msg = `${newPhone} is already taken by someone else.`;
          setShowModal(false);
          return failureToast(msg);
        } else {
          console.log(otpResp, "response of otp for phone");
          successToast("OTP sent successfully!");
          setShowModal(false);
          user.role === "worker"
            ? navigate("/worker/otpVerification", {
                state: { email: UsersData.email, newPhone: newPhone },
              })
            : navigate("/user/otpVerification ", {
                state: { email: UsersData.email, newPhone: newPhone },
              });
        }
      } else if (otpResp.type === "auth/requestOTPforPhoneAsync/rejected") {
        failureToast(otpResp.payload.error); // Display the error message
      }
    } catch (error) {
      failureToast(error);
    } finally {
      dispatch(hideSpinner());
      setDisableUpdatePhone(true);
    }
  };

  const updatePhone = () => {
    toggleEditPhone();
    setModalContent("Test: Wait while you are being redirected...");
    console.log("Before setShowModal(true):", showModal);
    setShowModal(true);
    requestOTPforPhone();
  };

  const handleChange = (e) => {
    const enteredEmail = e.target.value;

    setNewMail(enteredEmail);
    //    Email validation regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Check if entered email matches the regex
    const isValid = emailRegex.test(enteredEmail);
    setNewMailError(isValid);
    console.log(isValid);
    setDisableUpdateEmail(!isValid);
    if (!newMail.trim()) {
      // If newMail is empty or contains only whitespaces, do not dispatch the request
      setDisableUpdateEmail(true);
      return;
    }
  };

  const updateEmail = () => {
    toggleEditEmail();
    if (disableUpdateEmail || !newMail.trim()) {
      // If newMail is empty or contains only whitespaces, do not dispatch the request
      setDisableUpdateEmail(true);
      return;
    }
    setModalContent("Test: Wait while you are being redirected...");
    console.log("Before setShowModal(true):", showModal);
    setShowModal(true);
    requestOTP();
  };

  const handlePhoneChange = (value) => {
    setValidNewPhone(true);
    setNewPhone(value);
    if (!isValidPhoneNumber(value)) {
      setValidNewPhone(false);
      setDisableUpdatePhone(true);
    } else {
      setDisableUpdatePhone(false);
    }
  };

  return (
    <>
      <UserNavbar />
      <Container className="d-flex justify-content-center mt-5 vh-100">
        <Container>
          <Row className="d-flex flex-row  align-items-center">
            {" "}
            {!editMode && (
              <Col xs={2} md={1} className="text-start">
                <Button color="danger" onClick={handleGoBack}>
                  <FontAwesomeIcon icon={faArrowLeft} />
                </Button>
              </Col>
            )}
            <Col className="fw-bold fs-3">{EDITPROFILE_PAGE.LABELS.TITLE}</Col>
          </Row>
          {userDataLoading ? (
            <div className="d-flex justify-content-center">
              <Spinner color="primary" />
            </div>
          ) : (
            <Row>
              {editMode ? (
                <Form
                  className="mt-5"
                  onSubmit={handleSubmit}
                  onKeyDown={handleKeyPress}
                >
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label className="fw-semibold" for="firstName">
                          {RegisterPage.LABELS.FIRST_NAME}
                        </Label>
                        <Input
                          type={RegisterPage.INPUT_FIELDS.FIRST_NAME.type}
                          name={RegisterPage.INPUT_FIELDS.FIRST_NAME.name}
                          id={RegisterPage.INPUT_FIELDS.FIRST_NAME.name}
                          placeholder={
                            RegisterPage.INPUT_FIELDS.FIRST_NAME.placeholder
                          }
                          maxLength={12}
                          required
                          value={formData.firstName}
                          onChange={(e) =>
                            handleNameChange(
                              formData,
                              setFormData,
                              setErrors,
                              errors,
                              "firstName",
                              e
                            )
                          }
                        />{" "}
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label className="fw-semibold" for="lastName">
                          {RegisterPage.LABELS.LAST_NAME}
                        </Label>
                        <Input
                          type={RegisterPage.INPUT_FIELDS.LAST_NAME.type}
                          name={RegisterPage.INPUT_FIELDS.LAST_NAME.name}
                          id={RegisterPage.INPUT_FIELDS.LAST_NAME.name}
                          placeholder={
                            RegisterPage.INPUT_FIELDS.LAST_NAME.placeholder
                          }
                          maxLength={12}
                          required
                          value={formData.lastName}
                          onChange={(e) =>
                            handleNameChange(
                              formData,
                              setFormData,
                              setErrors,
                              errors,
                              "lastName",
                              e
                            )
                          }
                        />{" "}
                      </FormGroup>
                    </Col>
                  </Row>
                  {/*   <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label className="fw-semibold" for="email">
                          {RegisterPage.LABELS.EMAIL}
                        </Label>
                        <Input
                          type={RegisterPage.INPUT_FIELDS.EMAIL.name}
                          name={RegisterPage.INPUT_FIELDS.EMAIL.name}
                          id={RegisterPage.INPUT_FIELDS.EMAIL.name}
                          placeholder={
                            RegisterPage.INPUT_FIELDS.EMAIL.placeholder
                          }
                          disabled="true"
                          maxLength={70}
                          value={formData.email}
                          onChange={handleEmailChange}
                          onKeyDown={(event) => {
                            if (event.key === " ") {
                              event.preventDefault();
                            }
                          }}
                        />
                        {errors.email && (
                          <span className="text-danger">{errors.email}</span>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label className="fw-semibold" for="phoneNumber">
                          {RegisterPage.LABELS.PHONE}
                        </Label>
                        <PhoneInput
                          defaultCountry="PK"
                          id={RegisterPage.INPUT_FIELDS.PHONE.name}
                          placeholder={
                            RegisterPage.INPUT_FIELDS.PHONE.placeholder
                          }
                          disabled="true"
                          maxLength={20}
                          required
                          value={formData.phoneNumber}
                          onChange={handlePhoneChange}
                          international
                          countryCallingCodeEditable={false}
                        />
                        {errors.phone && (
                          <span className="text-danger">{errors.phone}</span>
                        )}
                      </FormGroup>
                    </Col>
                  </Row>*/}
                  {ShowServices && (
                    <>
                      <Row className="my-4">
                        <Label className="fw-semibold">
                          {RegisterPage.LABELS.SERVICES}
                        </Label>
                        <Col
                          md={12}
                          className="d-flex flex-row Service-overflow-y-scroll"
                        >
                          <FormGroup className="w-100">
                            {listLoading && ShowServices ? (
                              <div className="text-center w-100">
                                <Spinner />
                                <p>
                                  {
                                    RegisterPage.LOADER_MESSAGES
                                      .SERVICES_LOADING
                                  }
                                </p>
                              </div>
                            ) : (
                              <CustomServiceDropdown
                                list={list}
                                selectedServices={formData?.services}
                                handleServiceChange={handleServiceChange}
                                handleRateChange={handleRateChange}
                              />
                            )}
                          </FormGroup>
                        </Col>
                      </Row>
                    </>
                  )}
                  <Row>
                    <Col>
                      <FormGroup>
                        <Label className="fw-semibold" for="address">
                          {RegisterPage.LABELS.ADDRESS}
                        </Label>
                        {editMode && (
                          // Render map only when in edit mode
                          <Map
                            setFormData={setFormData}
                            formData={formData}
                            editMode={editMode}
                            setErrors={setErrors}
                            errors={errors}
                          />
                        )}
                      </FormGroup>
                    </Col>
                  </Row>
                  <Button
                    type="submit"
                    color="primary"
                    disabled={isSaveDisabled || loading}
                    className="me-2"
                  >
                    {loading ? (
                      <Spinner size="sm" color="light" />
                    ) : (
                      <>{EDITPROFILE_PAGE.BUTTONS.SAVE}</>
                    )}
                  </Button>
                  <Button
                    color="danger"
                    onClick={handleCancelEdit}
                    disabled={loading}
                  >
                    <FontAwesomeIcon icon={faTimes} />{" "}
                    {EDITPROFILE_PAGE.BUTTONS.CANCEL}
                  </Button>
                </Form>
              ) : (
                <Card
                  className="my-4"
                  style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
                >
                  <CardBody>
                    <Row>
                      <Col xs={6}>
                        <p className="fw-semibold">
                          {EDITPROFILE_PAGE.CARD_LABELS.FIRST_NAME}
                        </p>
                        <p className="w-100">{UsersData?.firstName}</p>
                      </Col>
                      <Col xs={6}>
                        <p className="fw-semibold">
                          {EDITPROFILE_PAGE.CARD_LABELS.LAST_NAME}
                        </p>
                        <p className="w-100">{UsersData?.lastName}</p>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={6}>
                        <p className="fw-semibold">
                          {EDITPROFILE_PAGE.CARD_LABELS.EMAIL}
                        </p>
                        {emailEdit ? (
                          <>
                            <Input
                              id="exampleEmail"
                              name="email"
                              placeholder="Enter the new email"
                              type="email"
                              value={newMail}
                              onChange={handleChange}
                              style={{
                                fontSize: "1rem",
                                border: `1px solid`,
                                borderRadius: "5px",
                              }}
                            />
                          </>
                        ) : (
                          <>
                            <p className="w-100">{UsersData?.email}</p>
                          </>
                        )}
                        {emailEdit ? (
                          <>
                            <Row className="mt-1">
                              <Col>
                                {" "}
                                <Button
                                  disabled={disableUpdateEmail}
                                  onClick={updateEmail}
                                  color="success"
                                >
                                  Update
                                </Button>
                              </Col>
                              <Col>
                                <Button
                                  onClick={toggleEditEmail}
                                  color="danger"
                                >
                                  Cancel Edit
                                </Button>
                              </Col>
                            </Row>
                          </>
                        ) : (
                          <>
                            <Button onClick={showEmailEdits} color="primary">
                              Edit
                            </Button>
                          </>
                        )}
                      </Col>
                      <Col xs={6}>
                        <p className="fw-semibold">
                          {EDITPROFILE_PAGE.CARD_LABELS.PHONE}
                        </p>
                        {/* Inside the Phone section in the render */}
                        {phoneEdit ? (
                          <>
                            <PhoneInput
                              id="examplephone"
                              name="phone"
                              defaultCountry="PK"
                              placeholder="Enter the new phone"
                              type="text"
                              international
                              countryCallingCodeEditable={false}
                              onChange={handlePhoneChange}
                            />
                          </>
                        ) : (
                          <>
                            <p className="w-100">{UsersData?.phoneNumber}</p>
                          </>
                        )}
                        {phoneEdit ? (
                          <>
                            <Row className="mt-1">
                              <Col>
                                <Button
                                  disabled={
                                    !validnewPhone || disableUpdatePhone
                                  }
                                  onClick={updatePhone}
                                  color="success"
                                >
                                  Update
                                </Button>
                              </Col>
                              <Col>
                                <Button
                                  onClick={toggleEditPhone}
                                  color="danger"
                                >
                                  Cancel Edit
                                </Button>
                              </Col>
                            </Row>
                          </>
                        ) : (
                          <>
                            <Button onClick={showPhoneEdits} color="primary">
                              Edit
                            </Button>
                          </>
                        )}
                      </Col>
                    </Row>
                    <Row>
                      {ShowServices && (
                        <Col>
                          <p className="fw-semibold">
                            {EDITPROFILE_PAGE.CARD_LABELS.SERVICES}
                          </p>
                          <ol>
                            {UsersData?.services?.map((service) => (
                              <li className="pb-2" key={service.name}>
                                {service.name} - {service.rate}{" "}
                                {EDITPROFILE_PAGE.CARD_LABELS.RATE}
                              </li>
                            ))}
                          </ol>
                        </Col>
                      )}
                      <Col>
                        <p className="fw-semibold">
                          {EDITPROFILE_PAGE.CARD_LABELS.ADDRESS}
                        </p>
                        <p className="w-100">{UsersData?.address}</p>
                      </Col>
                    </Row>
                    {/* ${edit ?"d-none" :""} */}
                    <Button color={`primary`} onClick={handleEditModeToggle}>
                      {EDITPROFILE_PAGE.BUTTONS.EDIT}
                    </Button>
                  </CardBody>
                </Card>
              )}
            </Row>
          )}
          <Modal
            isOpen={showModal}
            toggle={() => setShowModal(!showModal)}
            keyboard={false}
            backdrop="static"
            centered
          >
            <ModalHeader>Popup Title</ModalHeader>
            <ModalBody>
              <p>{modalContent}</p>
            </ModalBody>
          </Modal>
        </Container>
      </Container>
    </>
  );
};

export default EditProfilePage;
