import * as React from "react";
import { StyledInput } from "../common/styles";
import { useState } from "react";

export interface TricksTakenInputAreaProps {
  setTricksTaken: (tricksTaken: number) => void;
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

  const trickInputProps = useInput("0");

  return (
    // <div style={{ width: "25px", position: "relative" }}>
    <StyledInput
      style={{ width: "25px", position: "relative", top: "0px" }}
      {...trickInputProps}
      placeholder=""
    />
    // </div>
  );
};
