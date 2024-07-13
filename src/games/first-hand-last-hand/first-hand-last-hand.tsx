import Stack from "react-bootstrap/esm/Stack";
import { GameHeader } from "../../common/common-styles";
import { GameStatus } from "../../App";
import { ResetGame } from "../../common/reset-game";
import Button from "react-bootstrap/esm/Button";
import { Gear } from "react-bootstrap-icons";
import { SimpleModal } from "../../common/simple-modal";
import { useState } from "react";
import { PlayerGeneralProps } from "../../components/player-general";
import useCookies from "react-cookie/cjs/useCookies";
import { addPlayer, editPlayer } from "../../common/player-utility";
import { PlayerList } from "../../common/player-list";
import { NumericInputArea } from "../../components/numeric-input-area";

interface RoundInfo {
  bookScore: number;
  cardScore: number;
}

interface PlayerGameInfo {
  player: PlayerGeneralProps;
  rounds: RoundInfo[];
}

interface GameInfo {
  playerGameInfo: PlayerGameInfo[];
}

export interface FirstHandLastHandProps {
  onGameStatusChanged: (status: GameStatus) => void;
}

export const gameName = "First Hand Last Hand";
const gameCookieName = "players_fhlh";
const defaultPlayers: PlayerGeneralProps[] = [
  { Name: "Team 1" },
  { Name: "Team 2" },
];
const maxTeams = 3;
const minTeams = 2;

export const FirstHandLastHand = (props: FirstHandLastHandProps) => {
  const [gameStatus, setGameStatus] = useState(GameStatus.NotStarted);
  const [players, setPlayers] = useState<PlayerGeneralProps[]>([]);
  const [showGameSettings, setShowGameSettings] = useState(
    players.length === 0
  );
  const [gameInfo, setGameInfo] = useState<GameInfo>();
  const [cookies, setCookie] = useCookies([gameCookieName]);

  const settingsContent = (
    <Stack gap={4}>
      <PlayerList
        addPlayer={addPlayerLocal}
        removePlayer={removePlayer}
        editPlayer={editPlayerLocal}
        activePlayers={players}
        canAddPlayer={players.length < maxTeams}
        canRemovePlayer={players.length > minTeams}
        playerType="teams"
      />
    </Stack>
  );

  function addPlayerLocal(newName: string) {
    return addPlayer(
      players,
      setPlayers,
      (value: string) => setCookie(gameCookieName, value),
      maxTeams,
      newName
    );
  }

  function editPlayerLocal(originalName: string, newName: string) {
    return editPlayer(
      players,
      setPlayers,
      (value: string) => setCookie(gameCookieName, value),
      originalName,
      newName
    );
  }

  function removePlayer(name: string) {
    const newPlayers = [...players].filter((x) => x.Name !== name);
    setPlayers(newPlayers);
    setCookie(gameCookieName, newPlayers.map((x) => x.Name).join("|"));
  }

  if (!cookies.players_fhlh && players.length === 0) {
    setPlayers(defaultPlayers);
  }
  if (cookies.players_fhlh && players.length === 0) {
    setPlayers(
      cookies?.players_fhlh.split("|").map((x: string) => {
        return { Name: x };
      })
    );
  }

  const startGame = () => {
    setGameStatus(GameStatus.Active);
    setShowGameSettings(false);
    setGameInfo({
      playerGameInfo: players.map((player) => ({
        player: player,
        rounds: [{ bookScore: 0, cardScore: 0 }],
      })),
    });
  };

  /*const addRound = () => {
    if (!gameInfo) {
      return;
    }

    setGameInfo({
      playerGameInfo: gameInfo.playerGameInfo.map(
        (playerInfo: PlayerGameInfo): PlayerGameInfo => ({
          ...playerInfo,
          rounds: [...playerInfo.rounds, { bookScore: 0, cardScore: 0 }],
        })
      ),
    });
  };*/

  const resetGame = () => {
    setGameStatus(GameStatus.NotStarted);
  };

  return (
    <>
      <GameHeader>
        <h2>
          <Stack direction="horizontal" gap={1}>
            {gameName}
            {gameStatus !== GameStatus.NotStarted && (
              <ResetGame onAccept={resetGame} />
            )}
            {gameStatus === GameStatus.NotStarted ||
            gameStatus === GameStatus.Complete ? (
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
        <SimpleModal
          title={`${gameName} Settings`}
          content={settingsContent}
          defaultButtonContent="Start Game"
          alternateButtonContent="Close"
          onAccept={() => startGame()}
          onCancel={() => setShowGameSettings(false)}
          show={showGameSettings}
        />
      </GameHeader>
      {gameInfo && <GameDisplay gameInfo={gameInfo} />}
    </>
  );
};

interface GameDisplayProps {
  gameInfo: GameInfo;
}

const GameDisplay = (props: GameDisplayProps) => {
  const { playerGameInfo: playerInfos } = props.gameInfo;

  return (
    <Stack direction="horizontal" gap={2}>
      {playerInfos.map((playerInfo) => (
        <PlayerGameStatus
          key={playerInfo.player.Name}
          playerInfo={playerInfo}
        />
      ))}
    </Stack>
  );
};

interface PlayerGameStatusProps {
  playerInfo: PlayerGameInfo;
}

const PlayerGameStatus = (props: PlayerGameStatusProps) => {
  const { player, rounds } = props.playerInfo;

  return (
    <Stack>
      <span style={{ fontWeight: 600 }}>{player.Name}</span>
      {rounds.map((round, index) => (
        <PlayerRound
          key={index}
          startingScore={0}
          bookScore={round.bookScore}
          cardScore={round.cardScore}
        />
      ))}
    </Stack>
  );
};

interface PlayerRoundProps {
  startingScore: number;
  bookScore: number;
  cardScore: number;
}

const PlayerRound = (props: PlayerRoundProps) => {
  const { startingScore, bookScore, cardScore } = props;

  return (
    <Stack>
      <Stack direction="horizontal" gap={2}>
        <div>Book Score</div>
        <NumericInputArea
          startingValue={startingScore}
          setNewValue={(newValue) => console.log(newValue)}
          width={150}
        />
        {/* <div>{bookScore}</div> */}
      </Stack>
      <Stack direction="horizontal" gap={2}>
        <div>Card Score</div>
        <div>{cardScore}</div>
      </Stack>
    </Stack>
  );
};
