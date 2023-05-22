import { useState } from "react";
import Button from "react-bootstrap/Button";
import { PlayerGeneralProps } from "../../components/player-general";
import {
  SkullKingRoundInfo,
  SkullKingScoreBox,
  defaultSkullKingRoundInfo,
  skullKingScoreBoxWidth,
} from "./skull-king-score-box";
import { Gear, Pencil } from "react-bootstrap-icons";
import {
  SkullKingCardInclusions,
  SkullKingIncludedCards,
  defaultSkullKingIncludedCards,
  getCardCount,
} from "./skull-king-included-cards";
import Stack from "react-bootstrap/esm/Stack";
import { NumericInputArea } from "../../components/numeric-input-area";
import { ResetGame } from "../../common/reset-game";
import { PlayerList } from "../../common/player-list";
import { SimpleModal } from "../../common/simple-modal";
import useCookies from "react-cookie/cjs/useCookies";

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

export const SkullKing = () => {
  const [players, setPlayers] = useState<PlayerGeneralProps[]>([]);
  const [playerStates, setPlayerStates] = useState<SkullKingPlayerState[]>([]);
  const [round, setRound] = useState<number>(0);
  const [gameStatus, setGameStatus] = useState<SkullKingGameStatus>(
    SkullKingGameStatus.GameNotStarted
  );
  const [includedCards, setIncludedCards] = useState<SkullKingCardInclusions>({
    ...defaultSkullKingIncludedCards,
  });
  const [showGameSettings, setShowGameSettings] = useState<boolean>(
    players.length === 0
  );
  const [cookies, setCookie] = useCookies(["players_sk"]);

  const [maxPlayers] = useState<number>(8);
  const [minPlayers] = useState<number>(2);

  if (!cookies.players_sk && players.length === 0) {
    setPlayers([{ Name: "Player 1" }, { Name: "Player 2" }]);
  }
  if (cookies.players_sk && players.length === 0) {
    setPlayers(
      cookies?.players_sk.split("|").map((x: string) => {
        return { Name: x };
      })
    );
  }

  function startGame() {
    setShowGameSettings(false);
    if (players?.length !== 0) {
      setPlayerStates(
        players.map((x, index) => {
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

  function addPlayer(name: string) {
    if (players.length === maxPlayers) return;

    if (players.findIndex((x) => x.Name === name) !== -1) {
      return `Player ${name} already exists.`;
    }

    const newPlayers = [
      ...players,
      {
        Name: name,
      } as PlayerGeneralProps,
    ];
    setPlayers(newPlayers);
    setCookie("players_sk", newPlayers.map((x) => x.Name).join("|"));
  }

  function editPlayer(originalName: string, newName: string) {
    if (
      originalName !== newName &&
      players.findIndex((x) => x.Name === newName) !== -1
    ) {
      return `Player ${newName} already exists.`;
    }
    const newPlayers = [...players].map((x) =>
      x.Name !== originalName ? x : { Name: newName }
    );
    setPlayers(newPlayers);
    setCookie("players_sk", newPlayers.map((x) => x.Name).join("|"));
  }

  function removePlayer(name: string) {
    const newPlayers = [...players].filter((x) => x.Name !== name);
    setPlayers(newPlayers);
    setCookie("players_sk", newPlayers.map((x) => x.Name).join("|"));
  }

  const settingsContent = (
    <Stack gap={4}>
      <PlayerList
        addPlayer={addPlayer}
        removePlayer={removePlayer}
        editPlayer={editPlayer}
        activePlayers={players}
        canAddPlayer={players.length < maxPlayers}
        canRemovePlayer={players.length > minPlayers}
      />
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
          </Stack>
        )}
      </div>
    </Stack>
  );

  return (
    <>
      <div className="game-header">
        <h2>
          <Stack direction="horizontal" gap={1}>
            Skull King
            {gameStatus !== SkullKingGameStatus.GameNotStarted && (
              <ResetGame onAccept={resetGame} />
            )}
            {gameStatus === SkullKingGameStatus.GameNotStarted ||
            gameStatus === SkullKingGameStatus.GameOver ? (
              <Button variant="link" onClick={() => setShowGameSettings(true)}>
                <Gear />
              </Button>
            ) : (
              <Button variant="link" disabled>
                <Gear />
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
          <SimpleModal
            title="Skull King Settings"
            content={settingsContent}
            defaultButtonContent="Start Game"
            alternateButtonContent="Close"
            onAccept={startGame}
            onCancel={() => setShowGameSettings(false)}
            show={showGameSettings}
          />
          <Stack gap={4}>
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