import { NavLink } from "react-router";
import { useEffect } from "react";
import Header from "./titlebar";

function App() {
  useEffect(() => {
    const threeScript = document.createElement("script");
    threeScript.src = "./Utils/three.min.js"; // Use the local path to the three.min.js file
    threeScript.async = true;
    document.body.appendChild(threeScript);

    const vantaScript = document.createElement("script");
    vantaScript.src = "./Utils/vanta.dots.min.js"; // Use the local path to the vanta.dots.min.js file
    vantaScript.async = true;
    document.body.appendChild(vantaScript);

    const setVanta = () => {
      if (window.VANTA) {
        window.VANTA.DOTS({
          el: document.querySelector("main"),
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

    return () => {
      if (window.VANTA && window.VANTA.current) {
        window.VANTA.current.destroy();
      }
      document.body.removeChild(threeScript);
      document.body.removeChild(vantaScript);
    };
  }, []);

  return (
    <main className="flex flex-col items-center h-screen text-center font-[Montserrat] ">
      <Header />
      <div className="flex flex-col items-center mt-[150px]">
        <h3 className="py-2 px-4 rounded-full border border-gray-200 solid w-fit">
          MetaSolve secures $20M Series B to reshape the future of algorithmic
          intelligence.
        </h3>
        <h1 className="text-[70px] font-semibold my-7 leading-[1.15] bg-gradient-to-b from-blue-500  to-gray-200 text-transparent bg-clip-text">
          Revolutionizing The <br /> Future with Algorithms
        </h1>
        <h3 className="mb-10">
          MetaSolve brings powerful, AI-driven tools to life—engineered to{" "}
          <br />
          solve the world's toughest challenges
        </h3>
        <div>
          <NavLink
            to="/ga"
            className="bg-blue-500  text-white rounded-full px-6 py-3 hover:bg-blue-400 transition duration-300 ease-in-out"
          >
            Use Genetic Algorithm
          </NavLink>
          <NavLink
            to="/pso"
            className="text-white border border-blue-400 rounded-full px-6 py-3 ml-4 hover:bg-blue-500  transition duration-300 ease-in-out"
          >
            Use Particle Swarm Optimization
          </NavLink>
          <NavLink
            to="/tables"
            className="text-white border border-blue-400 rounded-full px-6 py-3 ml-4 hover:bg-blue-500  transition duration-300 ease-in-out"
          >
            Benchmark Results
          </NavLink>
        </div>
      </div>
    </main>
  );
}

export default App;
