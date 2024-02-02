import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

const BlockPopUp = ({ isOpen, toggle,toggleAccess, onConfirm, person }) => {
  const newAccess = person?.access === "accepted" ? "Blocked" : "Unblocked";

  const handleConfirm = async () => {
    await onConfirm();
    await toggleAccess();
    toggle();
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>Confirmation</ModalHeader>
      <ModalBody>
        {`${person?.firstName} will be ${newAccess}. Are you sure?`}
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
        <Button color="primary" onClick={handleConfirm}>
          Confirm
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default BlockPopUp;
