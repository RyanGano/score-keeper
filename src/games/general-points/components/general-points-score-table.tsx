import Button from "react-bootstrap/esm/Button";
import Table from "react-bootstrap/esm/Table";
import { Pencil } from "react-bootstrap-icons";
import {
  defaultGoldColor,
  defaultGreenColor,
  formatRank,
  getTotalScore,
  mutedColor,
  type GeneralPointsPlayerState,
  type GeneralPointsRanking,
} from "../general-points";

export interface GeneralPointsScoreTableProps {
  playerStates: GeneralPointsPlayerState[];
  rankings: GeneralPointsRanking[];
  onEditRound: (roundIndex: number) => void;
}

export const GeneralPointsScoreTable = (
  props: GeneralPointsScoreTableProps
) => {
  const { playerStates, rankings, onEditRound } = props;
  const roundCount = playerStates[0]?.roundScores.length ?? 0;

  if (roundCount === 0) return null;

  const runningTotals = playerStates.map(() => 0);

  return (
    <div style={{ overflowX: "auto" }}>
      <Table size="sm" bordered style={{ width: "auto" }}>
        <thead>
          <tr>
            <th>Round</th>
            {playerStates.map((x) => {
              const ranking = rankings.find(
                (r) => r.playerInfo.Name === x.playerInfo.Name
              );
              const isTied = rankings.some(
                (r) => r !== ranking && r.rank === ranking?.rank
              );

              return (
                <th key={x.playerInfo.Name}>
                  {x.playerInfo.Name}
                  {ranking && (
                    // On its own line so a badge never widens the column.
                    <div>
                      <span
                        style={{
                          padding: "0 6px",
                          borderRadius: 8,
                          backgroundColor:
                            ranking.rank === 1
                              ? defaultGoldColor
                              : defaultGreenColor,
                          fontSize: "8pt",
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formatRank(ranking.rank, isTied)}
                      </span>
                    </div>
                  )}
                </th>
              );
            })}
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
              {playerStates.map((x, index) => {
                const roundScore = x.roundScores[round];
                runningTotals[index] += roundScore;
                return (
                  <td key={x.playerInfo.Name}>
                    {`${roundScore} (${runningTotals[index]})`}
                  </td>
                );
              })}
            </tr>
          ))}
          <tr>
            <td style={{ fontWeight: 600 }}>Total</td>
            {playerStates.map((x) => (
              <td key={x.playerInfo.Name} style={{ fontWeight: 600 }}>
                {getTotalScore(x)}
              </td>
            ))}
          </tr>
        </tbody>
      </Table>
    </div>
  );
};
