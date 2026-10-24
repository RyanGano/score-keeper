import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { GeneralPointsRoundEntry } from "../games/general-points/components/general-points-round-entry";
import { FirstHandLastHandRoundEntry } from "../games/first-hand-last-hand/components/first-hand-last-hand-round-entry";
import {
  emptyRound,
  type FirstHandLastHandTeamState,
} from "../games/first-hand-last-hand/first-hand-last-hand-scoring";

describe("signed score entry", () => {
  it("accepts a negative general-points score", async () => {
    const user = userEvent.setup();
    const onAccept = vi.fn();

    render(
      <GeneralPointsRoundEntry
        show
        round={1}
        isNewRound
        playerStates={[{ playerInfo: { Name: "Player 1" }, roundScores: [] }]}
        onAccept={onAccept}
        onCancel={vi.fn()}
      />
    );

    const input = screen.getByPlaceholderText("score");
    await user.type(input, "-15");
    await user.click(screen.getByRole("button", { name: "Add Scores" }));

    expect(onAccept).toHaveBeenCalledWith([-15]);
  });

  it("accepts negative small points without making the piece counts signed", async () => {
    const user = userEvent.setup();
    const onAccept = vi.fn();
    const teamStates: FirstHandLastHandTeamState[] = [
      { teamInfo: { Name: "Team 1" }, rounds: [] },
    ];

    render(
      <FirstHandLastHandRoundEntry
        show
        roundNumber={1}
        isNewRound
        teamStates={teamStates}
        onAccept={onAccept}
        onCancel={vi.fn()}
      />
    );

    const inputs = screen.getAllByPlaceholderText("0");
    expect(inputs.slice(0, 5).map((input) => input.getAttribute("inputmode"))).toEqual(
      Array(5).fill("numeric")
    );

    await user.type(inputs[5], "-18");
    await user.click(screen.getByRole("button", { name: "Add Scores" }));

    expect(onAccept).toHaveBeenCalledWith([
      { ...emptyRound, smallPoints: -20 },
    ]);
  });
});
