import * as React from "react";
import { useState } from "react";
import Stack from "react-bootstrap/esm/Stack";
import { CheckboxButtonGapless } from "../../../common/checkbox-buttons";
import { BuildingCheck } from "react-bootstrap-icons";

export const defaultCities = [
  { cost: 0 },
  { cost: 0 },
  { cost: 0 },
  { cost: 3 },
  { cost: 4 },
  { cost: 5 },
  { cost: 6 },
];

export interface CityProps {
  cost: number;
  setCompleted?: (isCompleted: boolean) => void;
  index: number;
}

export const City = (props: CityProps) => {
  const [people, setPeople] = useState<boolean[]>(
    Array(props.cost).fill(false)
  );

  function isCompleted(people: boolean[]) {
    return people.filter((x) => !x).length === 0;
  }

  function updatePerson(whichPerson: number, newValue: boolean) {
    const newPeopleValues = people.map((x, index) =>
      index === whichPerson ? newValue : x
    );
    setPeople(newPeopleValues);

    props.setCompleted?.(isCompleted(newPeopleValues));
  }

  function getPeopleBox(which: number) {
    return (
      <CheckboxButtonGapless
        key={`${props.cost}_${which}`}
        selected={people[which]}
        onChange={(newValue) => updatePerson(which, newValue)}
      />
    );
  }

  function getPeopleRow(which: number) {
    if (which !== 0 && which % 2 !== people.length % 2) {
      return null;
    }

    // odd, display one box at start
    if (which === 0 && people.length % 2 === 1) {
      return (
        <Stack
          key={`city_${props.cost}_row${Math.ceil(which / 2)}`}
          direction="horizontal"
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          {getPeopleBox(which)}
        </Stack>
      );
    }

    // otherwise display two boxes in the row
    return (
      <Stack
        key={`city_${props.cost}_row${Math.ceil(which / 2)}`}
        direction="horizontal"
        gap={1}
        style={{ display: "flex", justifyContent: "center" }}
      >
        {getPeopleBox(which)}
        {getPeopleBox(which + 1)}
      </Stack>
    );
  }

  function getPeopleBoxes() {
    const peopleStack: JSX.Element[] = [];
    for (let i = 0; i < people.length; i++) {
      const peopleRow = getPeopleRow(i);
      if (peopleRow !== null) peopleStack.push(peopleRow);
    }

    return (
      <Stack style={{ display: "flex", justifyContent: "end" }} gap={1}>
        {peopleStack}
      </Stack>
    );
  }

  return (
    <Stack direction="vertical" style={{ maxWidth: "56px", alignSelf: "end" }}>
      <div style={{ display: "flex", alignSelf: "center" }}>
        {isCompleted(people) && <BuildingCheck color="#00aa00" />}
      </div>
      <div
        style={{
          borderWidth: "1px",
          borderColor: "#000000",
          margin: "4px",
          borderStyle: "solid",
          height: `${props.index * 12}px`,
          width: "48px",
          padding: "4px",
          display: "flex",
        }}
      >
        {getPeopleBoxes()}
      </div>
    </Stack>
  );
};
