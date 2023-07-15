import { useEffect, useState } from "react";
import { NumericInputArea } from "../../components/numeric-input-area";
import Stack from "react-bootstrap/esm/Stack";

export interface YahtzeeLowerScoreAreaProps {
  multiplier: number;
  width: number;
  height: number;
  setScore: (newValue: number) => void;
}

export const YahtzeeLowerScoreArea = (props: YahtzeeLowerScoreAreaProps) => {
  const [threeOfAKind, setThreeOfAKind] = useState<number | undefined>();
  const [fourOfAKind, setFourOfAKind] = useState<number | undefined>();
  const [fullHouse, setFullHouse] = useState<number | undefined>();
  const [smallStraight, setSmallStraight] = useState<number | undefined>();
  const [largeStraight, setLargeStraight] = useState<number>();
  const [yahtzee, setYathzee] = useState<number>();
  const [chance, setChance] = useState<number>();
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    props.setScore(score);
  }, [props, score]);

  useEffect(() => {
    const currentScore =
      (threeOfAKind ?? 0) * props.multiplier +
      (fourOfAKind ?? 0) * props.multiplier +
      (fullHouse ?? 0) * props.multiplier +
      (smallStraight ?? 0) * props.multiplier +
      (largeStraight ?? 0) * props.multiplier +
      (yahtzee ?? 0) * props.multiplier +
      (chance ?? 0) * props.multiplier;
    setScore(currentScore);
  }, [
    threeOfAKind,
    largeStraight,
    smallStraight,
    yahtzee,
    fullHouse,
    fourOfAKind,
    props.multiplier,
    chance,
  ]);

  return (
    <Stack style={{ maxHeight: `${props.height}px` }}>
      <div style={{ height: 25.33 }} />
      <NumericInputArea
        setNewValue={(newValue) => {
          setThreeOfAKind(newValue);
        }}
        placeholder=""
        width={props.width}
      />
      <NumericInputArea
        setNewValue={(newValue) => {
          setFourOfAKind(newValue);
        }}
        placeholder=""
        width={props.width}
      />
      <NumericInputArea
        setNewValue={(newValue) => {
          setFullHouse(newValue);
        }}
        placeholder=""
        width={props.width}
      />
      <NumericInputArea
        setNewValue={(newValue) => {
          setSmallStraight(newValue);
        }}
        placeholder=""
        width={props.width}
      />
      <NumericInputArea
        setNewValue={(newValue) => {
          setLargeStraight(newValue);
        }}
        placeholder=""
        width={props.width}
      />
      <NumericInputArea
        setNewValue={(newValue) => {
          setYathzee(newValue);
        }}
        placeholder=""
        width={props.width}
      />
      <NumericInputArea
        setNewValue={(newValue) => {
          setChance(newValue);
        }}
        placeholder=""
        width={props.width}
      />
      <NumericInputArea
        startingValue={score}
        placeholder=""
        width={props.width}
        noBorder={true}
      />
    </Stack>
  );
};
