import React, { useState } from "react";
import { List } from "react-bootstrap-icons";
import Button from "react-bootstrap/esm/Button";
import Stack from "react-bootstrap/esm/Stack";
import { Game } from "./App";
import Nav from "react-bootstrap/esm/Nav";

export interface LeftNavProps {
  setGame: (game: Game) => void;
  collapsed: boolean;
  appVersion: string;
}

export const LeftNav = (props: LeftNavProps) => {
  const [showPopover, setShowPopover] = useState<boolean>(false);

  return (
    <div className="LeftNav">
      {props.collapsed && !showPopover && (
        <div style={{ padding: "12px" }}>
          <Button onClick={() => setShowPopover(true)}>
            <List />
          </Button>
        </div>
      )}
      {(!props.collapsed || showPopover) && (
        <Nav className="scorekeepersidebar">
          <Stack style={{ paddingLeft: "12px" }}>
            {showPopover && (
              <Stack direction="horizontal">
                <Button onClick={() => setShowPopover(false)}>
                  <List />
                </Button>
              </Stack>
            )}
            {!showPopover && (
              <Stack direction="horizontal">
                <Button variant="dark" disabled>
                  <List />
                </Button>
              </Stack>
            )}
            <h2>{"Score Keeper "}</h2>
            <div>
              <Button
                variant="link"
                onClick={() => props.setGame(Game.SkullKing)}
              >
                Skull King
              </Button>
            </div>
            <div>
              <Button
                variant="link"
                onClick={() => props.setGame(Game.RollThroughTheAges)}
              >
                Roll Through the Ages
              </Button>
            </div>
          </Stack>
          <div
            style={{
              position: "absolute",
              left: "24px",
              bottom: "24px",
            }}
          >
            {props.appVersion}
          </div>
        </Nav>
      )}
    </div>
  );
};

export default LeftNav;
