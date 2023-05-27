import * as React from "react";
import { useCallback, useEffect, useState } from "react";
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
  updateCityBonusScore: (score: number) => void;
  updateMonumentBonusScore: (score: number) => void;
  cityCount: number;
  monumentCount: number;
}

export const Developments = (props: DevelopmentsProps) => {
  const [developments] = useState<DevelopmentProps[]>(defaultDevelopmentProps);
  const [checkedDevelopments, setCheckDevelopments] = useState<
    DevelopmentProps[]
  >([]);
  const [cityCount, setCityCount] = useState(props.cityCount);
  const [monumentCount, setMonumentCount] = useState(props.monumentCount);

  const updateDevelopmentScore = useCallback(
    (developments: DevelopmentProps[]) => {
      const points = developments.map((x) => x.points);

      if (checkedDevelopments.length === 0) return;

      props.updateDevelopmentScore(
        points.length === 0 ? 0 : points.reduce((a, b) => a + b)
      );

      props.updateMonumentBonusScore(
        developments.filter((x) => x.name === "Architecture").length === 1
          ? props.monumentCount
          : 0
      );

      props.updateCityBonusScore(
        developments.filter((x) => x.name === "Empire").length === 1
          ? props.cityCount
          : 0
      );
    },
    [checkedDevelopments.length, props]
  );

  useEffect(() => {
    if (props.cityCount !== cityCount) setCityCount(props.cityCount);

    if (props.monumentCount !== monumentCount)
      setMonumentCount(props.monumentCount);

    updateDevelopmentScore(checkedDevelopments);
  }, [
    checkedDevelopments,
    cityCount,
    monumentCount,
    props.cityCount,
    props.monumentCount,
    updateDevelopmentScore,
  ]);

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
    updateDevelopmentScore(checkedItems);
  }

  return (
    <Stack gap={0}>
      <h5>{`Developments: ${checkedDevelopments
        .map((x) => x.points)
        .reduce((a, b) => a + b, 0)} pts`}</h5>
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
