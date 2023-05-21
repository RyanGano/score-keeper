import React, { useState } from "react";
import { SimpleModal } from "../common/simple-modal";
import Form from "react-bootstrap/esm/Form";
import { TextInputArea } from "./text-input-area";

export interface EditExistingPlayerProps {
  currentName: string;
  show: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
}

export const EditExistingPlayer = (props: EditExistingPlayerProps) => {
  const [currentValue, setCurrentValue] = useState<string>("");

  return (
    <>
      <SimpleModal
        title="Reset Game"
        content={
          <Form>
            <Form.Group className="mb-3" controlId="nameChange">
              <Form.Label>Update player name:</Form.Label>
              <TextInputArea
                setNewValue={setCurrentValue}
                startingValue={props.currentName}
                onEnter={() => props.onSubmit(currentValue)}
                width={NaN}
                autoFocus={true}
              />
            </Form.Group>
          </Form>
        }
        defaultButtonContent="Edit Player"
        alternateButtonContent="Cancel"
        onAccept={() => props.onSubmit(currentValue)}
        onCancel={props.onClose}
        show={props.show}
      />
    </>
  );
};
