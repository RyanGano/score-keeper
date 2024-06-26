import React, { useState } from "react";
import { SimpleModal } from "../common/simple-modal";
import Form from "react-bootstrap/esm/Form";
import { TextInputArea } from "./text-input-area";

export interface AddNewPlayerProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
}

export const AddNewPlayer = (props: AddNewPlayerProps) => {
  const [currentValue, setCurrentValue] = useState<string>("");

  return (
    <>
      <SimpleModal
        title="Add New Player"
        content={
          <>
            <Form.Label>Player name:</Form.Label>
            <TextInputArea
              setNewValue={setCurrentValue}
              placeholder="name"
              width={NaN}
              onEnter={() => props.onSubmit(currentValue)}
              autoFocus={true}
            />
          </>
        }
        defaultButtonContent="Add Player"
        alternateButtonContent="Cancel"
        onAccept={() => props.onSubmit(currentValue)}
        onCancel={props.onClose}
        show={props.show}
      />
    </>
  );
};
