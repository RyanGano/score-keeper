import { useState, useRef } from "react";
import Overlay from "react-bootstrap/esm/Overlay";

export interface YahtzeeRowTitleProps {
  title: string;
  tip?: string;
  width: number;
}
export const YahtzeeRowTitle = (props: YahtzeeRowTitleProps) => {
  const [showTip, setShowTip] = useState<boolean>(false);
  const target = useRef(null);

  const tipText = props.tip;

  return (
    <>
      <div
        ref={target}
        style={{
          width: `${props.width}px`,
          borderWidth: ".5px",
          borderStyle: "solid",
          paddingLeft: "2px",
        }}
        onClick={() => setShowTip(!showTip)}
      >
        {props.title}
      </div>
      {props.tip && (
        <Overlay target={target.current} show={showTip} placement="bottom">
          {({
            placement: _placement,
            arrowProps: _arrowProps,
            show: _show,
            popper: _popper,
            hasDoneInitialMeasure: _hasDoneInitialMeasure,
            ...props
          }) => (
            <div
              {...props}
              style={{
                position: "absolute",
                backgroundColor: "rgba(100, 100, 100, 0.85)",
                padding: "2px 10px",
                color: "white",
                borderRadius: 3,
                ...props.style,
              }}
            >
              {tipText}
            </div>
          )}
        </Overlay>
      )}
    </>
  );
};
