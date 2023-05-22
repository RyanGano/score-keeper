import React, { useState } from "react";
import { SkullKing } from "./games/skull-king";
import { RollThroughTheAges } from "./games/roll-through-the-ages";
import Button from "react-bootstrap/esm/Button";
import Offcanvas from "react-bootstrap/esm/Offcanvas";
import { List } from "react-bootstrap-icons";
import Stack from "react-bootstrap/esm/Stack";
import "./App.css";

export enum Game {
  SkullKing,
  RollThroughTheAges,
}

function App() {
  const [game, setGame] = useState<Game | undefined>();
  const [showMenu, setShowMenu] = useState<boolean>(game === undefined);

  function setActiveGame(game: Game) {
    setShowMenu(false);
    setGame(game);
  }

  const leftNav = (
    <>
      <Button
        style={{ marginTop: "10px", marginLeft: "10px" }}
        variant="link"
        onClick={() => setShowMenu(true)}
      >
        <List />
      </Button>

      <Offcanvas
        style={{ width: "250px", backgroundColor: "#eeeeee" }}
        show={showMenu}
        onHide={() => setShowMenu(false)}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <Stack direction="horizontal" gap={2}>
              Score Keeper
              <div style={{ fontSize: "8pt" }}>v0.0.4</div>
            </Stack>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Stack>
            <div>
              <Button
                variant="link"
                onClick={() => setActiveGame(Game.SkullKing)}
              >
                Skull King
              </Button>
            </div>
            <div>
              <Button
                variant="link"
                onClick={() => setActiveGame(Game.RollThroughTheAges)}
              >
                Roll Through the Ages
              </Button>
            </div>
          </Stack>
        </Offcanvas.Body>
      </Offcanvas>
    </>
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
