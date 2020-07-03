import * as React from "react";
import clsx from "clsx";

import { Breakpoint } from "../App";
import * as classes from "./memory.module.scss";

const renderCell = (
  id: number,
  value: number,
  hightlighted: boolean,
  isStackPointer: boolean,
  onClick: (id: number) => void
) => (
  <div
    key={id}
    className={clsx({
      [classes.active]: hightlighted,
      [classes["stack-pointer"]]: isStackPointer
    })}
    onClick={() => onClick(id)}
    title="Click to set breakpoint"
  >
    <div>{id}</div>
    <div>{value}</div>
  </div>
);

const Memory = (props: Props) => {
  const createBreakpoint = (cell: number) => {
    let value = null;

    if (props.type === "shared")
      value = window.prompt(
        `Your breakpoint should activate whenever #${cell} in the shared memory is equal to...`,
        `${props.memory[cell]}`
      );
    else if (props.type === "private")
      value = window.prompt(
        `Your breakpoint should activate whenever #${cell} in the private memory of core ${
          props.core
        } is equal to...`,
        `${props.memory[cell]}`
      );
    else if (props.type === "regs")
      value = window.prompt(
        `Your breakpoint should activate whenever #${cell} in the registers of core ${
          props.core
        } is equal to...`,
        `${props.memory[cell]}`
      );

    if (value === null || value === "") return;

    let res = parseInt(value, 10);
    if (isNaN(res)) return;

    props.onAddBreakpoint((sim, step) => {
      let positive = props.core !== undefined ? props.core : false;
      let core = props.core !== undefined ? props.core : 0;

      switch (props.type) {
        case "shared":
          return sim.steps[step].sharedMem[cell] === res;
        case "private":
          return sim.steps[step].localMem[core][cell] === res
            ? positive
            : false;
        case "regs":
          return sim.steps[step].regs[core][cell] === res ? positive : false;
      }
    });
  };

  return (
    <div
      className={clsx(classes.root, {
        [classes.vertical]: props.orientation === "vertical",
        [classes.horizontal]: props.orientation !== "vertical"
      })}
    >
      <div className={classes.title}>
        {props.title === undefined ? "MEMORY" : props.title.toUpperCase()}
      </div>
      <div
        className={clsx(classes.container, {
          [classes.vertical]: props.orientation === "vertical",
          [classes.horizontal]: props.orientation !== "vertical"
        })}
      >
        {props.memory.map((value, id) =>
          renderCell(
            id,
            value,
            props.highlighted
              ? props.highlighted.filter(key => key === id).length > 0
              : false,
            props.stackPointer === id,
            createBreakpoint
          )
        )}
      </div>
    </div>
  );
};

interface Props {
  core?: number;
  memory: number[];
  highlighted?: number[];
  stackPointer?: number;
  onAddBreakpoint: (p: Breakpoint) => void;
  type: "shared" | "private" | "regs";

  orientation?: "horizontal" | "vertical";
  title?: string;
}

export default Memory;
