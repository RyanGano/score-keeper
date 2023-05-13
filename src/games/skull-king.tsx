import { useContext, useState } from "react";
import Button from "react-bootstrap/Button";
import { Context, GameProps } from "../App";
import { PlayerGeneralProps } from "../components/player-general";
import {
  SkullKingRoundInfo,
  SkullKingScoreBox,
  defaultSkullKingRoundInfo,
  skullKingScoreBoxWidth,
} from "../components/skull-king-score-box";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import { BidInputField } from "../components/bid-input-field";
import { TricksTakenInputArea } from "../components/tricks-taken-input-area";
import { BonusInputArea } from "../components/bonus-input-area";
import { PencilFill } from "react-bootstrap-icons";
import {
  SkullKingCardInclusions,
  SkullKingIncludedCards,
  defaultSkullKingIncludedCards,
  getCardCount,
} from "../components/skull-king-included-cards";
import Stack from "react-bootstrap/esm/Stack";

interface SkullKingPlayerState {
  playerInfo: PlayerGeneralProps;
  roundScores: SkullKingRoundInfo[];
  currentRound: SkullKingRoundInfo | null;
  editRound: SkullKingRoundInfo | null;
}

export function calculateRoundScore(info: SkullKingRoundInfo): number {
  if (info.bid === info.taken) {
    const newScore =
      info.bid === 0
        ? info.possibleTricks * 10 + info.bonus
        : info.taken * 20 + info.bonus;

    return newScore;
  }

  if (info.bid === 0)
    return info.possibleTricks * -10;
    
  return Math.abs(info.taken - info.bid) * -10;
}

enum SkullKingGameStatus {
  GameNotStarted,
  BiddingOpen,
  BiddingClosed,
  GameOver,
  EditingPastItem,
}

