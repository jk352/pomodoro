import Pomodoro from "./Components/Pomodoro";
import "./App.css";

function App(props) {
  return (
    <div className="App">
      <header className="App-header">
        <Pomodoro swRegistration={props.swRegistration} />
      </header>
      <main></main>
    </div>
  );
}

export default App;
