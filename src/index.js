import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

if (document.title === "React App") {
  navigator.serviceWorker.register("sw.js").then(function (registration) {
    ReactDOM.render(
      <React.StrictMode>
        <App swRegistration={registration} />
      </React.StrictMode>,
      document.getElementById("root")
    );
  });
} else {
  ReactDOM.render(<App />, document.getElementById("root"));
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
