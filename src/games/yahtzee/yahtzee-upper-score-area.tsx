import { useEffect, useState } from "react";
import { NumericInputArea } from "../../components/numeric-input-area";
import Stack from "react-bootstrap/esm/Stack";

export interface YahtzeeUpperScoreAreaProps {
  multiplier: number;
  width: number;
  height: number;
  setScore: (newValue: number) => void;
  setBonus: (newValue: number) => void;
}

export const YahtzeeUpperScoreArea = (props: YahtzeeUpperScoreAreaProps) => {
  const [aces, setAces] = useState<number | undefined>();
  const [twos, setTwos] = useState<number | undefined>();
  const [threes, setThrees] = useState<number | undefined>();
  const [fours, setFours] = useState<number | undefined>();
  const [fives, setFives] = useState<number | undefined>();
  const [sixes, setSixes] = useState<number | undefined>();
  const [score, setScore] = useState<number>(0);
  const [bonus, setBonus] = useState<number>(0);

  useEffect(() => {
    props.setScore(score);
    props.setBonus(bonus);
  }, [bonus, props, score]);

  useEffect(() => {
    const currentScore =
      (aces ?? 0) * 1 * props.multiplier +
      (twos ?? 0) * 2 * props.multiplier +
      (threes ?? 0) * 3 * props.multiplier +
      (fours ?? 0) * 4 * props.multiplier +
      (fives ?? 0) * 5 * props.multiplier +
      (sixes ?? 0) * 6 * props.multiplier;
    setScore(currentScore);
    setBonus(currentScore >= 63 * props.multiplier ? 35 * props.multiplier : 0);
  }, [aces, fives, fours, props.multiplier, sixes, threes, twos]);

  return (
    <Stack style={{ maxHeight: `${props.height}px` }}>
      <div style={{ height: 25.33 }} />
      <NumericInputArea
        setNewValue={(newValue) => {
          setAces(newValue);
        }}
        placeholder=""
        width={props.width}
      />
      <NumericInputArea
        setNewValue={(newValue) => {
          setTwos(newValue);
        }}
        placeholder=""
        width={props.width}
      />
      <NumericInputArea
        setNewValue={(newValue) => {
          setThrees(newValue);
        }}
        placeholder=""
        width={props.width}
      />
      <NumericInputArea
        setNewValue={(newValue) => {
          setFours(newValue);
        }}
        placeholder=""
        width={props.width}
      />
      <NumericInputArea
        setNewValue={(newValue) => {
          setFives(newValue);
        }}
        placeholder=""
        width={props.width}
      />
      <NumericInputArea
        setNewValue={(newValue) => {
          setSixes(newValue);
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
      <NumericInputArea
        startingValue={bonus}
        placeholder=""
        width={props.width}
        noBorder={true}
      />
      <NumericInputArea
        startingValue={score + bonus}
        placeholder=""
        width={props.width}
        noBorder={true}
      />
    </Stack>
  );
};
