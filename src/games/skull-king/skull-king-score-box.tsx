import * as React from "react";
import { calculateRoundScore } from "./skull-king";
import { Stack } from "react-bootstrap";

export interface SkullKingRoundInfo {
  id: string;
  possibleTricks: number;
  bid: number;
  taken: number;
  bonus: number;
}

export const defaultSkullKingRoundInfo: SkullKingRoundInfo = {
  id: "",
  possibleTricks: 0,
  bid: 0,
  taken: 0,
  bonus: 0,
};

export interface SkullKingScoreBoxProps {
  roundInfo: SkullKingRoundInfo;
  displayFullInfo: boolean;
  currentScore: number;
}

export const skullKingScoreBoxWidth = 150;

function validateSkullKingRoundInfo(info: SkullKingRoundInfo) {
  // if (info.id === "") throw new Error(`InvalidId: ${info}`);
}

function calculateBidStatusColor(
  roundInfo: SkullKingRoundInfo,
  display: boolean
): string {
  if (!display) return "#ffffff";
  if (roundInfo.bid > roundInfo.taken) return "#aa6600";
  else if (roundInfo.taken > roundInfo.bid) return "#aa6600";
  else if (roundInfo.bid === 0) return "#00aaaa";
  else return "#00aa00";
}

export const SkullKingScoreBox = (props: SkullKingScoreBoxProps) => {
  validateSkullKingRoundInfo(props.roundInfo);
  const roundScore = calculateRoundScore(props.roundInfo);

  const secondRow = props.displayFullInfo ? (
    <Stack
      direction="horizontal"
      style={{
        paddingLeft: "0px",
        width: `${skullKingScoreBoxWidth}px`,
        maxWidth: `${skullKingScoreBoxWidth}px`,
      }}
    >
      <div
        style={{
          backgroundColor: "#cccccc",
          borderStyle: "solid",
          borderWidth: ".5px",
          borderColor: "#888888",
          width: `${skullKingScoreBoxWidth * 0.4}px`,
          paddingLeft: "2px",
          paddingRight: "2px",
        }}
      >
        {props.displayFullInfo ? `${roundScore}` : " "}
      </div>
      <div
        style={{
          borderStyle: "solid",
          borderWidth: ".5px",
          borderColor: "#888888",
          width: `${skullKingScoreBoxWidth * 0.6}px`,
          paddingLeft: "2px",
          paddingRight: "2px",
        }}
      >
        {props.displayFullInfo ? `${props.currentScore + roundScore}` : " "}
      </div>
    </Stack>
  ) : null;

  return (
    <Stack
      style={{
        width: `${skullKingScoreBoxWidth}px`,
        maxWidth: `${skullKingScoreBoxWidth}px`,
        borderStyle: "solid",
        borderWidth: ".5px",
        borderColor: "#333333",
        paddingLeft: "0px",
      }}
    >
      <Stack
        direction="horizontal"
        style={{ width: `${skullKingScoreBoxWidth}px` }}
      >
        <div
          style={{
            borderStyle: "solid",
            borderWidth: ".5px",
            borderColor: "#888888",
            backgroundColor: calculateBidStatusColor(
              props.roundInfo,
              props.displayFullInfo
            ),
            width: `${skullKingScoreBoxWidth * 0.4}px`,
            alignContent: "center",
            paddingLeft: "2px",
            paddingRight: "2px",
          }}
        >{`${props.roundInfo.bid}/${props.roundInfo.taken}`}</div>
        <div
          style={{
            borderStyle: "solid",
            borderWidth: ".5px",
            borderColor: "#888888",
            width: `${skullKingScoreBoxWidth * 0.6}px`,
            paddingLeft: "2px",
            paddingRight: "2px",
          }}
        >
          {props.displayFullInfo
            ? `${roundScore - props.roundInfo.bonus}|${props.roundInfo.bonus}`
            : " "}
        </div>
      </Stack>
      {secondRow}
    </Stack>
  );
};
