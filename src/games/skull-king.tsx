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
import { Pencil } from "react-bootstrap-icons";
import {
  SkullKingCardInclusions,
  SkullKingIncludedCards,
  defaultSkullKingIncludedCards,
  getCardCount,
} from "../components/skull-king-included-cards";
import Stack from "react-bootstrap/esm/Stack";
import { NumericInputArea } from "../components/numeric-input-area";
import { ResetGame } from "../common/reset-game";

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
    key: string,
    currentScores: number[],
    displayFullInfo: boolean
  ): JSX.Element {
    let scores: JSX.Element[] = [];
    info.forEach((x, index) => {
      scores.push(
        <SkullKingScoreBox
          key={`scorebox_${key}_${index}`}
          roundInfo={x}
          displayFullInfo={displayFullInfo}
          currentScore={currentScores[index]}
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
              key={`scorebox_full_${key}`}
              style={{ width: "32px" }}
              onClick={() => beginEditing(info)}
            >
              <Pencil color="red" />
            </Button>
          ) : (
            <Button
              key={`scorebox_full_${key}`}
              variant="link"
              size="sm"
              style={{ width: "32px" }}
              disabled
            >
              <Pencil />
            </Button>
          )
        );
      } else {
        scores.push(
          <div key={`scorebox_partial_${key}`} style={{ width: "32px" }} />
        );
      }
    }

    return (
      <Stack key={`scorebox_stack_${key}`} direction="horizontal" gap={1}>
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

  function getCurrentScores(whichRound: number): number[] {
    let scores = playerStates.map((x) => 0);

    for (var i = 0; i < whichRound; i++) {
      const roundInfos = getRoundInfos(i);
      playerStates.map(
        (x, index) => (scores[index] += calculateRoundScore(roundInfos[index]))
      );
    }

    return scores;
  }

  function getAllScores(): JSX.Element[] {
    let scores: JSX.Element[] = [];
    if (round !== 0) {
      for (var i: number = 0; i < round - 1; i++) {
        const newKey = `$item_${i}_${round}`;
        scores.push(
          <div key={newKey}>
            {getRoundInfo(
              getRoundInfos(i),
              newKey,
              getCurrentScores(i),
              i < round - 1
            )}
          </div>
        );
      }
      if (gameStatus !== SkullKingGameStatus.GameOver) {
        const newKey = `$item_current_${round}`;
        scores.push(
          <div key={newKey}>
            {getRoundInfo(
              getCurrentRoundInfos(),
              newKey,
              getCurrentScores(round - 1),
              false
            )}
          </div>
        );
      }
    }

    return scores;
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
              }
            : { ...defaultSkullKingRoundInfo };
        return {
          playerInfo: x.playerInfo,
          roundScores: [...x.roundScores, finishedRoundInfo],
          currentRound: {
            ...defaultSkullKingRoundInfo,
            id: `${x.playerInfo.Name}_${round + 1}`,
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

  function lockInBids(): void {
    setGameStatus(SkullKingGameStatus.BiddingClosed);
  }

  function finishRound(): void {
    setGameStatus(
      round !== 10
        ? SkullKingGameStatus.BiddingOpen
        : SkullKingGameStatus.GameOver
    );
    setRound(round + 1);
    round !== 10 ? addNewRoundInfo() : finishGame();
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
              <ResetGame onAccept={resetGame} />
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
                    <Stack key={`edit_${index}`} gap={1}>
                      <NumericInputArea
                        setNewValue={(newBid) =>
                          updateField(
                            x.playerInfo,
                            (info: SkullKingRoundInfo) => {
                              return { ...info, bid: newBid };
                            }
                          )
                        }
                        startingValue={x.editRound?.bid}
                        placeholder="bid"
                        width={skullKingScoreBoxWidth}
                        autoFocus={index === 0}
                        onEnter={stopEditing}
                      />
                      <Stack
                        direction="horizontal"
                        style={{ width: `${skullKingScoreBoxWidth}px` }}
                      >
                        <NumericInputArea
                          setNewValue={(tricksTaken) =>
                            updateField(
                              x.playerInfo,
                              (info: SkullKingRoundInfo) => {
                                return { ...info, taken: tricksTaken };
                              }
                            )
                          }
                          startingValue={x.editRound?.taken}
                          placeholder="tricks"
                          width={skullKingScoreBoxWidth / 2}
                          onEnter={stopEditing}
                        />
                        <NumericInputArea
                          setNewValue={(bonus) =>
                            updateField(
                              x.playerInfo,
                              (info: SkullKingRoundInfo) => {
                                return { ...info, bonus };
                              }
                            )
                          }
                          startingValue={x.editRound?.bonus}
                          placeholder="bonus"
                          width={skullKingScoreBoxWidth / 2}
                          onEnter={stopEditing}
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
                    <NumericInputArea
                      key={`bidInput_${index}_${round}`}
                      setNewValue={(newBid) =>
                        updateField(
                          x.playerInfo,
                          (info: SkullKingRoundInfo) => {
                            return { ...info, bid: newBid };
                          }
                        )
                      }
                      startingValue={undefined}
                      placeholder="bid"
                      width={skullKingScoreBoxWidth}
                      autoFocus={index === 0}
                      onEnter={lockInBids}
                    />
                  ))}
                </Stack>
                <div>
                  <Button onClick={lockInBids}>Lock in bids</Button>
                </div>
              </Stack>
            )}
            {gameStatus === SkullKingGameStatus.BiddingClosed && (
              <Stack gap={1}>
                <Stack direction="horizontal" gap={1}>
                  {playerStates.map((x, index) => (
                    <Stack
                      key={`results_${index}_${round}`}
                      style={{ width: `${skullKingScoreBoxWidth}px` }}
                      direction="horizontal"
                    >
                      <NumericInputArea
                        setNewValue={(tricksTaken) =>
                          updateField(
                            x.playerInfo,
                            (info: SkullKingRoundInfo) => {
                              return { ...info, taken: tricksTaken };
                            }
                          )
                        }
                        startingValue={undefined}
                        placeholder="tricks"
                        width={skullKingScoreBoxWidth / 2}
                        autoFocus={index === 0}
                        onEnter={finishRound}
                      />
                      <NumericInputArea
                        setNewValue={(bonus) =>
                          updateField(
                            x.playerInfo,
                            (info: SkullKingRoundInfo) => {
                              return { ...info, bonus };
                            }
                          )
                        }
                        startingValue={undefined}
                        placeholder="bonus"
                        width={skullKingScoreBoxWidth / 2}
                        onEnter={finishRound}
                      />
                    </Stack>
                  ))}
                </Stack>
                <div>
                  <Button onClick={finishRound}>Update results</Button>
                </div>
              </Stack>
            )}
          </div>
        </Stack>
      </div>
    </>
  );
};