export const SkullKing = () => {
  const props: GameProps = useContext<GameProps>(Context);
  const [playerStates, setPlayerStates] = useState<SkullKingPlayerState[]>([]);
  const [round, setRound] = useState<number>(0);
  const [gameStatus, setGameStatus] = useState<SkullKingGameStatus>(
    SkullKingGameStatus.GameNotStarted
  );
  const [includedCards, setIncludedCards] = useState<SkullKingCardInclusions>({
    ...defaultSkullKingIncludedCards,
  });

  function startGame() {
    if (props.getPlayers !== undefined) {
      setPlayerStates(
        props.getPlayers().map((x, index) => {
          return {
            playerInfo: x,
            roundScores: [],
            currentRound: {
              ...defaultSkullKingRoundInfo,
              id: `${x.Name}_1`,
              possibleTricks: 1,
            },
            editRound: null,
          };
        })
      );
      setRound(1);
      setGameStatus(SkullKingGameStatus.BiddingOpen);
    }
  }

  props.setMaxPlayerCount(8);

  function getRoundInfo(
    info: SkullKingRoundInfo[],
    displayFullInfo: boolean,
    displayEditButton: boolean
  ): JSX.Element {
    let scores: JSX.Element[] = [];
    info.forEach((x, index) => {
      scores.push(
        <SkullKingScoreBox
          key={`scorebox_${index}`}
          roundInfo={x}
          displayFullInfo={displayFullInfo}
        />
      );
    });

    if (gameStatus !== SkullKingGameStatus.EditingPastItem) {
      if (displayFullInfo) {
        scores.push(
          <Button
            variant="danger"
            size="sm"
            style={{ width: "32px" }}
            onClick={() => beginEditing(info)}
          >
            <PencilFill />
          </Button>
        );
      } else {
        scores.push(<div style={{ width: "32px" }} />);
      }
    }

    return (
      <Row
        style={{
          maxWidth: `${(playerStates.length + 1) * skullKingScoreBoxWidth}px`,
        }}
      >
        {scores}
      </Row>
    );
  }

  function beginEditing(roundInfo: SkullKingRoundInfo[]) {
    setGameStatus(SkullKingGameStatus.EditingPastItem);

    setPlayerStates(
      playerStates.map((x) => {
        return {
          playerInfo: x.playerInfo,
          roundScores: [...x.roundScores],
          currentRound:
            x.currentRound !== null
              ? { ...x.currentRound }
              : { ...defaultSkullKingRoundInfo },
          editRound: roundInfo.filter(
            (y) => !!x.roundScores.find((z) => z.id === y.id)
          )[0],
        };
      })
    );
  }

  function stopEditing() {
    setGameStatus(SkullKingGameStatus.BiddingOpen);

    setPlayerStates(
      playerStates.map((x) => {
        return {
          playerInfo: x.playerInfo,
          roundScores: [
            ...x.roundScores.map((y) => {
              return x.editRound !== null && x.editRound.id === y.id
                ? { ...x.editRound }
                : { ...y };
            }),
          ],
          currentRound:
            x.currentRound !== null
              ? { ...x.currentRound }
              : { ...defaultSkullKingRoundInfo },
          editRound: null,
        };
      })
    );
  }

  function getRoundInfos(which: number): SkullKingRoundInfo[] {
    return playerStates.map((x) => x.roundScores[which]);
  }

  function getCurrentRoundInfos(): SkullKingRoundInfo[] {
    return playerStates
      .filter((x) => x !== null)
      .map((x) =>
        x.currentRound !== null
          ? x.currentRound
          : { ...defaultSkullKingRoundInfo }
      );
  }

  function getAllScores(): JSX.Element[] {
    let scores: JSX.Element[] = [];
    if (round !== 0) {
      for (var i: number = 0; i < round - 1; i++) {
        scores.push(
          <div key={`score_${i}`}>
            {getRoundInfo(getRoundInfos(i), i < round - 1, true)}
          </div>
        );
      }
      if (gameStatus !== SkullKingGameStatus.GameOver) {
        scores.push(
          <div key={`score_current`}>
            {getRoundInfo(getCurrentRoundInfos(), false, false)}
          </div>
        );
      }
    }

    return scores;
  }

  function getCurrentScore(roundInfo: SkullKingRoundInfo[]) {
    if (roundInfo.length === 0) return 0;

    let currentScore: number = 0;
    roundInfo.forEach((x) => (currentScore += calculateRoundScore(x)));

    return currentScore;
  }

  function updateField(
    playerInfo: PlayerGeneralProps,
    buildRoundInfo: (roundInfo: SkullKingRoundInfo) => SkullKingRoundInfo
  ): void {
    setPlayerStates(
      playerStates.map((x) =>
        x.playerInfo !== playerInfo
          ? x
          : {
              playerInfo: x.playerInfo,
              roundScores: [...x.roundScores],
              currentRound: !!x.editRound
                ? x.currentRound
                : x.currentRound !== null
                ? buildRoundInfo(x.currentRound)
                : { ...defaultSkullKingRoundInfo },
              editRound: !!x.editRound
                ? x.editRound !== null
                  ? buildRoundInfo(x.editRound)
                  : { ...defaultSkullKingRoundInfo }
                : x.editRound,
            }
      )
    );
  }

  function addNewRoundInfo(): void {
    setPlayerStates(
      playerStates.map((x) => {
        const finishedRoundInfo =
          x.currentRound !== null
            ? {
                ...x.currentRound,
                currentScore: getCurrentScore(x.roundScores),
              }
            : { ...defaultSkullKingRoundInfo };
        return {
          playerInfo: x.playerInfo,
          roundScores: [...x.roundScores, finishedRoundInfo],
          currentRound: {
            ...defaultSkullKingRoundInfo,
            id: `${x.playerInfo.Name}_${round + 1}`,
            currentScore: getCurrentScore(x.roundScores),
            possibleTricks:
              getCardCount(includedCards) /
                (playerStates.length * (round + 1)) >=
              1
                ? round + 1
                : Math.floor(getCardCount(includedCards) / playerStates.length),
          },
          editRound: null,
        };
      })
    );
  }

  function finishGame(): void {
    setPlayerStates(
      playerStates.map((x) => {
        const finishedRoundInfo =
          x.currentRound !== null
            ? {
                ...x.currentRound,
                currentScore: getCurrentScore(x.roundScores),
              }
            : { ...defaultSkullKingRoundInfo };
        return {
          playerInfo: x.playerInfo,
          roundScores: [...x.roundScores, finishedRoundInfo],
          currentRound: null,
          editRound: null,
        };
      })
    );
  }

  return (
    <div
      style={{ position: "absolute", left: "274px", top: "24px", bottom: "0" }}
    >
      <h2>Skull King</h2>
      <Button size="sm" onClick={() => startGame()}>
        Start Game
      </Button>
      <SkullKingIncludedCards
        {...includedCards}
        updateKraken={(newValue) =>
          setIncludedCards({ ...includedCards, kraken: newValue })
        }
        updateWhiteWhale={(newValue) =>
          setIncludedCards({ ...includedCards, whiteWhale: newValue })
        }
        updateLootCoins={(newValue) =>
          setIncludedCards({ ...includedCards, lootCoins: newValue })
        }
        updateMermaids={(newValue) =>
          setIncludedCards({ ...includedCards, mermaids: newValue })
        }
      />
      <p />
      <div style={{ position: "relative", left: "0px", right: "24px" }}>
        {gameStatus !== SkullKingGameStatus.GameNotStarted &&
          gameStatus !== SkullKingGameStatus.GameOver &&
          `Round: ${round}`}
        {gameStatus === SkullKingGameStatus.GameOver && "Game over"}
        <Container>
          <Row>
            {playerStates.map((x, index) => (
              <Col key={`playerNameTop_${index}`}>
                <b>{x.playerInfo.Name}</b>
              </Col>
            ))}
          </Row>
          {getAllScores()}
        </Container>
      </div>
      <div style={{ position: "absolute", left: "0px", bottom: "24px" }}>
        {gameStatus === SkullKingGameStatus.EditingPastItem && (
          <Stack gap={1}>
            <Stack direction="horizontal" gap={1}>
              {playerStates.map((x, index) => (
                <Col key={`playerNameTop_${index}`}>
                  <b>{x.playerInfo.Name}</b>
                </Col>
              ))}
            </Stack>
            <Stack direction="horizontal" gap={1}>
              {playerStates.map((x, index) => (
                <Col key={`bidInput_${index}`}>
                  <BidInputField
                    setBid={(newBid) =>
                      updateField(x.playerInfo, (info: SkullKingRoundInfo) => {
                        return { ...info, bid: newBid };
                      })
                    }
                    startingValue={x.editRound?.bid}
                  />
                </Col>
              ))}
            </Stack>
            <Stack direction="horizontal" gap={1}>
              {playerStates.map((x, index) => (
                <Stack
                  direction="horizontal"
                  gap={1}
                  style={{ width: `${skullKingScoreBoxWidth}px` }}
                >
                  <TricksTakenInputArea
                    setTricksTaken={(tricksTaken) =>
                      updateField(x.playerInfo, (info: SkullKingRoundInfo) => {
                        return { ...info, taken: tricksTaken };
                      })
                    }
                    startingValue={x.editRound?.taken}
                  />
                  <BonusInputArea
                    setBonus={(bonus) =>
                      updateField(x.playerInfo, (info: SkullKingRoundInfo) => {
                        return { ...info, bonus };
                      })
                    }
                    startingValue={x.editRound?.bonus}
                  />
                </Stack>
              ))}
            </Stack>
            <div>
              <Button
                onClick={() => {
                  stopEditing();
                }}
              >
                Done Editing
              </Button>
            </div>
          </Stack>
        )}
        {gameStatus === SkullKingGameStatus.BiddingOpen && (
          <div>
            <Container>
              <Row>
                {playerStates.map((x, index) => (
                  <Col key={`playerNameTop_${index}`}>
                    <b>{x.playerInfo.Name}</b>
                  </Col>
                ))}
              </Row>
              <Row>
                {playerStates.map((x, index) => (
                  <Col key={`bidInput_${index}`}>
                    <BidInputField
                      setBid={(newBid) =>
                        updateField(
                          x.playerInfo,
                          (info: SkullKingRoundInfo) => {
                            return { ...info, bid: newBid };
                          }
                        )
                      }
                      startingValue={undefined}
                    />
                  </Col>
                ))}
              </Row>
            </Container>
            <Button
              onClick={() => {
                setGameStatus(SkullKingGameStatus.BiddingClosed);
              }}
            >
              Lock in bids
            </Button>
          </div>
        )}
        {gameStatus === SkullKingGameStatus.BiddingClosed && (
          <div
            style={{
              width: `${(playerStates.length + 1) * skullKingScoreBoxWidth}px`,
            }}
          >
            <Container>
              <Row>
                {playerStates.map((x, index) => (
                  <Col key={`state_${index}`}>
                    <b>{x.playerInfo.Name}</b>
                  </Col>
                ))}
              </Row>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: `${
                    (playerStates.length + 1) * skullKingScoreBoxWidth
                  }px`,
                }}
              >
                {playerStates.map((x, index) => (
                  <Stack
                    direction="horizontal"
                    gap={1}
                    style={{ width: `${skullKingScoreBoxWidth}px` }}
                  >
                    <TricksTakenInputArea
                      setTricksTaken={(tricksTaken) =>
                        updateField(
                          x.playerInfo,
                          (info: SkullKingRoundInfo) => {
                            return { ...info, taken: tricksTaken };
                          }
                        )
                      }
                      startingValue={undefined}
                    />
                    <BonusInputArea
                      setBonus={(bonus) =>
                        updateField(
                          x.playerInfo,
                          (info: SkullKingRoundInfo) => {
                            return { ...info, bonus };
                          }
                        )
                      }
                      startingValue={undefined}
                    />
                  </Stack>
                ))}
              </div>
            </Container>
            <Button
              onClick={() => {
                setGameStatus(
                  round !== 10
                    ? SkullKingGameStatus.BiddingOpen
                    : SkullKingGameStatus.GameOver
                );
                setRound(round + 1);
                round !== 10 ? addNewRoundInfo() : finishGame();
              }}
            >
              Update results
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
