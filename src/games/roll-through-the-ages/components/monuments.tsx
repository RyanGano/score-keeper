import * as React from "react";
import { useState } from "react";
import Stack from "react-bootstrap/esm/Stack";
import { Monument } from "./monument";

export const defaultMonuments = [
  {
    name: "Step Pyramid",
    scores: [1, 0],
    cost: 3,
    shape: [1, 2],
    enabled: (playerCount: number) => true,
  },
  {
    name: "Stone Circle",
    scores: [2, 1],
    cost: 5,
    shape: [2, 3],
    enabled: (playerCount: number) => true,
  },
  {
    name: "Temple",
    scores: [4, 2],
    cost: 7,
    shape: [1, 3, 3],
    enabled: (playerCount: number) => playerCount !== 2,
  },
  {
    name: "Hanging Gardens",
    scores: [8, 4],
    cost: 11,
    shape: [2, 4, 5],
    enabled: (playerCount: number) => playerCount !== 3,
  },
  {
    name: "Great Pyramid",
    scores: [12, 6],
    cost: 15,
    shape: [1, 2, 3, 4, 5],
    enabled: (playerCount: number) => playerCount !== 2,
  },
  {
    name: "Great Wall (Invasion has no effect)",
    scores: [10, 5],
    cost: 13,
    shape: [13],
    enabled: (playerCount: number) => true,
  },
  {
    name: "Obelisk",
    scores: [6, 3],
    cost: 9,
    shape: [1, 1, 1, 1, 1, 1, 1, 1, 1],
    enabled: (playerCount: number) => true,
  },
];

interface MonumentInfo {
  name: string;
  scores: number[];
  cost: number;
  shape: number[];
  enabled: (playerCount: number) => boolean;
  completed: boolean;
}

export interface MonumentsProps {
  updateCompletedMonumentCount: (count: number) => void;
  updateMonumentScore: (score: number) => void;
  numberOfPlayers: number;
}

export const Monuments = (props: MonumentsProps) => {
  const [monuments, setMonuments] = useState(
    defaultMonuments.map((x) => {
      return {
        name: x.name,
        scores: x.scores,
        cost: x.cost,
        shape: x.shape,
        enabled: x.enabled,
        completed: false,
      };
    })
  );
  const [monumentsCompletedByOthers, setMonumentsCompletedByOthers] = useState<
    string[]
  >([]);

  function updateMonumentScore(
    monuments: MonumentInfo[],
    monumentNamesOthersCompleted: string[]
  ) {
    const monumentScore = monuments
      .filter((x) => x.completed)
      .map((x) =>
        monumentNamesOthersCompleted.includes(x.name)
          ? x.scores[1]
          : x.scores[0]
      )
      .reduce((a, b) => a + b, 0);

    props.updateMonumentScore(monumentScore);
  }

  function updateMonuments(whichMonument: number, completed: boolean): void {
    const updatedMonumentInfo = monuments.map((x, index) =>
      index === whichMonument ? { ...x, completed } : { ...x }
    );

    setMonuments(updatedMonumentInfo);
    props.updateCompletedMonumentCount(
      updatedMonumentInfo.filter((x) => x.completed).length
    );

    updateMonumentScore(updatedMonumentInfo, monumentsCompletedByOthers);
  }

  function updateFirstPlayerStatus(
    whichMonument: string,
    completed: boolean
  ): void {
    const monumentNames = [
      ...monumentsCompletedByOthers.filter((x) => x !== whichMonument),
    ];

    if (completed) monumentNames.push(whichMonument);

    setMonumentsCompletedByOthers(monumentNames);
    props.updateCompletedMonumentCount(
      monuments.filter((x) => x.completed).length
    );

    updateMonumentScore(monuments, monumentNames);
  }

  return (
    <Stack gap={1} style={{ maxWidth: 505 }}>
      <h5>Monuments</h5>
      <Stack direction="horizontal" gap={1}>
        {monuments.slice(0, 4).map((x, index) => (
          <Monument
            key={index}
            name={x.name}
            scores={x.scores}
            cost={x.cost}
            shape={x.shape}
            enabled={x.enabled(props.numberOfPlayers)}
            setOtherPlayerCompletedFirst={(value) =>
              updateFirstPlayerStatus(x.name, value)
            }
            setCompleted={(completed) => updateMonuments(index, completed)}
          />
        ))}
      </Stack>
      <Stack direction="horizontal" gap={1}>
        {monuments.slice(4).map((x, index) => (
          <Monument
            key={index}
            name={x.name}
            scores={x.scores}
            cost={x.cost}
            shape={x.shape}
            enabled={x.enabled(props.numberOfPlayers)}
            setOtherPlayerCompletedFirst={(value) =>
              updateFirstPlayerStatus(x.name, value)
            }
            setCompleted={(completed) => updateMonuments(index, completed)}
          />
        ))}
      </Stack>
    </Stack>
  );
};
