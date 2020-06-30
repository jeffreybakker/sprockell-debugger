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
        <CoreSelector
          selected={props.core}
          step={props.step}
          onClick={props.onSelectCore}
        />
      ) : null}
    </div>
  );
};

interface Props {
  core?: number;
  step?: Step;

  onSelectCore?: (id: number) => void;
}

export default Header;
