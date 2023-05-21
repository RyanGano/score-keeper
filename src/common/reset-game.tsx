import { XCircle } from "react-bootstrap-icons";
import Button from "react-bootstrap/esm/Button";
import { SimpleModal } from "./simple-modal";
import { useState } from "react";

export interface ResetGameProps {
  onAccept: () => void;
}

export const ResetGame = (props: ResetGameProps) => {
  const [showResetGameModal, setShowResetGameModal] = useState<boolean>(false);

  function resetGame() {
    setShowResetGameModal(false);
    props.onAccept();
  }

  return (
    <>
      <SimpleModal
        title="Reset Game"
        content={<>Are you sure you want to reset the game?</>}
        defaultButtonContent="Reset"
        alternateButtonContent="Cancel"
        onAccept={resetGame}
        onCancel={() => setShowResetGameModal(false)}
        show={showResetGameModal}
      />
      <Button variant="link" onClick={() => setShowResetGameModal(true)}>
        <XCircle color="red" />
      </Button>
    </>
  );
};
