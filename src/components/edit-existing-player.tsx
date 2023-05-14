import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { StyledInput } from "../common/styles";

function useInput(defaultValue: string) {
  const [modified, setModified] = useState<boolean>(false);
  const [value, setValue] = useState(defaultValue);
  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
    setModified(true);
  }

  return {
    value,
    onChange,
    modified,
  };
}

export interface EditExistingPlayerProps {
  currentName: string;
  show: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
}

export const EditExistingPlayer = (props: EditExistingPlayerProps) => {
  const handleKeypress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    //it triggers by pressing the enter key
    if (e.code === "Enter") {
      props.onSubmit(inputProps.value);
    }
  };

  const inputProps = useInput(props.currentName);

  if (!inputProps.modified) inputProps.value = props.currentName;

  return (
    <>
      <Modal
        show={props.show}
        onHide={() => props.onClose()}
        aria-labelledby="ModalHeader"
      >
        <Modal.Body>
          <div>
            <div>Update player name:</div>
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
            Edit Player
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
