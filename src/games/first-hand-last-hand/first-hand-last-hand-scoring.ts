import type { PlayerGeneralProps } from "../../components/player-general";

/** The game always runs to ten thousand. */
export const winningScore = 10000;

export const defaultBlueColor = "#DDDDFF";
export const defaultGreenColor = "#DDFFDD";
export const defaultGoldColor = "#FFF2CC";

/** Anything the score pad plays down is dimmed rather than shrunk. */
export const mutedColor = "#4D4D4D";
/** Everything that costs a team points. */
export const negativeColor = "#B02A37";

/** What one of each piece is worth when the big points are counted. */
export const cleanBookValue = 500;
export const dirtyBookValue = 300;
export const specialCardValue = 100;
export const bigBangInHandValue = 300;

/** Scores only ever move in multiples of five. */
export const scoreIncrement = 5;

/**
 * A round's two counting phases. Every big-point field holds points rather
 * than a count of pieces, and the two in-hand penalties are already negative.
 */
export interface FirstHandLastHandRound {
  cleanBookPoints: number;
  dirtyBookPoints: number;
  specialsOnTablePoints: number;
  specialsInHandPoints: number;
  bigBangsInHandPoints: number;
  /** Points on the table less points still in hand, already netted. */
  smallPoints: number;
}

export interface FirstHandLastHandTeamState {
  teamInfo: PlayerGeneralProps;
  rounds: FirstHandLastHandRound[];
}

export const FirstHandLastHandGameStatus = {
  GameNotStarted: "GameNotStarted",
  GameActive: "GameActive",
  GameOver: "GameOver",
} as const;
export type FirstHandLastHandGameStatus =
  (typeof FirstHandLastHandGameStatus)[keyof typeof FirstHandLastHandGameStatus];

export const emptyRound: FirstHandLastHandRound = {
  cleanBookPoints: 0,
  dirtyBookPoints: 0,
  specialsOnTablePoints: 0,
  specialsInHandPoints: 0,
  bigBangsInHandPoints: 0,
  smallPoints: 0,
};

/** Rounds to the nearest multiple of five, the only step this game uses. */
export function roundToIncrement(value: number): number {
  return Math.round(value / scoreIncrement) * scoreIncrement;
}

/**
 * Books, special cards and big bangs. Big bangs left on the table are worth
 * nothing, so they are never recorded.
 */
export function getBigPoints(round: FirstHandLastHandRound): number {
  return (
    round.cleanBookPoints +
    round.dirtyBookPoints +
    round.specialsOnTablePoints +
    round.specialsInHandPoints +
    round.bigBangsInHandPoints
  );
}

export function getRoundScore(round: FirstHandLastHandRound): number {
  return getBigPoints(round) + round.smallPoints;
}

export function getTotalScore(teamState: FirstHandLastHandTeamState): number {
  return teamState.rounds.reduce((total, x) => total + getRoundScore(x), 0);
}

/**
 * How many points a team has to lay down to get started, which climbs as their
 * score does.
 */
export function getPointsToStart(currentScore: number): number {
  if (currentScore < 5000) return 90;
  if (currentScore < 7500) return 120;
  return 150;
}

export function isGameFinished(
  teamStates: FirstHandLastHandTeamState[]
): boolean {
  return teamStates.some((x) => getTotalScore(x) >= winningScore);
}

/** The teams with the highest total; more than one when the game is tied. */
export function getWinners(
  teamStates: FirstHandLastHandTeamState[]
): FirstHandLastHandTeamState[] {
  if (teamStates.length === 0) return [];

  const best = Math.max(...teamStates.map((x) => getTotalScore(x)));

  return teamStates.filter((x) => getTotalScore(x) === best);
}

/** A count of pieces or a score; either way, no sign and no decimals. */
export const entryPattern = /^\d*$/;
/** Small points can go either way once cards in hand are subtracted. */
export const scorePattern = /^-?\d*$/;

/**
 * Nobody lays down more than a dozen of anything, so a small number is a count
 * of pieces and a large one is the points those pieces are worth.
 */
export const maxPieceCount = 12;

export type BigPointField = Exclude<keyof FirstHandLastHandRound, "smallPoints">;

export interface BigPointFieldInfo {
  field: BigPointField;
  label: string;
  pieceValue: number;
  /** In-hand pieces cost the team points rather than earning them. */
  isPenalty: boolean;
}

export const bigPointFields: BigPointFieldInfo[] = [
  {
    field: "cleanBookPoints",
    label: "Clean books",
    pieceValue: cleanBookValue,
    isPenalty: false,
  },
  {
    field: "dirtyBookPoints",
    label: "Dirty books",
    pieceValue: dirtyBookValue,
    isPenalty: false,
  },
  {
    field: "specialsOnTablePoints",
    label: "Specials on table",
    pieceValue: specialCardValue,
    isPenalty: false,
  },
  {
    field: "specialsInHandPoints",
    label: "Specials in hand",
    pieceValue: specialCardValue,
    isPenalty: true,
  },
  {
    field: "bigBangsInHandPoints",
    label: "Big bangs in hand",
    pieceValue: bigBangInHandValue,
    isPenalty: true,
  },
];

/** What one team typed; kept as text so a box can be left empty. */
export type TeamEntry = Record<BigPointField | "smallPoints", string>;

export const emptyEntry: TeamEntry = {
  cleanBookPoints: "",
  dirtyBookPoints: "",
  specialsOnTablePoints: "",
  specialsInHandPoints: "",
  bigBangsInHandPoints: "",
  smallPoints: "",
};

/**
 * Reads a box as either a count of pieces or the points they are worth, and
 * returns the points, signed for the field it belongs to.
 */
export function parsePieceEntry(
  value: string,
  fieldInfo: BigPointFieldInfo
): number {
  const parsed = parseInt(value, 10);
  if (isNaN(parsed) || parsed <= 0) return 0;

  const points =
    parsed <= maxPieceCount ? parsed * fieldInfo.pieceValue : parsed;

  return fieldInfo.isPenalty ? -points : points;
}

/** Writes points back into a box, preferring a piece count where one fits. */
export function formatPieceEntry(
  points: number,
  fieldInfo: BigPointFieldInfo
): string {
  const size = Math.abs(points);
  if (size === 0) return "";

  const count = size / fieldInfo.pieceValue;

  return Number.isInteger(count) && count <= maxPieceCount
    ? `${count}`
    : `${size}`;
}

/** Turns what a team typed into a round; small points snap to the nearest 5. */
export function parseEntry(
  entry: TeamEntry | undefined
): FirstHandLastHandRound {
  if (!entry) return emptyRound;

  const smallPoints = parseInt(entry.smallPoints, 10);
  const round = { ...emptyRound };

  bigPointFields.forEach((fieldInfo) => {
    round[fieldInfo.field] = parsePieceEntry(entry[fieldInfo.field], fieldInfo);
  });
  round.smallPoints = isNaN(smallPoints) ? 0 : roundToIncrement(smallPoints);

  return round;
}

/** Fills the boxes in from a round that is being corrected. */
export function formatEntry(
  round: FirstHandLastHandRound | undefined
): TeamEntry {
  if (!round) return { ...emptyEntry };

  const entry = { ...emptyEntry };

  bigPointFields.forEach((fieldInfo) => {
    entry[fieldInfo.field] = formatPieceEntry(round[fieldInfo.field], fieldInfo);
  });
  entry.smallPoints = round.smallPoints === 0 ? "" : `${round.smallPoints}`;

  return entry;
}
