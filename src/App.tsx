import * as React from "react";
import "./styles.css";

import ClearBreakpoints from "./components/ClearBreakpoints";
import Core from "./components/Core";
import Header from "./components/Header";
import Memory from "./components/Memory";
import PlayButton from "./components/PlayButton";

import { Instruction, Simulator, Step } from "./simulator/Types";

import * as classes from "./app.module.scss";
import InstructionSet from "./components/InstructionSet";

class App extends React.Component<any, State> {
  limit: number;
  processing: boolean;
  queue: string[];
  ws: WebSocket | null;

  thread: number | null;

  constructor(props: any) {
    super(props);

    this.limit = 1000;
    this.processing = false;
    this.queue = [];
    this.ws = null;

    this.thread = null;

    this.state = {
      state: "init",
      simulator: { instructions: [], steps: [] },
      core: 0,
      playing: false,
      step: 0,
      breakpoints: []
    };

    this.onAddBreakpoint = this.onAddBreakpoint.bind(this);
    this.onSelectCore = this.onSelectCore.bind(this);
    this.onPlay = this.onPlay.bind(this);
    this.onPause = this.onPause.bind(this);
    this.play = this.play.bind(this);
    this.onNextStep = this.onNextStep.bind(this);
  }

  onAddBreakpoint(dbg: Breakpoint) {
    this.setState({ breakpoints: [dbg, ...this.state.breakpoints] });
  }

  onNextStep(step?: number) {
    let next = step === undefined ? this.state.step + 1 : step;
    if (next < 0) next = 0;
    if (next >= this.state.simulator.steps.length)
      next = this.state.simulator.steps.length - 1;
    this.setState({ step: next });

    // Continue processing if the user loads a certain step
    if (next >= this.limit * 0.9) this.resumeProcessing();
  }

  onPlay() {
    this.setState({ playing: true });
    window.setTimeout(this.play, 10);
  }

  onPause() {
    this.setState({ playing: false });
  }

  onSelectCore(id: number) {
    this.setState({ core: id });
  }

  render() {
    const { simulator, state, step, core } = this.state;

    return (
      <div
        className={classes.root}
        onKeyDown={e => {
          switch (e.keyCode) {
            case 74: // J
              this.onNextStep();
              return;
            case 75: // K
              this.onNextStep(this.state.step - 1);
              return;
          }
        }}
        tabIndex={0}
      >
        <Header
          core={core}
          curStep={state === "init" ? undefined : step}
          step={state === "init" ? undefined : simulator.steps[step]}
          steps={state === "init" ? undefined : simulator.steps.length}
          onSelectCore={this.onSelectCore}
          onSetStep={this.onNextStep}
        />

        {state === "init" ? (
          <InstructionSet
            instructions={this.generateFAQ([
              { text: "##" },
              { text: "# SPROCKELL DEBUGGER" },
              { text: "##" },
              {
                text: "A debugger for Sprockell: ",
                link: {
                  url: "https://github.com/leonschoorl/sprockell",
                  title: "github.com/leonschoorl/sprockell"
                }
              },
              {},
              { text: "How to set up and use:" },
              {
                text: "1. Clone and install",
                link: {
                  url: "https://github.com/jeffreybakker/sprockell",
                  title: "github.com/jeffreybakker/sprockell"
                }
              },
              {
                text: "2. Clone and install",
                link: {
                  url: "https://github.com/novnc/websockify-js",
                  title: "github.com/novnc/websockify-js"
                }
              },
              { text: " " },
              {
                text:
                  "3. Set up a compiled Sprockell file with the following debugger"
              },
              {
                text:
                  "--> `main = runWithDebuggerOverNetwork (debuggerSimplePrintAndWait toJson) [program, program]`"
              },
              { text: " " },
              {
                text:
                  "4. Proxy the connection to the debugger to port 1234 using websockify-js:"
              },
              {
                text: "--> `websockify.js 1234 127.0.0.1:1235`"
              },
              { text: " " },
              { text: "5. Refresh this page and have fun!" },
              { text: " " },
              { text: " " },
              {
                text:
                  "(Please note that you have to restart websockify and your code every time you refresh the browser)"
              }
            ])}
          />
        ) : (
          <>
            <Core
              core={core}
              simulator={simulator}
              step={step}
              onAddBreakpoint={this.onAddBreakpoint}
            />
            <Memory
              highlighted={this.getSharedMemHighlights()}
              memory={simulator.steps[step].sharedMem}
              onAddBreakpoint={this.onAddBreakpoint}
              type="shared"
            />
            <PlayButton
              isPlaying={this.state.playing}
              onPlay={this.onPlay}
              onPause={this.onPause}
            />
            {this.state.breakpoints.length > 0 ? (
              <ClearBreakpoints
                onClear={() => this.setState({ breakpoints: [] })}
              />
            ) : (
              false
            )}
          </>
        )}
      </div>
    );
  }

