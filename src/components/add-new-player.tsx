import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { StyledInput } from "../common/styles";

function useInput(defaultValue: string) {
  const [value, setValue] = useState(defaultValue);
  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
  }
  return {
    value,
    onChange,
  };
}

export interface AddNewPlayerProps {
  defaultValue: string;
  show: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
}

export const AddNewPlayer = (props: AddNewPlayerProps) => {
  const handleKeypress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    //it triggers by pressing the enter key
    if (e.code === "Enter") {
      props.onSubmit(inputProps.value);
    }
  };

  const inputProps = useInput(props.defaultValue);

  return (
    <>
      <Modal
        show={props.show}
        onHide={() => props.onClose()}
        aria-labelledby="ModalHeader"
      >
        <Modal.Body>
          <div>
            <div>Enter player name:</div>
            <StyledInput
              {...inputProps}
              placeholder=""
              onKeyPress={handleKeypress}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => props.onClose()}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => props.onSubmit(inputProps.value)}
          >
            Add Player
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
