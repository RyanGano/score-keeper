import type React from "react";
import { useState } from "react";
import Form from "react-bootstrap/esm/Form";
import Stack from "react-bootstrap/esm/Stack";
import { SimpleModal } from "../../../common/simple-modal";
import {
  bigBangInHandValue,
  cleanBookValue,
  defaultBlueColor,
  defaultGreenColor,
  dirtyBookValue,
  emptyRound,
  getBigPoints,
  getPointsToStart,
  getRoundScore,
  getTotalScore,
  roundToIncrement,
  specialCardValue,
  type FirstHandLastHandRound,
  type FirstHandLastHandTeamState,
} from "../first-hand-last-hand";

/** A count of pieces: zero or more, and an empty box counts as zero. */
const countPattern = /^\d*$/;
/** Small points can go either way once cards in hand are subtracted. */
const scorePattern = /^-?\d*$/;

export type CountField = Exclude<keyof FirstHandLastHandRound, "smallPoints">;

/** Each of the pieces counted during the big points, and what one is worth. */
export const countFields: { field: CountField; label: string; value: number }[] =
  [
    { field: "cleanBooks", label: "Clean books", value: cleanBookValue },
    { field: "dirtyBooks", label: "Dirty books", value: dirtyBookValue },
    {
      field: "specialsOnTable",
      label: "Specials on table",
      value: specialCardValue,
    },
    {
      field: "specialsInHand",
      label: "Specials in hand",
      value: -specialCardValue,
    },
    {
      field: "bigBangsInHand",
      label: "Big bangs in hand",
      value: bigBangInHandValue,
    },
  ];

/** What one team typed; kept as text so a box can be left empty. */
export type TeamEntry = Record<CountField | "smallPoints", string>;

export const emptyEntry: TeamEntry = {
  cleanBooks: "",
  dirtyBooks: "",
  specialsOnTable: "",
  specialsInHand: "",
  bigBangsInHand: "",
  smallPoints: "",
};

function parseCount(value: string): number {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) || parsed < 0 ? 0 : parsed;
}

/** Turns what a team typed into a round; small points snap to the nearest 5. */
export function parseEntry(entry: TeamEntry | undefined): FirstHandLastHandRound {
  if (!entry) return emptyRound;

  const smallPoints = parseInt(entry.smallPoints, 10);

  return {
    cleanBooks: parseCount(entry.cleanBooks),
    dirtyBooks: parseCount(entry.dirtyBooks),
    specialsOnTable: parseCount(entry.specialsOnTable),
    specialsInHand: parseCount(entry.specialsInHand),
    bigBangsInHand: parseCount(entry.bigBangsInHand),
    smallPoints: isNaN(smallPoints) ? 0 : roundToIncrement(smallPoints),
  };
}

export interface FirstHandLastHandRoundEntryProps {
  show: boolean;
  round: number;
  teamStates: FirstHandLastHandTeamState[];
  onAccept: (rounds: FirstHandLastHandRound[]) => void;
  onCancel: () => void;
}

export const FirstHandLastHandRoundEntry = (
  props: FirstHandLastHandRoundEntryProps
) => {
  const { show, round, teamStates, onAccept, onCancel } = props;
  // Mounted fresh each time the round is entered, so the boxes start empty.
  const [entries, setEntries] = useState<TeamEntry[]>(() =>
    teamStates.map(() => ({ ...emptyEntry }))
  );

  function updateValue(
    index: number,
    field: keyof TeamEntry,
    newValue: string
  ) {
    const pattern = field === "smallPoints" ? scorePattern : countPattern;
    if (!pattern.test(newValue)) return;

    setEntries(
      entries.map((x, i) => (i === index ? { ...x, [field]: newValue } : x))
    );
  }

  function acceptRound() {
    onAccept(teamStates.map((_, index) => parseEntry(entries[index])));
  }

  function handleKeypress(
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    if (e.key === "Enter") {
      e.preventDefault();
      acceptRound();
    }
  }

  const content = (
    <Stack gap={3}>
      {teamStates.map((teamState, index) => {
        const entry = entries[index] ?? emptyEntry;
        const parsed = parseEntry(entries[index]);
        const total = getTotalScore(teamState);

        return (
          <Stack
            key={teamState.teamInfo.Name}
            gap={2}
            style={{
              padding: 8,
              borderRadius: 12,
              backgroundColor: defaultBlueColor,
            }}
          >
            <Stack direction="horizontal" gap={2}>
              <span style={{ fontWeight: 600, flexGrow: 1 }}>
                {teamState.teamInfo.Name}
              </span>
              <span style={{ fontSize: "8pt" }}>
                {`total ${total} • needs ${getPointsToStart(
                  total
                )} to start`}
              </span>
            </Stack>

            <Stack gap={1}>
              <span style={{ fontWeight: 600, fontSize: "9pt" }}>
                Big points
              </span>
              {countFields.map((countField) => (
                <Stack
                  key={countField.field}
                  direction="horizontal"
                  gap={2}
                  style={{ alignItems: "center" }}
                >
                  <span style={{ flexGrow: 1 }}>{countField.label}</span>
                  <span style={{ fontSize: "8pt", minWidth: 40 }}>
                    {`${countField.value > 0 ? "+" : ""}${countField.value}`}
                  </span>
                  <Form.Control
                    type="text"
                    inputMode="numeric"
                    style={{ width: "70px" }}
                    placeholder="0"
                    value={entry[countField.field]}
                    onChange={(e) =>
                      updateValue(index, countField.field, e.target.value)
                    }
                    onKeyDown={handleKeypress}
                  />
                </Stack>
              ))}
              <Stack direction="horizontal" gap={2}>
                <span style={{ flexGrow: 1, fontSize: "9pt" }}>
                  Big points subtotal
                </span>
                <span style={{ fontWeight: 600 }}>{getBigPoints(parsed)}</span>
              </Stack>
            </Stack>

            <Stack gap={1}>
              <span style={{ fontWeight: 600, fontSize: "9pt" }}>
                Small points
              </span>
              <Stack
                direction="horizontal"
                gap={2}
                style={{ alignItems: "center" }}
              >
                <span style={{ flexGrow: 1 }}>On table less in hand</span>
                <Form.Control
                  type="text"
                  inputMode="numeric"
                  style={{ width: "70px" }}
                  placeholder="0"
                  value={entry.smallPoints}
                  onChange={(e) =>
                    updateValue(index, "smallPoints", e.target.value)
                  }
                  onKeyDown={handleKeypress}
                />
              </Stack>
            </Stack>

            <Stack
              direction="horizontal"
              gap={2}
              style={{
                padding: 6,
                borderRadius: 8,
                backgroundColor: defaultGreenColor,
              }}
            >
              <span style={{ flexGrow: 1, fontWeight: 600 }}>Round score</span>
              <span style={{ fontWeight: 800 }}>{getRoundScore(parsed)}</span>
              <span style={{ fontSize: "8pt" }}>
                {`new total ${total + getRoundScore(parsed)}`}
              </span>
            </Stack>
          </Stack>
        );
      })}
      <div style={{ fontSize: "8pt" }}>
        Big bangs left on the table are worth nothing, so they are not counted.
        Small points are the points on the table less the points still in hand.
        An empty box counts as 0.
      </div>
    </Stack>
  );

  return (
    <SimpleModal
      title={`Round ${round} Scores`}
      content={content}
      defaultButtonContent="Add Scores"
      alternateButtonContent="Cancel"
      onAccept={acceptRound}
      onCancel={onCancel}
      show={show}
    />
  );
};
