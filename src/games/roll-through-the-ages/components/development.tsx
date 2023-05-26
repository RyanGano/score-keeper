import * as React from "react";
import { useState } from "react";
import Stack from "react-bootstrap/esm/Stack";
import { CheckSquare, Square } from "react-bootstrap-icons";

export interface DevelopmentProps {
  cost: number;
  name: string;
  points: number;
  effect: string;
  setChecked?: (isChecked: boolean) => void;
}

export const Development = (props: DevelopmentProps) => {
  const [selected, setSelected] = useState<boolean>(false);

  return (
    <div
      className="text-dark fs-6 btn"
      onClick={() => {
        setSelected(!selected);
        props.setChecked?.(!selected);
      }}
    >
      <Stack direction="horizontal" gap={2}>
        {props.cost}
        {selected ? <CheckSquare /> : <Square />}
        <div style={{ width: "90px", display: "flex" }}>{props.name}</div>
        <div>{props.points}</div>
        <div></div>
        <div>{props.effect}</div>
      </Stack>
    </div>
  );
};
