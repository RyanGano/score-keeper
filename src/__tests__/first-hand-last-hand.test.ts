import { describe, expect, it } from "vitest";
import {
  emptyRound,
  getBigPoints,
  getPointsToStart,
  getRoundScore,
  getTotalScore,
  getWinners,
  isGameFinished,
  roundToIncrement,
  type FirstHandLastHandRound,
  type FirstHandLastHandTeamState,
} from "../games/first-hand-last-hand/first-hand-last-hand";
import { parseEntry } from "../games/first-hand-last-hand/components/first-hand-last-hand-round-entry";

function round(
  values: Partial<FirstHandLastHandRound>
): FirstHandLastHandRound {
  return { ...emptyRound, ...values };
}

function team(
  name: string,
  rounds: FirstHandLastHandRound[]
): FirstHandLastHandTeamState {
  return { teamInfo: { Name: name }, rounds };
}

describe("getBigPoints", () => {
  it("counts books, specials and big bangs", () => {
    expect(
      getBigPoints(
        round({
          cleanBooks: 2,
          dirtyBooks: 1,
          specialsOnTable: 3,
          specialsInHand: 1,
          bigBangsInHand: 1,
        })
      )
    ).toBe(1000 + 300 + 300 - 100 - 300);
  });

  it("ignores the small points", () => {
    expect(getBigPoints(round({ cleanBooks: 1, smallPoints: 245 }))).toBe(500);
  });
});

describe("getRoundScore", () => {
  it("adds the small points to the big points", () => {
    expect(getRoundScore(round({ dirtyBooks: 1, smallPoints: -60 }))).toBe(240);
  });
});

describe("getPointsToStart", () => {
  it("grows as the score does", () => {
    expect(getPointsToStart(0)).toBe(90);
    expect(getPointsToStart(4995)).toBe(90);
    expect(getPointsToStart(5000)).toBe(120);
    expect(getPointsToStart(7495)).toBe(120);
    expect(getPointsToStart(7500)).toBe(150);
    expect(getPointsToStart(9999)).toBe(150);
  });
});

describe("roundToIncrement", () => {
  it("snaps to the nearest five", () => {
    expect(roundToIncrement(242)).toBe(240);
    expect(roundToIncrement(243)).toBe(245);
    expect(roundToIncrement(-62)).toBe(-60);
  });
});

describe("parseEntry", () => {
  it("treats empty and bad boxes as zero", () => {
    expect(
      parseEntry({
        cleanBooks: "",
        dirtyBooks: "",
        specialsOnTable: "",
        specialsInHand: "",
        bigBangsInHand: "",
        smallPoints: "",
      })
    ).toEqual(emptyRound);
  });

  it("rounds the small points to the nearest five", () => {
    expect(
      parseEntry({
        cleanBooks: "1",
        dirtyBooks: "0",
        specialsOnTable: "0",
        specialsInHand: "0",
        bigBangsInHand: "0",
        smallPoints: "-43",
      })
    ).toEqual(round({ cleanBooks: 1, smallPoints: -45 }));
  });
});

describe("the end of the game", () => {
  const teamStates = [
    team("Team 1", [round({ smallPoints: 9000 }), round({ cleanBooks: 2 })]),
    team("Team 2", [round({ smallPoints: 4000 })]),
  ];

  it("totals every round", () => {
    expect(getTotalScore(teamStates[0])).toBe(10000);
  });

  it("is over once a team reaches the winning score", () => {
    expect(isGameFinished(teamStates, 10000)).toBe(true);
    expect(isGameFinished(teamStates, 12000)).toBe(false);
  });

  it("never ends on its own without a winning score", () => {
    expect(isGameFinished(teamStates, 0)).toBe(false);
  });

  it("gives the win to the highest total", () => {
    expect(getWinners(teamStates).map((x) => x.teamInfo.Name)).toEqual([
      "Team 1",
    ]);
  });

  it("reports every team of a tie", () => {
    const tied = [
      team("Team 1", [round({ smallPoints: 10000 })]),
      team("Team 2", [round({ smallPoints: 10000 })]),
    ];

    expect(getWinners(tied).map((x) => x.teamInfo.Name)).toEqual([
      "Team 1",
      "Team 2",
    ]);
  });
});
