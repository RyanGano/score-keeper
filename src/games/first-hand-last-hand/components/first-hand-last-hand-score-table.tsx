import Button from "react-bootstrap/esm/Button";
import OverlayTrigger from "react-bootstrap/esm/OverlayTrigger";
import Popover from "react-bootstrap/esm/Popover";
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

export interface RoundBreakdownProps {
  teamName: string;
  roundNumber: number;
  round: FirstHandLastHandRound;
}

/** Every line of a round's scoring, kept out of the table until asked for. */
export const RoundBreakdown = (props: RoundBreakdownProps) => {
  const { teamName, roundNumber, round } = props;

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
    // Rendered on the body, and painted here rather than left to the
    // stylesheet, so it always sits solid above the score pad beneath it.
    <Popover
      style={{
        zIndex: 2000,
        backgroundColor: "#FFFFFF",
        border: "1px solid #BBBBBB",
        borderRadius: 8,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)",
      }}
    >
      <Popover.Header
        style={{
          backgroundColor: "#F0F0F0",
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        }}
      >
        {`${teamName} — round ${roundNumber}`}
      </Popover.Header>
      <Popover.Body
        style={{
          backgroundColor: "#FFFFFF",
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
        }}
      >
        <Stack gap={1} style={{ minWidth: 210 }}>
          {bigPointFields.map((x) => line(x.label, round[x.field]))}
          {line("Big points", getBigPoints(round), true)}
          {line("Small points", round.smallPoints)}
          {line("Round score", getRoundScore(round), true)}
        </Stack>
      </Popover.Body>
    </Popover>
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
  const roundCount = teamStates[0]?.rounds.length ?? 0;

  if (roundCount === 0) return null;

  const runningTotals = teamStates.map(() => 0);

  return (
    <div style={{ overflowX: "auto" }}>
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
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
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
                    <OverlayTrigger
                      trigger={["hover", "focus"]}
                      rootClose
                      placement="bottom"
                      container={document.body}
                      overlay={
                        <RoundBreakdown
                          teamName={x.teamInfo.Name}
                          roundNumber={round + 1}
                          round={roundInfo}
                        />
                      }
                    >
                      <span tabIndex={0} style={{ cursor: "pointer" }}>
                        <span
                          style={{
                            color:
                              roundScore < 0 ? negativeColor : undefined,
                          }}
                        >
                          {roundScore}
                        </span>
                        <span style={{ color: mutedColor }}>
                          {` (${runningTotals[index]})`}
                        </span>
                      </span>
                    </OverlayTrigger>
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
