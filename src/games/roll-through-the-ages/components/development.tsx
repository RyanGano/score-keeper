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

  const pointsStyle = selected
    ? {
        borderStyle: "solid",
        borderWidth: "0.5px",
        paddingRight: "4px",
        paddingLeft: "4px",
      }
    : {
        paddingRight: "4.5px",
        paddingLeft: "4.5px",
        marginTop: ".5px",
        marginBottom: ".5px",
      };

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
        <div style={pointsStyle}>{props.points}</div>
        <div></div>
        <div>{props.effect}</div>
      </Stack>
    </div>
  );
};
