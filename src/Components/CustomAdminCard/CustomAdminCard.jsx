import React from 'react';
import { Card, CardBody, CardImg, CardTitle, Button, Row } from 'reactstrap';

const CustomAdminCard = ({ logoSrc, title, buttonText, buttonColor, onClickHandler }) => {
  return (
    <Card className="shadow" style={{ backgroundColor: "#f6f8fc" }}>
      <CardBody>
        <Row>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          </div>
        </Row>
        <CardImg src={logoSrc} alt="Logo" style={{ height: "250px", marginRight: "10px" }} />
        <CardTitle tag="h5" style={{ marginTop: "4%", textAlign: "center" }}>
          {title}
        </CardTitle>

        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Button color={buttonColor} onClick={onClickHandler}>
            {buttonText}
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default CustomAdminCard;
