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

  const [isEditingNotification, setIsEditingNotification] = useState(false);
  const [isEditingScheduledOrder, setIsEditingScheduledOrder] = useState(false);
  const [isEditingRadius, setIsEditingRadius] = useState(false);

//   const checkValidation = (valids) => {
//     const { newValue, upperLimit, lowerLimit, name, units } = valids;
//     let capitalized = capitalizeFirstLetter(name);
//     if (newValue > upperLimit) {
//       failureToast(
//         `${capitalized} cannot be more than ${upperLimit} ${units}!`
//       );
//       return false;
//     } else if (newValue < lowerLimit) {
//       failureToast(
//         `${capitalized} cannot be less than ${lowerLimit} ${units}!`
//       );
//       return false;
//     } else if (isNaN(newValue)) {
//       failureToast(`${capitalized} must be a valid number!`);
//       return false;
//     }
//     return true;
//   };

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
      failureToast(`${capitalized} cannot be more than ${upperLimit} ${units}!`);
      return false;
    } else if (numericValue < lowerLimit) {
      failureToast(`${capitalized} cannot be less than ${lowerLimit} ${units}!`);
      return false;
    }
  
    return true;
  };
  

  useEffect(() => {
    const getAllSettings = async () => {
      const data = { token: token };
      const result = await dispatch(getSettings(data));
      if (result?.type === "/admin/getSettings/fulfilled") {
        console.log("Success", result?.payload);
        setNotificationTimeLimit(result?.payload?.notificationsLife);
        setScheduledOrderOffset(result?.payload?.scheduleOffestTime);
        setRadius(result?.payload?.radius);
      }
      dispatch(hideSpinner());
    };
    dispatch(showSpinner());
    getAllSettings();
  }, []);

  const handleUpdateNotification = () => {
    // Perform validation here if needed
    // Update the state and set editing to false
    const name = "Notifications Time Limit";
    const units = "minutes";
    const upperLimit = 10;
    const lowerLimit = 5;
    const propertyName = "notificationsLife";
    const newValue = notificationTimeLimit;
    const valids = { newValue, name, upperLimit, lowerLimit, units };
    const validated = checkValidation(valids);
    if (validated === false) {
      return;
    }
    const updateNotificationLimit = async () => {
      const data = { propertyName, newValue, token };
      const resp = await dispatch(updateSettingsAsync(data));
      if (resp.type === "/admin/updateSettings/fulfilled") {
        console.log(resp, "payload in the uppdate notifications");
        successToast("Notifications time limit updated successfully")
      }
    };
    updateNotificationLimit();
    setIsEditingNotification(false);
  };

  const handleUpdateScheduledOrder = () => {
    const name = "Scheduled Order Offset Time";
    const units = "minutes";
    const upperLimit = 60;
    const lowerLimit = 30;
    const propertyName = "scheduleOffestTime";
    const newValue = scheduledOrderOffset;
    const valids = { newValue, name, upperLimit, lowerLimit, units };
    const validated = checkValidation(valids);
    if (validated === false) {
      return;
    }
    const updateScheduledOrdersOffset = async () => {
      const data = { propertyName, newValue, token };
      const resp = await dispatch(updateSettingsAsync(data));
      if (resp.type === "/admin/updateSettings/fulfilled") {
        console.log(resp, "payload in the uppdate scheduled");
        successToast("Scheduled orders offset updated successfully")
      }
    };
    updateScheduledOrdersOffset();
    setIsEditingScheduledOrder(false);
  };

  const handleUpdateRadius = () => {
    const propertyName = "radius";
    const name = "Radius";
    const newValue = radius;
    const units = "Kms";
    const upperLimit = 50;
    const lowerLimit = 10;
    const valids = { newValue, name, upperLimit, lowerLimit, units };
    const validated = checkValidation(valids);
    if (validated === false) {
      return;
    }
    const updateRadius = async () => {
      const data = { propertyName, newValue, token };
      const resp = await dispatch(updateSettingsAsync(data));
      if (resp.type === "/admin/updateSettings/fulfilled") {
        console.log(resp, "payload in the uppdate radius");
        successToast("Radius updated successfully")
      }
    };
    updateRadius();
    setIsEditingRadius(false);
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
                            value={notificationTimeLimit}
                            onChange={(e) =>
                              setNotificationTimeLimit(e.target.value)
                            }
                            className=""
                          />
                          <Button
                            color="success"
                            onClick={handleUpdateNotification}
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
                            onClick={() => setIsEditingNotification(true)}
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
                            value={scheduledOrderOffset}
                            onChange={(e) =>
                              setScheduledOrderOffset(e.target.value)
                            }
                            className=" "
                          />
                          <Button
                            color="success"
                            onClick={handleUpdateScheduledOrder}
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
                            onClick={() => setIsEditingScheduledOrder(true)}
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
                            value={radius}
                            onChange={(e) => setRadius(e.target.value)}
                            className=" "
                          />
                          <Button color="success" onClick={handleUpdateRadius}>
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
                            onClick={() => setIsEditingRadius(true)}
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
