import Stack from "react-bootstrap/esm/Stack";
import {
  SkullKingGameStatus,
  SkullKingPlayerState,
  calculateRoundScore,
  defaultBlueColor,
  defaultGreenColor,
  disabledButtonColor,
  enabledButtonColor,
} from "./skull-king";
import { SimpleModal } from "../../common/simple-modal";
import { useEffect, useState } from "react";
import { DashSquareFill, PlusSquareFill } from "react-bootstrap-icons";

export interface SkullKingPlayerStatusCardProps {
  player: SkullKingPlayerState;
  dealer?: boolean;
  forceShowUpdateUI?: boolean;
  turnPhase: SkullKingGameStatus;
  onCancelledAutoUpdate?: () => void;
  onBidChange?: (newBid: number) => void;
  onScoreChange?: (taken: number, bonus: number) => void;
}

export const SkullKingPlayerStatusCard = (
  props: SkullKingPlayerStatusCardProps
) => {
  const {
    player,
    dealer,
    forceShowUpdateUI,
    onCancelledAutoUpdate,
    onBidChange,
    onScoreChange,
    turnPhase,
  } = props;
  const [showBidUI, setShowBidUI] = useState<boolean>(false);
  const [showScoreUI, setShowScoreUI] = useState<boolean>(false);
  const [currentBonus, setCurrentBonus] = useState<number>(0);
  const [currentTricksTaken, setCurrentTricksTaken] = useState<number>(0);

  useEffect(() => {
    setShowBidUI((forceShowUpdateUI ?? false) && !!onBidChange);
    setShowScoreUI((forceShowUpdateUI ?? false) && !!onScoreChange);
  }, [forceShowUpdateUI, onBidChange, onScoreChange]);

  useEffect(() => {
    setCurrentBonus(0);
    setCurrentTricksTaken(0);
  }, [turnPhase]);

  const getBidContent = () => {
    if (!player.currentRound) {
      return null;
    }

    const children = [];

    for (let i = 0; i <= player.currentRound.possibleTricks; i++) {
      children.push(
        <div
          key={i}
          style={{
            margin: 6,
            padding: 24,
            backgroundColor: defaultBlueColor,
            borderRadius: 12,
            minWidth: 70,
            display: "flex",
            justifyContent: "center",
            fontWeight: 800,
          }}
          onClick={
            !!onBidChange
              ? () => {
                  player.currentRound!.bid = i;
                  setShowBidUI(false);
                  onBidChange(i);
                }
              : undefined
          }
        >
          {i}
        </div>
      );
    }
    return <div className={"d-flex flex-wrap"}>{children}</div>;
  };

  const getBonusUI = () => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <DashSquareFill
          color={currentBonus > 0 ? enabledButtonColor : disabledButtonColor}
          size={36}
          onClick={() =>
            currentBonus > 0 ? setCurrentBonus(currentBonus - 10) : undefined
          }
        />
        <div
          style={{
            margin: 6,
            padding: 24,
            backgroundColor: defaultBlueColor,
            borderRadius: 12,
            maxWidth: 75,
            minWidth: 70,
            display: "flex",
            justifyContent: "center",
            fontWeight: 800,
          }}
        >
          {currentBonus}
        </div>
        <PlusSquareFill
          color={enabledButtonColor}
          size={36}
          onClick={() => setCurrentBonus(currentBonus + 10)}
        />
      </div>
    );
  };

  const getScoreContent = () => {
    if (!player.currentRound) {
      return <></>;
    }

    const tricksTaken = [];

    for (let i = 0; i <= player.currentRound.possibleTricks; i++) {
      tricksTaken.push(
        <div
          key={i}
          style={{
            margin: 6,
            padding: 24,
            backgroundColor:
              currentTricksTaken === i ? defaultGreenColor : defaultBlueColor,
            borderRadius: 12,
            minWidth: 70,
            display: "flex",
            justifyContent: "center",
            fontWeight: 800,
          }}
          onClick={() => setCurrentTricksTaken(i)}
        >
          {i}
        </div>
      );
    }

    return (
      <Stack>
        <span>Tricks Taken</span>
        <div className={"d-flex flex-wrap"}>{tricksTaken}</div>
        <span>Bonus Points</span>
        <div className={"d-flex flex-wrap"}>{getBonusUI()}</div>
      </Stack>
    );
  };

  const cancelAutoUI = () => {
    setShowBidUI(false);
    setShowScoreUI(false);
    onCancelledAutoUpdate?.();
  };

  const saveScore = () => {
    onScoreChange?.(currentTricksTaken ?? 0, currentBonus);
    setShowScoreUI(false);
  };

  return (
    <>
      <SimpleModal
        title={`Update Bid - ${player.playerInfo.Name}`}
        content={<>{showBidUI && getBidContent()}</>}
        defaultButtonContent={"Cancel"}
        onAccept={() => cancelAutoUI()}
        onCancel={() => cancelAutoUI()}
        show={showBidUI}
      />
      <SimpleModal
        title={`Update Score - ${player.playerInfo.Name} (bid ${player.currentRound?.bid})`}
        content={<>{showScoreUI && getScoreContent()}</>}
        defaultButtonContent={"Save Score"}
        onAccept={() => saveScore()}
        onCancel={() => cancelAutoUI()}
        show={showScoreUI}
      />
      <div
        style={{
          margin: 6,
          padding: 12,
          backgroundColor: dealer
            ? !!onBidChange
              ? defaultGreenColor
              : defaultBlueColor
            : !!onBidChange
            ? defaultBlueColor
            : defaultGreenColor,
          borderRadius: 12,
          minWidth: 150,
          minHeight: 100,
        }}
        onClick={() =>
          !!onBidChange
            ? setShowBidUI(true)
            : !!onScoreChange
            ? setShowScoreUI(true)
            : undefined
        }
      >
        <Stack>
          <h5>{player.playerInfo.Name}</h5>
          <span style={{ fontWeight: 600 }}>{`Score: ${player.roundScores
            .map((x) => calculateRoundScore(x))
            .reduce((a, b) => a + b, 0)}`}</span>
          {turnPhase === SkullKingGameStatus.BiddingOpen && (
            <p>
              {player.currentRound?.possibleTricks !== 1 ? (
                <span>{`Last Round: ${calculateRoundScore(
                  player.roundScores[player.roundScores.length - 1]
                )}`}</span>
              ) : (
                <br />
              )}
            </p>
          )}
          {turnPhase === SkullKingGameStatus.BiddingClosed && (
            <p>
              <span>{`Results: ${player.currentRound?.taken} / ${player.currentRound?.bonus}`}</span>
            </p>
          )}

          <h5>{`Bid: ${player.currentRound?.bid ?? 0}`}</h5>
        </Stack>
      </div>
    </>
  );
};
