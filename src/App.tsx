import React, { useState } from "react";
import "./App.css";
import LeftNav from "./LeftNav";
import { SkullKing } from "./games/skull-king";
import { RollThroughTheAges } from "./games/roll-through-the-ages";

export enum Game {
  SkullKing,
  RollThroughTheAges,
}

function App() {
  const [game, setGame] = useState<Game | undefined>();

  function setActiveGame(game: Game) {
    setGame(game);
  }

  const leftNav = (
    <LeftNav setGame={setActiveGame} collapsed={game !== undefined} />
  );

  return (
    <div className="App">
      {leftNav}
      {game === Game.SkullKing && <SkullKing />}
      {game === Game.RollThroughTheAges && <RollThroughTheAges />}
    </div>
  );
}

export default App;
