import type React from "react";
import { useState } from "react";
import Form from "react-bootstrap/esm/Form";
import Stack from "react-bootstrap/esm/Stack";
import { SimpleModal } from "../../../common/simple-modal";
import {
  bigPointFields,
  defaultBlueColor,
  emptyEntry,
  entryPattern,
  formatEntry,
  getBigPoints,
  getRoundScore,
  maxPieceCount,
  mutedColor,
  negativeColor,
  parseEntry,
  scorePattern,
  type FirstHandLastHandRound,
  type FirstHandLastHandTeamState,
  type TeamEntry,
} from "../first-hand-last-hand-scoring";

export interface FirstHandLastHandRoundEntryProps {
  show: boolean;
  roundNumber: number;
  isNewRound: boolean;
  teamStates: FirstHandLastHandTeamState[];
  onAccept: (rounds: FirstHandLastHandRound[]) => void;
  onCancel: () => void;
}

export const FirstHandLastHandRoundEntry = (
  props: FirstHandLastHandRoundEntryProps
) => {
  const { show, roundNumber, isNewRound, teamStates, onAccept, onCancel } =
    props;
  // Mounted fresh each time a round is opened, on the round being entered or
  // corrected.
  const [entries, setEntries] = useState<TeamEntry[]>(() =>
    teamStates.map((x) => formatEntry(x.rounds[roundNumber - 1]))
  );

  function updateValue(index: number, field: keyof TeamEntry, newValue: string) {
    const pattern = field === "smallPoints" ? scorePattern : entryPattern;
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

        return (
          <Stack
            key={teamState.teamInfo.Name}
            gap={1}
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
              <span style={{ color: mutedColor }}>round</span>
              <span
                style={{ fontWeight: 600, minWidth: 60, textAlign: "right" }}
              >
                {getRoundScore(parsed)}
              </span>
            </Stack>

            {bigPointFields.map((fieldInfo) => (
              <Stack
                key={fieldInfo.field}
                direction="horizontal"
                gap={2}
                style={{ alignItems: "center" }}
              >
                <span
                  style={{
                    flexGrow: 1,
                    color: fieldInfo.isPenalty ? negativeColor : undefined,
                  }}
                >
                  {fieldInfo.label}
                  <span style={{ color: mutedColor }}>
                    {` ${fieldInfo.isPenalty ? "-" : ""}${
                      fieldInfo.pieceValue
                    } ea`}
                  </span>
                </span>
                <Form.Control
                  type="text"
                  inputMode="numeric"
                  size="sm"
                  style={{ width: "64px" }}
                  placeholder="0"
                  value={entry[fieldInfo.field]}
                  onChange={(e) =>
                    updateValue(index, fieldInfo.field, e.target.value)
                  }
                  onKeyDown={handleKeypress}
                />
                <span
                  style={{
                    minWidth: 60,
                    textAlign: "right",
                    color:
                      parsed[fieldInfo.field] < 0 ? negativeColor : mutedColor,
                  }}
                >
                  {parsed[fieldInfo.field]}
                </span>
              </Stack>
            ))}

            <Stack direction="horizontal" gap={2}>
              <span style={{ flexGrow: 1, color: mutedColor }}>Big points</span>
              <span style={{ minWidth: 60, textAlign: "right" }}>
                {getBigPoints(parsed)}
              </span>
            </Stack>

            <Stack
              direction="horizontal"
              gap={2}
              style={{ alignItems: "center" }}
            >
              <span style={{ flexGrow: 1 }}>
                Points on table
                <span style={{ color: negativeColor }}>
                  {" minus points in hand"}
                </span>
              </span>
              <Form.Control
                type="text"
                inputMode="numeric"
                size="sm"
                style={{ width: "64px" }}
                placeholder="0"
                value={entry.smallPoints}
                onChange={(e) =>
                  updateValue(index, "smallPoints", e.target.value)
                }
                onKeyDown={handleKeypress}
              />
              <span
                style={{
                  minWidth: 60,
                  textAlign: "right",
                  color: parsed.smallPoints < 0 ? negativeColor : mutedColor,
                }}
              >
                {parsed.smallPoints}
              </span>
            </Stack>
          </Stack>
        );
      })}
      <div style={{ color: mutedColor }}>
        {`Type a count of pieces (up to ${maxPieceCount}) or the points they are worth — 3 and 1500 both mean three clean books. Big bangs left on the table are worth nothing, so they are not counted.`}
      </div>
    </Stack>
  );

  return (
    <SimpleModal
      title={`Round ${roundNumber} Scores`}
      content={content}
      defaultButtonContent={isNewRound ? "Add Scores" : "Save Scores"}
      alternateButtonContent="Cancel"
      onAccept={acceptRound}
      onCancel={onCancel}
      show={show}
    />
  );
};
