import Stack from "react-bootstrap/esm/Stack";
import { CheckSquare, Square } from "react-bootstrap-icons";
import styled from "styled-components";

export const CheckboxChecked = styled(CheckSquare)`
  margin-right: 4px;
`;

export const CheckboxUnchecked = styled(Square)`
  margin-right: 4px;
`;

export interface CheckboxButtonProps {
  text?: string;
  selected: boolean;
  onChange: (value: boolean) => void;
}

export const CheckboxButton = (props: CheckboxButtonProps) => {
  return (
    <Stack
      direction="horizontal"
      className="text-dark fs-6 btn"
      onClick={() => props.onChange(!props.selected)}
    >
      {props.text ? (
        <>
          {props.selected ? <CheckboxChecked /> : <CheckboxUnchecked />}
          {props.text}
        </>
      ) : props.selected ? (
        <CheckSquare />
      ) : (
        <Square />
      )}
    </Stack>
  );
};

export const CheckboxButtonGapless = (props: CheckboxButtonProps) => {
  return (
    <Stack
      direction="horizontal"
      className="text-dark fs-6 btn"
      onClick={() => props.onChange(!props.selected)}
      style={{ margin: "0px", padding: "0px" }}
    >
      {props.text ? (
        <>
          {props.selected ? <CheckboxChecked /> : <CheckboxUnchecked />}
          {props.text}
        </>
      ) : props.selected ? (
        <CheckSquare />
      ) : (
        <Square />
      )}
    </Stack>
  );
};
