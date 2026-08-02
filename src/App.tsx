import React, { useCallback, useEffect, useState } from "react";
import { SkullKing } from "./games/skull-king/skull-king";
import { RollThroughTheAges } from "./games/roll-through-the-ages/roll-through-the-ages";
import Button from "react-bootstrap/esm/Button";
import Offcanvas from "react-bootstrap/esm/Offcanvas";
import { Cart, InfoCircle, List } from "react-bootstrap-icons";
import Stack from "react-bootstrap/esm/Stack";
import "./App.css";
import { NavLink } from "react-bootstrap";
import { version } from "./version";
// import {
//   FirstHandLastHand,
//   gameName as firstHandLastHandGameName,
// } from "./games/first-hand-last-hand/first-hand-last-hand";

export const Game = {
  SkullKing: "SkullKing",
  RollThroughTheAges: "RollThroughTheAges",
  // FirstHandLastHand: "FirstHandLastHand",
} as const;
export type Game = (typeof Game)[keyof typeof Game];

export const GameStatus = {
  Active: "Active",
  Complete: "Complete",
  NotStarted: "NotStarted",
} as const;
export type GameStatus = (typeof GameStatus)[keyof typeof GameStatus];

const amazonAssociateTag = "aworldchanger-20";

const amazonProductLink = (asin: string) =>
  `https://www.amazon.com/dp/${asin}?tag=${amazonAssociateTag}`;

const amazonSearchLink = (search: string) =>
  `https://www.amazon.com/s?k=${encodeURIComponent(
    search
  )}&tag=${amazonAssociateTag}`;

function App() {
  const [game, setGame] = useState<Game | undefined>();
  const [showMenu, setShowMenu] = useState<boolean>(game === undefined);
  const [gameStatus, setGameStatus] = useState<GameStatus>(
    GameStatus.NotStarted
  );

  function setActiveGame(game: Game) {
    setShowMenu(false);
    setGame(game);
  }

  const showOptionalPopup = useCallback(() => {
    return gameStatus === GameStatus.Active
      ? "Do you really want to close and lose any in progress game information?"
      : null;
  }, [gameStatus]);

  useEffect(() => {
    window.onbeforeunload = function () {
      return showOptionalPopup();
    };

    return () => {
      window.onbeforeunload = null;
    };
  }, [showOptionalPopup]);

  const leftNav = (
    <>
      <Stack style={{ marginLeft: "10px", marginTop: "10px" }} gap={0}>
        <div>
          <Button variant="link" onClick={() => setShowMenu(true)}>
            <List />
          </Button>
        </div>
        {game === undefined && !showMenu && (
          <p style={{ marginLeft: "10px" }}>
            To choose a game, open the
            <Button
              style={{
                marginLeft: "-8px",
                marginRight: "-12px",
                marginTop: "-5px",
              }}
              variant="link"
              onClick={() => setShowMenu(true)}
            >
              menu
            </Button>
            .
          </p>
        )}
      </Stack>

      <Offcanvas
        style={{ backgroundColor: "#eeeeee" }}
        show={showMenu}
        onHide={() => setShowMenu(false)}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <Stack direction="horizontal" gap={2}>
              Score Keeper
              <div style={{ fontSize: "8pt" }}>v{version}</div>
            </Stack>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Stack>
            <Stack direction="horizontal" gap={0}>
              <Button
                variant="link"
                onClick={() => setActiveGame(Game.SkullKing)}
              >
                Skull King
              </Button>
              <NavLink
                target="_blank"
                href="https://www.grandpabecksgames.com/pages/skull-king"
              >
                <InfoCircle />
              </NavLink>
              <NavLink
                target="_blank"
                rel="noreferrer"
                title="Buy Skull King on Amazon"
                href={amazonProductLink("B00CK1EJG8")}
              >
                <Cart />
              </NavLink>
            </Stack>
            <NavLink
              target="_blank"
              href="https://skullk.ing/"
            >
              <Button variant="link" style={{ marginLeft: 16 }}>
                Try the new app here
              </Button>
            </NavLink>
            <Stack direction="horizontal" gap={0}>
              <Button
                variant="link"
                onClick={() => setActiveGame(Game.RollThroughTheAges)}
              >
                Roll Through the Ages
              </Button>
              <NavLink
                target="_blank"
                href="https://www.youtube.com/watch?v=2ZJjtVMvOow"
              >
                <InfoCircle />
              </NavLink>
              <NavLink
                target="_blank"
                rel="noreferrer"
                title="Buy Roll Through the Ages on Amazon"
                href={amazonSearchLink("Roll Through the Ages board game")}
              >
                <Cart />
              </NavLink>
            </Stack>
            {/* <Stack direction="horizontal" gap={0}>
              <Button
                variant="link"
                onClick={() => setActiveGame(Game.FirstHandLastHand)}
              >
                {firstHandLastHandGameName}
              </Button>
            </Stack> */}
            <p style={{ fontSize: "8pt", marginTop: 16, marginBottom: 0 }}>
              As an Amazon Associate I earn from qualifying purchases.
            </p>
          </Stack>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );

  return (
    <div className="App">
      {leftNav}
      {game === Game.SkullKing && (
        <SkullKing onGameStatusChanged={(status) => setGameStatus(status)} />
      )}
      {game === Game.RollThroughTheAges && (
        <RollThroughTheAges
          onGameStatusChanged={(status) => setGameStatus(status)}
        />
      )}
      {/* {game === Game.FirstHandLastHand && (
        <FirstHandLastHand
          onGameStatusChanged={(status) => setGameStatus(status)}
        />
      )} */}
    </div>
  );
}

export default App;
