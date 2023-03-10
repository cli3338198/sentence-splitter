/**
 * Implement a function that takes a text as input and returns an array of
 * sentence ranges.
 *
 * Your solution will be validated against an extended data set :)
 */

export interface Sentence {
  sent: string;
  start: number;
  end: number;
}
type Record<K extends string, T> = { [P in K]: T };
type MachineState =
  | "IDLE"
  | "END_SENT"
  | "W"
  | "QUOTE"
  | "!?"
  | "D"
  | "Dr"
  | "Dr."
  | "Dr. "
  | "M"
  | "Mr"
  | "Mr."
  | "Mr. "
  | "Mrs"
  | "Mrs."
  | "Mrs. "
  | "Ms"
  | "Ms."
  | "Ms. "
  | "S"
  | "Sr"
  | "Sr."
  | "Sr. "
  | "."
  | ".."
  | "...";
type Action = "add" | "start" | "end";
type Event =
  | "SPACE"
  | "NEW_LINE"
  | "DOT"
  | "TERM"
  | "D"
  | "M"
  | "S"
  | "r"
  | "s"
  | "QUOTE"
  | "UPPER_LETTER"
  | "REST";
type Transition = [Event, MachineState, Action[]];
type MachineConfig = Record<MachineState, Transition[]>;
type TransitionResult = { state: MachineState; actions: Action[] };
type SplitterState = {
  result: Sentence[];
  state: MachineState;
  actions: Action[];
};

