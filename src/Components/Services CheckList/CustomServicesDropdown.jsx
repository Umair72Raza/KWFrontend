import React from "react";
import { Input, Label, FormGroup, Col, Row } from "reactstrap";
import { RegisterPage } from "../../Constants/Constants";

const CustomServiceDropdown = ({
  list,
  selectedServices,
  handleServiceChange,
  handleRateChange,
  errors,
  loading

}) => {
  const handleInputKeyDown = (e) => {
    const keyCode = e.which || e.keyCode;

    // Allow only numeric values, backspace/delete, and numpad keys
    if (
      (keyCode < 48 || keyCode > 57) && // Allow only numeric values
      (keyCode < 96 || keyCode > 105) && // Allow numpad keys
      keyCode !== 8 &&
      keyCode !== 46 // Allow backspace/delete
    ) {
      e.preventDefault();
    }
  };

  return (
    <div className="List-Width">
    {list?.length > 0 ? (
      list.map((service) => (
        <FormGroup key={service?._id} check>
          <Row className="align-items-center">
            <Col xs="auto">
              <Label check>
                <Input
                style={{ border: "1px solid #000000" }}
                  type="checkbox"
                  value={service?.name}
                  checked={selectedServices?.some(
                    (s) => s?.name === service?.name
                  )}
                  onChange={handleServiceChange}
                  disabled={
                     loading ||
                    selectedServices.length >= 5 &&
                    !selectedServices.some((s) => s?.name === service?.name )
                  }
                />
              </Label>
            </Col>
            <Col>
              <Label check className="ml-2 my-1">
                {service?.name}
              </Label>
            </Col>
            {selectedServices?.some((s) => s?.name === service?.name) && (
              <Col lg={6} className="d-flex flex-column">
              <Col className="ml-2 mt-1 d-flex flex-row align-self-end">
                <Input
                 invalid={errors && errors[service?.name] ? true : false}
                  type="number"
                  min="10"
                  max="999"
                  title="Rate must be a number greater than or equal to 10"
                  required
                  placeholder={RegisterPage.INPUT_FIELDS.SERVICES.rate}
                  value={
                    selectedServices?.find((s) => s?.name === service?.name)
                      ?.rate || ""
                  }
                  onChange={(e) => handleRateChange(e, service?.name)}
                  onKeyDown={handleInputKeyDown}
                  disabled={loading}
                  style={{ height: "25px", width:"100px" }}
                />
                <span className="align-self-center fw-bold">{RegisterPage.INPUT_FIELDS.SERVICES.rate}</span>
                </Col>
                {errors && errors[service?.name] && (
                  <span className="text-danger text-end fw-medium">{errors[service?.name]}</span>
                )}
              </Col>
            )}
          </Row>
        </FormGroup>
      ))
    ) : (
      <div>{RegisterPage.LOADER_MESSAGES.LIST_NOT_AVAILABLE}</div>
    )}
  </div>
);
};


export default CustomServiceDropdown;
