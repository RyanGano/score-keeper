import { useState } from "react";
import Stack from "react-bootstrap/esm/Stack";
import { CheckboxButtonGapless } from "../../../common/checkbox-buttons";

export interface DisastersProps {
  updateDisasters: (count: number) => void;
}

export const Disasters = (props: DisastersProps) => {
  const [disasters, setDisasters] = useState<boolean[]>(Array(45).fill(false));

  function updateDisaster(which: number, value: boolean) {
    const updatedDisasters = [
      ...disasters.map((x, index) => (index === which ? value : x)),
    ];

    setDisasters(updatedDisasters);
    props.updateDisasters(updatedDisasters.filter((x) => x).length);
  }

  function getDisasterBox(which: number) {
    return (
      <CheckboxButtonGapless
        key={`${which}`}
        selected={disasters[which]}
        onChange={(newValue) => updateDisaster(which, newValue)}
      />
    );
  }

  function getDisasterSection(start: number) {
    const disasterBoxes: JSX.Element[] = [];

    for (let i = start; i < start + 5; i++)
      disasterBoxes.push(getDisasterBox(i));

    return (
      <Stack direction="horizontal" gap={1}>
        {disasterBoxes}
      </Stack>
    );
  }

  return (
    <Stack gap={1}>
      <h5>Disasters</h5>
      <Stack direction="vertical" gap={2}>
        <Stack direction="horizontal" gap={3}>
          {getDisasterSection(0)}
          {getDisasterSection(5)}
          {getDisasterSection(10)}
        </Stack>
        <Stack direction="horizontal" gap={3}>
          {getDisasterSection(15)}
          {getDisasterSection(20)}
          {getDisasterSection(25)}
        </Stack>
        <Stack direction="horizontal" gap={3}>
          {getDisasterSection(30)}
          {getDisasterSection(35)}
          {getDisasterSection(40)}
        </Stack>
      </Stack>
    </Stack>
  );
};
