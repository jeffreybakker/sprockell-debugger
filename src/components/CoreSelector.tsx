import * as React from "react";
import clsx from "clsx";

import { Step } from "../simulator/Types";

import * as classes from "./core-selector.module.scss";

const renderCore = (
  id: number,
  pc: number,
  sp: number,
  selected: boolean,
  onClick: (id: number) => void
) => {
  return (
    <div
      key={id}
      className={clsx(classes.core, { [classes.active]: selected })}
      onClick={() => onClick(id)}
    >
      <div>#{id}</div>
      <div>
        <div>PC: {pc}</div>
        <div>SP: {sp}</div>
      </div>
    </div>
  );
};

const CoreSelector = (props: Props) => (
  <>
    {props.step.pc.map((pc, id) =>
      renderCore(
        id,
        pc,
        props.step.sp[id],
        props.selected === undefined ? false : props.selected === id,
        props.onClick === undefined ? () => {} : props.onClick
      )
    )}
  </>
);

interface Props {
  selected?: number;
  step: Step;

  onClick?: (id: number) => void;
}

export default CoreSelector;
