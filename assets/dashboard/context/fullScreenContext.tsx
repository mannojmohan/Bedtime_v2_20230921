import React, { createContext, useEffect, useState } from "react";

export const FullScreenContext = createContext({});

export function toggleFullScreen() {
  const fsDocElem = document.documentElement as HTMLElement; // Use type assertion

  if (!document.fullscreenElement) {
    const methods = [
      "requestFullscreen",
      "msRequestFullscreen",
      "mozRequestFullScreen",
      "webkitRequestFullscreen",
    ];

    for (const method of methods) {
      if (fsDocElem[method]) {
        fsDocElem[method]();
        break;
      }
    }
  } else {
    const methods = [
      "exitFullscreen",
      "msExitFullscreen",
      "mozCancelFullScreen",
      "webkitExitFullscreen",
    ];

    for (const method of methods) {
      if (document[method]) {
        document[method]();
        break;
      }
    }
  }
}

export function FullScreenProvider({ children }) {
  const [isFS, setFullScreen] = useState(!!document.fullscreenElement);

  useEffect(() => {
    const handleFullScreenChange = () => {
      setFullScreen(!!document.fullscreenElement);
    };

    const events = [
      "fullscreenchange",
      "mozfullscreenchange",
      "webkitfullscreenchange",
      "msfullscreenchange",
    ];

    for (const event of events) {
      document.addEventListener(event, handleFullScreenChange);
    }

    return () => {
      for (const event of events) {
        document.removeEventListener(event, handleFullScreenChange);
      }
    };
  }, []);

  return (
    <FullScreenContext.Provider value={{ isFullScreen: isFS, toggleFullScreen }}>
      {children}
    </FullScreenContext.Provider>
  );
}
