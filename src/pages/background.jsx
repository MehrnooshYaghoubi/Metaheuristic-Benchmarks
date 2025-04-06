import React, { useEffect } from "react";
import "./background.scss";

export default function Background() {
  useEffect(() => {
    // Import and execute the JavaScript logic from background.js
    const script = document.createElement("script");
    script.src = "./background.js"; // Adjust the path if needed
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); // Cleanup the script on unmount
    };
  }, []);

  return (
    <div className="a-hole">
      <div className="aura"></div>
      <div className="overlay"></div>
      <canvas id="background-canvas"></canvas>
    </div>
  );
}