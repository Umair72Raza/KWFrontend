import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Input,
  Col,
  Row,
  FormGroup,
  Label,
  Container,
  Spinner,
} from "reactstrap";
import {
  getSettings,
  updateSettingsAsync,
} from "../../Redux/Slices/AdminSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  hideSpinner,
  selectSpinnerVisibility,
  showSpinner,
} from "../../Redux/Slices/LoaderSlice";
import { capitalizeFirstLetter, failureToast, successToast } from "../../utils";

const Settings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state?.auth);
  const spinnerVisible = useSelector(selectSpinnerVisibility);
  const [notificationTimeLimit, setNotificationTimeLimit] = useState();
  const [scheduledOrderOffset, setScheduledOrderOffset] = useState();
  const [radius, setRadius] = useState();

  const [newNotificationsLimit, setNewNotificationsLimit] = useState();
  const [newScheduledOrderOffset, setNewScheduledOrderOffset] = useState();
  const [newRadius, setNewRadius] = useState();

  const [disableNotificationsButton, setDisableNotificationsButton] =
    useState(false);
  const [disableSchOrderButton, setDisableSchOrderButton] = useState(false);
  const [disableRadiusButton, setDisableRadiusButton] = useState(false);

  const [isEditingNotification, setIsEditingNotification] = useState(false);
  const [isEditingScheduledOrder, setIsEditingScheduledOrder] = useState(false);
  const [isEditingRadius, setIsEditingRadius] = useState(false);

  const checkValidation = (valids) => {
    const { newValue, upperLimit, lowerLimit, name, units } = valids;
    let capitalized = capitalizeFirstLetter(name);

    // Check if the newValue is a valid number and doesn't contain the '+' operator
    if (!/^[0-9]+$/.test(newValue)) {
      failureToast(`${capitalized} must be a valid non-decimal number!`);
      return false;
    }

    // Convert newValue to a number
    const numericValue = Number(newValue);

    // Check the range
    if (numericValue > upperLimit) {
      failureToast(
        `${capitalized} cannot be more than ${upperLimit} ${units}!`
      );
      return false;
    } else if (numericValue < lowerLimit) {
      failureToast(
        `${capitalized} cannot be less than ${lowerLimit} ${units}!`
      );
      return false;
    }

    return true;
  };

  useEffect(() => {
    const getAllSettings = async () => {
      const data = { token: token };
      const result = await dispatch(getSettings(data));
      if (result?.type === "/admin/getSettings/fulfilled") {
    
        setNotificationTimeLimit(result?.payload?.notificationsLife);
        setScheduledOrderOffset(result?.payload?.scheduleOffestTime);
        setRadius(result?.payload?.radius);
      }
      dispatch(hideSpinner());
    };
    dispatch(showSpinner());
    getAllSettings();
  }, []);

  const handleUpdateNotification = async () => {
    // Perform validation here if needed
    // Update the state and set editing to false
    setDisableNotificationsButton(true);
    const name = "Notifications Time Limit";
    const units = "minutes";
    const upperLimit = 10;
    const lowerLimit = 5;
    const propertyName = "notificationsLife";
    const newValue = newNotificationsLimit;
    const valids = { newValue, name, upperLimit, lowerLimit, units };
    const validated = checkValidation(valids);

    try {
      if (validated === false) {
        // Handle validation failure
        setDisableNotificationsButton(false);
        return;
      }

      const updateNotificationLimit = async () => {
        const data = { propertyName, newValue, token };

        try {
          const resp = await dispatch(updateSettingsAsync(data));

          if (resp.type === "/admin/updateSettings/fulfilled") {
    
            successToast("Notifications time limit updated successfully");
            setNotificationTimeLimit(resp.payload.notificationsLife);
            setDisableNotificationsButton(false);
          }
        } catch (error) {
          // Handle dispatch error
          console.error("Error updating notification limit:", error);
          // Optionally, you can show an error toast or handle the error in another way
        }
      };

      await updateNotificationLimit();
      setIsEditingNotification(false);
    } catch (error) {
      // Handle validation error
      console.error("Validation error:", error);
      // Optionally, you can show an error toast or handle the error in another way
    }
  };

  const handleUpdateScheduledOrder = async () => {
    setDisableSchOrderButton(true);
    const name = "Scheduled Order Offset Time";
    const units = "minutes";
    const upperLimit = 60;
    const lowerLimit = 30;
    const propertyName = "scheduleOffestTime";
    const newValue = newScheduledOrderOffset;
    const valids = { newValue, name, upperLimit, lowerLimit, units };
    const validated = checkValidation(valids);

    try {
      if (validated === false) {
        // Handle validation failure
        setDisableSchOrderButton(false);
        return;
      }

      const updateScheduledOrdersOffset = async () => {
        const data = { propertyName, newValue, token };

        try {
          const resp = await dispatch(updateSettingsAsync(data));

          if (resp.type === "/admin/updateSettings/fulfilled") {
          
            successToast("Scheduled orders offset updated successfully");
            setScheduledOrderOffset(resp.payload.scheduleOffestTime);
            setDisableSchOrderButton(false);
          }
        } catch (error) {
          // Handle dispatch error
          console.error("Error updating scheduled orders offset:", error);
          // Optionally, you can show an error toast or handle the error in another way
        }
      };

      await updateScheduledOrdersOffset();
      setIsEditingScheduledOrder(false);
    } catch (error) {
      // Handle validation error
      setIsEditingScheduledOrder(false);
      console.error("Validation error:", error);
      // Optionally, you can show an error toast or handle the error in another way
    }
  };

  const handleUpdateRadius = async () => {
    setDisableRadiusButton(true);
    const propertyName = "radius";
    const name = "Radius";
    const newValue = newRadius;
    const units = "Kms";
    const upperLimit = 50;
    const lowerLimit = 10;
    const valids = { newValue, name, upperLimit, lowerLimit, units };
    const validated = checkValidation(valids);

    try {
      if (validated === false) {
        // Handle validation failure
        setDisableRadiusButton(false);
        return;
      }

      const updateRadius = async () => {
        const data = { propertyName, newValue, token };

        try {
          const resp = await dispatch(updateSettingsAsync(data));

          if (resp.type === "/admin/updateSettings/fulfilled") {
         
            successToast("Radius updated successfully");
            setRadius(resp.payload.radius);
            setDisableRadiusButton(false);
          }
        } catch (error) {
          // Handle dispatch error
          console.error("Error updating radius:", error);

          // Optionally, you can show an error toast or handle the error in another way
        }
      };

      await updateRadius();
      setIsEditingRadius(false);
    } catch (error) {
      // Handle validation error
      console.error("Validation error:", error);
      setDisableRadiusButton(false);
      setIsEditingRadius(false);
      // Optionally, you can show an error toast or handle the error in another way
    }
  };

  const handleCancelNotification = () => {
    // Set editing to false without updating the state
    setIsEditingNotification(false);
  };

  const handleCancelScheduledOrder = () => {
    // Set editing to false without updating the state
    setIsEditingScheduledOrder(false);
  };

  const handleCancelRadius = () => {
    // Set editing to false without updating the state
    setIsEditingRadius(false);
  };

  const handleEditSchOffset = () => {
    setIsEditingRadius(false);
    setIsEditingScheduledOrder(true);
    setIsEditingNotification(false);
  };

  const handleEditNotifiTime = () => {
    setIsEditingRadius(false);
    setIsEditingScheduledOrder(false);
    setIsEditingNotification(true);
  };

  const handleEditRadius = () => {
    setIsEditingScheduledOrder(false);
    setIsEditingNotification(false);
    setIsEditingRadius(true);
  };

  return (
    <>
      <Container fluid>
        <Row className="d-flex justify-content-between m-1">
          <Col>
            <Button onClick={() => navigate(-1)}>Back</Button>
          </Col>
          <Col className="text-center ">
            <h1>Settings</h1>
          </Col>
          <Col></Col>
        </Row>
      </Container>

      {spinnerVisible ? (
        <>
          <Spinner />
        </>
      ) : (
        <>
          <div className="settings-container mt-2">
            <div>
              <Row>
                <Col>
                  <FormGroup>
                    <Label for="notificationTimeLimit">
                      Notification Time Limit:
                    </Label>
                    <div className="d-flex align-items-center text-center">
                      {isEditingNotification ? (
                        <>
                          <Input
                            type="text"
                            id="notificationTimeLimit"
                            value={newNotificationsLimit}
                            onChange={(e) => {
                              const inputValue = e.target.value.replace(
                                /\D/g,
                                ""
                              ); // Remove non-numeric characters
                              setNewNotificationsLimit(inputValue);
                            }}
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
                              setNewNotificationsLimit(numericValue);
                            }}
                            className=""
                            pattern="\d*"
                            maxLength={3}
                          />

                          <Button
                            color="success"
                            onClick={handleUpdateNotification}
                            disabled={disableNotificationsButton}
                          >
                            Update
                          </Button>
                          <Button
                            color="danger"
                            className=" "
                            onClick={handleCancelNotification}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <div className="">
                            {notificationTimeLimit} minutes
                          </div>
                          <Button
                            color="primary"
                            style={{ marginLeft: "3%" }}
                            onClick={handleEditNotifiTime}
                          >
                            Edit
                          </Button>
                        </>
                      )}
                    </div>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <FormGroup>
                    <Label for="scheduledOrderOffset">
                      Scheduled Order Offset Time:
                    </Label>
                    <div className="d-flex align-items-center">
                      {isEditingScheduledOrder ? (
                        <>
                          <Input
                            type="text"
                            id="scheduledOrderOffset"
                            value={newScheduledOrderOffset}
                            onChange={(e) => {
                              const inputValue = e.target.value.replace(
                                /\D/g,
                                ""
                              ); // Remove non-numeric characters
                              setNewScheduledOrderOffset(inputValue);
                            }}
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
                              setNewScheduledOrderOffset(numericValue);
                            }}
                            className=" "
                            pattern="\d*"
                            maxLength={2}
                          />
                          <Button
                            color="success"
                            onClick={handleUpdateScheduledOrder}
                            disabled={disableSchOrderButton}
                          >
                            Update
                          </Button>
                          <Button
                            color="danger"
                            className=" "
                            onClick={handleCancelScheduledOrder}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <div>{scheduledOrderOffset} minutes</div>
                          <Button
                            color="primary"
                            style={{ marginLeft: "3%" }}
                            onClick={handleEditSchOffset}
                          >
                            Edit
                          </Button>
                        </>
                      )}
                    </div>
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col>
                  <FormGroup>
                    <Label for="radius">Radius of Vicinity Distance:</Label>
                    <div className="d-flex align-items-center">
                      {isEditingRadius ? (
                        <>
                          <Input
                            type="text"
                            id="radius"
                            value={newRadius}
                            onChange={(e) => {
                              const inputValue = e.target.value.replace(
                                /\D/g,
                                ""
                              ); // Remove non-numeric characters
                              setNewRadius(inputValue);
                            }}
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
                              setNewRadius(numericValue);
                            }}
                            className=""
                            pattern="\d*"
                            maxLength={2}
                          />

                          <Button
                            color="success"
                            onClick={handleUpdateRadius}
                            disabled={disableRadiusButton}
                          >
                            Update
                          </Button>
                          <Button
                            color="danger"
                            className=" "
                            onClick={handleCancelRadius}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <div className=" ">{radius} Kms</div>
                          <Button
                            color="primary"
                            style={{ marginLeft: "17%" }}
                            onClick={handleEditRadius}
                          >
                            Edit
                          </Button>
                        </>
                      )}
                    </div>
                  </FormGroup>
                </Col>
              </Row>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Settings;
