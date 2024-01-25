import React from "react";
import {
  Button,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";

const ModalComponent = (props) => {
  const {
    modalHeader,
    isFinalize,
    isModalOpen,
    toggleModal,
    inputLabel,
    modalInputValue,
    modalInputSetter,
    finalizeFunction,
    cancelButtonLabel,
    finalizeButtonLabel,
    showInput,
    cancel,
    order,
  } = props;

  return (
    <Modal
      isOpen={isModalOpen}
      toggle={toggleModal}
      centered
      backdrop="static"
      keyboard={false}

    >
      <ModalHeader toggle={toggleModal}>{modalHeader}</ModalHeader>
      <ModalBody style={{ maxHeight: "200px", overflowY: "auto" }}>

        {order && (
          <>
            <div>
              <strong>Order Title:</strong> {order.Title}
            </div>
            <div>
              <strong>Service:</strong> {order.service}
            </div>
            <div>
              <strong>Amount:</strong> {order.amount}
            </div>
            <div>
              <strong>Order Details:</strong>{" "}
              {order.details.replace(/<br\s*\/?>/g, "\n")}
            </div>

          </>
        )}

        {showInput && (
          <Form>
            <FormGroup>
              <Label for="cancelReason">{inputLabel}</Label>
              <Input
                type="text"
                id="cancelReason"
                placeholder="Enter reason"
                value={modalInputValue}
                onChange={(e) => modalInputSetter(e.target.value)}
              />
            </FormGroup>
          </Form>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={cancel}>
          {cancelButtonLabel}
        </Button>
        <Button
          color={isFinalize ? "success" : "danger"}
          onClick={finalizeFunction}
        >
          {finalizeButtonLabel}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ModalComponent;
