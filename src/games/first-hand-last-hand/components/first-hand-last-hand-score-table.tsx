import Table from "react-bootstrap/esm/Table";
import {
  getBigPoints,
  getPointsToStart,
  getRoundScore,
  getTotalScore,
  type FirstHandLastHandTeamState,
} from "../first-hand-last-hand";

export interface FirstHandLastHandScoreTableProps {
  teamStates: FirstHandLastHandTeamState[];
}

export const FirstHandLastHandScoreTable = (
  props: FirstHandLastHandScoreTableProps
) => {
  const { teamStates } = props;
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
              <td>{round + 1}</td>
              {teamStates.map((x, index) => {
                const roundInfo = x.rounds[round];
                const roundScore = getRoundScore(roundInfo);
                runningTotals[index] += roundScore;
                return (
                  <td key={x.teamInfo.Name}>
                    <div>{`${roundScore} (${runningTotals[index]})`}</div>
                    <div style={{ fontSize: "8pt" }}>
                      {`big ${getBigPoints(roundInfo)} / small ${
                        roundInfo.smallPoints
                      }`}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
          <tr>
            <td style={{ fontWeight: 600 }}>Total</td>
            {teamStates.map((x) => (
              <td key={x.teamInfo.Name} style={{ fontWeight: 600 }}>
                {getTotalScore(x)}
              </td>
            ))}
          </tr>
          <tr>
            <td style={{ fontSize: "8pt" }}>To start</td>
            {teamStates.map((x) => (
              <td key={x.teamInfo.Name} style={{ fontSize: "8pt" }}>
                {getPointsToStart(getTotalScore(x))}
              </td>
            ))}
          </tr>
        </tbody>
      </Table>
    </div>
  );
};
