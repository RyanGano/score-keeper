import * as React from "react";
import { calculateRoundScore } from "./skull-king";
import { Stack } from "react-bootstrap";
import {
  CurrentScoreArea,
  RoundBidArea,
  RoundResultsArea,
  RoundScoreArea,
  ScoreResultsStack,
} from "./skull-king-styles";

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
    <Stack direction="horizontal">
      <RoundScoreArea>
        {props.displayFullInfo ? `${roundScore}` : " "}
      </RoundScoreArea>
      <CurrentScoreArea>
        {props.displayFullInfo ? `${props.currentScore + roundScore}` : " "}
      </CurrentScoreArea>
    </Stack>
  ) : null;

  return (
    <ScoreResultsStack>
      <Stack
        direction="horizontal"
        style={{ width: `${skullKingScoreBoxWidth}px` }}
      >
        <RoundBidArea
          style={{
            backgroundColor: calculateBidStatusColor(
              props.roundInfo,
              props.displayFullInfo
            ),
          }}
        >{`${props.roundInfo.bid}/${props.roundInfo.taken}`}</RoundBidArea>
        <RoundResultsArea>
          {props.displayFullInfo
            ? `${roundScore - props.roundInfo.bonus}|${props.roundInfo.bonus}`
            : " "}
        </RoundResultsArea>
      </Stack>
      {secondRow}
    </ScoreResultsStack>
  );
};
