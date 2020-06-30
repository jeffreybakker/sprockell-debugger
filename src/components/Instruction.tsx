import * as React from "react";
import clsx from "clsx";

import {
  Instruction as Instr,
  Operator,
  RegAddr,
  Target,
  AddrImmDI
} from "../simulator/Types";

import * as classes from "./instruction.module.scss";

const renderInstruction = (instruction: Instr) => {
  const name = (name: string) => <div className={classes.name}>{name}</div>;
  const op = (op: Operator) => <div className={classes.op}>{op}</div>;
  const reg = (reg: RegAddr) => (
    <div className={classes.reg}>
      {reg === 0 ? "reg0" : reg === 1 ? "regSprId" : reg}
    </div>
  );
  const address = (address: AddrImmDI) => {
    switch (address.type) {
      case "ImmValue":
        return (
          <div className={classes.address}>
            <div>(</div>
            <div>{address.type}</div>
            <div>{address.value}</div>
            <div>)</div>
          </div>
        );
      case "DirAddr":
        return (
          <div className={classes.address}>
            <div>(</div>
            <div>{address.type}</div>
            <div>{address.address}</div>
            <div>)</div>
          </div>
        );
      case "IndAddr":
        return (
          <div className={classes.address}>
            <div>(</div>
            <div>{address.type}</div>
            {reg(address.reg)}
            <div>)</div>
          </div>
        );
    }
  };
  const target = (target: Target) => {
    switch (target.type) {
      case "Abs":
      case "Rel":
        return (
          <div className={classes.target}>
            <div>(</div>
            <div>{target.type}</div>
            <div>{target.address}</div>
            <div>)</div>
          </div>
        );
      case "Ind":
        return (
          <div className={classes.target}>
            <div>(</div>
            <div>Ind</div>
            {reg(target.reg)}
            <div>)</div>
          </div>
        );
    }
  };

  switch (instruction.name) {
    case "Compute":
      return (
        <div>
          {name(instruction.name)}
          {op(instruction.operator)}
          {reg(instruction.a)}
          {reg(instruction.b)}
          {reg(instruction.res)}
        </div>
      );
    case "Jump":
      return (
        <div>
          {name(instruction.name)}
          {target(instruction.target)}
        </div>
      );
    case "Branch":
      return (
        <div>
          {name(instruction.name)}
          {reg(instruction.condition)}
          {target(instruction.target)}
        </div>
      );
    case "Load":
      return (
        <div>
          {name(instruction.name)}
          {address(instruction.source)}
          {reg(instruction.target)}
        </div>
      );
    case "Store":
      return (
        <div>
          {name(instruction.name)}
          {reg(instruction.source)}
          {address(instruction.target)}
        </div>
      );
    case "Push":
      return (
        <div>
          {name(instruction.name)}
          {reg(instruction.source)}
        </div>
      );
    case "Pop":
      return (
        <div>
          {name(instruction.name)}
          {reg(instruction.target)}
        </div>
      );
    case "ReadInstr":
      return (
        <div>
          {name(instruction.name)}
          {address(instruction.source)}
        </div>
      );
    case "Receive":
      return (
        <div>
          {name(instruction.name)}
          {reg(instruction.target)}
        </div>
      );
    case "WriteInstr":
      return (
        <div>
          {name(instruction.name)}
          {reg(instruction.source)}
          {address(instruction.target)}
        </div>
      );
    case "TestAndSet":
      return (
        <div>
          {name(instruction.name)}
          {address(instruction.target)}
        </div>
      );
    case "FAQ":
      return (
        <div>
          {instruction.text ? <div>-- {instruction.text}</div> : null}
          {instruction.link ? (
            <div>
              <a href={instruction.link.url}>{instruction.link.title}</a>
            </div>
          ) : null}
        </div>
      );
    default:
      return <div>{name(instruction.name)}</div>;
  }
};

const Instruction = (props: Props) => {
  return (
    <div
      className={clsx(classes.instruction, {
        [classes.active]: props.selected,
        [classes.referenced]: props.highlighted
      })}
    >
      <div className={classes.line}>{props.id}</div>
      {renderInstruction(props.instruction)}
    </div>
  );
};

interface Props {
  id: number;
  instruction: Instr;

  highlighted?: boolean;
  selected?: boolean;
}

export default Instruction;
