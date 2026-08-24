import { useEffect, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import Stack from "react-bootstrap/esm/Stack";
import { ArrowCounterclockwise, Gear } from "react-bootstrap-icons";
import { GameStatus } from "../../App";
import { GameHeader } from "../../common/common-styles";
import { PlayerList } from "../../common/player-list";
import { ResetGame } from "../../common/reset-game";
import { SimpleModal } from "../../common/simple-modal";
import { addPlayer, editPlayer } from "../../common/player-utility";
import { NumericInputArea } from "../../components/numeric-input-area";
import type { PlayerGeneralProps } from "../../components/player-general";
import { useCookies } from "react-cookie";
import { FirstHandLastHandRoundEntry } from "./components/first-hand-last-hand-round-entry";
import { FirstHandLastHandScoreTable } from "./components/first-hand-last-hand-score-table";

export const gameName = "First Hand Last Hand";
const gameCookieName = "players_fhlh";
const maxTeams = 4;
const minTeams = 2;
const defaultWinningScore = 10000;

export const defaultBlueColor = "#DDDDFF";
export const defaultGreenColor = "#DDFFDD";
export const defaultGoldColor = "#FFF2CC";

/** What each piece is worth when the big points are counted. */
export const cleanBookValue = 500;
export const dirtyBookValue = 300;
export const specialCardValue = 100;
export const bigBangInHandValue = -300;

/** Scores only ever move in multiples of five. */
export const scoreIncrement = 5;

export interface FirstHandLastHandRound {
  cleanBooks: number;
  dirtyBooks: number;
  specialsOnTable: number;
  specialsInHand: number;
  bigBangsInHand: number;
  /** Points on the table less points still in hand, already netted. */
  smallPoints: number;
}

export interface FirstHandLastHandTeamState {
  teamInfo: PlayerGeneralProps;
  rounds: FirstHandLastHandRound[];
}

export const FirstHandLastHandGameStatus = {
  GameNotStarted: "GameNotStarted",
  GameActive: "GameActive",
  GameOver: "GameOver",
} as const;
export type FirstHandLastHandGameStatus =
  (typeof FirstHandLastHandGameStatus)[keyof typeof FirstHandLastHandGameStatus];

export const emptyRound: FirstHandLastHandRound = {
  cleanBooks: 0,
  dirtyBooks: 0,
  specialsOnTable: 0,
  specialsInHand: 0,
  bigBangsInHand: 0,
  smallPoints: 0,
};

/** Rounds to the nearest multiple of five, the only step this game uses. */
export function roundToIncrement(value: number): number {
  return Math.round(value / scoreIncrement) * scoreIncrement;
}

/**
 * Books, special cards and big bangs. Big bangs left on the table are worth
 * nothing, so they are never recorded.
 */
export function getBigPoints(round: FirstHandLastHandRound): number {
  return (
    round.cleanBooks * cleanBookValue +
    round.dirtyBooks * dirtyBookValue +
    round.specialsOnTable * specialCardValue -
    round.specialsInHand * specialCardValue +
    round.bigBangsInHand * bigBangInHandValue
  );
}

export function getRoundScore(round: FirstHandLastHandRound): number {
  return getBigPoints(round) + round.smallPoints;
}

export function getTotalScore(teamState: FirstHandLastHandTeamState): number {
  return teamState.rounds.reduce((total, x) => total + getRoundScore(x), 0);
}

/**
 * How many points a team has to lay down to get started, which climbs as their
 * score does.
 */
export function getPointsToStart(currentScore: number): number {
  if (currentScore < 5000) return 90;
  if (currentScore < 7500) return 120;
  return 150;
}

export function isGameFinished(
  teamStates: FirstHandLastHandTeamState[],
  winningScore: number
): boolean {
  if (winningScore <= 0) return false;

  return teamStates.some((x) => getTotalScore(x) >= winningScore);
}

/** The teams with the highest total; more than one when the game is tied. */
export function getWinners(
  teamStates: FirstHandLastHandTeamState[]
): FirstHandLastHandTeamState[] {
  if (teamStates.length === 0) return [];

  const best = Math.max(...teamStates.map((x) => getTotalScore(x)));

  return teamStates.filter((x) => getTotalScore(x) === best);
}

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
  const [winningScore, setWinningScore] = useState<number>(defaultWinningScore);
  const [showGameSettings, setShowGameSettings] = useState<boolean>(
    teams.length === 0
  );
  const [showRoundEntry, setShowRoundEntry] = useState<boolean>(false);
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

  function startGame() {
    setShowGameSettings(false);
    if (teams.length === 0) return;

    setTeamStates(teams.map((x) => ({ teamInfo: x, rounds: [] })));
    setGameStatus(FirstHandLastHandGameStatus.GameActive);
  }

  function resetGame() {
    setTeamStates([]);
    setShowRoundEntry(false);
    setGameStatus(FirstHandLastHandGameStatus.GameNotStarted);
  }

  function addRound(rounds: FirstHandLastHandRound[]) {
    const newTeamStates = teamStates.map((x, index) => ({
      ...x,
      rounds: [...x.rounds, rounds[index] ?? emptyRound],
    }));

    setTeamStates(newTeamStates);
    setShowRoundEntry(false);
    if (isGameFinished(newTeamStates, winningScore)) {
      setGameStatus(FirstHandLastHandGameStatus.GameOver);
    }
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

  const round = (teamStates[0]?.rounds.length ?? 0) + 1;
  const winners = getWinners(teamStates);

  const settingsContent = (
    <Stack gap={4}>
      <PlayerList
        addPlayer={addTeamLocal}
        removePlayer={removeTeam}
        editPlayer={editTeamLocal}
        activePlayers={teams}
        canAddPlayer={teams.length < maxTeams}
        canRemovePlayer={teams.length > minTeams}
        playerType="teams"
      />
      <Stack gap={2}>
        <Form.Label style={{ marginBottom: 0 }}>Winning score:</Form.Label>
        <NumericInputArea
          setNewValue={setWinningScore}
          startingValue={winningScore}
          placeholder="points"
          width={150}
        />
        <div style={{ fontSize: "8pt" }}>
          The game ends once any team reaches this total. Use 0 to keep playing
          until you end the game yourself.
        </div>
      </Stack>
    </Stack>
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
      {showRoundEntry && (
        <FirstHandLastHandRoundEntry
          show={showRoundEntry}
          round={round}
          teamStates={teamStates}
          onAccept={addRound}
          onCancel={() => setShowRoundEntry(false)}
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
                onClick={() => setShowRoundEntry(true)}
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

            {gameStatus === FirstHandLastHandGameStatus.GameActive && (
              <Stack gap={1}>
                <span style={{ fontWeight: 600 }}>
                  {`Points needed to start round ${round}:`}
                </span>
                <Stack direction="horizontal" gap={2}>
                  {teamStates.map((x) => (
                    <div
                      key={x.teamInfo.Name}
                      style={{
                        padding: 8,
                        borderRadius: 12,
                        backgroundColor: defaultGreenColor,
                        minWidth: 120,
                      }}
                    >
                      <Stack gap={0}>
                        <span>{x.teamInfo.Name}</span>
                        <span style={{ fontWeight: 800, fontSize: "14pt" }}>
                          {getPointsToStart(getTotalScore(x))}
                        </span>
                        <span style={{ fontSize: "8pt" }}>
                          {`total ${getTotalScore(x)}`}
                        </span>
                      </Stack>
                    </div>
                  ))}
                </Stack>
              </Stack>
            )}

            {gameStatus === FirstHandLastHandGameStatus.GameOver && (
              <Stack gap={1}>
                <h5>Game Over</h5>
                <div
                  style={{
                    padding: 8,
                    borderRadius: 12,
                    backgroundColor: defaultGoldColor,
                    maxWidth: 320,
                  }}
                >
                  {winners.length > 1
                    ? `Tied at ${getTotalScore(
                        winners[0]
                      )}: ${winners.map((x) => x.teamInfo.Name).join(", ")}`
                    : `${winners[0]?.teamInfo.Name} wins with ${getTotalScore(
                        winners[0]
                      )}!`}
                </div>
              </Stack>
            )}

            <FirstHandLastHandScoreTable teamStates={teamStates} />
          </Stack>
        )}
      </div>
    </>
  );
};
