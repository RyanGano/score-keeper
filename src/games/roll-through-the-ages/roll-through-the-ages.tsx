import * as React from "react";
import { GameHeader } from "../../common/common-styles";
import { useState } from "react";
import { SimpleModal } from "../../common/simple-modal";
import Stack from "react-bootstrap/esm/Stack";
import { PlayerList } from "../../common/player-list";
import { PlayerGeneralProps } from "../../components/player-general";
import { addPlayer, editPlayer } from "../../common/player-utility";
import useCookies from "react-cookie/cjs/useCookies";
import Button from "react-bootstrap/esm/Button";
import { Gear } from "react-bootstrap-icons";
import { ResetGame } from "../../common/reset-game";
import { Developments } from "./components/developments";
import { CheckboxButton } from "../../common/checkbox-buttons";
import { City, defaultCities } from "./components/city";

enum GameStatus {
  GameNotStarted,
  GameStarted,
  GameOver,
}

export const RollThroughTheAges = () => {
  const [players, setPlayers] = useState<PlayerGeneralProps[]>([]);
  const [showGameSettings, setShowGameSettings] = useState<boolean>(
    players.length === 0
  );
  const [startingPlayer, setStartingPlayer] = useState<boolean>(false);
  const [numberOfPlayers, setNumberOfPlayers] = useState<number>(2);
  const [gameStatus, setGameStatus] = useState<GameStatus>(
    GameStatus.GameNotStarted
  );
  const [cities, setCities] = useState(
    defaultCities.map((x) => {
      return { cost: x.cost, completed: x.cost === 0 };
    })
  );
  const [developmentsScore, setDevelopmentsScore] = useState<number>(0);
  const [cookies, setCookie] = useCookies(["players_rtta"]);

  const minPlayers = 1;
  const maxPlayers = 1;

  if (!cookies.players_rtta && players.length === 0) {
    setPlayers([{ Name: "Me" }]);
  }
  if (cookies.players_rtta && players.length === 0) {
    setPlayers(
      cookies?.players_rtta.split("|").map((x: string) => {
        return { Name: x };
      })
    );
  }

  function addPlayerLocal(newName: string) {
    return addPlayer(
      players,
      setPlayers,
      (value: string) => setCookie("players_rtta", value),
      maxPlayers,
      newName
    );
  }

  function editPlayerLocal(originalName: string, newName: string) {
    return editPlayer(
      players,
      setPlayers,
      (value: string) => setCookie("players_rtta", value),
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
          text="First Player"
          selected={startingPlayer}
          onChange={setStartingPlayer}
        />
      </div>
      <Stack direction="horizontal">
        Number of Players:
        <CheckboxButton
          text="2"
          selected={numberOfPlayers === 2}
          onChange={(_) => setNumberOfPlayers(2)}
        />
        <CheckboxButton
          text="3"
          selected={numberOfPlayers === 3}
          onChange={(_) => setNumberOfPlayers(3)}
        />
        <CheckboxButton
          text="4"
          selected={numberOfPlayers === 4}
          onChange={(_) => setNumberOfPlayers(4)}
        />
      </Stack>
    </Stack>
  );

  function startGame() {
    setShowGameSettings(false);
    setGameStatus(GameStatus.GameStarted);
  }

  function resetGame() {
    setGameStatus(GameStatus.GameNotStarted);
  }

  function updateCities(whichCity: number, completed: boolean): void {
    const updatedCityInfo = cities.map((x, index) =>
      index === whichCity ? { ...x, completed } : { ...x }
    );

    setCities(updatedCityInfo);
  }

  return (
    <>
      <GameHeader>
        <h2>
          <Stack direction="horizontal" gap={1}>
            Roll Through the Ages
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
        <SimpleModal
          title="Roll Through the Ages Settings"
          content={settingsContent}
          defaultButtonContent="Start Game"
          alternateButtonContent="Close"
          onAccept={() => startGame()}
          onCancel={() => setShowGameSettings(false)}
          show={showGameSettings}
        />
      </GameHeader>
      {/* Game area */}
      <Stack direction="horizontal" gap={1} style={{ minHeight: "108px" }}>
        {cities.map((x, index) => (
          <City
            key={index}
            cost={x.cost}
            setCompleted={(completed) => updateCities(index, completed)}
            index={index + 1}
          />
        ))}
      </Stack>
      {`Score ${developmentsScore}`}
      <Developments
        updateDevelopmentScore={setDevelopmentsScore}
        cityCount={cities.filter((x) => x.completed).length}
        monumentCount={0}
      />
    </>
  );
};
