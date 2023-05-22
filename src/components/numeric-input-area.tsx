import * as React from "react";
import { TextInputArea } from "./text-input-area";

export interface NumericInputAreaProps {
  setNewValue: (vewValue: number) => void;
  startingValue?: number;
  placeholder?: string;
  width: number;
  onEnter?: () => void;
  autoFocus?: boolean;
}

export const NumericInputArea = (props: NumericInputAreaProps) => {
  function onChange(newValue: string): void {
    const valueAsInt = parseInt(newValue);
    props.setNewValue(!isNaN(valueAsInt) ? valueAsInt : 0);
  }

  return (
    <TextInputArea
      setNewValue={onChange}
      startingValue={props.startingValue?.toString()}
      placeholder={props.placeholder}
      onEnter={() => props.onEnter?.()}
      width={props.width}
      autoFocus={props.autoFocus}
    />
  );
};
