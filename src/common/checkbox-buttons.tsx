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
  enabled?: boolean;
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
          {props.selected ? (
            <CheckboxChecked
              color={props.enabled ?? true ? "#000000" : "#cccccc"}
            />
          ) : (
            <CheckboxUnchecked
              color={props.enabled ?? true ? "#000000" : "#cccccc"}
            />
          )}
          {props.text}
        </>
      ) : props.selected ? (
        <CheckSquare color={props.enabled ?? true ? "#000000" : "#cccccc"} />
      ) : (
        <Square color={props.enabled ?? true ? "#000000" : "#cccccc"} />
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
          {props.selected ? (
            <CheckboxChecked
              color={props.enabled ?? true ? "#000000" : "#cccccc"}
            />
          ) : (
            <CheckboxUnchecked
              color={props.enabled ?? true ? "#000000" : "#cccccc"}
            />
          )}
          {props.text}
        </>
      ) : props.selected ? (
        <CheckSquare color={props.enabled ?? true ? "#000000" : "#cccccc"} />
      ) : (
        <Square color={props.enabled ?? true ? "#000000" : "#cccccc"} />
      )}
    </Stack>
  );
};
