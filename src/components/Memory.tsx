import * as React from "react";
import clsx from "clsx";

import * as classes from "./memory.module.scss";

const renderCell = (id: number, value: number, hightlighted: boolean) => (
  <div key={id} className={clsx({ [classes.active]: hightlighted })}>
    <div>{id}</div>
    <div>{value}</div>
  </div>
);

const Memory = (props: Props) => {
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
              : false
          )
        )}
      </div>
    </div>
  );
};

interface Props {
  memory: number[];
  highlighted?: number[];

  orientation?: "horizontal" | "vertical";
  title?: string;
}

export default Memory;
