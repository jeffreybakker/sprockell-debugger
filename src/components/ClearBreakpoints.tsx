import * as React from "react";

import * as classes from "./play.module.scss";

const ClearBreakpoints = (props: Props) => {
  return (
    <div
      className={classes.root}
      style={{ backgroundColor: "#d54e53", bottom: 160 }}
      onClick={() => {
        if (props.onClear) props.onClear();
      }}
      title={`Click to clear all breakpoints`}
    >
      <span className="material-icons">clear_all</span>
    </div>
  );
};

interface Props {
  onClear?: () => void;
}

export default ClearBreakpoints;
