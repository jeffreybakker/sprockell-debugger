import * as React from "react";

import * as classes from "./play.module.scss";

const PlayButton = (props: Props) => {
  return (
    <div
      className={classes.root}
      style={{ backgroundColor: props.isPlaying ? "#de935f" : "#b9ca4a" }}
      onClick={() => {
        if (props.isPlaying) {
          if (props.onPause) props.onPause();
        } else if (props.onPlay) props.onPlay();
      }}
      title={`Click to ${
        props.isPlaying ? "pause" : "play"
      } until the next breakpoint; use [j] and [k] to move through the steps manually`}
    >
      <span className="material-icons">
        {props.isPlaying ? "pause" : "skip_next"}
      </span>
    </div>
  );
};

interface Props {
  isPlaying?: boolean;

  onPlay?: () => void;
  onPause?: () => void;
}

export default PlayButton;
