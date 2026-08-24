import { describe, expect, it } from "vitest";
import {
  bigPointFields,
  emptyEntry,
  emptyRound,
  formatEntry,
  getBigPoints,
  getPointsToStart,
  getRoundScore,
  getTotalScore,
  getWinners,
  isGameFinished,
  parseEntry,
  roundToIncrement,
  type FirstHandLastHandRound,
  type FirstHandLastHandTeamState,
  type TeamEntry,
} from "../games/first-hand-last-hand/first-hand-last-hand-scoring";

function round(
  values: Partial<FirstHandLastHandRound>
): FirstHandLastHandRound {
  return { ...emptyRound, ...values };
}

function entry(values: Partial<TeamEntry>): TeamEntry {
  return { ...emptyEntry, ...values };
}

function team(
  name: string,
  rounds: FirstHandLastHandRound[]
): FirstHandLastHandTeamState {
  return { teamInfo: { Name: name }, rounds };
}

describe("getBigPoints", () => {
  it("adds up the books, specials and big bangs", () => {
    expect(
      getBigPoints(
        round({
          cleanBookPoints: 1000,
          dirtyBookPoints: 300,
          specialsOnTablePoints: 300,
          specialsInHandPoints: -100,
          bigBangsInHandPoints: -300,
        })
      )
    ).toBe(1200);
  });

  it("ignores the small points", () => {
    expect(getBigPoints(round({ cleanBookPoints: 500, smallPoints: 245 }))).toBe(
      500
    );
  });
});

describe("getRoundScore", () => {
  it("adds the small points to the big points", () => {
    expect(getRoundScore(round({ dirtyBookPoints: 300, smallPoints: -60 }))).toBe(
      240
    );
  });
});

describe("getPointsToStart", () => {
  it("climbs as the score does", () => {
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
    expect(parseEntry(entry({}))).toEqual(emptyRound);
  });

  it("reads a small number as a count of pieces", () => {
    expect(parseEntry(entry({ cleanBookPoints: "3" })).cleanBookPoints).toBe(
      1500
    );
    expect(
      parseEntry(entry({ specialsOnTablePoints: "12" })).specialsOnTablePoints
    ).toBe(1200);
  });

  it("reads a large number as the points themselves", () => {
    expect(parseEntry(entry({ cleanBookPoints: "1500" })).cleanBookPoints).toBe(
      1500
    );
    expect(parseEntry(entry({ dirtyBookPoints: "900" })).dirtyBookPoints).toBe(
      900
    );
  });

  it("takes the in-hand pieces away", () => {
    const parsed = parseEntry(
      entry({ specialsInHandPoints: "2", bigBangsInHandPoints: "1" })
    );

    expect(parsed.specialsInHandPoints).toBe(-200);
    expect(parsed.bigBangsInHandPoints).toBe(-300);
    expect(getBigPoints(parsed)).toBe(-500);
  });

  it("rounds the small points to the nearest five", () => {
    expect(parseEntry(entry({ smallPoints: "-43" })).smallPoints).toBe(-45);
  });
});

describe("formatEntry", () => {
  it("puts an existing round back into the boxes", () => {
    expect(
      formatEntry(
        round({
          cleanBookPoints: 1500,
          specialsInHandPoints: -200,
          smallPoints: 245,
        })
      )
    ).toEqual(
      entry({
        cleanBookPoints: "3",
        specialsInHandPoints: "2",
        smallPoints: "245",
      })
    );
  });

  it("falls back to points where no piece count fits", () => {
    expect(formatEntry(round({ dirtyBookPoints: 4000 })).dirtyBookPoints).toBe(
      "4000"
    );
  });

  it("round-trips every big-point field", () => {
    const original = round({
      cleanBookPoints: 1000,
      dirtyBookPoints: 4000,
      specialsOnTablePoints: 700,
      specialsInHandPoints: -100,
      bigBangsInHandPoints: -600,
      smallPoints: 245,
    });

    expect(parseEntry(formatEntry(original))).toEqual(original);
  });

  it("leaves an empty round with empty boxes", () => {
    expect(formatEntry(emptyRound)).toEqual(emptyEntry);
    expect(formatEntry(undefined)).toEqual(emptyEntry);
  });
});

describe("bigPointFields", () => {
  it("covers every big-point field of a round", () => {
    expect(bigPointFields.map((x) => x.field).sort()).toEqual(
      Object.keys(emptyRound)
        .filter((x) => x !== "smallPoints")
        .sort()
    );
  });
});

describe("the end of the game", () => {
  const teamStates = [
    team("Team 1", [
      round({ smallPoints: 9000 }),
      round({ cleanBookPoints: 1000 }),
    ]),
    team("Team 2", [round({ smallPoints: 4000 })]),
  ];

  it("totals every round", () => {
    expect(getTotalScore(teamStates[0])).toBe(10000);
  });

  it("is over once a team reaches ten thousand", () => {
    expect(isGameFinished(teamStates)).toBe(true);
    expect(isGameFinished([team("Team 1", [round({ smallPoints: 9995 })])])).toBe(
      false
    );
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
