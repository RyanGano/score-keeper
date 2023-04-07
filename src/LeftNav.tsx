import React, { useState } from "react";
import { PersonAdd, PersonDash } from "react-bootstrap-icons";
import Button from "react-bootstrap/esm/Button";
import { NavLink } from "react-router-dom";
import { LightBlueLeftNav } from "./common/styles";
import { AddNewPlayer } from "./components/add-new-player";
import { PlayerGeneral, PlayerGeneralProps } from "./components/player-general";

export interface LeftNavProps {
  addPlayer: (name: string) => void;
  removePlayer: (name: string) => void;
  activePlayers: PlayerGeneralProps[];
  canAddPlayer: boolean;
}

export const LeftNav = (props: LeftNavProps) => {
  const [addPlayerVisisble, setAddPlayerVisisble] = useState<boolean>(false);

  function addPlayer(name: string) {
    props.addPlayer(name);
    setAddPlayerVisisble(false);
  }

  function removePlayer(name: string) {
    props.removePlayer(name);
    // setPlayers([...players].filter((x) => x.Name !== name));
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
              <div className="d-flex justify-content-end">
                <PlayerGeneral Name={x.Name} />
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => removePlayer(x.Name)}
                >
                  <PersonDash />
                </Button>
              </div>
            </div>
          ))}
          <h3>
            Player Info<span> </span>
            <Button
            disabled = {!props.canAddPlayer}
              onClick={() => {
                setAddPlayerVisisble(true);
              }}
            >
              <PersonAdd />
            </Button>
          </h3>
          <AddNewPlayer
            defaultValue=""
            show={addPlayerVisisble}
            onClose={() => setAddPlayerVisisble(false)}
            onSubmit={(name: string) => addPlayer(name)}
          />
        </div>
      </LightBlueLeftNav>
    </div>
  );
};

export default LeftNav;
