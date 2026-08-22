import type React from "react";
import { useEffect, useRef, useState } from "react";
import Form from "react-bootstrap/esm/Form";
import Stack from "react-bootstrap/esm/Stack";
import { CheckboxButton } from "../../../common/checkbox-buttons";
import { SimpleModal } from "../../../common/simple-modal";
import {
  defaultBlueColor,
  getTotalScore,
  type GeneralPointsPlayerState,
} from "../general-points";

/** A whole number, optionally negative; an empty box counts as zero. */
const scorePattern = /^-?\d*$/;

export function parseRoundScore(value: string): number {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? 0 : parsed;
}

export interface GeneralPointsRoundEntryProps {
  show: boolean;
  round: number;
  playerStates: GeneralPointsPlayerState[];
  onAccept: (roundScores: number[]) => void;
  onCancel: () => void;
}

export const GeneralPointsRoundEntry = (
  props: GeneralPointsRoundEntryProps
) => {
  const { show, round, playerStates, onAccept, onCancel } = props;
  const [values, setValues] = useState<string[]>([]);
  const [fastEnter, setFastEnter] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!show) return;

    setValues(playerStates.map(() => ""));
    setActiveIndex(0);
  }, [show, playerStates]);

  useEffect(() => {
    if (!show) return;

    const focusActive = setTimeout(() => {
      const input = inputs.current[activeIndex];
      input?.focus();
      input?.select();
    }, 0);

    return () => clearTimeout(focusActive);
  }, [show, activeIndex]);

  function updateValue(index: number, newValue: string) {
    if (!scorePattern.test(newValue)) return;

    setValues(values.map((x, i) => (i === index ? newValue : x)));
  }

  function acceptRound() {
    onAccept(playerStates.map((_, index) => parseRoundScore(values[index] ?? "")));
  }

  function onEnter(index: number) {
    if (fastEnter && index < playerStates.length - 1) {
      setActiveIndex(index + 1);
      return;
    }

    acceptRound();
  }

  function handleKeypress(
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) {
    if (e.key === "Enter") {
      e.preventDefault();
      onEnter(index);
    }
  }

  const content = (
    <Stack gap={3}>
      <CheckboxButton
        selected={fastEnter}
        text="Fast Enter (press enter to move to the next player)"
        onChange={setFastEnter}
      />
      <Stack gap={2}>
        {playerStates.map((x, index) => (
          <Stack
            key={x.playerInfo.Name}
            direction="horizontal"
            gap={2}
            style={{
              padding: 6,
              borderRadius: 8,
              backgroundColor:
                fastEnter && index === activeIndex
                  ? defaultBlueColor
                  : "transparent",
            }}
          >
            <Stack gap={0} style={{ flexGrow: 1 }}>
              <span style={{ fontWeight: 600 }}>{x.playerInfo.Name}</span>
              <span style={{ fontSize: "8pt" }}>
                {`Total: ${getTotalScore(x)}`}
              </span>
            </Stack>
            <Form.Control
              ref={(input: HTMLInputElement | null) => {
                inputs.current[index] = input;
              }}
              type="text"
              inputMode="numeric"
              style={{ width: "100px" }}
              placeholder="score"
              value={values[index] ?? ""}
              onChange={(e) => updateValue(index, e.target.value)}
              onKeyDown={(e) => handleKeypress(e, index)}
              onFocus={() => setActiveIndex(index)}
            />
          </Stack>
        ))}
      </Stack>
      <div style={{ fontSize: "8pt" }}>
        Scores may be positive, negative or zero. An empty box counts as 0.
      </div>
    </Stack>
  );

  return (
    <SimpleModal
      title={`Round ${round} Scores`}
      content={content}
      defaultButtonContent="Add Scores"
      alternateButtonContent="Cancel"
      onAccept={acceptRound}
      onCancel={onCancel}
      show={show}
    />
  );
};
