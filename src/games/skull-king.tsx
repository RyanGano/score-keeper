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

interface SkullKingPlayerState {
  playerInfo: PlayerGeneralProps;
  roundScores: SkullKingRoundInfo[];
}

export function calculateRoundScore(info: SkullKingRoundInfo): number {
  if (info.bid === info.taken) {
    const newScore =
      info.bid === 0
        ? info.possibleTricks * 10 + info.bonus
        : info.taken * 20 + info.bonus;

    return newScore;
  }

  return Math.abs(info.taken - info.bid) * -10;
}

enum SkullKingGameStatus {
  GameNotStarted,
  BiddingOpen,
  BiddingClosed,
  GameOver,
}

export const SkullKing = () => {
  const props: GameProps = useContext<GameProps>(Context);
  const [playerStates, setPlayerStates] = useState<SkullKingPlayerState[]>([]);
  const [round, setRound] = useState<number>(0);
  const [gameStatus, setGameStatus] = useState<SkullKingGameStatus>(
    SkullKingGameStatus.GameNotStarted
  );

  function startGame() {
    if (props.getPlayers !== undefined) {
      setPlayerStates(
        props.getPlayers().map((x, index) => {
          return {
            playerInfo: x,
            roundScores: [{ ...defaultSkullKingRoundInfo, possibleTricks: 1 }],
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

    return (
      <Row
        style={{
          maxWidth: `${playerStates.length * skullKingScoreBoxWidth}px`,
        }}
      >
        {scores}
      </Row>
    );
  }

  function getRoundInfos(which: number): SkullKingRoundInfo[] {
    return playerStates.map((x) => x.roundScores[which]);
  }

  function getAllScores(): JSX.Element[] {
    let scores: JSX.Element[] = [];
    if (round !== 0) {
      for (var i: number = 0; i < round; i++) {
        scores.push(
          <div key={`score_${i}`}>
            {getRoundInfo(getRoundInfos(i), i < round - 1)}
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

  function setBid(playerInfo: PlayerGeneralProps, newBid: number): void {
    setPlayerStates(
      playerStates.map((x) =>
        x.playerInfo !== playerInfo
          ? x
          : {
              playerInfo: x.playerInfo,
              roundScores: [
                ...x.roundScores.slice(0, x.roundScores.length - 1),
                {
                  ...x.roundScores[x.roundScores.length - 1],
                  bid: newBid,
                  possibleTricks: round,
                  currentScore: getCurrentScore(
                    x.roundScores.slice(0, x.roundScores.length - 1)
                  ),
                },
              ],
            }
      )
    );
  }

  function setTricksTaken(
    playerInfo: PlayerGeneralProps,
    newTricksTaken: number
  ): void {
    setPlayerStates(
      playerStates.map((x) =>
        x.playerInfo !== playerInfo
          ? x
          : {
              playerInfo: x.playerInfo,
              roundScores: [
                ...x.roundScores.slice(0, x.roundScores.length - 1),
                {
                  ...x.roundScores[x.roundScores.length - 1],
                  taken: newTricksTaken,
                },
              ],
            }
      )
    );
  }

  function setBonus(playerInfo: PlayerGeneralProps, newBonus: number): void {
    setPlayerStates(
      playerStates.map((x) =>
        x.playerInfo !== playerInfo
          ? x
          : {
              playerInfo: x.playerInfo,
              roundScores: [
                ...x.roundScores.slice(0, x.roundScores.length - 1),
                {
                  ...x.roundScores[x.roundScores.length - 1],
                  bonus: newBonus,
                },
              ],
            }
      )
    );
  }

  function addNewRoundInfo(): void {
    setPlayerStates(
      playerStates.map((x) => {
        return {
          playerInfo: x.playerInfo,
          roundScores: [
            ...x.roundScores,
            {
              ...defaultSkullKingRoundInfo,
              currentScore: getCurrentScore(x.roundScores),
              possibleTricks: round + 1,
            },
          ],
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
      <p />
      <div style={{ position: "relative", left: "0px", right: "24px" }}>
        {gameStatus !== SkullKingGameStatus.GameNotStarted && `Round: ${round}`}
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
                      setBid={(newBid) => setBid(x.playerInfo, newBid)}
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
          <div style={{ width: "625px" }}>
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
                  width: "625px",
                }}
              >
                {playerStates.map((x, index) => (
                  <Col key={`state2_${index}`}>
                    <TricksTakenInputArea
                      setTricksTaken={(tricksTaken) =>
                        setTricksTaken(x.playerInfo, tricksTaken)
                      }
                    />
                    <BonusInputArea
                      setBonus={(bonus) => setBonus(x.playerInfo, bonus)}
                    />
                  </Col>
                ))}
              </div>
            </Container>
            <Button
              onClick={() => {
                setGameStatus(SkullKingGameStatus.BiddingOpen);
                setRound(round + 1);
                addNewRoundInfo();
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
