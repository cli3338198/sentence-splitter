import * as React from "react";
import "./App.css";
import { splitter, Sentence } from "./algo";
import { text as mock } from "./mocks";

type State = {
  text: string;
  mapper: Sentence[];
  expanded: boolean;
};

const styles: { background: string; color: string }[] = [
  { background: "#ece323aa", color: "#000" },
  { background: "#ec9715aa", color: "#000" },
  { background: "#3c5143aa", color: "#fff" },
  { background: "#df864aaa", color: "#fff" },
  { background: "#963232aa", color: "#fff" },
  { background: "#eff6fdaa", color: "#000" },
  { background: "#eb5c74aa", color: "#000" },
  { background: "#7ec926aa", color: "#000" },
];
const getTagStyle = (i: number) => styles[i % styles.length];

const samples = [mock, ""];
class App extends React.Component {
  state: State = {
    text: "",
    mapper: [],
    expanded: false,
  };
  componentDidMount() {
    this.setState({ mapper: splitter(this.state.text) });
  }
  updateText = (e: { target: { value: string } }) => {
    this.setState({ text: e.target.value, mapper: splitter(e.target.value) });
  };
  toggleExpand = () => {
    this.setState({ expanded: !this.state.expanded });
  };
  useSample = (index: any) => {
    this.setState({
      text: samples[index] || "",
      mapper: splitter(samples[index] || ""),
    });
    const tocopy = document.getElementById("tocopy") as HTMLTextAreaElement;
    tocopy.value = "";
  };
  copy = () => {
    if (this.state.mapper.length > 0) {
      const tocopy = document.getElementById("tocopy") as HTMLTextAreaElement;
      for (const { sent } of this.state.mapper) {
        tocopy.value =
          tocopy.value + (tocopy.value.length > 1 ? "\n" : "") + sent;
      }
      tocopy.focus();
      tocopy.select();
      document.execCommand("copy");
    }
  };
  render() {
    const expand = this.state.expanded ? "expand" : "";
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Sentence splitter</h1>
        </header>
        <div className="App-content">
          <div>
            <button onClick={() => this.useSample(0)}>Use sample</button>
            <button onClick={() => this.useSample(1)}>Clean</button>
          </div>
          <p className="App-intro">
            <textarea
              placeholder="Type or past your text here..."
              value={this.state.text}
              onChange={this.updateText}
            />
          </p>
          <textarea
            id="tocopy"
            style={{ width: "0px", height: "0px" }}
          ></textarea>
          <div className="stats">Sentences: {this.state.mapper.length}</div>
          <button onClick={this.copy}>Copy Text</button>
          {/* {this.state.mapper.map(
            ({ sent, start, end }: Sentence, i: number) => (
              <span
                className="tag"
                key={i}
                style={getTagStyle(i)}
                title={`start: ${start}, end: ${end}`}
              >
                {sent}
              </span>
            )
          )} */}
        </div>
      </div>
    );
  }
}

export default App;
