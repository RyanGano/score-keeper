import * as React from "react";
import { StyledInput } from "../common/styles";
import { useState } from "react";
import { skullKingScoreBoxWidth } from "./skull-king-score-box";

export interface BonusInputAreaProps {
  setBonus: (bonus: number) => void;
  startingValue: number | undefined;
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

  const bonusInputProps = useInput(
    !!props.startingValue ? props.startingValue.toString() : "0"
  );

  return (
    <StyledInput
      style={{ width: `${skullKingScoreBoxWidth / 2}px` }}
      {...bonusInputProps}
      placeholder=""
    />
  );
};
