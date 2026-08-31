import { useEffect, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Stack from "react-bootstrap/esm/Stack";
import Form from "react-bootstrap/esm/Form";
import { ArrowCounterclockwise, Gear } from "react-bootstrap-icons";
import { GameStatus } from "../../App";
import { CheckboxButton } from "../../common/checkbox-buttons";
import { GameHeader } from "../../common/common-styles";
import { PlayerList } from "../../common/player-list";
import { ResetGame } from "../../common/reset-game";
import { SimpleModal } from "../../common/simple-modal";
import { addPlayer, editPlayer } from "../../common/player-utility";
import { NumericInputArea } from "../../components/numeric-input-area";
import type { PlayerGeneralProps } from "../../components/player-general";
import { useCookies } from "react-cookie";
import { GeneralPointsRoundEntry } from "./components/general-points-round-entry";
import { GeneralPointsScoreTable } from "./components/general-points-score-table";

export const gameName = "General Points";
const gameCookieName = "players_gp";
const maxPlayers = 10;
const minPlayers = 1;
const defaultPointsToFinish = 100;

export const defaultBlueColor = "#DDDDFF";
export const defaultGreenColor = "#DDFFDD";
export const defaultGoldColor = "#FFF2CC";
export const mutedColor = "#4D4D4D";

export interface GeneralPointsPlayerState {
  playerInfo: PlayerGeneralProps;
  roundScores: number[];
}

export interface GeneralPointsRanking {
  rank: number;
  playerInfo: PlayerGeneralProps;
  total: number;
}

export const GeneralPointsGameStatus = {
  GameNotStarted: "GameNotStarted",
  GameActive: "GameActive",
  GameOver: "GameOver",
} as const;
export type GeneralPointsGameStatus =
  (typeof GeneralPointsGameStatus)[keyof typeof GeneralPointsGameStatus];

export function getTotalScore(playerState: GeneralPointsPlayerState): number {
  return playerState.roundScores.reduce((a, b) => a + b, 0);
}

/**
 * The game ends as soon as any player total reaches the finishing score,
 * whether the high or the low score wins. A finishing score of 0 means the
 * game only ends when it is ended by hand.
 */
export function isGameFinished(
  playerStates: GeneralPointsPlayerState[],
  pointsToFinish: number
): boolean {
  if (pointsToFinish <= 0) return false;

  return playerStates.some((x) => getTotalScore(x) >= pointsToFinish);
}

/** Ranks the players best first; tied players share a rank. */
export function getRankings(
  playerStates: GeneralPointsPlayerState[],
  lowScoreWins: boolean
): GeneralPointsRanking[] {
  const totals = playerStates.map((x) => ({
    playerInfo: x.playerInfo,
    total: getTotalScore(x),
  }));

  const sorted = [...totals].sort((a, b) =>
    lowScoreWins ? a.total - b.total : b.total - a.total
  );

  const rankings: GeneralPointsRanking[] = [];
  sorted.forEach((x, index) => {
    const previous = rankings[index - 1];
    rankings.push({
      ...x,
      rank: previous && previous.total === x.total ? previous.rank : index + 1,
    });
  });

  return rankings;
}

export interface GeneralPointsProps {
  onGameStatusChanged: (status: GameStatus) => void;
}

export const GeneralPoints = (props: GeneralPointsProps) => {
  const { onGameStatusChanged } = props;
  const [players, setPlayers] = useState<PlayerGeneralProps[]>([]);
  const [playerStates, setPlayerStates] = useState<GeneralPointsPlayerState[]>(
    []
  );
  const [gameStatus, setGameStatus] = useState<GeneralPointsGameStatus>(
    GeneralPointsGameStatus.GameNotStarted
  );
  const [pointsToFinish, setPointsToFinish] =
    useState<number>(defaultPointsToFinish);
  const [lowScoreWins, setLowScoreWins] = useState<boolean>(false);
  const [showGameSettings, setShowGameSettings] = useState<boolean>(
    players.length === 0
  );
  /** The round the entry popup is on, whether new or being corrected. */
  const [entryRoundIndex, setEntryRoundIndex] = useState<number | undefined>();
  const [cookies, setCookie] = useCookies([gameCookieName]);

  useEffect(() => {
    let newStatus: GameStatus = GameStatus.NotStarted;

    switch (gameStatus) {
      case GeneralPointsGameStatus.GameNotStarted:
        newStatus = GameStatus.NotStarted;
        break;
      case GeneralPointsGameStatus.GameActive:
        newStatus = GameStatus.Active;
        break;
      case GeneralPointsGameStatus.GameOver:
        newStatus = GameStatus.Complete;
        break;
    }

    onGameStatusChanged(newStatus);
  }, [gameStatus, onGameStatusChanged]);

  if (!cookies.players_gp && players.length === 0) {
    setPlayers([{ Name: "Player 1" }, { Name: "Player 2" }]);
  }
  if (cookies.players_gp && players.length === 0) {
    setPlayers(
      cookies?.players_gp.split("|").map((x: string) => {
        return { Name: x };
      })
    );
  }

  function addPlayerLocal(newName: string) {
    return addPlayer(
      players,
      setPlayers,
      (value: string) => setCookie(gameCookieName, value),
      maxPlayers,
      newName
    );
  }

  function editPlayerLocal(originalName: string, newName: string) {
    return editPlayer(
      players,
      setPlayers,
      (value: string) => setCookie(gameCookieName, value),
      originalName,
      newName
    );
  }

  function removePlayer(name: string) {
    const newPlayers = [...players].filter((x) => x.Name !== name);
    setPlayers(newPlayers);
    setCookie(gameCookieName, newPlayers.map((x) => x.Name).join("|"));
  }

  /** Puts every player back on an empty round one. */
  function beginFirstRound() {
    setPlayerStates(players.map((x) => ({ playerInfo: x, roundScores: [] })));
    setGameStatus(GeneralPointsGameStatus.GameActive);
  }

  function startGame() {
    setShowGameSettings(false);
    if (players.length === 0) return;

    beginFirstRound();
  }

  /**
   * Clears the scores and starts over with the same players and options,
   * exactly as if the game had just been started.
   */
  function resetGame() {
    setEntryRoundIndex(undefined);
    if (players.length === 0) {
      setPlayerStates([]);
      setGameStatus(GeneralPointsGameStatus.GameNotStarted);
      return;
    }

    beginFirstRound();
  }

  /** Stores a round, whether it is a new one or a correction to an old one. */
  function saveRound(index: number, roundScores: number[]) {
    const newPlayerStates = playerStates.map((x, playerIndex) => {
      const newScore = roundScores[playerIndex] ?? 0;

      return {
        ...x,
        roundScores:
          index < x.roundScores.length
            ? x.roundScores.map((old, i) => (i === index ? newScore : old))
            : [...x.roundScores, newScore],
      };
    });

    setPlayerStates(newPlayerStates);
    setEntryRoundIndex(undefined);
    setGameStatus(
      isGameFinished(newPlayerStates, pointsToFinish)
        ? GeneralPointsGameStatus.GameOver
        : GeneralPointsGameStatus.GameActive
    );
  }

  function undoLastRound() {
    setPlayerStates(
      playerStates.map((x) => ({
        ...x,
        roundScores: x.roundScores.slice(0, x.roundScores.length - 1),
      }))
    );
    setGameStatus(GeneralPointsGameStatus.GameActive);
  }

  const roundCount = playerStates[0]?.roundScores.length ?? 0;
  const round = roundCount + 1;
  const rankings = getRankings(playerStates, lowScoreWins);

  const settingsContent = (
    <Stack gap={4}>
      <PlayerList
        addPlayer={addPlayerLocal}
        removePlayer={removePlayer}
        editPlayer={editPlayerLocal}
        activePlayers={players}
        canAddPlayer={players.length < maxPlayers}
        canRemovePlayer={players.length > minPlayers}
      />
      <Stack gap={2}>
        <Form.Label style={{ marginBottom: 0 }}>Points to finish:</Form.Label>
        <NumericInputArea
          setNewValue={setPointsToFinish}
          startingValue={pointsToFinish}
          placeholder="points"
          width={150}
        />
        <div style={{ fontSize: "8pt" }}>
          The game ends once any player reaches this total. Use 0 to keep
          playing until you end the game yourself.
        </div>
        <CheckboxButton
          selected={lowScoreWins}
          text="Low score wins"
          onChange={setLowScoreWins}
        />
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
      {entryRoundIndex !== undefined && (
        <GeneralPointsRoundEntry
          show
          round={entryRoundIndex + 1}
          isNewRound={entryRoundIndex === roundCount}
          playerStates={playerStates}
          onAccept={(roundScores) => saveRound(entryRoundIndex, roundScores)}
          onCancel={() => setEntryRoundIndex(undefined)}
        />
      )}
      <GameHeader>
        <h2>
          <Stack direction="horizontal" gap={1}>
            {gameName}
            {gameStatus !== GeneralPointsGameStatus.GameNotStarted && (
              <ResetGame onAccept={resetGame} />
            )}
            {gameStatus === GeneralPointsGameStatus.GameNotStarted ||
            gameStatus === GeneralPointsGameStatus.GameOver ? (
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
        {gameStatus !== GeneralPointsGameStatus.GameNotStarted && (
          <Stack gap={3}>
            {gameStatus === GeneralPointsGameStatus.GameActive && (
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
                {gameStatus === GeneralPointsGameStatus.GameOver
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
              {gameStatus === GeneralPointsGameStatus.GameActive &&
                round > 1 && (
                  <Button
                    variant="link"
                    onClick={() =>
                      setGameStatus(GeneralPointsGameStatus.GameOver)
                    }
                  >
                    End game
                  </Button>
                )}
            </Stack>

            {gameStatus === GeneralPointsGameStatus.GameOver && (
              <Stack gap={1}>
                <h5>
                  {lowScoreWins ? "Final Ranks (low score wins)" : "Final Ranks"}
                </h5>
                {rankings.map((x) => (
                  <div
                    key={x.playerInfo.Name}
                    style={{
                      padding: 8,
                      borderRadius: 12,
                      backgroundColor:
                        x.rank === 1 ? defaultGoldColor : defaultGreenColor,
                      maxWidth: 320,
                    }}
                  >
                    <Stack direction="horizontal" gap={3}>
                      <span style={{ fontWeight: 800 }}>{x.rank}</span>
                      <span style={{ flexGrow: 1 }}>{x.playerInfo.Name}</span>
                      <span style={{ fontWeight: 600 }}>{x.total}</span>
                    </Stack>
                  </div>
                ))}
              </Stack>
            )}

            <GeneralPointsScoreTable
              playerStates={playerStates}
              onEditRound={(index) => setEntryRoundIndex(index)}
            />
          </Stack>
        )}
      </div>
    </>
  );
};
