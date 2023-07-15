import Stack from "react-bootstrap/esm/Stack";
import { YahtzeeUpperScoreArea } from "./yahtzee-upper-score-area";
import { useState } from "react";
import { YahtzeeLowerScoreArea } from "./yahtzee-lower-score-area";

export interface YahtzeeScoresProps {
  multiplier: number;
}

export const YahtzeeScores = (props: YahtzeeScoresProps) => {
  const [_, setUpperScore] = useState<number>(0);
  const [__, setUpperBonus] = useState<number>(0);

  return (
    <Stack>
      <YahtzeeUpperScoreArea
        multiplier={props.multiplier}
        width={100}
        height={255}
        setScore={(newValue) => setUpperScore(newValue)}
        setBonus={(newValue) => setUpperBonus(newValue)}
      />
      <YahtzeeLowerScoreArea
        multiplier={props.multiplier}
        width={100}
        height={255}
        setScore={(newValue) => setUpperScore(newValue)}
      />
    </Stack>
  );
};
