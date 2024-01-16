import React from "react";
import { Input, Label, FormGroup, Col, Row } from "reactstrap";

const CustomServiceDropdown = ({
  list,
  selectedServices,
  handleServiceChange,
  handleRateChange,
}) => {
    const [rateError, setRateError] = React.useState("");
 
const handleInputKeyDown = (e) => {
    const keyCode = e.which || e.keyCode;
  
    // Allow only numeric values and backspace/delete
    if ((keyCode < 48 || keyCode > 57) && keyCode !== 8 && keyCode !== 46) {
      e.preventDefault();
    }
  };
      const handleInputBlur = (e, serviceName) => {
        let { value } = e.target;
        value = parseFloat(value);
    
        // Check if the value is less than 10 and reset it to 10
        if (value < 10 || isNaN(value)) {
          value = 10;
        }
    
        handleRateChange({ target: { value } }, serviceName);
      };
    


    
  return (
    <div>
      {list?.length > 0 &&
        list.map((service) => (
          <FormGroup key={service._id} check>
            <Row className="align-items-center">
              <Col xs="auto">
                <Input
                  type="checkbox"
                  value={service.name}
                  checked={selectedServices.some((s) => s.name === service.name)}
                  onChange={handleServiceChange}
                />
              </Col>
              <Col>
                <Label check className="ml-2">
                  {service.name}
                </Label>
              </Col>
              {selectedServices.some((s) => s.name === service.name) && (
                <Col xs="auto" className="ml-2 d-flex flex-row">
                
                  <Input
                    type="number"
                    min="10"
                    placeholder={`Rate ($/hr)`}
                    value={
                      selectedServices.find((s) => s.name === service.name)?.rate || ""
                    }
                    onChange={(e) => handleRateChange(e, service.name)}
                    onBlur={(e) => handleInputBlur(e, service.name)}
                    onKeyDown={handleInputKeyDown}
                  />
                    <span className="align-self-center" >($/hr)</span>
                </Col>
              )}
            </Row>
          </FormGroup>
        ))}
    </div>
  );
};

export default CustomServiceDropdown;
