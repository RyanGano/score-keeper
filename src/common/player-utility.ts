import { PlayerGeneralProps } from "../components/player-general";

export function addPlayer(
  players: PlayerGeneralProps[],
  setPlayers: (players: PlayerGeneralProps[]) => void,
  setCookie: (players: string) => void,
  maxPlayers: number,
  name: string
) {
  if (players.length === maxPlayers) return;

  if (players.findIndex((x) => x.Name === name) !== -1) {
    return `Player ${name} already exists.`;
  }

  const newPlayers = [
    ...players,
    {
      Name: name,
    } as PlayerGeneralProps,
  ];
  setPlayers(newPlayers);
  setCookie(newPlayers.map((x) => x.Name).join("|"));
}

export function editPlayer(
  players: PlayerGeneralProps[],
  setPlayers: (players: PlayerGeneralProps[]) => void,
  setCookie: (players: string) => void,
  originalName: string,
  newName: string
) {
  if (
    originalName !== newName &&
    players.findIndex((x) => x.Name === newName) !== -1
  ) {
    return `Player ${newName} already exists.`;
  }
  const newPlayers = [...players].map((x) =>
    x.Name !== originalName ? x : { Name: newName }
  );
  setPlayers(newPlayers);
  setCookie(newPlayers.map((x) => x.Name).join("|"));
}
