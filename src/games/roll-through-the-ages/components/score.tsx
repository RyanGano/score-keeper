import Stack from "react-bootstrap/esm/Stack";
import { CenteredTextBox } from "../../../common/common-styles";

export interface ScoreProps {
  development: number;
  bonus: number;
}

export const Score = (props: ScoreProps) => {
  const subtotal = props.development + 0 + props.bonus;
  const total = {
    minWidth: 40,
  };
  return (
    <Stack gap={1} style={{ margin: 8 }}>
      <h5>Score</h5>
      <Stack direction="horizontal" gap={1}>
        <CenteredTextBox style={total}>{props.development}</CenteredTextBox>
        Developments
      </Stack>
      <Stack direction="horizontal" gap={1}>
        <CenteredTextBox style={total}>{0}</CenteredTextBox>+ Monuments
      </Stack>
      <Stack direction="horizontal" gap={1}>
        <CenteredTextBox style={total}>{props.bonus}</CenteredTextBox>+ Bonuses
      </Stack>
      <Stack direction="horizontal" gap={1}>
        <CenteredTextBox style={total}>{subtotal}</CenteredTextBox>= Subtotal
      </Stack>
      <Stack direction="horizontal" gap={1}>
        <CenteredTextBox style={total}>0</CenteredTextBox>- Disasters
      </Stack>
      <Stack direction="horizontal" gap={1}>
        <CenteredTextBox style={total}>{subtotal - 0}</CenteredTextBox>= Total
      </Stack>
    </Stack>
  );
};
