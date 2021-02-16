import { TIMER_STATE } from "./constants";
export function getPomodoroIndex(pomodoro) {
  // return just the number of pomodoro or 0 if it is off
  return pomodoro === TIMER_STATE.OFF
    ? 0
    : parseInt(
        pomodoro
          .replace("timer_pomodoro_", "")
          .replace("_inprogress", "")
          .replace("_break", "")
      );
}
export function getNextState(timerState) {
  if (timerState === TIMER_STATE.OFF) {
    // start
    return TIMER_STATE.POMODORO_1_INPROGRESS;
  } else if (timerState === TIMER_STATE.POMODORO_4_BREAK) {
    return TIMER_STATE.POMODORO_1_INPROGRESS; // restart loop
  } else if (timerState.includes("inprogress")) {
    // break of same pomodoro
    return timerState.replace("_inprogress", "_break");
  } else {
    // break - get next state
    const current = getPomodoroIndex(timerState);
    return TIMER_STATE["POMODORO_" + (current + 1) + "_INPROGRESS"];
  }
}
export function getCountDown(time) {
  // convert seconds to mm:ss format
  let minutes = Math.floor(time / 60);
  let seconds = time - minutes * 60;
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  return minutes + ":" + seconds;
}
