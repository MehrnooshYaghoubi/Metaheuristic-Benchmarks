import { NavLink } from "react-router";
import { useEffect } from "react";
import { Minus, Square, X } from "lucide-react";
import { getCurrentWindow } from "@tauri-apps/api/window";

// when using `"withGlobalTauri": true`, you may use
// const { getCurrentWindow } = window.__TAURI__.window;

function App() {
  useEffect(() => {
    // Load the Three.js and Vanta.js scripts dynamically
    const threeScript = document.createElement("script");
    threeScript.src =
      "https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js";
    threeScript.async = true;
    document.body.appendChild(threeScript);

    const vantaScript = document.createElement("script");
    vantaScript.src =
      "https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.dots.min.js";
    vantaScript.async = true;
    document.body.appendChild(vantaScript);

    // Initialize Vanta.DOTS after the scripts are loaded
    const setVanta = () => {
      if (window.VANTA) {
        window.VANTA.DOTS({
          el: document.querySelector("main"), // Target the main element
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: 0x2099ff,
          color2: 0x317cb6,
          backgroundColor: 0x0,
          size: 3.0,
          spacing: 30.0,
        });
      }
    };

    threeScript.onload = () => {
      vantaScript.onload = setVanta;
    };

    // Cleanup Vanta effect on component unmount
    return () => {
      if (window.VANTA && window.VANTA.current) {
        window.VANTA.current.destroy();
      }
      document.body.removeChild(threeScript);
      document.body.removeChild(vantaScript);
    };
  }, []);

  const appWindow = getCurrentWindow();

  return (
    <main className="flex flex-col items-center h-screen text-center font-[Montserrat] ">
      <header
        data-tauri-drag-region
        className="flex w-full justify-between mb-[150px] py-3 pl-10 pr-4 border-b-1 border-gray-800 solid select-none"
      >
        <div className="flex">
          <img
            src="./icon.svg "
            alt="logo"
            className="mr-3 w-[20px] aspect-auto"
          />
          <h3>MetaSlove</h3>
        </div>
        <div className="flex items-center justify-around">
          <button
            className="mr-4 hover:text-red-400 transition duration-300 ease-in-out cursor-pointer"
            onClick={() => appWindow.minimize()}
          >
            <Minus size={16} />
          </button>
          <button
            className="mr-4 hover:text-red-400 transition duration-300 ease-in-out cursor-pointer"
            onClick={() => appWindow.toggleMaximize()}
          >
            <Square size={15} />
          </button>
          <button onClick={() => appWindow.close}>
            <X
              size={16}
              className=" hover:text-red-400 transition duration-300 ease-in-out cursor-pointer"
            />
          </button>
        </div>
      </header>
      <h3 className="py-2 px-4 rounded-full border border-gray-200 solid">
        MetaSolve secures $20M Series B to reshape the future of algorithmic
        intelligence.
      </h3>
      <h1 className="text-[70px] font-semibold my-7 leading-[1.15] bg-gradient-to-b from-blue-500  to-gray-200 text-transparent bg-clip-text">
        Revolutionizing The <br /> Future with Algorithms
      </h1>
      <h3 className="mb-10">
        MetaSolve brings powerful, AI-driven tools to life—engineered to <br />
        solve the world's toughest challenges
      </h3>
      <div>
        <NavLink
          to="/ga"
          className="bg-blue-500  text-white rounded-full px-6 py-3 hover:bg-blue-400 transition duration-300 ease-in-out"
        >
          Use MetaSolve Now
        </NavLink>
        <NavLink
          to="/pso"
          className="text-white border border-blue-400 rounded-full px-6 py-3 ml-4 hover:bg-blue-500  transition duration-300 ease-in-out"
        >
          Talk to an expert
        </NavLink>
      </div>
    </main>
  );
}

export default App;
