import * as React from "react";
import Form from "react-bootstrap/esm/Form";
import { useState } from "react";

export interface TextInputAreaProps {
  setNewValue: (vewValue: string) => void;
  startingValue?: string;
  placeholder?: string;
  width: number;
  onEnter?: () => void;
  updateOnlyOnBlur?: boolean;
  autoFocus?: boolean;
}

export const TextInputArea = (props: TextInputAreaProps) => {
  const [value, setValue] = useState(props.startingValue);

  const handleKeypress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      props.onEnter?.();
    }
  };

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
    if (props.updateOnlyOnBlur !== true) props.setNewValue(e.target.value);
  }

  function onFocus(e: React.FocusEvent<HTMLInputElement>) {
    e.target.setSelectionRange(0, e.target.value.length);
  }

  function onBlur(): void {
    props.setNewValue(value ?? "");
  }

  const fieldStyle = isNaN(props.width ?? 0)
    ? {}
    : { width: `${props.width}px` };

  return (
    <Form onSubmit={(e) => e.preventDefault()}>
      <Form.Control
        type="textarea"
        defaultValue={props.startingValue}
        style={fieldStyle}
        onKeyDown={handleKeypress}
        onChange={onChange}
        onBlur={onBlur}
        autoFocus={props.autoFocus}
        onFocus={onFocus}
        placeholder={props.placeholder}
      />
    </Form>
  );
};
