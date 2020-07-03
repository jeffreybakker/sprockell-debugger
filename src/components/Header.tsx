import * as React from "react";

import CoreSelector from "./CoreSelector";

import * as classes from "./header.module.scss";
import { Step } from "../simulator/Types";

const Header = (props: Props) => {
  return (
    <div className={classes.root}>
      <div className={classes.title}>
        <h4>Sprockell Debugger</h4>
        <p>&copy; 2020 Jeffrey Bakker</p>
      </div>
      {props.step ? (
        <>
          {/* Step counter */}
          <div
            className={classes.counter}
            onClick={() => {
              if (!props.onSetStep) return;

              let value = window.prompt("Jump to step...", `${props.curStep}`);
              if (value === null || value === "") return;

              let res = parseInt(value, 10);
              if (isNaN(res)) return;

              props.onSetStep(res);
            }}
            title="Click to set step; use [j] and [k] to move forwards and backwards"
          >
            <div>
              {props.curStep}
              <sup>th</sup>
            </div>
            <div>
              STEP OUT OF {props.steps === undefined ? 0 : props.steps - 1}
            </div>
          </div>

          {/* Core selector */}
          <CoreSelector
            selected={props.core}
            step={props.step}
            onClick={props.onSelectCore}
          />
        </>
      ) : null}
    </div>
  );
};

interface Props {
  core?: number;
  curStep?: number;
  step?: Step;
  steps?: number;

  onSelectCore?: (id: number) => void;
  onSetStep?: (step: number) => void;
}

export default Header;
