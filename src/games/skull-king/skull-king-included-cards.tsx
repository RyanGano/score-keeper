import Stack from "react-bootstrap/esm/Stack";
import { CheckboxButton } from "../../common/checkbox-buttons";

export interface SkullKingCardInclusions {
  kraken: boolean;
  whiteWhale: boolean;
  lootCoins: boolean;
  mermaids: boolean;
}
export interface SkullKingIncludedCardsProps extends SkullKingCardInclusions {
  updateKraken: (newValue: boolean) => void;
  updateWhiteWhale: (newValue: boolean) => void;
  updateLootCoins: (newValue: boolean) => void;
  updateMermaids: (newValue: boolean) => void;
}

export const defaultSkullKingIncludedCards: SkullKingCardInclusions = {
  kraken: true,
  whiteWhale: true,
  lootCoins: true,
  mermaids: true,
};

export function getCardCount(includedCards: SkullKingCardInclusions): number {
  const suitCount = 14;
  const numberOfSuits = 4;
  const escapeCount = 5;
  const pirateCount = 6;
  const skullKingCount = 1;
  const totalBasicCards =
    suitCount * numberOfSuits + escapeCount + pirateCount + skullKingCount;

  const mermaidCount = 2;
  const krakenCount = 1;
  const whiteWhaleCount = 1;
  const lootCardCounts = 2;

  return (
    totalBasicCards +
    (includedCards.mermaids ? mermaidCount : 0) +
    (includedCards.kraken ? krakenCount : 0) +
    (includedCards.whiteWhale ? whiteWhaleCount : 0) +
    (includedCards.lootCoins ? lootCardCounts : 0)
  );
}

export const SkullKingIncludedCards = (props: SkullKingIncludedCardsProps) => {
  return (
    <Stack gap={0}>
      Include:
      <Stack direction="horizontal" gap={0}>
        <div>
          <CheckboxButton
            text="Mermaids"
            selected={props.mermaids}
            onChange={props.updateMermaids}
          />
        </div>
        <div>
          <CheckboxButton
            text="Kraken"
            selected={props.kraken}
            onChange={props.updateKraken}
          />
        </div>
        <div>
          <CheckboxButton
            text="White Whale"
            selected={props.whiteWhale}
            onChange={props.updateWhiteWhale}
          />
        </div>
        <div>
          <CheckboxButton
            text="Loot Coins"
            selected={props.lootCoins}
            onChange={props.updateLootCoins}
          />
        </div>
      </Stack>
    </Stack>
  );
};
