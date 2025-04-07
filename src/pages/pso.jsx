import { NavLink } from "react-router";
import { useEffect } from "react";

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
          backgroundColor: 0x0, // Black background
          color1: 0x2658, // Custom color 1
          color2: 0x2e819c, // Custom color 2
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

  return (
    <main className="flex flex-col items-center justify-center h-screen font-[montserrat] text-center">
      <h3 className="text-[70px] font-semibold my-7 leading-[1.15] bg-gradient-to-b from-blue-500  to-white text-transparent bg-clip-text">
        Particle Swarm <br /> Optimization
      </h3>
      <ul className="list-none text-center space-y-4">
        <li className="text-lg text-gray-700 hover:text-blue-500 transition">
          Particle Swarm Optimization
        </li>
        <li className="text-lg text-gray-700 hover:text-blue-500 transition">
          Particle Swarm Optimization
        </li>
        <li className="text-lg text-gray-700 hover:text-blue-500 transition">
          Particle Swarm Optimization
        </li>
      </ul>
      <NavLink
        to="/"
        className="mt-8 px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
      >
        Back
      </NavLink>
    </main>
  );
}