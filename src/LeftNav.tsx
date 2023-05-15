import React, { useState } from "react";
import { List, Pencil, PersonAdd, XCircle } from "react-bootstrap-icons";
import Button from "react-bootstrap/esm/Button";
import { AddNewPlayer } from "./components/add-new-player";
import { PlayerGeneral, PlayerGeneralProps } from "./components/player-general";
import { EditExistingPlayer } from "./components/edit-existing-player";
import Stack from "react-bootstrap/esm/Stack";
import { Game } from "./App";
import Nav from "react-bootstrap/esm/Nav";

export interface LeftNavProps {
  addPlayer: (name: string) => void;
  removePlayer: (name: string) => void;
  editPlayer: (originalName: string, newName: string) => void;
  setGame: (game: Game) => void;
  activePlayers: PlayerGeneralProps[];
  canAddPlayer: boolean;
  canRemovePlayer: boolean;
  collapsed: boolean;
}

export const LeftNav = (props: LeftNavProps) => {
  const [addPlayerVisible, setAddPlayerVisible] = useState<boolean>(false);
  const [editPlayerVisible, setEditPlayerVisible] = useState<
    PlayerGeneralProps | undefined
  >();
  const [showPopover, setShowPopover] = useState<boolean>(false);

  function addPlayer(name: string) {
    props.addPlayer(name);
    setAddPlayerVisible(false);
  }

  function removePlayer(name: string) {
    props.removePlayer(name);
  }

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
          <div style={{ position: "absolute", bottom: "25px", left: "25px" }}>
            {props.activePlayers.map((x) => (
              <div
                key={x.Name}
                style={{ paddingRight: "24px", marginBottom: "10px" }}
              >
                <Stack direction="horizontal" gap={2}>
                  <PlayerGeneral Name={x.Name} />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditPlayerVisible(x)}
                  >
                    <Pencil />
                  </Button>
                  {props.canRemovePlayer && (
                    <Button
                      size="sm"
                      variant="link"
                      onClick={() => removePlayer(x.Name)}
                    >
                      <XCircle color="red" />
                    </Button>
                  )}
                  {!props.canRemovePlayer && (
                    <Button size="sm" variant="link" disabled>
                      <XCircle color="grey" />
                    </Button>
                  )}
                </Stack>
              </div>
            ))}
            <h3>
              Player Info<span> </span>
              <Button
                disabled={!props.canAddPlayer}
                onClick={() => {
                  setAddPlayerVisible(true);
                }}
              >
                <PersonAdd />
              </Button>
            </h3>
            <AddNewPlayer
              defaultValue=""
              show={addPlayerVisible}
              onClose={() => setAddPlayerVisible(false)}
              onSubmit={(name: string) => addPlayer(name)}
            />
            <EditExistingPlayer
              currentName={editPlayerVisible?.Name ?? ""}
              show={!!editPlayerVisible}
              onClose={() => setEditPlayerVisible(undefined)}
              onSubmit={(name: string) => {
                props.editPlayer(editPlayerVisible?.Name ?? "", name);
                setEditPlayerVisible(undefined);
              }}
            />
          </div>
        </Nav>
      )}
    </div>
  );
};

export default LeftNav;
