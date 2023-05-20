import { useState } from "react";
import Button from "react-bootstrap/Button";
import { GameProps } from "../App";
import { PlayerGeneralProps } from "../components/player-general";
import {
  SkullKingRoundInfo,
  SkullKingScoreBox,
  defaultSkullKingRoundInfo,
  skullKingScoreBoxWidth,
} from "../components/skull-king-score-box";
import { BidInputField } from "../components/bid-input-field";
import { TricksTakenInputArea } from "../components/tricks-taken-input-area";
import { BonusInputArea } from "../components/bonus-input-area";
import { Pencil, XCircle } from "react-bootstrap-icons";
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

  if (info.bid === 0) return info.possibleTricks * -10;

  return Math.abs(info.taken - info.bid) * -10;
}

enum SkullKingGameStatus {
  GameNotStarted,
  BiddingOpen,
  BiddingClosed,
  GameOver,
  EditingPastItem,
}

export const SkullKing = (props: GameProps) => {
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
    displayFullInfo: boolean
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
          gameStatus === SkullKingGameStatus.BiddingOpen ||
            gameStatus === SkullKingGameStatus.GameOver ? (
            <Button
              variant="link"
              size="sm"
              style={{ width: "32px" }}
              onClick={() => beginEditing(info)}
            >
              <Pencil color="red" />
            </Button>
          ) : (
            <Button variant="link" size="sm" style={{ width: "32px" }} disabled>
              <Pencil />
            </Button>
          )
        );
      } else {
        scores.push(<div style={{ width: "32px" }} />);
      }
    }

    return (
      <Stack direction="horizontal" gap={1}>
        {scores}
      </Stack>
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
    setGameStatus(
      round < 11
        ? SkullKingGameStatus.BiddingOpen
        : SkullKingGameStatus.GameOver
    );

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
            {getRoundInfo(getRoundInfos(i), i < round - 1)}
          </div>
        );
      }
      if (gameStatus !== SkullKingGameStatus.GameOver) {
        scores.push(
          <div key={`score_current`}>
            {getRoundInfo(getCurrentRoundInfos(), false)}
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

  function getRoundStatus(): string | undefined {
    switch (gameStatus) {
      case SkullKingGameStatus.EditingPastItem:
        return "Editing";
      case SkullKingGameStatus.GameOver:
        return "Game over";
      case SkullKingGameStatus.GameNotStarted:
        return undefined;
      default:
        return `Round: ${round}`;
    }
  }

  function resetGame(): void {
    setGameStatus(SkullKingGameStatus.GameNotStarted);
    setPlayerStates([]);
    setRound(0);
  }

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: "74px",
          top: "12px",
        }}
      >
        <h2>
          <Stack direction="horizontal" gap={1}>
            Skull King
            {gameStatus !== SkullKingGameStatus.GameNotStarted && (
              <Button variant="link" onClick={() => resetGame()}>
                <XCircle color="red" />
              </Button>
            )}
          </Stack>
        </h2>
      </div>
      <div
        style={{
          position: "absolute",
          left: "24px",
          top: "74px",
        }}
      >
        <Stack gap={4}>
          <div>
            {gameStatus === SkullKingGameStatus.GameNotStarted && (
              <Stack gap={3}>
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
                <div>
                  <Button size="sm" onClick={() => startGame()}>
                    Start Game
                  </Button>
                </div>
              </Stack>
            )}
          </div>
          <Stack>
            {getRoundStatus()}
            <Stack direction="horizontal" gap={1}>
              {playerStates.map((x, index) => (
                <div
                  style={{ width: `${skullKingScoreBoxWidth}px` }}
                  key={`playerNameTop_${index}`}
                >
                  <b>{x.playerInfo.Name}</b>
                </div>
              ))}
            </Stack>
            {getAllScores()}
          </Stack>
          <div>
            {gameStatus === SkullKingGameStatus.EditingPastItem && (
              <Stack gap={1}>
                <Stack direction="horizontal">
                  {playerStates.map((x, index) => (
                    <Stack gap={1}>
                      <BidInputField
                        setBid={(newBid) =>
                          updateField(
                            x.playerInfo,
                            (info: SkullKingRoundInfo) => {
                              return { ...info, bid: newBid };
                            }
                          )
                        }
                        startingValue={x.editRound?.bid}
                      />
                      <Stack
                        direction="horizontal"
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
                          startingValue={x.editRound?.taken}
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
                          startingValue={x.editRound?.bonus}
                        />
                      </Stack>
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
              <Stack gap={1}>
                <Stack direction="horizontal" gap={1}>
                  {playerStates.map((x, index) => (
                    <BidInputField
                      key={`bidInput_${index}`}
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
                  ))}
                </Stack>
                <div>
                  <Button
                    onClick={() => {
                      setGameStatus(SkullKingGameStatus.BiddingClosed);
                    }}
                  >
                    Lock in bids
                  </Button>
                </div>
              </Stack>
            )}
            {gameStatus === SkullKingGameStatus.BiddingClosed && (
              <Stack gap={1}>
                <Stack direction="horizontal" gap={1}>
                  {playerStates.map((x, index) => (
                    <Stack
                      style={{ width: `${skullKingScoreBoxWidth}px` }}
                      direction="horizontal"
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
                </Stack>
                <div>
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
              </Stack>
            )}
          </div>
        </Stack>
      </div>
    </>
  );
};
