import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import "./App.css";
import { PlayerGeneralProps } from "./components/player-general";
import LeftNav from "./LeftNav";

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
  const [players, setPlayers] = useState<PlayerGeneralProps[]>([
    { Name: "Ryan" },
    { Name: "Lisa" },
    { Name: "Ryan Jr." },
    { Name: "Kristen" },
    { Name: "Eric" },
  ]);
  const [maxPlayers, setMaxPlayers] = useState<number>(8);

  function addPlayer(name: string) {
    if (players.length === maxPlayers) return;

    setPlayers([
      ...players,
      {
        Name: name,
      } as PlayerGeneralProps,
    ]);
  }

  function removePlayer(name: string) {
    setPlayers([...players].filter((x) => x.Name !== name));
  }

  const gameContext: GameProps = {
    getPlayers: () => players,
    setMaxPlayerCount: (max) => setMaxPlayers(max),
  };

  const leftNav = (
    <LeftNav
      addPlayer={addPlayer}
      removePlayer={removePlayer}
      canAddPlayer={players.length < maxPlayers}
      activePlayers={players}
    />
  );

  return (
    <div className="App">
      {leftNav}
      <Context.Provider value={gameContext}>
        <Outlet context={gameContext} />
      </Context.Provider>
    </div>
  );
}

export default App;

