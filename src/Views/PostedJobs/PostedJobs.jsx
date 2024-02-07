import React from "react";
import { Button, Col, Container, Input, Row } from "reactstrap";

const PostedJobs = () => {
  return (
    <div>
      <Container>
       
        <Row>
          <Col></Col>
          <Col>
            <Button color="primary">Post a new job </Button>
          </Col>
          <Col></Col>
        </Row>
        <Row>
          <Col></Col>
          <Col>
            {" "}
            <h1>Posted Jobs</h1>
          </Col>
          <Col></Col>
        </Row>
      </Container>
    </div>
  );
};

export default PostedJobs;
