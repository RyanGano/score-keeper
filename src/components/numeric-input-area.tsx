import * as React from "react";
import { TextInputArea } from "./text-input-area";

export interface NumericInputAreaProps {
  setNewValue?: (vewValue: number) => void;
  startingValue?: number;
  placeholder?: string;
  width: number;
  onEnter?: () => void;
  autoFocus?: boolean;
  noBorder?: boolean;
}

export const NumericInputArea = (props: NumericInputAreaProps) => {
  function onChange(newValue: string): void {
    const valueAsInt = parseInt(newValue);
    props.setNewValue?.(!isNaN(valueAsInt) ? valueAsInt : 0);
  }

  const textInputArea = (
    <TextInputArea
      setNewValue={props.setNewValue ? onChange : undefined}
      startingValue={props.startingValue?.toString()}
      placeholder={props.placeholder}
      onEnter={() => props.onEnter?.()}
      width={props.width}
      height={25.33}
      autoFocus={props.autoFocus}
    />
  );
  /*const textInputArea = props.setNewValue ? (
    <TextInputArea
      setNewValue={!!props.setNewValue && onChange}
      startingValue={props.startingValue?.toString()}
      placeholder={props.placeholder}
      onEnter={() => props.onEnter?.()}
      width={props.width}
      height={25.33}
      autoFocus={props.autoFocus}
    />
  ) : !props.noBorder ? (
    <div
      style={{
        width: props.width,
        maxHeight: 25.33,
        borderStyle: "solid",
        borderWidth: "0.5px",
      }}
    >
      {props.startingValue?.toString()}
    </div>
  ) : (
    <div
      style={{
        width: props.width,
        maxHeight: 25.33,
      }}
    >
      {props.startingValue?.toString()}
    </div>
  );*/

  return <>{textInputArea}</>;
};
