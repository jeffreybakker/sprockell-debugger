import * as React from "react";
import clsx from "clsx";

import InstructionSet from "./InstructionSet";
import Memory from "./Memory";

import { Simulator, Instruction, Target, AddrImmDI } from "../simulator/Types";

import * as classes from "./core.module.scss";

const getRegs = (i: Instruction) => {
  let res: number[] = [];

  const fromAddress = (t: AddrImmDI) => {
    if (t.type === "IndAddr") return [t.reg];
    return [];
  };

  const fromTarget = (t: Target) => {
    if (t.type === "Ind") return [t.reg];
    return [];
  };

  if (i.name === "Compute") res = [i.a, i.b, i.res];
  else if (i.name === "Jump") res = fromTarget(i.target);
  else if (i.name === "Branch") res = [i.condition, ...fromTarget(i.target)];
  else if (i.name === "Load") res = [i.target, ...fromAddress(i.source)];
  else if (i.name === "Store") res = [i.source, ...fromAddress(i.target)];
  else if (i.name === "Receive") res = [i.target];
  else if (i.name === "WriteInstr") res = [i.source, ...fromAddress(i.target)];

  return res;
};

const getMem = (i: Instruction, regs: number[]) => {
  let res: number[] = [];

  const fromAddress = (t: AddrImmDI) => {
    if (t.type === "DirAddr") return [t.address];
    else if (t.type === "IndAddr") return [regs[t.reg]];
    return [];
  };

  if (i.name === "Load") res = fromAddress(i.source);
  else if (i.name === "Store") res = fromAddress(i.target);

  return res;
};

const getRefs = (i: Instruction, regs: number[], pc: number) => {
  let res: number[] = [];

  const fromTarget = (t: Target) => {
    if (t.type === "Ind") return [regs[t.reg]];
    else if (t.type === "Abs") return [t.address];
    else if (t.type === "Rel") return [pc + t.address];
    return [];
  };

  if (i.name === "Jump") res = fromTarget(i.target);
  else if (i.name === "Branch") res = fromTarget(i.target);

  return res;
};

const Core = (props: Props) => {
  const pc = props.simulator.steps[props.step].pc[props.core];
  const sp = props.simulator.steps[props.step].sp[props.core];
  const instr = props.simulator.instructions[props.core][pc];
  const regs = props.simulator.steps[props.step].regs[props.core];

  return (
    <div className={classes.root}>
      <InstructionSet
        highlighted={getRefs(instr, regs, pc)}
        selected={pc}
        instructions={props.simulator.instructions[props.core]}
      />
      <Memory
        highlighted={getRegs(instr)}
        memory={[...props.simulator.steps[props.step].regs[props.core], sp, pc]}
        orientation="vertical"
        title="Registers"
      />
      <Memory
        highlighted={getMem(instr, regs)}
        memory={props.simulator.steps[props.step].localMem[props.core]}
        orientation="vertical"
        title="Local memory"
      />
    </div>
  );
};

interface Props {
  core: number;
  simulator: Simulator;
  step: number;
}

export default Core;
