import Stack from "react-bootstrap/esm/Stack";
import { GameHeader } from "../../common/common-styles";
import { useState } from "react";
import { ResetGame } from "../../common/reset-game";
import Button from "react-bootstrap/esm/Button";
import { Gear } from "react-bootstrap-icons";
import { SimpleModal } from "../../common/simple-modal";
import { PlayerList } from "../../common/player-list";
import { PlayerGeneralProps } from "../../components/player-general";
import useCookies from "react-cookie/cjs/useCookies";
import { addPlayer, editPlayer } from "../../common/player-utility";
import { CheckboxButton } from "../../common/checkbox-buttons";
import { YahtzeeScores } from "./yahtzee-scores";
import { YahtzeeKey } from "./yahtzee-key";

enum GameStatus {
  GameNotStarted,
  GameInProgress,
  GameOver,
}

export const Yahtzee = () => {
  const [players, setPlayers] = useState<PlayerGeneralProps[]>([]);
  const [gameStatus, setGameStatus] = useState<GameStatus>(
    GameStatus.GameNotStarted
  );
  const [showGameSettings, setShowGameSettings] = useState<boolean>(false);
  const [cookies, setCookie] = useCookies(["players_y"]);
  const [tripleYahtzee, setTripleYahtzee] = useState<boolean>(false);

  const maxPlayers = 1;
  const minPlayers = 1;

  function resetGame() {
    setGameStatus(GameStatus.GameNotStarted);
  }

  function startGame() {
    setGameStatus(GameStatus.GameInProgress);
    setShowGameSettings(false);
  }

  if (!cookies.players_y && players.length === 0) {
    setPlayers([{ Name: "Me" }]);
  }
  if (cookies.players_y && players.length === 0) {
    setPlayers(
      cookies?.players_y.split("|").map((x: string) => {
        return { Name: x };
      })
    );
  }

  function addPlayerLocal(newName: string) {
    return addPlayer(
      players,
      setPlayers,
      (value: string) => setCookie("players_y", value),
      maxPlayers,
      newName
    );
  }

  function editPlayerLocal(originalName: string, newName: string) {
    return editPlayer(
      players,
      setPlayers,
      (value: string) => setCookie("players_y", value),
      originalName,
      newName
    );
  }

  const settingsContent = (
    <Stack gap={4}>
      <PlayerList
        addPlayer={addPlayerLocal}
        removePlayer={(_) => {}}
        editPlayer={editPlayerLocal}
        activePlayers={players}
        canAddPlayer={players.length < maxPlayers}
        canRemovePlayer={players.length > minPlayers}
      />
      <div>
        <CheckboxButton
          text="Triple Yahtzee"
          selected={tripleYahtzee}
          onChange={setTripleYahtzee}
        />
      </div>
    </Stack>
  );

  const playerInfo = (
    <Stack
      direction="horizontal"
      gap={2}
      onClick={() =>
        gameStatus !== GameStatus.GameInProgress && setShowGameSettings(true)
      }
    >
      <div style={{ fontSize: "16pt" }}>Player:</div>
      <div style={{ fontSize: "16pt", fontWeight: "500" }}>
        {players[0]?.Name}
      </div>
    </Stack>
  );

  return (
    <>
      <GameHeader>
        <h2>
          <Stack direction="horizontal" gap={1}>
            Yahtzee
            {gameStatus !== GameStatus.GameNotStarted && (
              <ResetGame onAccept={resetGame} />
            )}
            {gameStatus === GameStatus.GameNotStarted ||
            gameStatus === GameStatus.GameOver ? (
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
      <Stack gap={2} style={{ margin: 8 }}>
        <SimpleModal
          title="Yahtzee Settings"
          content={settingsContent}
          defaultButtonContent="Start Game"
          alternateButtonContent="Close"
          onAccept={startGame}
          onCancel={() => setShowGameSettings(false)}
          show={showGameSettings}
        />
        {playerInfo}
        <Stack direction="horizontal" gap={2}>
          <YahtzeeKey />
          <YahtzeeScores multiplier={1} />
          {tripleYahtzee && <YahtzeeScores multiplier={2} />}
          {tripleYahtzee && <YahtzeeScores multiplier={3} />}
        </Stack>
      </Stack>
    </>
  );
};
