import * as React from "react";

import { Instruction as Instr } from "../simulator/Types";
import Instruction from "./Instruction";

import * as classes from "./instruction.module.scss";

const InstructionSet = (props: Props) => (
  <div className={classes.set}>
    {new Array(props.instructions.length).fill(null).map((_, index) => (
      <Instruction
        key={index}
        id={index}
        instruction={
          props.instructions[index] !== undefined
            ? props.instructions[index]
            : { name: "unknown" }
        }
        highlighted={
          props.highlighted
            ? props.highlighted.filter(id => id === index).length > 0
            : false
        }
        selected={props.selected === index}
      />
    ))}
    <div className={classes.empty}>
      <div className={classes.line} />
    </div>
  </div>
);

interface Props {
  instructions: Instr[];

  selected?: number;
  highlighted?: number[];
}

export default InstructionSet;
