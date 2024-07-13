import Stack from "react-bootstrap/esm/Stack";
import { CenteredTextBoxWithBorder } from "../../../common/common-styles";

export interface ScoreProps {
  development: number;
  monument: number;
  bonus: number;
  disaster: number;
}

export const Score = (props: ScoreProps) => {
  const { development, monument, bonus, disaster } = props;
  const subtotal = development + monument + bonus;
  const total = {
    minWidth: 40,
  };
  return (
    <Stack gap={1}>
      <h5>Score</h5>
      <Stack direction="horizontal" gap={1}>
        <CenteredTextBoxWithBorder style={total}>
          {development}
        </CenteredTextBoxWithBorder>
        Developments
      </Stack>
      <Stack direction="horizontal" gap={1}>
        <CenteredTextBoxWithBorder style={total}>
          {monument}
        </CenteredTextBoxWithBorder>
        + Monuments
      </Stack>
      <Stack direction="horizontal" gap={1}>
        <CenteredTextBoxWithBorder style={total}>
          {bonus}
        </CenteredTextBoxWithBorder>
        + Bonuses
      </Stack>
      <Stack direction="horizontal" gap={1}>
        <CenteredTextBoxWithBorder style={total}>
          {subtotal}
        </CenteredTextBoxWithBorder>
        = Subtotal
      </Stack>
      <Stack direction="horizontal" gap={1}>
        <CenteredTextBoxWithBorder style={total}>
          {disaster}
        </CenteredTextBoxWithBorder>
        - Disasters
      </Stack>
      <Stack direction="horizontal" gap={1}>
        <CenteredTextBoxWithBorder style={total}>
          {subtotal - disaster}
        </CenteredTextBoxWithBorder>
        = Total
      </Stack>
    </Stack>
  );
};
