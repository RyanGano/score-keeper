import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FirstHandLastHandScoreTable } from "../games/first-hand-last-hand/components/first-hand-last-hand-score-table";
import {
  emptyRound,
  type FirstHandLastHandTeamState,
} from "../games/first-hand-last-hand/first-hand-last-hand-scoring";

const teamStates: FirstHandLastHandTeamState[] = [
  {
    teamInfo: { Name: "Team 1" },
    rounds: [{ ...emptyRound, cleanBookPoints: 1000, smallPoints: 125 }],
  },
  {
    teamInfo: { Name: "Team 2" },
    rounds: [{ ...emptyRound, dirtyBookPoints: 300, smallPoints: -25 }],
  },
];

function renderTable(onEditRound = vi.fn()) {
  render(
    <FirstHandLastHandScoreTable
      teamStates={teamStates}
      onEditRound={onEditRound}
    />
  );

  return onEditRound;
}

describe("the score table", () => {
  it("shows each round score and running total", () => {
    renderTable();

    expect(
      screen.getByLabelText("Round 1 score for Team 1").textContent
    ).toBe("1125 (1125)");
    expect(
      screen.getByLabelText("Round 1 score for Team 2").textContent
    ).toBe("275 (275)");
  });

  it("keeps the breakdown hidden until a score is pointed at", () => {
    renderTable();

    expect(screen.queryByText("Clean books")).toBeNull();
  });

  it("shows the breakdown on hover and takes it away again", async () => {
    const user = userEvent.setup();
    renderTable();

    await user.hover(screen.getByLabelText("Round 1 score for Team 1"));
    expect(screen.getByText("Team 1 — round 1")).toBeDefined();
    expect(screen.getByText("Clean books")).toBeDefined();
    expect(screen.getByText("Round score")).toBeDefined();

    await user.unhover(screen.getByLabelText("Round 1 score for Team 1"));
    expect(screen.queryByText("Clean books")).toBeNull();
  });

  it("shows the breakdown for a tapped score, which lands as focus", async () => {
    const user = userEvent.setup();
    renderTable();

    await user.click(screen.getByLabelText("Round 1 score for Team 2"));
    expect(screen.getByText("Team 2 — round 1")).toBeDefined();

    await user.tab();
    expect(screen.queryByText("Team 2 — round 1")).toBeNull();
  });

  it("asks for a round to be edited", async () => {
    const user = userEvent.setup();
    const onEditRound = renderTable();

    await user.click(screen.getByTitle("Edit round 1"));

    expect(onEditRound).toHaveBeenCalledWith(0);
  });
});
