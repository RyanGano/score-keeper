import Table from "react-bootstrap/esm/Table";
import { getTotalScore, type GeneralPointsPlayerState } from "../general-points";

export interface GeneralPointsScoreTableProps {
  playerStates: GeneralPointsPlayerState[];
}

export const GeneralPointsScoreTable = (
  props: GeneralPointsScoreTableProps
) => {
  const { playerStates } = props;
  const roundCount = playerStates[0]?.roundScores.length ?? 0;

  if (roundCount === 0) return null;

  const runningTotals = playerStates.map(() => 0);

  return (
    <div style={{ overflowX: "auto" }}>
      <Table size="sm" bordered style={{ width: "auto" }}>
        <thead>
          <tr>
            <th>Round</th>
            {playerStates.map((x) => (
              <th key={x.playerInfo.Name}>{x.playerInfo.Name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: roundCount }, (_, round) => (
            <tr key={round}>
              <td>{round + 1}</td>
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
