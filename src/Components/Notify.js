import React, { useState, useEffect } from "react";

import Notification from "react-web-notification";

const soundRef = React.createRef();

function Notify(props) {
  const [ignore, setIgnore] = useState(true); // don't notify without support/permission
  useEffect(() => {
    if (soundRef && soundRef.current) {
      if (props.hasHadInteraction) {
        // browser needs user interaction before sound
        soundRef.current.play();
      }
    }
  }, [props.title, props.hasHadInteraction]);
  const handlePermissionGranted = () => {
    console.log("Permission Granted");
    setIgnore(false);
  };
  const handlePermissionDenied = () => {
    console.log("Permission Denied");
    setIgnore(true);
  };
  const handleNotSupported = () => {
    console.log("Web Notification not Supported");
    setIgnore(true);
  };
  return (
    <>
      <Notification
        ignore={ignore && props.title !== ""}
        notSupported={handleNotSupported.bind(this)}
        onPermissionGranted={handlePermissionGranted.bind(this)}
        onPermissionDenied={handlePermissionDenied.bind(this)}
        timeout={3000}
        title={props.title}
        options={props.options}
        swRegistration={props.swRegistration}
      />
      <audio id="sound" preload="auto" ref={soundRef}>
        <source src="sound.mp3" type="audio/mpeg" />
        <source src="sound.ogg" type="audio/ogg" />
        <embed hidden={true} autostart="false" loop={false} src="sound.mp3" />
      </audio>
    </>
  );
}

export default Notify;
