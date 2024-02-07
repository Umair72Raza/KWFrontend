import React, { useState } from "react";
import { Button, Col, Container, Input, Row } from "reactstrap";
import Booking from "../../Components/booking popup/booking";

const PostedJobs = () => {
    const [modal,setModal] = useState(false);
    const [fromPostJob,setPostJob] = useState(true)
    const toggleModal =() => {
        setModal(!modal)
    }
  return (
    <div>
      <Container>
        <Row>
          <Col>
            <Button onClick={()=>setModal(true)} color="primary">Post an open job </Button>
          </Col>
        </Row>
        <Booking
        modal={modal}
        toggle={toggleModal}
        fromPostJob={fromPostJob}
      />
      </Container>
    </div>
  );
};

export default PostedJobs;
