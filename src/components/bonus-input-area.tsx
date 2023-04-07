import * as React from "react";
import { StyledInput } from "../common/styles";
import { useState } from "react";

export interface BonusInputAreaProps {
  setBonus: (bonus: number) => void;
}

export const BonusInputArea = (props: BonusInputAreaProps) => {
  function useInput(defaultValue: string) {
    const [value, setValue] = useState(defaultValue);
    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
      setValue(e.target.value);
      const newBonus = parseInt(e.target.value);
      props.setBonus(!isNaN(newBonus) ? newBonus : 0);
    }
    return {
      value,
      onChange,
    };
  }

  const bonusInputProps = useInput("0");

  return (
    // <div style={{ width: "25px" }}>
    <StyledInput
      style={{ width: "25px", position: "relative", top: "0px" }}
      {...bonusInputProps}
      placeholder=""
    />
    // </div>
  );
};