const events: Record<Event, RegExp> = {
  SPACE: /\s/,
  NEW_LINE: /\n/,
  DOT: /\./,
  TERM: /[!?]/,
  D: /D/,
  M: /M/,
  S: /S/,
  s: /s/,
  r: /r/,
  UPPER_LETTER: /[A-Z]/,
  QUOTE: /"/,
  REST: /./,
};
const machine: MachineConfig = {
  IDLE: [
    ["SPACE", "IDLE", []],
    ["NEW_LINE", "IDLE", []],
    ["DOT", ".", ["start", "add"]],
    ["TERM", "!?", ["start", "add"]],
    ["D", "D", ["start", "add"]],
    ["M", "M", ["start", "add"]],
    ["S", "S", ["start", "add"]],
    ["QUOTE", "QUOTE", ["start", "add"]],
    ["REST", "W", ["start", "add"]],
  ],
  W: [
    ["NEW_LINE", "IDLE", ["end"]],
    ["DOT", ".", ["add"]],
    ["TERM", "!?", ["add"]],
    ["D", "D", ["add"]],
    ["M", "M", ["add"]],
    ["S", "S", ["add"]],
    ["QUOTE", "QUOTE", ["add"]],
    ["REST", "W", ["add"]],
  ],
  QUOTE: [
    ["NEW_LINE", "IDLE", ["end"]],
    ["QUOTE", "W", ["add"]],
    ["REST", "QUOTE", ["add"]],
  ],
  "!?": [
    ["NEW_LINE", "IDLE", ["end"]],
    ["SPACE", "END_SENT", ["end"]],
    ["REST", "!?", ["add"]],
  ],
  D: [
    ["NEW_LINE", "IDLE", ["end"]],
    ["r", "Dr", ["add"]],
    ["REST", "W", ["add"]],
  ],
  Dr: [
    ["NEW_LINE", "IDLE", ["end"]],
    ["DOT", "Dr.", ["add"]],
    ["REST", "W", ["add"]],
  ],
  "Dr.": [
    ["NEW_LINE", "IDLE", ["end"]],
    ["SPACE", "Dr. ", ["add"]],
    ["REST", "W", ["add"]],
  ],
  "Dr. ": [
    ["NEW_LINE", "IDLE", ["end"]],
    ["UPPER_LETTER", "W", ["add"]],
    ["REST", "W", ["end", "start", "add"]],
  ],
  S: [
    ["NEW_LINE", "IDLE", ["end"]],
    ["r", "Sr", ["add"]],
    ["REST", "W", ["add"]],
  ],
  M: [
    ["NEW_LINE", "IDLE", ["end"]],
    ["r", "Mr", ["add"]],
    ["s", "Ms", ["add"]],
    ["REST", "W", ["add"]],
  ],
  Mr: [
    ["NEW_LINE", "IDLE", ["end"]],
    ["DOT", "Mr.", ["add"]],
    ["s", "Mrs", ["add"]],
    ["REST", "W", ["add"]],
  ],
  Sr: [
    ["NEW_LINE", "IDLE", ["end"]],
    ["DOT", "Sr.", ["add"]],
    ["REST", "W", ["add"]],
  ],
  Ms: [
    ["NEW_LINE", "IDLE", ["end"]],
    ["DOT", "Ms.", ["add"]],
    ["REST", "W", ["add"]],
  ],
  Mrs: [
    ["NEW_LINE", "IDLE", ["end"]],
    ["DOT", "Mrs.", ["add"]],
    ["REST", "W", ["add"]],
  ],
  "Mr.": [
    ["NEW_LINE", "IDLE", ["end"]],
    ["SPACE", "Mr. ", ["add"]],
    ["REST", "W", ["add"]],
  ],
  "Sr.": [
    ["NEW_LINE", "IDLE", ["end"]],
    ["SPACE", "Sr. ", ["add"]],
    ["REST", "W", ["add"]],
  ],
  "Ms.": [
    ["NEW_LINE", "IDLE", ["end"]],
    ["SPACE", "Ms. ", ["add"]],
    ["REST", "W", ["add"]],
  ],
  "Mrs.": [
    ["NEW_LINE", "IDLE", ["end"]],
    ["SPACE", "Mrs. ", ["add"]],
    ["REST", "W", ["add"]],
  ],
  "Mr. ": [
    ["NEW_LINE", "IDLE", ["end"]],
    ["UPPER_LETTER", "W", ["add"]],
    ["REST", "W", ["end", "start", "add"]],
  ],
  "Sr. ": [
    ["NEW_LINE", "IDLE", ["end"]],
    ["UPPER_LETTER", "W", ["add"]],
    ["REST", "W", ["end", "start", "add"]],
  ],
  "Mrs. ": [
    ["NEW_LINE", "IDLE", ["end"]],
    ["UPPER_LETTER", "W", ["add"]],
    ["REST", "W", []],
  ],
  "Ms. ": [
    ["NEW_LINE", "IDLE", ["end"]],
    ["UPPER_LETTER", "W", ["add"]],
    ["REST", "W", ["end", "start", "add"]],
  ],
  ".": [
    ["NEW_LINE", "IDLE", ["end"]],
    ["DOT", "..", ["add"]],
    ["SPACE", "END_SENT", ["end"]],
    ["REST", "W", ["add"]],
  ],
  "..": [
    ["NEW_LINE", "IDLE", ["end"]],
    ["DOT", "...", ["add"]],
  ],
  "...": [
    ["NEW_LINE", "IDLE", ["end"]],
    ["SPACE", "END_SENT", ["end"]],
    ["REST", "W", ["add"]],
  ],
  END_SENT: [
    ["SPACE", "IDLE", []],
    ["DOT", ".", ["start", "add"]],
    ["TERM", "!?", ["start", "add"]],
    ["D", "D", ["start", "add"]],
    ["M", "M", ["start", "add"]],
    ["S", "S", ["start", "add"]],
    ["QUOTE", "QUOTE", ["start", "add"]],
    ["REST", "W", ["start", "add"]],
  ],
};
const nextState = (prevState: MachineState, l: string): TransitionResult => {
  const transitions = machine[prevState];
  if (!transitions) {
    console.warn(
      `Missing transitions for state "${prevState}" in the machine's config!`
    );
    return { state: prevState, actions: [] };
  }
  const nextTransition = transitions.find(([eventName]) => {
    const regExp = events[eventName];
    if (regExp) {
      return regExp.test(l);
    }
    return false;
  });
  if (nextTransition) {
    const [, next, actions = []] = nextTransition;
    return { state: next, actions };
  }
  return { state: prevState, actions: [] };
};
const allActions = {
  start: (s: Sentence[], l: string, i: number): Sentence[] => {
    return [{ sent: "", start: i, end: 0 }, ...s];
  },
  end: (s: Sentence[], l: string, i: number): Sentence[] => {
    const [head, ...rest] = s;
    return [{ ...head, end: i }, ...rest];
  },
  add: (s: Sentence[], l: string, i: number): Sentence[] => {
    const [head, ...rest] = s;
    return [{ ...head, sent: head.sent + l }, ...rest];
  },
};
const stateMachineReducer = (
  acc: SplitterState,
  letter: string,
  index: number,
  all: string[]
): SplitterState => {
  const { result, state } = acc;
  const { state: nState, actions } = nextState(state, letter);
  let newResult = result;
  newResult = actions.reduce((r: Sentence[], a: Action) => {
    const fn = allActions[a];
    if (fn) {
      return fn(r, letter, index);
    }
    return r;
  }, newResult);
  const ret = { result: newResult, state: nState, actions };
  return ret;
};
export function splitter(text: string): Sentence[] {
  return text
    .split("")
    .reduce(stateMachineReducer, {
      result: [],
      state: "IDLE",
      actions: [],
    })
    .result.reverse();
}
