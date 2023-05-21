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
}

export const PlayerList = (props: PlayerListProps) => {
  const [addPlayerVisible, setAddPlayerVisible] = useState<boolean>(false);
  const [editPlayerVisible, setEditPlayerVisible] = useState<
    PlayerGeneralProps | undefined
  >();
  const [alert, setAlert] = useState<string | undefined>();

  function addPlayer(name: string) {
    addAlert(props.addPlayer(name));
    setAddPlayerVisible(false);
  }

  function removePlayer(name: string) {
    props.removePlayer(name);
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
        Player Info<span> </span>
        <Button
          variant="link"
          disabled={!props.canAddPlayer}
          onClick={() => {
            setAddPlayerVisible(true);
          }}
        >
          <PersonAdd />
        </Button>
      </h5>
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
      <AddNewPlayer
        show={addPlayerVisible}
        onClose={() => setAddPlayerVisible(false)}
        onSubmit={(name: string) => addPlayer(name)}
      />
      <EditExistingPlayer
        currentName={editPlayerVisible?.Name ?? ""}
        show={!!editPlayerVisible}
        onClose={() => setEditPlayerVisible(undefined)}
        onSubmit={(name: string) => {
          addAlert(props.editPlayer(editPlayerVisible?.Name ?? "", name));
          setEditPlayerVisible(undefined);
        }}
      />
    </div>
  );
};
