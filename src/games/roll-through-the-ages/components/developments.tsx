import * as React from "react";
import { useState } from "react";
import Stack from "react-bootstrap/esm/Stack";
import { Development, DevelopmentProps } from "./development";

const defaultDevelopmentProps: DevelopmentProps[] = [
  {
    cost: 10,
    name: "Leadership",
    points: 2,
    effect: "Reroll 1 die (after last roll)",
  },
  {
    cost: 10,
    name: "Irrigation",
    points: 2,
    effect: "Drought has no effect",
  },
  {
    cost: 15,
    name: "Agriculture",
    points: 3,
    effect: "+1 food / food die",
  },
  {
    cost: 15,
    name: "Quarrying",
    points: 3,
    effect: "+1 stone if collecting stone",
  },
  {
    cost: 15,
    name: "Medicine",
    points: 3,
    effect: "Pestilence has no effect",
  },
  {
    cost: 20,
    name: "Coinage",
    points: 4,
    effect: "Coin die results are worth 12",
  },
  {
    cost: 20,
    name: "Caravans",
    points: 4,
    effect: "No need to discard goods",
  },
  {
    cost: 20,
    name: "Religion",
    points: 6,
    effect: "Revolt affects opponents",
  },
  {
    cost: 30,
    name: "Granaries",
    points: 6,
    effect: "Sell food for 4 coins each",
  },
  {
    cost: 30,
    name: "Masonry",
    points: 6,
    effect: "+1 worker / worker die",
  },
  {
    cost: 40,
    name: "Engineering",
    points: 6,
    effect: "Use stone for 3 workers each",
  },
  {
    cost: 50,
    name: "Architecture",
    points: 8,
    effect: "Bonus pts: 1 / monument",
  },
  {
    cost: 60,
    name: "Empire",
    points: 8,
    effect: "Bonus pts: 1 / city",
  },
];

export interface DevelopmentsProps {
  updateDevelopmentScore: (score: number) => void;
}

export const Developments = (props: DevelopmentsProps) => {
  const [developments] = useState<DevelopmentProps[]>(defaultDevelopmentProps);
  const [checkedDevelopments, setCheckDevelopments] = useState<
    DevelopmentProps[]
  >([]);

  function updateCheckedDevelopments(
    developmentName: string,
    isChecked: boolean
  ) {
    const checkedItems = !isChecked
      ? checkedDevelopments.filter((x) => x.name !== developmentName)
      : [
          ...checkedDevelopments,
          developments.filter((x) => x.name === developmentName)[0],
        ];

    setCheckDevelopments(checkedItems);
    const points = checkedItems.map((x) => x.points);
    props.updateDevelopmentScore(
      points.length === 0 ? 0 : points.reduce((a, b) => a + b)
    );
  }

  return (
    <Stack gap={0}>
      {developments.map((x) => (
        <Development
          key={x.name}
          {...x}
          setChecked={(isChecked) =>
            updateCheckedDevelopments(x.name, isChecked)
          }
        />
      ))}
    </Stack>
  );
};
