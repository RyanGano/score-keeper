import * as React from "react";
import { StyledInput } from "../common/styles";
import { useState } from "react";
import { skullKingScoreBoxWidth } from "./skull-king-score-box";

export interface TricksTakenInputAreaProps {
  setTricksTaken: (tricksTaken: number) => void;
  startingValue: number | undefined;
}

export const TricksTakenInputArea = (props: TricksTakenInputAreaProps) => {
  function useInput(defaultValue: string) {
    const [value, setValue] = useState(defaultValue);
    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
      setValue(e.target.value);
      const newTricksTaken = parseInt(e.target.value);
      props.setTricksTaken(!isNaN(newTricksTaken) ? newTricksTaken : 0);
    }
    return {
      value,
      onChange,
    };
  }

  const trickInputProps = useInput(
    !!props.startingValue ? props.startingValue.toString() : "0"
  );

  return (
    <StyledInput
      style={{ width: `${skullKingScoreBoxWidth / 2}px` }}
      {...trickInputProps}
      placeholder=""
    />
  );
};
