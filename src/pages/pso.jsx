import { NavLink } from "react-router";
import { useEffect } from "react";
import Header from "../titlebar";
import { CircleChevronLeft } from "lucide-react";
import { InputBox } from "./../components/Inputbox";
import { useState, useRef } from "react";
import React from "react";
import { StandardPSO } from "../Algorithms/PSO/pso";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";

import Latex from "react-latex-next";
import "./../../node_modules/katex/dist/katex.min.css";

export default function PSO() {
  const [positions, setPositions] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [optimalValue, setOptimalValue] = useState(false);
  const populationSizeRef = useRef(null);
  const dimensionRef = useRef(null);
  const [dimension, setDimension] = useState(null);
  const lowerBoundRef = useRef(null);
  const upperBoundRef = useRef(null);
  const targetFunctionRef = useRef(null);
  const inertiaWeightRef = useRef(null);
  const cognitiveRef = useRef(null);
  const socialRef = useRef(null);
  const numOfIterationsRef = useRef(null);
  const [isWrandom, setWrandom] = useState(false);
  const [gBest, setGBest] = useState(null);
  const [data, setData] = useState([]);

  const handleStart = async () => {
    setIsRunning(true);

    const populationSize = parseInt(populationSizeRef.current.value);
    const dimension = parseInt(dimensionRef.current.value);
    const lowerBound = parseInt(lowerBoundRef.current.value);
    const upperBound = parseInt(upperBoundRef.current.value);
    const iterations = parseInt(numOfIterationsRef.current.value);

    if (
      isNaN(populationSize) ||
      isNaN(dimension) ||
      isNaN(lowerBound) ||
      isNaN(upperBound) ||
      isNaN(iterations) ||
      populationSize <= 0 ||
      dimension <= 0 ||
      lowerBound >= upperBound ||
      iterations <= 0
    ) {
      alert("Please enter valid input values.");
      setIsRunning(false);
      return;
    }

    if (
      !populationSize ||
      !dimension ||
      !lowerBound ||
      !upperBound ||
      !iterations
    ) {
      alert("Please fill in all fields.");
      setIsRunning(false);
      return;
    }

    const fitnessFunction = async (x) => {
      switch (targetFunctionRef.current.value) {
        case "Sum of squares":
          return x.reduce((sum, val) => sum + val ** 2, 0);
        case "Rosenbrock":
          return x.reduce(
            (sum, val, index) =>
              sum + 100 * (val - x[index - 1] ** 2) ** 2 + (1 - val) ** 2,
            0
          );
        case "Rastrigin":
          return (
            10 * dimension + x.reduce((sum, val) => sum + (val ** 2 - 10), 0)
          );
        default:
          return null;
      }
    };
    const W = parseFloat(inertiaWeightRef.current.value);
    const c1 = parseFloat(cognitiveRef.current.value);
    const c2 = parseFloat(socialRef.current.value);

    console.log({
      populationSize,
      dimension,
      lowerBound,
      upperBound,
      iterations,
      fitnessFunction,
      W,
      c1,
      c2,
    });

    let result = await StandardPSO(
      populationSize,
      dimension,
      lowerBound,
      upperBound,
      iterations,
      fitnessFunction,
      W,
      c1,
      c2,
      setPositions,
      isWrandom,
      0.726,
      setData
    );

    console.log(result);

    setGBest(result.gbest.map((e) => e.toFixed(5)).join(", "));
    setOptimalValue(result.bestFitness.toExponential());
    setIsRunning(false);
  };
  useEffect(() => {
    const threeScript = document.createElement("script");
    threeScript.src = "./Utils/three.min.js";
    threeScript.async = true;
    document.body.appendChild(threeScript);

    const vantaScript = document.createElement("script");
    vantaScript.src = "./Utils/vanta.birds.min.js";
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
        <div className="flex items-center w-[98%] h-[98%] backdrop-blur-xl bg-black/10 border border-white/20 rounded-2xl shadow-lg p-8 text-white">
          {/* inputs are here */}
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
            <div className="grid grid-cols-2 grid-rows-5 gap-x-5">
              <InputBox
                logo="f"
                parameter="Target function"
                ref={targetFunctionRef}
                inputType="Select"
                options={["Sum of squares", "Rosenbrock", "Rastrigin"]}
              />
              <InputBox
                logo="D"
                parameter="Dimension:"
                ref={dimensionRef}
                onChange={(e) => setDimension(e.target.value)}
                placeholder="Enter a number"
                inputType="number"
              />
              <InputBox
                logo="P"
                ref={populationSizeRef}
                parameter="Population Size:"
                placeholder="Enter a number"
                inputType="number"
              />
              <InputBox
                logo="LB"
                ref={lowerBoundRef}
                parameter="Lower Bound:"
                placeholder="Enter a number"
                inputType="number"
                defaultVal={-10}
              />
              <InputBox
                logo="UB"
                ref={upperBoundRef}
                parameter="Upper Bound:"
                placeholder="Enter a number"
                inputType="number"
                defaultVal={10}
              />
              <InputBox
                logo="W_1"
                parameter="Inertia Weight:"
                placeholder="Enter a number"
                inputType="number"
                disabled={isWrandom}
                ref={inertiaWeightRef}
                defaultVal={0.729}
              />
              <InputBox
                ref={cognitiveRef}
                logo="C_1"
                placeholder="Enter a number"
                inputType="number"
                parameter="Cognitive Coefficient"
                defaultVal={1.49445}
              />
              <InputBox
                ref={socialRef}
                logo="C_2"
                placeholder="Enter a number"
                inputType="number"
                parameter="Social Coefficient"
                defaultVal={1.49445}
              />
              <InputBox
                ref={numOfIterationsRef}
                logo="N"
                placeholder="Enter a number"
                inputType="number"
                parameter="Number of Iterations"
              />
              <div className="ml-5 flex items-center">
                <input
                  type="checkbox"
                  name=""
                  id=""
                  className="mr-2"
                  onChange={(e) => setWrandom(e.target.checked)}
                />
                <p className="text-start text-sm">
                  Random W (With Logistic Map)
                </p>
              </div>
              <div className="flex justify-end mt-5 self-center-safe">
                <button
                  onClick={handleStart}
                  disabled={isRunning}
                  className="mr-3 bg-[#CAD7F7] text-black py-2 px-8 rounded-md cursor-pointer hover:bg-[#CAD7F7]/80 transition duration-300 ease-in-out disabled:bg-[#CAD7F7]/30"
                >
                  Start
                </button>
              </div>
            </div>
          </div>
          {/* chart is here: */}
          <div className="pl-15 w-[50%]">
            <div className="w-full h-70">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  width={500}
                  height={300}
                  data={data}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid />
                  <XAxis dataKey="iteration" label="Best Fitness" />
                  <YAxis dataKey="best" label="iteration" />
                  <Tooltip />
                  <Line type="monotone" dataKey="best" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {dimension <= 2 ? (
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart
                  width={600}
                  height={400}
                  margin={{
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 20,
                  }}
                >
                  <CartesianGrid />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="X"
                    domain={[-10, 10]}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Y"
                    domain={[-10, 10]}
                  />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                  <Scatter name="Particles" data={positions} fill="#8884d8" />
                </ScatterChart>
              </ResponsiveContainer>
            ) : (
              <h3 className="my-10">Can't Draw More Than 2 Demensions</h3>
            )}

            <div
              className={
                optimalValue
                  ? "flex flex-col justify-center items-center"
                  : "hidden"
              }
            >
              <h3 className="font-semibold">GBEST Answer:</h3>
              <div className="text- ml-4 font-medium text-blue-300">
                <span>( {gBest} )</span>
              </div>
              <h3 className="font-semibold mt-5">Optimal Answer:</h3>
              <div className="text-lg ml-4 font-medium text-blue-300">
                <span>( {optimalValue} )</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
