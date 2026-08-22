import { describe, expect, it } from "vitest";
import {
  getRankings,
  getTotalScore,
  isGameFinished,
  type GeneralPointsPlayerState,
} from "../games/general-points/general-points";
import { parseRoundScore } from "../games/general-points/components/general-points-round-entry";

function makePlayers(
  scores: Record<string, number[]>
): GeneralPointsPlayerState[] {
  return Object.entries(scores).map(([Name, roundScores]) => ({
    playerInfo: { Name },
    roundScores,
  }));
}

describe("getTotalScore", () => {
  it("adds positive, negative and zero round scores", () => {
    expect(getTotalScore({ playerInfo: { Name: "A" }, roundScores: [] })).toBe(
      0
    );
    expect(
      getTotalScore({ playerInfo: { Name: "A" }, roundScores: [10, -4, 0, 7] })
    ).toBe(13);
  });
});

describe("isGameFinished", () => {
  const players = makePlayers({ A: [40, 30], B: [10, 10] });

  it("finishes when a player reaches the finishing score", () => {
    expect(isGameFinished(players, 70)).toBe(true);
    expect(isGameFinished(players, 71)).toBe(false);
  });

  it("never finishes when there is no finishing score", () => {
    expect(isGameFinished(players, 0)).toBe(false);
  });
});

describe("getRankings", () => {
  const players = makePlayers({ A: [30], B: [-5], C: [12] });

  it("ranks the high score first by default", () => {
    expect(getRankings(players, false).map((x) => x.playerInfo.Name)).toEqual([
      "A",
      "C",
      "B",
    ]);
  });

  it("ranks the low score first when low score wins", () => {
    expect(getRankings(players, true).map((x) => x.playerInfo.Name)).toEqual([
      "B",
      "C",
      "A",
    ]);
  });

  it("gives tied players the same rank and skips the next one", () => {
    const tied = makePlayers({ A: [20], B: [20], C: [5] });
    expect(getRankings(tied, false).map((x) => x.rank)).toEqual([1, 1, 3]);
  });
});

describe("parseRoundScore", () => {
  it("treats an empty box as zero and keeps negatives", () => {
    expect(parseRoundScore("")).toBe(0);
    expect(parseRoundScore("-15")).toBe(-15);
    expect(parseRoundScore("42")).toBe(42);
  });
});
