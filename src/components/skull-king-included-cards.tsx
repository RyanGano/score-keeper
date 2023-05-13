import { CheckSquare, Square } from "react-bootstrap-icons";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/esm/Stack";

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
  lootCoins: false,
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
    <Stack direction="horizontal" gap={3}>
      <div>
        <Button
          variant="link"
          size="sm"
          onClick={() => props.updateMermaids(!props.mermaids)}
        >
          {props.mermaids ? (
            <CheckSquare style={{ marginRight: "4" }} />
          ) : (
            <Square style={{ marginRight: "4" }} />
          )}
          Include Mermaids
        </Button>
      </div>
      <div>
        <Button
          variant="link"
          size="sm"
          onClick={() => props.updateKraken(!props.kraken)}
        >
          {props.kraken ? (
            <CheckSquare style={{ marginRight: "4" }} />
          ) : (
            <Square style={{ marginRight: "4" }} />
          )}
          Include Kraken
        </Button>
      </div>
      <div>
        <Button
          variant="link"
          size="sm"
          onClick={() => props.updateWhiteWhale(!props.whiteWhale)}
        >
          {props.whiteWhale ? (
            <CheckSquare style={{ marginRight: "4" }} />
          ) : (
            <Square style={{ marginRight: "4" }} />
          )}
          Include White Whale
        </Button>
      </div>
      <div>
        <Button
          variant="link"
          size="sm"
          onClick={() => props.updateLootCoins(!props.lootCoins)}
        >
          {props.lootCoins ? (
            <CheckSquare style={{ marginRight: "4" }} />
          ) : (
            <Square style={{ marginRight: "4" }} />
          )}
          Include Loot Coins
        </Button>
      </div>
    </Stack>
  );
};
