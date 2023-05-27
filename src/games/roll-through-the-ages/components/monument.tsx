import * as React from "react";
import { useState } from "react";
import Stack from "react-bootstrap/esm/Stack";
import { CheckboxButtonGapless } from "../../../common/checkbox-buttons";
import {
  CenteredTextBox,
  CenteredTextBoxWithBorder,
} from "../../../common/common-styles";

export interface MonumentProps {
  name: string;
  scores: number[];
  cost: number;
  shape: number[];
  enabled: boolean;
  setOtherPlayerCompletedFirst: (value: boolean) => void;
  setCompleted?: (isCompleted: boolean) => void;
}

export const Monument = (props: MonumentProps) => {
  const [blocks, setBlocks] = useState<boolean[]>(
    Array(props.cost).fill(false)
  );
  const [othersCompletedFirst, setOthersCompletedFirst] =
    useState<boolean>(false);

  function isCompleted(blocks: boolean[]) {
    return blocks.filter((x) => !x).length === 0;
  }

  function updateBlock(whichBlock: number, newValue: boolean) {
    const newBlockValues = blocks.map((x, index) =>
      index === whichBlock ? newValue : x
    );
    setBlocks(newBlockValues);

    props.setCompleted?.(isCompleted(newBlockValues));
  }

  function getMonumentBox(which: number) {
    return (
      <CheckboxButtonGapless
        key={`${props.cost}_${which}`}
        enabled={props.enabled}
        selected={blocks[which]}
        onChange={(newValue) =>
          props.enabled ? updateBlock(which, newValue) : {}
        }
      />
    );
  }

  function getBlockRow(which: number) {
    const row: JSX.Element[] = [];

    const startingIndex = props.shape
      .slice(0, which)
      .reduce((a, b) => a + b, 0);

    for (let i = 0; i < props.shape[which]; i++) {
      row.push(getMonumentBox(startingIndex + i));
    }

    return (
      <Stack
        key={`${props.cost}_row_${which}`}
        direction="horizontal"
        gap={1}
        style={{ display: "flex", justifyContent: "center" }}
      >
        {row}
      </Stack>
    );
  }

  function getBlockBoxes() {
    const blockStack: JSX.Element[] = [];
    for (let i = 0; i < props.shape.length; i++) {
      const blockRow = getBlockRow(i);
      if (blockRow !== null) blockStack.push(blockRow);
    }

    return (
      <Stack style={{ display: "flex", justifyContent: "end" }} gap={1}>
        {blockStack}
      </Stack>
    );
  }

  function toggleOthersCompletedFirst() {
    props.setOtherPlayerCompletedFirst(!othersCompletedFirst);
    setOthersCompletedFirst(!othersCompletedFirst);
  }

  const backgroundColor = isCompleted(blocks) ? "#00aa00" : null;

  const nonSelectedStyle = {
    paddingLeft: 2,
    paddingRight: 2,
    minWidth: 24,
    color: "#cccccc",
  };

  const selectedStyle = {
    paddingLeft: 2,
    paddingRight: 2,
    minWidth: 24,
    backgroundColor: backgroundColor,
    borderColor: props.enabled ? "#000000" : "#cccccc",
    color: props.enabled ? "#000000" : "#cccccc",
  };

  const firstScore = othersCompletedFirst ? (
    <CenteredTextBox style={nonSelectedStyle}>
      {props.scores[0]}
    </CenteredTextBox>
  ) : (
    <CenteredTextBoxWithBorder style={selectedStyle}>
      {props.scores[0]}
    </CenteredTextBoxWithBorder>
  );

  const secondScore = !othersCompletedFirst ? (
    <CenteredTextBox style={nonSelectedStyle}>
      {props.scores[1]}
    </CenteredTextBox>
  ) : (
    <CenteredTextBoxWithBorder style={selectedStyle}>
      {props.scores[1]}
    </CenteredTextBoxWithBorder>
  );

  return (
    <Stack direction="vertical" style={{ alignSelf: "end" }}>
      <div
        style={{
          margin: "4px",
          padding: "4px",
          display: "flex",
        }}
      >
        {getBlockBoxes()}
      </div>
      <Stack
        direction="horizontal"
        style={{ display: "flex", alignSelf: "center" }}
        onClick={() => (props.enabled ? toggleOthersCompletedFirst() : {})}
      >
        {firstScore}
        {secondScore}
      </Stack>
      <div style={{ fontSize: 8, alignSelf: "center" }}>{props.name}</div>
    </Stack>
  );
};
