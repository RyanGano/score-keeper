import * as React from "react";
import { GameHeader } from "../../common/common-styles";
import { useCallback, useEffect, useState } from "react";
import { SimpleModal } from "../../common/simple-modal";
import Stack from "react-bootstrap/esm/Stack";
import { PlayerList } from "../../common/player-list";
import { PlayerGeneralProps } from "../../components/player-general";
import { addPlayer, editPlayer } from "../../common/player-utility";
import useCookies from "react-cookie/cjs/useCookies";
import Button from "react-bootstrap/esm/Button";
import { Gear, QuestionCircle, StarFill } from "react-bootstrap-icons";
import { ResetGame } from "../../common/reset-game";
import { Developments } from "./components/developments";
import { CheckboxButton } from "../../common/checkbox-buttons";
import { Cities } from "./components/cities";
import { Score } from "./components/score";
import { Monuments } from "./components/monuments";
import { Disasters } from "./components/disasters";
import { hintPopupContent } from "./components/hint-area";
import { GameStatus } from "../../App";

const citiesIndex = 0;
const developmentsIndex = 1;
const monumentsIndex = 2;
const disastersIndex = 3;
const scoreIndex = 3;

export interface RollThroughTheAgesProps {
  onGameStatusChanged: (status: GameStatus) => void;
}

