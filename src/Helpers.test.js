import { TIMER_STATE } from "./constants";
import { getPomodoroIndex, getNextState, getCountDown } from "./Helpers";

test("countdown renders properly with only seconds", () => {
  const count = getCountDown(3);
  expect(count).toEqual("0:03");
});

test("countdown renders properly with minutes and seconds", () => {
  const count = getCountDown(250);
  expect(count).toEqual("4:10");
});

test("retrieves pomodoro index", () => {
  const index = getPomodoroIndex(TIMER_STATE.POMODORO_3_BREAK);
  expect(index).toEqual(3);
});

test("retrieves pomodoro index 0 when off", () => {
  const index = getPomodoroIndex(TIMER_STATE.OFF);
  expect(index).toEqual(0);
});

test("get starting state from off state", () => {
  const pom = getNextState(TIMER_STATE.OFF);
  expect(pom).toEqual(TIMER_STATE.POMODORO_1_INPROGRESS);
});

test("get starting state from end state - restarts", () => {
  const pom = getNextState(TIMER_STATE.POMODORO_4_BREAK);
  expect(pom).toEqual(TIMER_STATE.POMODORO_1_INPROGRESS);
});

test("get to break state from inprogress", () => {
  const pom = getNextState(TIMER_STATE.POMODORO_2_INPROGRESS);
  expect(pom).toEqual(TIMER_STATE.POMODORO_2_BREAK);
});
