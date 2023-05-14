import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import "./App.css";
import { PlayerGeneralProps } from "./components/player-general";
import LeftNav from "./LeftNav";
import { useCookies } from "react-cookie";
import Alert from "react-bootstrap/esm/Alert";

export interface GameProps {
  getPlayers: () => PlayerGeneralProps[];
  setMaxPlayerCount: (max: number) => void;
}

const defaultGameProps: GameProps = {
  getPlayers: () => [],
  setMaxPlayerCount: () => {},
};

export const Context = React.createContext<GameProps>(defaultGameProps);

function App() {
  const [players, setPlayers] = useState<PlayerGeneralProps[]>([]);
  const [maxPlayers, setMaxPlayers] = useState<number>(8);
  const [cookies, setCookie] = useCookies(["game", "players"]);
  const [alert, setAlert] = useState<string | undefined>();

  if (!cookies.players && players.length === 0) {
    setPlayers([{ Name: "Player 1" }, { Name: "Player 2" }]);
  }
  if (cookies.players && players.length === 0) {
    setPlayers(
      cookies?.players.split("|").map((x: string) => {
        return { Name: x };
      })
    );
  }

  function addPlayer(name: string) {
    if (players.length === maxPlayers) return;

    if (players.findIndex((x) => x.Name === name) !== -1) {
      addAlert(`Player ${name} already exists.`);
      return;
    }

    const newPlayers = [
      ...players,
      {
        Name: name,
      } as PlayerGeneralProps,
    ];
    setPlayers(newPlayers);
    setCookie("players", newPlayers.map((x) => x.Name).join("|"));
  }

  function editPlayer(originalName: string, newName: string) {
    if (
      originalName !== newName &&
      players.findIndex((x) => x.Name === newName) !== -1
    ) {
      addAlert(`Player ${newName} already exists.`);
      return;
    }
    const newPlayers = [...players].map((x) =>
      x.Name !== originalName ? x : { Name: newName }
    );
    setPlayers(newPlayers);
    setCookie("players", newPlayers.map((x) => x.Name).join("|"));
  }

  function removePlayer(name: string) {
    const newPlayers = [...players].filter((x) => x.Name !== name);
    setPlayers(newPlayers);
    setCookie("players", newPlayers.map((x) => x.Name).join("|"));
  }

  function addAlert(newAlert: string) {
    if (alert) setAlert(`${alert}|${newAlert}`);
    else setAlert(newAlert);
  }

  const gameContext: GameProps = {
    getPlayers: () => players,
    setMaxPlayerCount: (max) => setMaxPlayers(max),
  };

  const leftNav = (
    <LeftNav
      addPlayer={addPlayer}
      editPlayer={editPlayer}
      removePlayer={removePlayer}
      canAddPlayer={players.length < maxPlayers}
      canRemovePlayer={players.length > 1}
      activePlayers={players}
    />
  );

  return (
    <div className="App">
      {leftNav}
      {alert && (
        <Alert variant="info" onClose={() => setAlert(undefined)} dismissible>
          {alert.split("|").map((x, index) => (
            <div key={index}>{x}</div>
          ))}
        </Alert>
      )}
      <Context.Provider value={gameContext}>
        <Outlet context={gameContext} />
      </Context.Provider>
    </div>
  );
}

export default App;