export const RollThroughTheAges = (props: RollThroughTheAgesProps) => {
  const { onGameStatusChanged } = props;
  const [players, setPlayers] = useState<PlayerGeneralProps[]>([]);
  const [showGameSettings, setShowGameSettings] = useState<boolean>(
    players.length === 0
  );
  const [showHintPopup, setShowHintPopup] = useState<boolean>(false);
  const [startingPlayer, setStartingPlayer] = useState<boolean>(false);
  const [numberOfPlayers, setNumberOfPlayers] = useState<number>(2);
  const [gameStatus, setGameStatus] = useState<GameStatus>(
    GameStatus.NotStarted
  );
  const [cityCount, setCityCount] = useState<number>(3);
  const [monumentCount, setMonumentCount] = useState<number>(0);
  const [monumentScore, setMonumentScore] = useState<number>(0);
  const [developmentsScore, setDevelopmentsScore] = useState<number>(0);
  const [cityBonus, setCityBonus] = useState<number>(0);
  const [monumentBonus, setMonumentBonus] = useState<number>(0);
  const [disasterCount, setDisasterCount] = useState<number>(0);
  const [needsReset, setNeedsReset] = useState<boolean[]>(Array(5).fill(false));
  const [cookies, setCookie] = useCookies(["players_rtta"]);
  const [monuments, setMonuments] = useState<JSX.Element | undefined>();
  const [cities, setCities] = useState<JSX.Element | undefined>();
  const [developments, setDevelopments] = useState<JSX.Element | undefined>();
  const [disasters, setDisasters] = useState<JSX.Element | undefined>();
  const [score, setScore] = useState<JSX.Element | undefined>();

  const minPlayers = 1;
  const maxPlayers = 1;

  useEffect(() => {
    onGameStatusChanged(gameStatus);
  }, [gameStatus, onGameStatusChanged]);

  const clearReset = useCallback(
    (which: number) => {
      setNeedsReset([
        ...needsReset.map((x, index) => (index === which ? false : x)),
      ]);
    },
    [needsReset]
  );

  const updateScore = useCallback(
    (newValue: number, updater: (newValue: number) => void) => {
      updater(newValue);

      if (gameStatus === GameStatus.NotStarted)
        setGameStatus(GameStatus.Active);
    },
    [gameStatus]
  );

  useEffect(() => {
    if (needsReset[citiesIndex]) {
      setCities(undefined);
      clearReset(citiesIndex);
      setCityCount(3);
    }
    if (cities === undefined) {
      setCities(
        <Cities
          updateCompletedCityCount={(newValue) =>
            updateScore(newValue, setCityCount)
          }
        />
      );
    }
  }, [cities, clearReset, needsReset, updateScore]);

  useEffect(() => {
    if (needsReset[developmentsIndex]) {
      setDevelopments(undefined);
      clearReset(developmentsIndex);
      setDevelopmentsScore(0);
      setCityBonus(0);
      setMonumentBonus(0);
    }

    if (
      developments === undefined ||
      developments.props.monumentCount !== monumentCount ||
      developments.props.cityCount !== cityCount
    ) {
      setDevelopments(
        <Developments
          onDevelopmentScoreChanged={(newValue) =>
            updateScore(newValue, setDevelopmentsScore)
          }
          onCityBonusScoreChanged={(newValue) =>
            updateScore(newValue, setCityBonus)
          }
          onMonumentBonusScoreChanged={(newValue) =>
            updateScore(newValue, setMonumentBonus)
          }
          cityCount={cityCount}
          monumentCount={monumentCount}
          onCompleted={() => setGameStatus(GameStatus.Complete)}
        />
      );
    }
  }, [
    cityCount,
    clearReset,
    developments,
    monumentCount,
    needsReset,
    updateScore,
  ]);

  useEffect(() => {
    if (needsReset[monumentsIndex]) {
      setMonuments(undefined);
      clearReset(monumentsIndex);
      setMonumentCount(0);
      setMonumentBonus(0);
    }
    if (
      monuments === undefined ||
      monuments.props.numberOfPlayers !== numberOfPlayers
    ) {
      setMonuments(
        <Monuments
          onCompletedMonumentCountChanged={(newValue) =>
            updateScore(newValue, setMonumentCount)
          }
          onMonumentScoreChanged={(newValue) =>
            updateScore(newValue, setMonumentScore)
          }
          numberOfPlayers={numberOfPlayers}
          onCompleted={() => setGameStatus(GameStatus.Complete)}
        />
      );
    }
  }, [clearReset, monuments, needsReset, numberOfPlayers, updateScore]);

  useEffect(() => {
    if (needsReset[disastersIndex]) {
      setDisasters(undefined);
      clearReset(disastersIndex);
      setDisasterCount(disasterCount);
    }
    if (disasters === undefined) {
      setDisasters(
        <Disasters
          updateDisasters={(newValue) =>
            updateScore(newValue, setDisasterCount)
          }
        />
      );
    }
  }, [clearReset, disasterCount, disasters, needsReset, updateScore]);

  useEffect(() => {
    if (needsReset[scoreIndex]) {
      clearReset(scoreIndex);
      setDevelopmentsScore(0);
      setMonumentScore(0);
      setCityBonus(0);
      setMonumentBonus(0);
      setDisasterCount(0);
    }
    if (
      score === undefined ||
      score.props.development !== developmentsScore ||
      score.props.monument !== monumentScore ||
      score.props.bonus !== cityBonus + monumentBonus ||
      score.props.disaster !== disasterCount
    ) {
      setScore(
        <Score
          development={developmentsScore}
          monument={monumentScore}
          bonus={cityBonus + monumentBonus}
          disaster={disasterCount}
        />
      );
    }
  }, [
    cityBonus,
    clearReset,
    developmentsScore,
    disasterCount,
    monumentBonus,
    monumentScore,
    needsReset,
    score,
  ]);

  if (!cookies.players_rtta && players.length === 0) {
    setPlayers([{ Name: "Me" }]);
  }
  if (cookies.players_rtta && players.length === 0) {
    setPlayers(
      cookies?.players_rtta.split("|").map((x: string) => {
        return { Name: x };
      })
    );
  }

  function addPlayerLocal(newName: string) {
    return addPlayer(
      players,
      setPlayers,
      (value: string) => setCookie("players_rtta", value),
      maxPlayers,
      newName
    );
  }

  function editPlayerLocal(originalName: string, newName: string) {
    return editPlayer(
      players,
      setPlayers,
      (value: string) => setCookie("players_rtta", value),
      originalName,
      newName
    );
  }

  const settingsContent = (
    <Stack gap={4}>
      <PlayerList
        addPlayer={addPlayerLocal}
        removePlayer={(_) => {}}
        editPlayer={editPlayerLocal}
        activePlayers={players}
        canAddPlayer={players.length < maxPlayers}
        canRemovePlayer={players.length > minPlayers}
      />
      <div>
        <CheckboxButton
          text="First Player"
          selected={startingPlayer}
          onChange={setStartingPlayer}
        />
      </div>
      <Stack direction="horizontal">
        Number of Players:
        <CheckboxButton
          text="2"
          selected={numberOfPlayers === 2}
          onChange={(_) => setNumberOfPlayers(2)}
        />
        <CheckboxButton
          text="3"
          selected={numberOfPlayers === 3}
          onChange={(_) => setNumberOfPlayers(3)}
        />
        <CheckboxButton
          text="4"
          selected={numberOfPlayers === 4}
          onChange={(_) => setNumberOfPlayers(4)}
        />
      </Stack>
    </Stack>
  );

  function startGame() {
    setShowGameSettings(false);
    setGameStatus(GameStatus.Active);
  }

  function resetGame() {
    setGameStatus(GameStatus.NotStarted);
    setNeedsReset(Array(5).fill(true));
  }

  const playerInfo = (
    <Stack
      direction="horizontal"
      gap={2}
      onClick={() =>
        gameStatus !== GameStatus.Active && setShowGameSettings(true)
      }
    >
      <div style={{ fontSize: "16pt" }}>Player:</div>
      <div style={{ fontSize: "16pt", fontWeight: "500" }}>
        {players[0]?.Name}
      </div>
      {startingPlayer && <StarFill />}
    </Stack>
  );

  return (
    <>
      <GameHeader>
        <h2>
          <Stack direction="horizontal" gap={1}>
            Roll Through the Ages
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
            <Button variant="link" onClick={() => setShowHintPopup(true)}>
              <QuestionCircle />
            </Button>
          </Stack>
        </h2>
        <SimpleModal
          title="Roll Through the Ages Settings"
          content={settingsContent}
          defaultButtonContent="Start Game"
          alternateButtonContent="Close"
          onAccept={() => startGame()}
          onCancel={() => setShowGameSettings(false)}
          show={showGameSettings}
        />
        <SimpleModal
          title="Game Help"
          content={hintPopupContent}
          defaultButtonContent="Close"
          onAccept={() => setShowHintPopup(false)}
          onCancel={() => setShowHintPopup(false)}
          show={showHintPopup}
        />
      </GameHeader>
      <Stack gap={2} style={{ margin: 8 }}>
        {playerInfo}
        {cities}
        {developments}
        {monuments}
        {disasters}
        {score}
      </Stack>
    </>
  );
};
