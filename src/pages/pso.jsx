import { NavLink } from "react-router";
import { useEffect } from "react";
import Header from "../titlebar";
import { CircleChevronLeft } from "lucide-react";
import InputBox from "./../components/Inputbox";
import React, { PureComponent } from "react";
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export default function PSO() {
    const data = [
        { x: 100, y: 200, z: 200 },
        { x: 120, y: 100, z: 260 },
        { x: 170, y: 300, z: 400 },
        { x: 140, y: 250, z: 280 },
        { x: 150, y: 400, z: 500 },
        { x: 110, y: 280, z: 200 },
    ];
    useEffect(() => {
        const threeScript = document.createElement("script");
        threeScript.src = "./Utils/three.min.js"; // Use the local path to the three.min.js file
        threeScript.async = true;
        document.body.appendChild(threeScript);

        const vantaScript = document.createElement("script");
        vantaScript.src = "./Utils/vanta.birds.min.js"; // Use the local path to the vanta.birds.min.js file
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
                <div className="flex items-center w-[98%] h-[98%] backdrop-blur-md bg-black/5 border border-white/20 rounded-2xl shadow-lg p-8 text-white">
                    <div className="flex flex-col h-full w-[50%]">
                        <div className="text-left">
                            <h2 className="font-semibold text-4xl text-white mb-6 flex items-center">
                                <NavLink className="mr-2" to="/">
                                    <CircleChevronLeft />
                                </NavLink>
                                Particle Swarm Optimization (PSO)
                            </h2>
                            <p className="text-lg text-white mb-4 text-justify">
                                Particle Swarm Optimization (PSO) is a
                                computational method used for optimization
                                problems. It is inspired by the social behavior
                                of birds and fish, where individuals in a group
                                (or swarm) communicate and collaborate to find
                                optimal solutions.
                            </p>
                        </div>
                        <div className="flex flex-col">
                            <InputBox logo="F" parameter="Target function" />
                            <InputBox logo="W1" parameter="Inertia Weight:" />
                            <InputBox
                                logo="C1"
                                parameter="Cognitive Coefficient"
                            />
                            <InputBox
                                logo="C2"
                                parameter="Social Coefficient"
                            />
                            <InputBox
                                logo="N"
                                parameter="Number of Iterations"
                            />
                            <div className="flex justify-end mt-5">
                                <button className="mr-3 bg-[#CAD7F7] text-black py-2 px-8 rounded-md cursor-pointer hover:bg-[#CAD7F7]/80 transition duration-300 ease-in-out">
                                    Start
                                </button>
                                <button className=" bg-[#CAD7F7] text-black py-2 px-8 rounded-md cursor-pointer hover:bg-[#CAD7F7]/80 transition duration-300 ease-in-out">
                                    Stop
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="pl-15 w-[50%]">
                        <ResponsiveContainer width="100%" height={400}>
                            <ScatterChart
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
                                    name="stature"
                                />
                                <YAxis
                                    type="number"
                                    dataKey="y"
                                    name="weight"
                                />
                                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                                <Scatter
                                    name="A school"
                                    data={data}
                                    fill="#8884d8"
                                />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </main>
    );
}
