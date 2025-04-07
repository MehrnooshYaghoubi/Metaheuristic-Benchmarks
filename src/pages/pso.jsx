import { NavLink } from "react-router";
import { useEffect } from "react";
import Header from "../titlebar";
import { useState } from "react";
import { CircleChevronLeft } from "lucide-react";

export default function PSO() {
  useEffect(() => {
    const threeScript = document.createElement("script");
    threeScript.src =
      "https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js";
    threeScript.async = true;
    document.body.appendChild(threeScript);

    const vantaScript = document.createElement("script");
    vantaScript.src =
      "https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.birds.min.js";
    vantaScript.async = true;
    document.body.appendChild(vantaScript);
    const setVanta = () => {
      if (window.VANTA) {
        window.VANTA.BIRDS({
          el: document.querySelector("main"),
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          backgroundColor: 0x0, 
          color1: 0x2658,
          color2: 0x2e819c,
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
    <main className="flex flex-col items-center justify-start h-screen font-[montserrat] text-center">
      <Header />
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        <div className="flex w-[98%] h-[98%] -z-1 backdrop-blur-md bg-black/5 border border-white/20 rounded-2xl shadow-lg p-8 text-white">
          <div className="flex flex-col h-full w-[50%]">
            <div className="text-left">
              <h2 className="font-semibold text-4xl text-white mb-6 flex items-center">
                <NavLink className="mr-2" to="/">
                  <CircleChevronLeft />
                </NavLink>
                Particle Swarm Optimization (PSO)
              </h2>
              <p className="text-lg text-white mb-4 text-justify">
                Particle Swarm Optimization (PSO) is a computational method used
                for optimization problems. It is inspired by the social behavior
                of birds and fish, where individuals in a group (or swarm)
                communicate and collaborate to find optimal solutions.
              </p>
            </div>
            <div className="flex flex-col">
              <InputBox logo="f" parameter="Target function" />
              <InputBox logo="f" parameter="Target function" />
              <InputBox logo="f" parameter="Target function" />
              <InputBox logo="f" parameter="Target function" />
              <InputBox logo="f" parameter="Target function" />
              <div className="flex justify-end mt-5">
                <button className="mr-3 bg-[#CAD7F7] text-black py-2 px-8 rounded-md">
                  Next
                </button>
                <button className=" bg-[#CAD7F7] text-black py-2 px-8 rounded-md">
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
        <h3>{parameter}</h3>
        <label className="bg-cyan-300 text-black ml-3 py-3 px-5 rounded-full">
          {logo}
        </label>
      </div>

      <div className="ml-5 flex flex-col items-start w-full">
        <p>Enter The Value Here:</p>
        <input
          type="text"
          placeholder="Type something..."
          className="w-full border border-gray-50 rounded-xl px-4 py-2 mt-2"
        />
      </div>
    </div>
  );
}
