import { NavLink } from "react-router";
import { useEffect } from "react";
import Header from "../titlebar";
import { useState } from "react";
import { CircleChevronLeft } from "lucide-react";

export default function GeneticAlgorithm() {
  useEffect(() => {
    const threeScript = document.createElement("script");
    threeScript.src =
      "https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js";
    threeScript.async = true;
    document.body.appendChild(threeScript);

    const vantaScript = document.createElement("script");
    vantaScript.src =
      "https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js";
    vantaScript.async = true;
    document.body.appendChild(vantaScript);

    const setVanta = () => {
      if (window.VANTA) {
        window.VANTA.NET({
          el: document.querySelector("main"), 
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: 0x468EFF, 
          backgroundColor: 0x0, 
          points: 17.0, 
          maxDistance: 27.0, 
          spacing: 18.0,
        });
      }
    };

    threeScript.onload = () => {
      vantaScript.onload = setVanta;
    };

    return () => {
      if (window.VANTA?.current) {
        window.VANTA.current.destroy();
      }
      if (document.body.contains(threeScript)) {
        document.body.removeChild(threeScript);
      }
      if (document.body.contains(vantaScript)) {
        document.body.removeChild(vantaScript);
      }
    };
  }, []);

  return (
    <main className="flex flex-col items-center justify-start h-screen font-[montserrat] text-center">
      <Header />
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        <div className="flex w-[98%] h-[98%] -z-10 backdrop-blur-md bg-black/5 border border-white/20 rounded-2xl shadow-lg p-8 text-white">
          <div className="flex flex-col h-full w-[50%]">
            <div className="text-left">
              <h2 className="font-semibold text-4xl text-white mb-6 flex items-center">
                <NavLink className="mr-2" to="/">
                  <CircleChevronLeft />
                </NavLink>
                Genetic Algorithm
              </h2>
              <p className="text-lg text-white mb-4 text-justify">
              Genetic Algorithms are optimization methods inspired by natural evolution.  
              They evolve solutions (chromosomes) using selection, crossover, and mutation,  
              efficiently searching complex problem spaces for optimal results.  
            </p>
            </div>
            <div className="flex flex-col">
              <InputBox logo="f" parameter="Population" />
              <InputBox logo="f" parameter="Population" />
              <InputBox logo="f" parameter="Population" />
              <InputBox logo="f" parameter="Population" />
              <InputBox logo="f" parameter="Population" />
              <div className="flex justify-end mt-5">
                <button className="mr-3 bg-[#CAD7F7] text-black py-2 px-8 rounded-md hover:bg-[#b8c7e8] transition-colors">
                  Next
                </button>
                <button className="bg-[#CAD7F7] text-black py-2 px-8 rounded-md hover:bg-[#b8c7e8] transition-colors">
                  Next
                </button>
              </div>
            </div>
          </div>
          <div className="h-full w-[50%]"></div>
        </div>
      </div>
    </main>
  );
}

function InputBox({ logo, parameter }) {
  return (
    <div className="flex items-center mt-7">
      <div className="flex items-end h-full">
        <h3 className="text-white">{parameter}</h3>
        <label className="bg-cyan-300 text-black ml-3 py-3 px-5 rounded-full">
          {logo}
        </label>
      </div>

      <div className="ml-5 flex flex-col items-start w-full">
        <p className="text-white">Enter The Value Here:</p>
        <input
          type="text"
          placeholder="Type something..."
          className="w-full border border-gray-50 rounded-xl px-4 py-2 mt-2 bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}