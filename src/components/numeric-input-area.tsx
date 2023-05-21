import * as React from "react";
import { StyledInput } from "../common/styles";
import { useState } from "react";
import { skullKingScoreBoxWidth } from "./skull-king-score-box";

export interface NumericInputAreaProps {
  setNewValue: (vewValue: number) => void;
  startingValue?: number;
  placeholder?: string;
  width?: number;
}

export const NumericInputArea = (props: NumericInputAreaProps) => {
  function useInput(defaultValue: string) {
    const [value, setValue] = useState(defaultValue);
    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
      setValue(e.target.value);
      const newValue = parseInt(e.target.value);
      props.setNewValue(!isNaN(newValue) ? newValue : 0);
    }
    return {
      value,
      onChange,
    };
  }

  const numericInputProps = useInput(
    !!props.startingValue ? props.startingValue.toString() : ""
  );

  return (
    <StyledInput
      style={{ width: `${props.width ?? skullKingScoreBoxWidth}px` }}
      {...numericInputProps}
      placeholder={props.placeholder}
    />
  );
};
