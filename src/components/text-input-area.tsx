import * as React from "react";
import Form from "react-bootstrap/esm/Form";
import { useState } from "react";

export interface TextInputAreaProps {
  setNewValue?: (vewValue: string) => void;
  startingValue?: string;
  placeholder?: string;
  width: number;
  height?: number;
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
    if (props.updateOnlyOnBlur !== true) props.setNewValue?.(e.target.value);
  }

  function onFocus(e: React.FocusEvent<HTMLInputElement>) {
    e.target.setSelectionRange(0, e.target.value.length);
  }

  function onBlur(): void {
    props.setNewValue?.(value ?? "");
  }

  const widthStyle = isNaN(props.width ?? 0)
    ? {}
    : { width: `${props.width}px` };
  const heightStyle = isNaN(props.height ?? NaN)
    ? {}
    : { height: `${props.height}px` };

  const form = !!props.setNewValue ? (
    <Form.Control
      type="textarea"
      defaultValue={props.startingValue}
      style={{ ...widthStyle, ...heightStyle }}
      onKeyDown={handleKeypress}
      onChange={onChange}
      onBlur={onBlur}
      autoFocus={props.autoFocus}
      onFocus={onFocus}
      placeholder={props.placeholder}
      disabled={!props.setNewValue}
    />
  ) : (
    <Form.Control
      type="textarea"
      value={props.startingValue}
      style={{ ...widthStyle, ...heightStyle }}
      onKeyDown={handleKeypress}
      onChange={onChange}
      onBlur={onBlur}
      autoFocus={props.autoFocus}
      onFocus={onFocus}
      placeholder={props.placeholder}
      disabled={!props.setNewValue}
    />
  );

  return (
    <Form onSubmit={(e) => e.preventDefault()}>
      {form}
    </Form>
  );
};
