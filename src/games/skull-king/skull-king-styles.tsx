import { CheckSquare, Square } from "react-bootstrap-icons";
import Stack from "react-bootstrap/esm/Stack";
import styled from "styled-components";

export const GameHeader = styled.div`
  position: absolute;
  left: 56px;
  top: 12px;
`;

export const ScoreResultsStack = styled(Stack)`
  border-style: solid;
  border-width: 0.5px;
  border-color: #333333;
`;

export const RoundBidArea = styled.div`
  border-style: solid;
  border-width: 0.5px;
  border-color: #888888;
  width: 60px;
  align-content: center;
  padding-left: 2px;
  padding-right: 2px;
`;

export const RoundResultsArea = styled.div`
  border-style: solid;
  border-width: 0.5px;
  border-color: #888888;
  width: 90px;
  height: 25.33px;
  padding-left: 2px;
  padding-right: 2px;
`;

export const RoundScoreArea = styled.div`
  background-color: #cccccc;
  border-style: solid;
  border-width: 0.5px;
  border-color: #888888;
  width: 60px;
  padding-left: 2px;
  padding-right: 2px;
`;

export const CurrentScoreArea = styled.div`
  border-style: solid;
  border-width: 0.5px;
  border-color: #888888;
  width: 90px;
  padding-left: 2px;
  padding-right: 2px;
`;

export const CheckboxChecked = styled(CheckSquare)`
  margin-right: 4px;
`;

export const CheckboxUnchecked = styled(Square)`
  margin-right: 4px;
`;
