import Slider from "rc-slider";
import "rc-slider/assets/index.css";

function Settings(props) {
  return (
    <>
      <hr />
      Settings:
      <div style={{ padding: "2em" }}>
        short break length: {props.shortBreakLength / (60 * 1000)} min
        <Slider
          defaultValue={props.shortBreakLength / (60 * 1000)}
          dots={true}
          min={3}
          max={5}
          onChange={(v) => props.setBreakLength("short", v)}
        />
        long break length: {props.longBreakLength / (60 * 1000)} min
        <Slider
          defaultValue={props.longBreakLength / (60 * 1000)}
          dots={true}
          min={15}
          max={30}
          onChange={(v) => props.setBreakLength("long", v)}
        />
        Prompt for break (pauses):&nbsp;
        <input
          type="checkbox"
          checked={props.blockingPrompts}
          onChange={(event) => props.setBlockingPrompts(event.target.checked)}
        />
      </div>
    </>
  );
}

export default Settings;
