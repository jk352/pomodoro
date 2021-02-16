import React from "react";
import { TIMER_STATE } from "../constants";
import { getPomodoroIndex, getNextState, getCountDown } from "../Helpers";
import Notify from "./Notify";
import Settings from "./Settings";
import Button from "./Button";

class Pomodoro extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timerState: TIMER_STATE.OFF,
      pomodoroLength: 1000 * 60 * 25,
      shortBreakLength: 1000 * 60 * 3,
      longBreakLength: 1000 * 60 * 15,
      interval: 1000, // update countdown every second
      countdown: 0,
      notificationTitle: "Pomodoro",
      notificationOptions: {},
      blockingPrompts: true, // extra feature to alert on break
    };
    this.timerRef = React.createRef(); // used to avoid re-renders affecting timer
    this.setTimer = this.setTimer.bind(this);
    this.time = this.time.bind(this);
    this.setBreakLength = this.setBreakLength.bind(this);
    this.resetTimer = this.resetTimer.bind(this);
    this.clearTimer = this.clearTimer.bind(this);
    this.getTimerLength = this.getTimerLength.bind(this);
    this.sendNotification = this.sendNotification.bind(this);
    this.setBlockingPrompts = this.setBlockingPrompts.bind(this);
  }
  time() {
    if (this.state.countdown > 0) {
      this.setState({ countdown: this.state.countdown - this.state.interval });
    } else {
      this.setTimer();
    }
  }
  setTimer() { // sets and increments timer as needed
    this.clearTimer();
    const nextState = getNextState(this.state.timerState);
    const nextStateLength = this.getTimerLength(nextState);
    // start timer right away, and set new state
    this.timerRef.current = setInterval(this.time, this.state.interval);
    this.setState({
      timerState: nextState,
      countdown: nextStateLength,
      hasHadInteraction: true,
    });
    switch (nextState) {
      case TIMER_STATE.POMODORO_1_INPROGRESS:
        if (this.state.timerState === TIMER_STATE.OFF) {
          this.sendNotification("Started - New Pomodoro");
        } else {
          this.sendNotification("Long Break Over - New Pomodoro");
        }
        break;
      case TIMER_STATE.POMODORO_1_BREAK:
      case TIMER_STATE.POMODORO_2_BREAK:
      case TIMER_STATE.POMODORO_3_BREAK:
        this.sendNotification("Short Break", true);
        break;
      case TIMER_STATE.POMODORO_4_BREAK:
        this.sendNotification("Long Break", true);
        break;
      default:
    }
  }
  getTimerLength(pomodoroState) {
    // duration of current pomodoro
    if (pomodoroState.includes("inprogress")) {
      return this.state.pomodoroLength;
    } else if (pomodoroState.includes("break")) {
      if (pomodoroState.includes("4")) {
        return this.state.longBreakLength;
      } else {
        return this.state.shortBreakLength;
      }
    } // no length for off state
  }
  clearTimer() {
    if (this.timerRef && this.timerRef.current) {
      clearInterval(this.timerRef.current);
    }
  }
  resetTimer() {
    this.clearTimer();
    this.setState({ timerState: TIMER_STATE.OFF });
  }
  sendNotification(heading, showAlert) {
    const now = Date.now();
    const title = "Pomodoro:" + heading;
    const body = "Hello from Pomodoro";
    const tag = now;
    const options = {
      tag: tag,
      body: body,
      lang: "en",
      dir: "ltr",
      sound: "sound.mp3", // no browsers supported https://developer.mozilla.org/en/docs/Web/API/notification/sound#Browser_compatibility
    };
    this.setState(
      {
        notificationTitle: title,
        notificationOptions: options,
      },
      () => {
        // if prompting for alert, ring bell first
        this.state.blockingPrompts &&
          showAlert &&
          setTimeout(function () {
            alert("TAKE A BREAK");
          }, 100); // skip cpu cycles to not block sound
      }
    );
  }
  setBreakLength(type, value) {
    this.setState({ [type + "BreakLength"]: value * (60 * 1000) });
  }
  setBlockingPrompts(value) {
    this.setState({ blockingPrompts: value });
  }
  render() {
    const currentIndex = getPomodoroIndex(this.state.timerState);
    return (
      <>
        <h1>It's Pomodoro Time</h1>
        <h2>
          {this.state.timerState === TIMER_STATE.OFF
            ? "TIMER OFF"
            : "TIMER RUNNING - " +
              getCountDown(Math.ceil(this.state.countdown / 1000)) +
              " remaining"}
        </h2>
        {this.state.timerState !== TIMER_STATE.OFF && (
          <ul>
            {[...Array(currentIndex)].map((a, b) => (
              <div key={"p_" + b}>
                {b + 1 === currentIndex ? ( // current pomodoro
                  <>
                    {this.state.timerState ===
                    TIMER_STATE["POMODORO_" + currentIndex + "_INPROGRESS"] ? (
                      <>
                        <li> pomodoro {b + 1} in progress</li>
                      </>
                    ) : (
                      <>
                        <li> pomodoro {b + 1} complete</li>
                        <li> pomodoro {b + 1} break in progress</li>
                      </>
                    )}
                  </>
                ) : (
                  // past pomodoros
                  <>
                    <li> pomodoro {b + 1} complete</li>
                    <li> pomodoro {b + 1} break complete</li>
                  </>
                )}
              </div>
            ))}
          </ul>
        )}
        <Button
          onClick={() =>
            this.state.timerState === TIMER_STATE.OFF
              ? this.setTimer()
              : this.resetTimer()
          }
        >
          {this.state.timerState === TIMER_STATE.OFF ? "START" : "RESET"}
        </Button>
        <Notify
          title={this.state.notificationTitle}
          options={this.state.notificationOptions}
          swRegistration={this.props.swRegistration}
          hasHadInteraction={this.state.hasHadInteraction} // needed to avoid ui interaction error
        />
        <Settings
          shortBreakLength={this.state.shortBreakLength}
          longBreakLength={this.state.longBreakLength}
          setBreakLength={this.setBreakLength}
          blockingPrompts={this.state.blockingPrompts}
          setBlockingPrompts={this.setBlockingPrompts}
        />
      </>
    );
  }
}
export default Pomodoro;
