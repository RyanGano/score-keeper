import * as React from "react";
import { calculateRoundScore } from "../games/skull-king";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import { Container } from "react-bootstrap";

export interface SkullKingRoundInfo {
  id: string;
  possibleTricks: number;
  bid: number;
  taken: number;
  bonus: number;
  currentScore: number;
}

export const defaultSkullKingRoundInfo: SkullKingRoundInfo = {
  id: "",
  possibleTricks: 0,
  bid: 0,
  taken: 0,
  bonus: 0,
  currentScore: 0,
};

export interface SkullKingScoreBoxProps {
  roundInfo: SkullKingRoundInfo;
  displayFullInfo: boolean;
}

export const skullKingScoreBoxWidth = 125;

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
    <Row>
      <Col
        style={{
          backgroundColor: "#cccccc",
          borderStyle: "solid",
          borderWidth: ".5px",
          borderColor: "#888888",
        }}
      >
        {props.displayFullInfo ? `${roundScore}` : " "}
      </Col>
      <Col
        style={{
          borderStyle: "solid",
          borderWidth: ".5px",
          borderColor: "#888888",
        }}
      >
        {props.displayFullInfo
          ? `${props.roundInfo.currentScore + roundScore}`
          : " "}
      </Col>
    </Row>
  ) : null;

  return (
    <Container
      style={{
        width: "125px",
        maxWidth: `${skullKingScoreBoxWidth}px`,
        borderStyle: "solid",
        borderWidth: ".5px",
        borderColor: "#333333",
      }}
    >
      <Row>
        <Col
          style={{
            borderStyle: "solid",
            borderWidth: ".5px",
            borderColor: "#888888",
            backgroundColor: calculateBidStatusColor(
              props.roundInfo,
              props.displayFullInfo
            ),
          }}
        >{`${props.roundInfo.bid}/${props.roundInfo.taken}`}</Col>
        <Col
          style={{
            borderStyle: "solid",
            borderWidth: ".5px",
            borderColor: "#888888",
          }}
        >
          {props.displayFullInfo
            ? `${roundScore - props.roundInfo.bonus}|${props.roundInfo.bonus}`
            : " "}
        </Col>
      </Row>
      {secondRow}
    </Container>
  );
};
