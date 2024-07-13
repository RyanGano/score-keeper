import { Pencil, PersonAdd, XCircle } from "react-bootstrap-icons";
import Button from "react-bootstrap/esm/Button";
import { useState } from "react";
import {
  PlayerGeneral,
  PlayerGeneralProps,
} from "../components/player-general";
import Stack from "react-bootstrap/esm/Stack";
import { AddNewPlayer } from "../components/add-new-player";
import { EditExistingPlayer } from "../components/edit-existing-player";
import Alert from "react-bootstrap/esm/Alert";

export interface PlayerListProps {
  addPlayer: (name: string) => string | undefined;
  removePlayer: (name: string) => void;
  editPlayer: (originalName: string, newName: string) => string | undefined;
  activePlayers: PlayerGeneralProps[];
  canAddPlayer: boolean;
  canRemovePlayer: boolean;
  playerType?: "teams" | "players";
}

export const PlayerList = (props: PlayerListProps) => {
  const {
    addPlayer,
    removePlayer,
    editPlayer,
    activePlayers,
    canAddPlayer,
    canRemovePlayer,
    playerType,
  } = props;
  const [addPlayerVisible, setAddPlayerVisible] = useState<boolean>(false);
  const [editPlayerVisible, setEditPlayerVisible] = useState<
    PlayerGeneralProps | undefined
  >();
  const [alert, setAlert] = useState<string | undefined>();

  function addPlayerLocal(name: string) {
    addAlert(addPlayer(name));
    setAddPlayerVisible(false);
  }

  function removePlayerLocal(name: string) {
    removePlayer(name);
  }

  function editPlayerLocal(currentName: string, name: string) {
    if (name.trim() === "") return "Name cannot be empty.";
    return editPlayer(currentName, name);
  }

  function addAlert(newAlert?: string) {
    if (!newAlert) return;

    if (alert) setAlert(`${alert}|${newAlert}`);
    else setAlert(newAlert);
  }

  return (
    <div>
      {alert && (
        <Alert
          variant="info"
          style={{ zIndex: "150" }}
          onClose={() => setAlert(undefined)}
          dismissible
        >
          {alert.split("|").map((x, index) => (
            <div key={index}>{x}</div>
          ))}
        </Alert>
      )}
      <h5>
        <Stack direction="horizontal" gap={1}>
          {playerType === "teams" ? "Team Info" : "Player Info"}
          <Button
            variant="link"
            disabled={!canAddPlayer}
            onClick={() => {
              setAddPlayerVisible(true);
            }}
          >
            <PersonAdd />
          </Button>
        </Stack>
      </h5>
      {activePlayers.map((x) => (
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
            {canRemovePlayer && (
              <Button
                size="sm"
                variant="link"
                onClick={() => removePlayerLocal(x.Name)}
              >
                <XCircle color="red" />
              </Button>
            )}
            {!canRemovePlayer && (
              <Button size="sm" variant="link" disabled>
                <XCircle color="grey" />
              </Button>
            )}
          </Stack>
        </div>
      ))}
      <AddNewPlayer
        show={addPlayerVisible}
        onClose={() => setAddPlayerVisible(false)}
        onSubmit={(name: string) => addPlayerLocal(name)}
      />
      <EditExistingPlayer
        currentName={editPlayerVisible?.Name ?? ""}
        show={!!editPlayerVisible}
        onClose={() => setEditPlayerVisible(undefined)}
        onSubmit={(name: string) => {
          addAlert(editPlayerLocal(editPlayerVisible?.Name ?? "", name));
          setEditPlayerVisible(undefined);
        }}
      />
    </div>
  );
};
