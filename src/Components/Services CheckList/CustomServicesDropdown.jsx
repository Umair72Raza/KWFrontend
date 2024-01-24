import React from "react";
import { Input, Label, FormGroup, Col, Row } from "reactstrap";

const CustomServiceDropdown = ({
  list,
  selectedServices,
  handleServiceChange,
  handleRateChange,
}) => {
  const handleInputKeyDown = (e) => {
    const keyCode = e.which || e.keyCode;

    // Allow only numeric values and backspace/delete
    if ((keyCode < 48 || keyCode > 57) && keyCode !== 8 && keyCode !== 46) {
      e.preventDefault();
    }
  };

  return (
    <div>
      {list?.length > 0 ? (
        list.map((service) => (
          <FormGroup key={service?._id} check>
            <Row className="align-items-center">
              <Col xs="auto">
                <Input
                  type="checkbox"
                  value={service?.name}
                  checked={selectedServices?.some((s) => s?.name === service?.name)}
                  onChange={handleServiceChange}
                />
              </Col>
              <Col>
                <Label check className="ml-2 my-1">
                  {service?.name}
                </Label>
              </Col>
              {selectedServices?.some((s) => s?.name === service?.name) && (
                <Col xs="auto" className="ml-2 d-flex flex-row">
                  <Input
                    type="number"
                    min="10"
                    required
                    placeholder={`Rate ($/hr)`}
                    value={
                      selectedServices?.find((s) => s?.name === service?.name)?.rate || ""
                    }
                    onChange={(e) => handleRateChange(e, service?.name)}
                    onKeyDown={handleInputKeyDown}
                    style={{ height: "25px" }}
                  />
                  <span className="align-self-center fw-bold">($/hr)</span>
                </Col>
              )}
            </Row>
          </FormGroup>
        ))
      ) : (
        <div>No services listed by admin yet.</div>
      )}
    </div>
  );
};

export default CustomServiceDropdown;
