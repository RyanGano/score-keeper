import Stack from "react-bootstrap/esm/Stack";
import { YahtzeeRowTitle } from "./yahtzee-row-title";

export const YahtzeeKey = () => {
  const cellWidth = 140;

  return (
    <Stack style={{ maxWidth: cellWidth }} direction="vertical">
      <YahtzeeRowTitle title="UPPER SECTION" width={cellWidth} />
      <YahtzeeRowTitle
        title="ACES"
        tip="COUNT AND ADD ONLY ACES"
        width={cellWidth}
      />
      <YahtzeeRowTitle
        title="TWOS"
        tip="COUNT AND ADD ONLY TWOS"
        width={cellWidth}
      />
      <YahtzeeRowTitle
        title="THREES"
        tip="COUNT AND ADD ONLY THREES"
        width={cellWidth}
      />
      <YahtzeeRowTitle
        title="FOURS"
        tip="COUNT AND ADD ONLY FOURS"
        width={cellWidth}
      />
      <YahtzeeRowTitle
        title="FIVES"
        tip="COUNT AND ADD ONLY FIVES"
        width={cellWidth}
      />
      <YahtzeeRowTitle
        title="SIXES"
        tip="COUNT AND ADD ONLY SIXES"
        width={cellWidth}
      />
      <YahtzeeRowTitle title="TOTAL SCORE" width={cellWidth} />
      <YahtzeeRowTitle title="BONUS (63+)" width={cellWidth} />
      <YahtzeeRowTitle title="UPPER TOTAL" width={cellWidth} />

      <YahtzeeRowTitle title="LOWER SECTION" width={cellWidth} />
      <YahtzeeRowTitle
        title="3 OF A KIND"
        tip="ADD TOTAL OF ALL DICE"
        width={cellWidth}
      />
      <YahtzeeRowTitle
        title="4 OF A KIND"
        tip="ADD TOTAL OF ALL DICE"
        width={cellWidth}
      />
      <YahtzeeRowTitle title="FULL HOUSE" tip="SCORE 25" width={cellWidth} />
      <YahtzeeRowTitle
        title="SMALL STRAIGHT"
        tip="SEQUENCE OF FOUR / SCORE 30"
        width={cellWidth}
      />
      <YahtzeeRowTitle
        title="LARGE STRAIGHT"
        tip="SEQUENCE OF FIVE / SCORE 40"
        width={cellWidth}
      />
      <YahtzeeRowTitle
        title="YAHTZEE"
        tip="5 OF A KIND / SCORE 50"
        width={cellWidth}
      />
      <YahtzeeRowTitle
        title="CHANCE"
        tip="ADD TOTAL OF ALL 5 DICE"
        width={cellWidth}
      />
      <YahtzeeRowTitle title="YAHTZEE" tip="EACH BONUS" width={cellWidth} />
      <YahtzeeRowTitle title="BONUS" tip="100 PER BONUS" width={cellWidth} />
      <YahtzeeRowTitle title="LOWER TOTAL" width={cellWidth} />
      <YahtzeeRowTitle title="UPPER TOTAL" width={cellWidth} />
      <YahtzeeRowTitle title="GRAND TOTAL" width={cellWidth} />
    </Stack>
  );
};
