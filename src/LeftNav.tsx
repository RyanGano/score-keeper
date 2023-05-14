import React, { useState } from "react";
import { Pencil, PersonAdd, XCircle } from "react-bootstrap-icons";
import Button from "react-bootstrap/esm/Button";
import { NavLink } from "react-router-dom";
import { LightBlueLeftNav } from "./common/styles";
import { AddNewPlayer } from "./components/add-new-player";
import { PlayerGeneral, PlayerGeneralProps } from "./components/player-general";
import { EditExistingPlayer } from "./components/edit-existing-player";
import Stack from "react-bootstrap/esm/Stack";

export interface LeftNavProps {
  addPlayer: (name: string) => void;
  removePlayer: (name: string) => void;
  editPlayer: (originalName: string, newName: string) => void;
  activePlayers: PlayerGeneralProps[];
  canAddPlayer: boolean;
  canRemovePlayer: boolean;
}

export const LeftNav = (props: LeftNavProps) => {
  const [addPlayerVisible, setAddPlayerVisible] = useState<boolean>(false);
  const [editPlayerVisible, setEditPlayerVisible] = useState<
    PlayerGeneralProps | undefined
  >();

  function addPlayer(name: string) {
    props.addPlayer(name);
    setAddPlayerVisible(false);
  }

  function removePlayer(name: string) {
    props.removePlayer(name);
  }

  return (
    <div className="LeftNav">
      <LightBlueLeftNav activeKey="/skullking">
        <h2>Score Keeper</h2>
        <div>
          <NavLink
            to="/skullking"
            className={({ isActive, isPending }) =>
              isPending ? "pending" : isActive ? "active" : ""
            }
          >
            Skull King
          </NavLink>
        </div>
        <div>
          <NavLink
            to="/rollthroughtheages"
            className={({ isActive, isPending }) =>
              isPending ? "pending" : isActive ? "active" : ""
            }
          >
            Roll Through the Ages
          </NavLink>
        </div>
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
      </LightBlueLeftNav>
    </div>
  );
};

export default LeftNav;