  componentDidMount() {
    const ws = new WebSocket("ws://127.0.0.1:1234");
    ws.onmessage = ev =>
      (ev.data as Blob).text().then(text => {
        this.queue.push(text);
        if (text.endsWith("\n")) this.processQueue(ws);
        console.log(ev);
      });

    this.processing = true;
    this.ws = ws;
  }

  play() {
    if (!this.state.playing) return;

    const start = this.state.step;
    // Take a break if we are still buffering
    if (start + 10 >= this.state.simulator.steps.length) {
      window.setTimeout(this.play, 1000);
      return;
    }

    let step = start + 1;
    const test = (dbg: Breakpoint) => {
      const res = dbg(this.state.simulator, step);

      if (res === false) return false;
      else if (res === true) return true;

      // Otherwise jump to core
      this.onSelectCore(res);

      return true;
    };

    // Run breakpoints
    for (; step < start + 10; step++) {
      if (this.state.breakpoints.some(test)) {
        console.warn("breakpoint" + step);
        this.onPause();
        break;
      }
    }

    this.onNextStep(step);

    window.setTimeout(this.play, 10);
  }

  getSharedMemHighlights() {
    const pc = this.state.simulator.steps[this.state.step].pc[this.state.core];
    const instr = this.state.simulator.instructions[this.state.core][pc];
    const addresses = [];

    if (instr.name === "ReadInstr") addresses.push(instr.source);
    else if (instr.name === "WriteInstr") addresses.push(instr.target);
    else if (instr.name === "TestAndSet") addresses.push(instr.target);

    const res = [];
    for (let i = 0; i < addresses.length; i++) {
      const addr = addresses[i];
      if (addr.type === "DirAddr") res.push(addr.address);
      else if (addr.type === "IndAddr") {
        res.push(
          this.state.simulator.steps[this.state.step].regs[this.state.core][
            addr.reg
          ]
        );
      }
    }

    return res;
  }

  generateFAQ(instr: Partial<Instruction>[]) {
    return instr.map(ii => Object.assign({ name: "FAQ" }, ii)) as Instruction[];
  }

  resumeProcessing() {
    this.limit += 500;

    if (!this.processing && this.ws !== null) this.ws.send("\r\n");

    this.processing = true;
  }

  processQueue(ws: WebSocket) {
    let text = this.queue.join("");
    this.queue = [];
    let init = false;

    // The queue might contain multiple steps
    let split = text.split("\n");
    if (split.length > 1 && split[1] !== "") {
      this.queue = split.filter((_, index) => index > 0);
      text = split[0];
    }

    // Filter the text from ulusual things
    text = text.split(" fromList ").join(" ");

    let parsed: any = {};
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      console.warn("Could not parse the following JSON:");
      console.warn(text);
      console.error(e);
      return;
    }

    const step = this.process(parsed);
    const sim = Object.assign({}, this.state.simulator);

    if (sim.instructions[0] === undefined) {
      for (let i = 0; i < step.pc.length; i++) {
        sim.instructions[i] = [];
      }

      sim.steps.push({
        pc: step.pc.map(() => 0),
        sp: step.sp.map(() => step.localMem[0].length),
        regs: step.regs.map((regs, spr) => {
          let res = [...regs];
          res[0] = 0;
          res[1] = spr;
          res[regs.length - 1] = 0;
          return res;
        }),
        localMem: step.localMem.map(mem => mem.map(() => 0)),
        sharedMem: step.sharedMem.map(() => 0)
      });

      init = true;
    }

    let oldPc = sim.steps[sim.steps.length - 1].pc;

    sim.steps.push(step);

    for (let i = 0; i < step.pc.length; i++) {
      sim.instructions[i][oldPc[i]] = step.instructions[i];
    }

    for (let i = 0; i < step.pc.length; i++) {
      if (sim.instructions[i][step.pc[i]] === undefined)
        sim.instructions[i][step.pc[i]] = { name: "EndProg" };
    }

    this.setState({ simulator: sim, state: init ? "debug" : this.state.state });
    if (sim.steps.length < this.limit) ws.send("\n");
    else this.processing = false;

    if (this.queue.length > 0) this.processQueue(ws);
  }

  process(parsed: any) {
    let step: Partial<Step & { instructions: Instruction[] }> = {};

    // Copy the PC and SP
    step.pc = parsed.state.sprockels.map((spr: any) => spr.pc);
    step.sp = parsed.state.sprockels.map((spr: any) => spr.sp);

    // Copy the registers
    step.regs = parsed.state.sprockels.map((spr: any, index: number) => [
      ...spr.regs,
      (step.sp as number[])[index],
      (step.pc as number[])[index]
    ]);

    // Copy the memory
    step.localMem = parsed.state.sprockels.map((spr: any) => spr.localMem);
    step.sharedMem = parsed.state.sharedMem;

    // Copy the instructions
    step.instructions = parsed.instructions;

    return step as Step & { instructions: Instruction[] };
  }
}

export type Breakpoint = (
  simulator: Simulator,
  step: number
) => boolean | number;

interface State {
  state: "init" | "debug";
  simulator: Simulator;
  core: number;
  playing: boolean;
  step: number;

  breakpoints: Breakpoint[];
}

export default App;
