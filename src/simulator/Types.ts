export interface Simulator {
  instructions: Instruction[][];
  steps: Step[];
}

export interface Step {
  pc: number[];
  sp: number[];
  regs: number[][];
  localMem: number[][];
  sharedMem: number[];
}

// ##
// # INSTRUCTIONS
// ##
export type Instruction =
  | ComputeInstruction
  | JumpInstruction
  | BranchInstruction
  | LoadInstruction
  | StoreInstruction
  | PushInstruction
  | PopInstruction
  | ReadInstruction
  | ReceiveInstruction
  | WriteInstruction
  | TestAndSetInstruction
  | SimpleInstruction
  | FAQInstruction;

interface BaseInstruction {
  name: string;
}

interface ComputeInstruction extends BaseInstruction {
  name: "Compute";
  operator: Operator;
  a: RegAddr;
  b: RegAddr;
  res: RegAddr;
}

interface JumpInstruction extends BaseInstruction {
  name: "Jump";
  target: Target;
}

interface BranchInstruction extends BaseInstruction {
  name: "Branch";
  condition: RegAddr;
  target: Target;
}

interface LoadInstruction extends BaseInstruction {
  name: "Load";
  source: AddrImmDI;
  target: RegAddr;
}

interface StoreInstruction extends BaseInstruction {
  name: "Store";
  source: RegAddr;
  target: AddrImmDI;
}

interface PushInstruction extends BaseInstruction {
  name: "Push";
  source: RegAddr;
}

interface PopInstruction extends BaseInstruction {
  name: "Pop";
  target: RegAddr;
}

interface ReadInstruction extends BaseInstruction {
  name: "ReadInstr";
  source: AddrImmDI;
}

interface ReceiveInstruction extends BaseInstruction {
  name: "Receive";
  target: RegAddr;
}

interface WriteInstruction extends BaseInstruction {
  name: "WriteInstr";
  source: RegAddr;
  target: AddrImmDI;
}

interface TestAndSetInstruction extends BaseInstruction {
  name: "TestAndSet";
  target: AddrImmDI;
}

interface SimpleInstruction extends BaseInstruction {
  name: "EndProg" | "Nop" | "unknown";
}

interface FAQInstruction extends BaseInstruction {
  name: "FAQ";
  text?: string;
  link?: { url: string; title: string };
}

// ##
// # MEMORY ADDRESSES
// ##
export type AddrImmDI = ImmValue | DirAddr | IndAddr;

interface BaseAddr {
  type: string;
}

interface ImmValue extends BaseAddr {
  type: "ImmValue";
  value: number;
}

interface DirAddr extends BaseAddr {
  type: "DirAddr";
  address: number;
}

interface IndAddr extends BaseAddr {
  type: "IndAddr";
  reg: RegAddr;
}

// ##
// # JUMP TARGETS
// ##
export type Target = AbsTarget | RelTarget | IndTarget;

interface BaseTarget {
  type: string;
}

interface AbsTarget extends BaseTarget {
  type: "Abs";
  address: CodeAddr;
}

interface RelTarget extends BaseTarget {
  type: "Rel";
  address: CodeAddr;
}

interface IndTarget extends BaseTarget {
  type: "Ind";
  reg: RegAddr;
}

export type CodeAddr = number;

export type RegAddr = number;

export type Operator =
  | "Add"
  | "Sub"
  | "Mul"

  // Comparison operations
  | "Equal"
  | "NEq"
  | "Gt"
  | "Lt"
  | "GtE"
  | "LtE"

  // Logic operators
  | "And"
  | "Or"
  | "Xor"
  | "LShift"
  | "RShift"

  // Decrement & Increment
  | "Decr"
  | "Incr"

  // Catch custom operators implemented by students
  | string;
