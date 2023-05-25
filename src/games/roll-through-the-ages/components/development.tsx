import * as React from "react";
import { useState } from "react";
import Stack from "react-bootstrap/esm/Stack";
import {
  CheckboxChecked,
  CheckboxUnchecked,
} from "../../skull-king/skull-king-styles";

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
      className="text-dark btn"
      onClick={() => {
        setSelected(!selected);
        props.setChecked?.(!selected);
      }}
    >
      <Stack direction="horizontal" gap={2}>
        {props.cost}
        {selected ? <CheckboxChecked /> : <CheckboxUnchecked />}
        <div style={{ width: "90px", display: "flex" }}>{props.name}</div>
        <div>{props.points}</div>
        <div>{props.effect}</div>
      </Stack>
    </div>
  );
};
