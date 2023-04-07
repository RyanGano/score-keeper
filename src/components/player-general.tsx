import * as React from "react";

export interface PlayerGeneralProps {
  Name: string;
}

export const PlayerGeneral = (props: PlayerGeneralProps) => {
  return <div style={{ width: "100px" }}>{props.Name}</div>;
};
