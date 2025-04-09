import { NavLink } from "react-router";
import { useEffect } from "react";
import Header from "../titlebar";
import { CircleChevronLeft } from "lucide-react";
import InputBox from "./../components/Inputbox";

export default function GeneticAlgorithm() {
    useEffect(() => {
        const threeScript = document.createElement("script");
        threeScript.src = "./Utils/three.min.js";
        threeScript.async = true;
        document.body.appendChild(threeScript);

        const vantaScript = document.createElement("script");
        vantaScript.src = "./Utils/vanta.net.min.js"; 
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
                    color: 0x468eff,
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
                <div className="flex w-[98%] h-[98%] backdrop-blur-md bg-black/5 border border-white/20 rounded-2xl shadow-lg p-8 text-white">
                    <div className="flex flex-col h-full w-[50%]">
                        <div className="text-left">
                            <h2 className="font-semibold text-4xl text-white mb-6 flex items-center">
                                <NavLink className="mr-2" to="/">
                                    <CircleChevronLeft />
                                </NavLink>
                                Genetic Algorithm
                            </h2>
                            <p className="text-lg text-white mb-4 text-justify">
                                Genetic Algorithms are optimization methods
                                inspired by natural evolution. They evolve
                                solutions (chromosomes) using selection,
                                crossover, and mutation, efficiently searching
                                complex problem spaces for optimal results.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 grid-rows-4 gap-2">
                            <InputBox
                                logo="f"
                                parameter="Enter your fitness function (min/max):"
                            />
                            <InputBox
                                logo="f"
                                parameter="Set population size:"
                            />
                            <InputBox
                                logo="f"
                                parameter="Choose selection method:"
                            />
                            <InputBox
                                logo="f"
                                parameter="Select crossover type: "
                            />
                            <InputBox
                                logo="f"
                                parameter="Set crossover probability:"
                            />
                            <InputBox
                                logo="f"
                                parameter="Choose mutation operator:"
                            />
                            <InputBox
                                logo="f"
                                parameter="Set mutation probability:"
                            />
                            <InputBox
                                logo="f"
                                parameter="Choose termination criteria:"
                            />
                        </div>
                        <div className="flex justify-end mt-5">
                            <button className="bg-[#CAD7F7] text-black py-2 px-8 rounded-md mr-2 cursor-pointer hover:bg-[#CAD7F7]/80 transition duration-300 ease-in-out">
                                Next
                            </button>
                            <button className="bg-[#CAD7F7] text-black py-2 px-8 rounded-md cursor-pointer hover:bg-[#CAD7F7]/80 transition duration-300 ease-in-out">
                                Next
                            </button>
                        </div>
                    </div>
                    <div className="h-full w-[50%]"></div>
                </div>
            </div>
        </main>
    );
}
