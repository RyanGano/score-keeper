import { useEffect, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Stack from "react-bootstrap/esm/Stack";
import { ArrowCounterclockwise, Gear } from "react-bootstrap-icons";
import { GameStatus } from "../../App";
import { GameHeader } from "../../common/common-styles";
import { PlayerList } from "../../common/player-list";
import { ResetGame } from "../../common/reset-game";
import { SimpleModal } from "../../common/simple-modal";
import { addPlayer, editPlayer } from "../../common/player-utility";
import type { PlayerGeneralProps } from "../../components/player-general";
import { useCookies } from "react-cookie";
import {
  defaultBlueColor,
  defaultGoldColor,
  defaultGreenColor,
  emptyRound,
  FirstHandLastHandGameStatus,
  getPointsToStart,
  getTotalScore,
  getWinners,
  isGameFinished,
  mutedColor,
  type FirstHandLastHandRound,
  type FirstHandLastHandTeamState,
} from "./first-hand-last-hand-scoring";
import { FirstHandLastHandRoundEntry } from "./components/first-hand-last-hand-round-entry";
import { FirstHandLastHandScoreTable } from "./components/first-hand-last-hand-score-table";

export const gameName = "First Hand Last Hand";
const gameCookieName = "players_fhlh";
const maxTeams = 4;
const minTeams = 2;

export interface FirstHandLastHandProps {
  onGameStatusChanged: (status: GameStatus) => void;
}

export const FirstHandLastHand = (props: FirstHandLastHandProps) => {
  const { onGameStatusChanged } = props;
  const [teams, setTeams] = useState<PlayerGeneralProps[]>([]);
  const [teamStates, setTeamStates] = useState<FirstHandLastHandTeamState[]>([]);
  const [gameStatus, setGameStatus] = useState<FirstHandLastHandGameStatus>(
    FirstHandLastHandGameStatus.GameNotStarted
  );
  const [showGameSettings, setShowGameSettings] = useState<boolean>(
    teams.length === 0
  );
  /** The round the entry popup is on, whether new or being corrected. */
  const [entryRoundIndex, setEntryRoundIndex] = useState<number | undefined>();
  const [cookies, setCookie] = useCookies([gameCookieName]);

  useEffect(() => {
    let newStatus: GameStatus = GameStatus.NotStarted;

    switch (gameStatus) {
      case FirstHandLastHandGameStatus.GameNotStarted:
        newStatus = GameStatus.NotStarted;
        break;
      case FirstHandLastHandGameStatus.GameActive:
        newStatus = GameStatus.Active;
        break;
      case FirstHandLastHandGameStatus.GameOver:
        newStatus = GameStatus.Complete;
        break;
    }

    onGameStatusChanged(newStatus);
  }, [gameStatus, onGameStatusChanged]);

  if (!cookies.players_fhlh && teams.length === 0) {
    setTeams([{ Name: "Team 1" }, { Name: "Team 2" }]);
  }
  if (cookies.players_fhlh && teams.length === 0) {
    setTeams(
      cookies?.players_fhlh.split("|").map((x: string) => {
        return { Name: x };
      })
    );
  }

  function addTeamLocal(newName: string) {
    return addPlayer(
      teams,
      setTeams,
      (value: string) => setCookie(gameCookieName, value),
      maxTeams,
      newName
    );
  }

  function editTeamLocal(originalName: string, newName: string) {
    return editPlayer(
      teams,
      setTeams,
      (value: string) => setCookie(gameCookieName, value),
      originalName,
      newName
    );
  }

  function removeTeam(name: string) {
    const newTeams = [...teams].filter((x) => x.Name !== name);
    setTeams(newTeams);
    setCookie(gameCookieName, newTeams.map((x) => x.Name).join("|"));
  }

  /** Puts every team back on an empty round one. */
  function beginFirstRound() {
    setTeamStates(teams.map((x) => ({ teamInfo: x, rounds: [] })));
    setGameStatus(FirstHandLastHandGameStatus.GameActive);
  }

  function startGame() {
    setShowGameSettings(false);
    if (teams.length === 0) return;

    beginFirstRound();
  }

  /**
   * Clears the scores and starts over with the same teams, exactly as if the
   * game had just been started.
   */
  function resetGame() {
    setEntryRoundIndex(undefined);
    if (teams.length === 0) {
      setTeamStates([]);
      setGameStatus(FirstHandLastHandGameStatus.GameNotStarted);
      return;
    }

    beginFirstRound();
  }

  /** Stores a round, whether it is a new one or a correction to an old one. */
  function saveRound(index: number, rounds: FirstHandLastHandRound[]) {
    const newTeamStates = teamStates.map((x, teamIndex) => {
      const newRound = rounds[teamIndex] ?? emptyRound;

      return {
        ...x,
        rounds:
          index < x.rounds.length
            ? x.rounds.map((old, i) => (i === index ? newRound : old))
            : [...x.rounds, newRound],
      };
    });

    setTeamStates(newTeamStates);
    setEntryRoundIndex(undefined);
    setGameStatus(
      isGameFinished(newTeamStates)
        ? FirstHandLastHandGameStatus.GameOver
        : FirstHandLastHandGameStatus.GameActive
    );
  }

  function undoLastRound() {
    setTeamStates(
      teamStates.map((x) => ({
        ...x,
        rounds: x.rounds.slice(0, x.rounds.length - 1),
      }))
    );
    setGameStatus(FirstHandLastHandGameStatus.GameActive);
  }

  const roundCount = teamStates[0]?.rounds.length ?? 0;
  const round = roundCount + 1;
  const winners = getWinners(teamStates);

  const settingsContent = (
    <PlayerList
      addPlayer={addTeamLocal}
      removePlayer={removeTeam}
      editPlayer={editTeamLocal}
      activePlayers={teams}
      canAddPlayer={teams.length < maxTeams}
      canRemovePlayer={teams.length > minTeams}
      playerType="teams"
    />
  );

  return (
    <>
      <SimpleModal
        title={`${gameName} Settings`}
        content={settingsContent}
        defaultButtonContent="Start Game"
        alternateButtonContent="Close"
        onAccept={startGame}
        onCancel={() => setShowGameSettings(false)}
        show={showGameSettings}
      />
      {entryRoundIndex !== undefined && (
        <FirstHandLastHandRoundEntry
          show
          roundNumber={entryRoundIndex + 1}
          isNewRound={entryRoundIndex === roundCount}
          teamStates={teamStates}
          onAccept={(rounds) => saveRound(entryRoundIndex, rounds)}
          onCancel={() => setEntryRoundIndex(undefined)}
        />
      )}
      <GameHeader>
        <h2>
          <Stack direction="horizontal" gap={1}>
            {gameName}
            {gameStatus !== FirstHandLastHandGameStatus.GameNotStarted && (
              <ResetGame onAccept={resetGame} />
            )}
            {gameStatus === FirstHandLastHandGameStatus.GameNotStarted ||
            gameStatus === FirstHandLastHandGameStatus.GameOver ? (
              <Button variant="link" onClick={() => setShowGameSettings(true)}>
                <Gear />
              </Button>
            ) : (
              <Button variant="link" disabled>
                <Gear />
              </Button>
            )}
          </Stack>
        </h2>
      </GameHeader>

      <div
        style={{
          position: "absolute",
          left: "12px",
          top: "74px",
          right: "12px",
        }}
      >
        {gameStatus !== FirstHandLastHandGameStatus.GameNotStarted && (
          <Stack gap={3}>
            {gameStatus === FirstHandLastHandGameStatus.GameActive && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 12,
                  backgroundColor: defaultBlueColor,
                  borderRadius: 12,
                  minHeight: 50,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
                onClick={() => setEntryRoundIndex(roundCount)}
              >
                {`Enter Round ${round} Scores`}
              </div>
            )}

            <Stack direction="horizontal" gap={2}>
              <span style={{ fontWeight: 600 }}>
                {gameStatus === FirstHandLastHandGameStatus.GameOver
                  ? "Game Over"
                  : `Round: ${round}`}
              </span>
              <Button
                variant="link"
                disabled={round === 1}
                title="Undo last round"
                onClick={undoLastRound}
              >
                <ArrowCounterclockwise />
              </Button>
              {gameStatus === FirstHandLastHandGameStatus.GameActive &&
                round > 1 && (
                  <Button
                    variant="link"
                    onClick={() =>
                      setGameStatus(FirstHandLastHandGameStatus.GameOver)
                    }
                  >
                    End game
                  </Button>
                )}
            </Stack>

            <Stack direction="horizontal" gap={2}>
              {teamStates.map((x) => (
                <div
                  key={x.teamInfo.Name}
                  style={{
                    padding: 8,
                    borderRadius: 12,
                    backgroundColor: defaultGreenColor,
                    minWidth: 130,
                  }}
                >
                  <Stack gap={0}>
                    <span>{x.teamInfo.Name}</span>
                    <span style={{ fontSize: "1.75rem", lineHeight: 1.1 }}>
                      {getTotalScore(x)}
                    </span>
                    <span style={{ color: mutedColor }}>
                      {`${getPointsToStart(getTotalScore(x))} to start`}
                    </span>
                  </Stack>
                </div>
              ))}
            </Stack>

            {gameStatus === FirstHandLastHandGameStatus.GameOver && (
              <div
                style={{
                  padding: 8,
                  borderRadius: 12,
                  backgroundColor: defaultGoldColor,
                  maxWidth: 320,
                  fontWeight: 600,
                }}
              >
                {winners.length > 1
                  ? `Tied at ${getTotalScore(winners[0])}: ${winners
                      .map((x) => x.teamInfo.Name)
                      .join(", ")}`
                  : `${winners[0]?.teamInfo.Name} wins with ${getTotalScore(
                      winners[0]
                    )}!`}
              </div>
            )}

            <FirstHandLastHandScoreTable
              teamStates={teamStates}
              onEditRound={(index) => setEntryRoundIndex(index)}
            />
          </Stack>
        )}
      </div>
    </>
  );
};
