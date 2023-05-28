import * as React from "react";
import { useState } from "react";
import Stack from "react-bootstrap/esm/Stack";
import { City } from "./city";

export const defaultCities = [
  { cost: 0 },
  { cost: 0 },
  { cost: 0 },
  { cost: 3 },
  { cost: 4 },
  { cost: 5 },
  { cost: 6 },
];

export interface CitiesProps {
  updateCompletedCityCount: (count: number) => void;
}

export const Cities = (props: CitiesProps) => {
  const [cities, setCities] = useState(
    defaultCities.map((x) => {
      return { cost: x.cost, completed: x.cost === 0 };
    })
  );

  function updateCities(whichCity: number, completed: boolean): void {
    const updatedCityInfo = cities.map((x, index) =>
      index === whichCity ? { ...x, completed } : { ...x }
    );

    setCities(updatedCityInfo);
    props.updateCompletedCityCount(
      updatedCityInfo.filter((x) => x.completed).length
    );
  }

  return (
    <Stack direction="horizontal" gap={1} style={{ minHeight: "108px" }}>
      {cities.map((x, index) => (
        <City
          key={index}
          cost={x.cost}
          setCompleted={(completed) => updateCities(index, completed)}
          index={index + 1}
        />
      ))}
    </Stack>
  );
};
