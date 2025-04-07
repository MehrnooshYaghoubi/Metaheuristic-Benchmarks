import { NavLink } from "react-router";
import { useEffect } from "react";

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
      if (window.VANTA && window.VANTA.current) {
        window.VANTA.current.destroy();
      }
      document.body.removeChild(threeScript);
      document.body.removeChild(vantaScript);
    };
  }, []);

  return (
    <main className="flex flex-col items-center justify-center h-screen font-[montserrat] text-center">
      <h3 className="font-bold text-4xl text-purple-700 mb-6">
        Genetic Algorithm
      </h3>
      <ul className="list-none text-center space-y-4">
        <li className="text-lg text-gray-800 hover:text-purple-600 transition">
          Selection
        </li>
        <li className="text-lg text-gray-800 hover:text-purple-600 transition">
          Crossover
        </li>
        <li className="text-lg text-gray-800 hover:text-purple-600 transition">
          Mutation
        </li>
      </ul>
      <NavLink
        to="/"
        className="mt-8 px-6 py-2 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition"
      >
        Back
      </NavLink>
    </main>
  );
}