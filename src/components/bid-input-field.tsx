import * as React from "react";
import { StyledInput } from "../common/styles";
import { useState } from "react";
import { skullKingScoreBoxWidth } from "./skull-king-score-box";

export interface BidInputFieldProps {
  setBid: (newBid: number) => void;
  startingValue: number | undefined;
}

export const BidInputField = (props: BidInputFieldProps) => {
  function useInput(defaultValue: string) {
    const [value, setValue] = useState(defaultValue);
    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
      setValue(e.target.value);
      const newBid = parseInt(e.target.value);
      props.setBid(!isNaN(newBid) ? newBid : 0);
    }
    return {
      value,
      onChange,
    };
  }

  const inputProps = useInput(
    !!props.startingValue ? props.startingValue.toString() : "0"
  );

  return (
    <div style={{ width: `${skullKingScoreBoxWidth}px` }}>
      <StyledInput
        style={{ width: `${skullKingScoreBoxWidth}px` }}
        {...inputProps}
        placeholder=""
      />
    </div>
  );
};
