import { useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Stack from "react-bootstrap/esm/Stack";
import Table from "react-bootstrap/esm/Table";
import { Pencil } from "react-bootstrap-icons";
import {
  bigPointFields,
  getBigPoints,
  getRoundScore,
  getTotalScore,
  mutedColor,
  negativeColor,
  type FirstHandLastHandRound,
  type FirstHandLastHandTeamState,
} from "../first-hand-last-hand-scoring";

const breakdownWidth = 230;

/** Where a breakdown is pinned, and which score it belongs to. */
export interface BreakdownState {
  teamName: string;
  roundNumber: number;
  round: FirstHandLastHandRound;
  top: number;
  left: number;
}

export interface RoundBreakdownProps {
  breakdown: BreakdownState;
}

/**
 * Every line of a round's scoring, kept out of the table until asked for.
 * Pinned to the window under the score it explains rather than handed to
 * react-bootstrap's Overlay, which cannot place itself under React 19.
 */
export const RoundBreakdown = (props: RoundBreakdownProps) => {
  const { teamName, roundNumber, round, top, left } = props.breakdown;

  const line = (label: string, value: number, bold?: boolean) => (
    <Stack direction="horizontal" gap={3} key={label}>
      <span style={{ flexGrow: 1, color: value === 0 ? mutedColor : undefined }}>
        {label}
      </span>
      <span
        style={{
          fontWeight: bold ? 600 : undefined,
          color:
            value < 0 ? negativeColor : value === 0 ? mutedColor : undefined,
        }}
      >
        {value}
      </span>
    </Stack>
  );

  return (
    <div
      style={{
        position: "fixed",
        top: top,
        left: left,
        width: breakdownWidth,
        zIndex: 2000,
        backgroundColor: "#FFFFFF",
        border: "1px solid #BBBBBB",
        borderRadius: 8,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          padding: "6px 10px",
          backgroundColor: "#F0F0F0",
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          borderBottom: "1px solid #BBBBBB",
        }}
      >
        {`${teamName} — round ${roundNumber}`}
      </div>
      <Stack gap={1} style={{ padding: "8px 10px" }}>
        {bigPointFields.map((x) => line(x.label, round[x.field]))}
        {line("Big points", getBigPoints(round), true)}
        {line("Small points", round.smallPoints)}
        {line("Round score", getRoundScore(round), true)}
      </Stack>
    </div>
  );
};

export interface FirstHandLastHandScoreTableProps {
  teamStates: FirstHandLastHandTeamState[];
  onEditRound: (roundIndex: number) => void;
}

export const FirstHandLastHandScoreTable = (
  props: FirstHandLastHandScoreTableProps
) => {
  const { teamStates, onEditRound } = props;
  const [breakdown, setBreakdown] = useState<BreakdownState | undefined>();
  const roundCount = teamStates[0]?.rounds.length ?? 0;

  if (roundCount === 0) return null;

  const runningTotals = teamStates.map(() => 0);

  /** Pins the breakdown under the score it explains, kept inside the window. */
  function showBreakdown(
    score: HTMLElement,
    teamName: string,
    roundNumber: number,
    round: FirstHandLastHandRound
  ) {
    const rect = score.getBoundingClientRect();

    setBreakdown({
      teamName,
      roundNumber,
      round,
      top: rect.bottom + 4,
      left: Math.max(
        4,
        Math.min(rect.left, window.innerWidth - breakdownWidth - 4)
      ),
    });
  }

  return (
    <div style={{ overflowX: "auto" }}>
      {breakdown && <RoundBreakdown breakdown={breakdown} />}
      <Table size="sm" bordered style={{ width: "auto" }}>
        <thead>
          <tr>
            <th>Round</th>
            {teamStates.map((x) => (
              <th key={x.teamInfo.Name}>{x.teamInfo.Name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: roundCount }, (_, round) => (
            <tr key={round}>
              <td>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  {round + 1}
                  <Button
                    variant="link"
                    title={`Edit round ${round + 1}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: 0,
                      border: "none",
                      color: mutedColor,
                    }}
                    onClick={() => onEditRound(round)}
                  >
                    <Pencil />
                  </Button>
                </div>
              </td>
              {teamStates.map((x, index) => {
                const roundInfo = x.rounds[round];
                const roundScore = getRoundScore(roundInfo);
                runningTotals[index] += roundScore;
                return (
                  <td key={x.teamInfo.Name}>
                    <span
                      tabIndex={0}
                      aria-label={`Round ${round + 1} score for ${
                        x.teamInfo.Name
                      }`}
                      style={{ cursor: "pointer" }}
                      onMouseEnter={(e) =>
                        showBreakdown(
                          e.currentTarget,
                          x.teamInfo.Name,
                          round + 1,
                          roundInfo
                        )
                      }
                      onFocus={(e) =>
                        showBreakdown(
                          e.currentTarget,
                          x.teamInfo.Name,
                          round + 1,
                          roundInfo
                        )
                      }
                      onMouseLeave={() => setBreakdown(undefined)}
                      onBlur={() => setBreakdown(undefined)}
                    >
                      <span
                        style={{
                          color: roundScore < 0 ? negativeColor : undefined,
                        }}
                      >
                        {roundScore}
                      </span>
                      <span style={{ color: mutedColor }}>
                        {` (${runningTotals[index]})`}
                      </span>
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
          <tr>
            <td style={{ fontWeight: 600 }}>Total</td>
            {teamStates.map((x) => (
              <td
                key={x.teamInfo.Name}
                style={{
                  fontWeight: 600,
                  color: getTotalScore(x) < 0 ? negativeColor : undefined,
                }}
              >
                {getTotalScore(x)}
              </td>
            ))}
          </tr>
        </tbody>
      </Table>
    </div>
  );
};
