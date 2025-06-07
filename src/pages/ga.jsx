import { data, NavLink } from "react-router";
import { useEffect, useRef, useState } from "react";
import Header from "../titlebar";
import { CircleChevronLeft } from "lucide-react";
import { InputBox } from "./../components/Inputbox";
import { Genetic } from "../Algorithms/Genetic Algorithm/main";
import { PacmanLoader } from "react-spinners";

export default function GeneticAlgorithm() {
  const fitnessFunction = useRef(null);
  const populationSize = useRef(null);
  const selectionMethod = useRef(null);
  const crossoverType = useRef(null);
  const mutationOperator = useRef(null);
  const mutationProbability = useRef(null);
  const terminationCriteria = useRef(null);
  const crossoverProbability = useRef(null);
  const replacementType = useRef(null);
  const dataType = useRef(null);
  const [pop, setPop] = useState([]);
  const [bestFitness, setBestFitness] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

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

  const startAlgo = () => {
    if (isRunning) {
      alert("Algorithm is already running. Please wait for it to finish.");
      return;
    }
    setIsRunning(true);
    const fitnessFunctionValue = fitnessFunction.current.value;
    const populationSizeValue = populationSize.current.value;
    const selectionMethodValue = selectionMethod.current.value;
    const crossoverTypeValue = crossoverType.current.value;
    const mutationOperatorValue = mutationOperator.current.value;
    const mutationProbabilityValue = mutationProbability.current.value;
    const terminationCriteriaValue = terminationCriteria.current.value;
    const crossoverProbabilityValue = crossoverProbability.current.value;
    const dataTypeValue = dataType.current.value;
    const replacementTypeValue = replacementType.current.value;

    if (
      !fitnessFunctionValue ||
      !populationSizeValue ||
      !selectionMethodValue ||
      !crossoverTypeValue ||
      !mutationOperatorValue ||
      !mutationProbabilityValue ||
      !terminationCriteriaValue ||
      !crossoverProbabilityValue ||
      !dataTypeValue ||
      !replacementType
    ) {
      alert("Please fill in all fields before starting the algorithm.");
      setIsRunning(false);
      return;
    }
    if (
      isNaN(populationSizeValue) ||
      isNaN(mutationProbabilityValue) ||
      isNaN(crossoverProbabilityValue)
    ) {
      alert(
        "Population size, mutation probability, and crossover probability must be numbers."
      );
      setIsRunning(false);

      return;
    }
    if (
      Number(populationSizeValue) <= 0 ||
      Number(mutationProbabilityValue) < 0 ||
      Number(mutationProbabilityValue) > 1 ||
      Number(crossoverProbabilityValue) < 0 ||
      Number(crossoverProbabilityValue) > 1
    ) {
      alert(
        "Please enter valid values for population size, mutation probability, and crossover probability."
      );
      setIsRunning(false);

      return;
    }
    if (dataTypeValue === "Binary") {
      if (
        !(
          crossoverTypeValue === "Single Point" ||
          crossoverTypeValue === "Two Point" ||
          crossoverTypeValue === "Uniform"
        )
      ) {
        alert(
          "For Binary data type, please select a valid crossover type (Single Point, Two Point, or Uniform)."
        );
        setIsRunning(false);

        return;
      }
      if (!(mutationOperatorValue === "Bit Flip Mutation")) {
        alert(
          "For Binary data type, please select a valid mutation operator (Bit Flip Mutation)."
        );
        setIsRunning(false);

        return;
      }
    }
    if (dataTypeValue === "Permutation") {
      if (
        !(
          crossoverTypeValue === "Order Crossover" ||
          crossoverTypeValue === "Cycle Recombination"
        )
      ) {
        alert(
          "For Permutation data type, please select a valid crossover type (Order Crossover or Cycle Recombination)."
        );
        setIsRunning(false);

        return;
      }
      if (
        !(
          mutationOperatorValue === "Swap Mutation" ||
          mutationOperatorValue === "Insert Mutation" ||
          mutationOperatorValue === "Scramble Mutation" ||
          mutationOperatorValue === "Inversion Mutation"
        )
      ) {
        alert(
          "For Permutation data type, please select a valid mutation operator (Swap Mutation, Insert Mutation, Scramble Mutation, or Inversion Mutation)."
        );
        setIsRunning(false);

        return;
      }
    }
    if (dataTypeValue === "Real Number") {
      if (
        !(
          crossoverTypeValue === "Simple Crossover" ||
          crossoverTypeValue === "Simple Arithmetic Crossover" ||
          crossoverTypeValue === "Whole Arithmetic Crossover"
        )
      ) {
        alert(
          "For Real Number data type, please select a valid crossover type (Simple Crossover, Simple Arithmetic Crossover, or Whole Arithmetic Crossover)."
        );
        setIsRunning(false);

        return;
      }
      if (!(mutationOperatorValue === "Complementary Mutation")) {
        alert(
          "For Real Number data type, please select a valid mutation operator (Complementary Mutation)."
        );
        setIsRunning(false);

        return;
      }
    }
    if (fitnessFunctionValue === "Traveling Salesman Problem") {
      if (dataTypeValue !== "Permutation") {
        alert(
          "For Traveling Salesman Problem, please select Permutation as the data type."
        );
        setIsRunning(false);

        return;
      }
    }

    let fitnessFunctionFunction;
    if (fitnessFunctionValue === "Sum of squares") {
      fitnessFunctionFunction = (individual) => {
        return individual.reduce((sum, gene) => sum + Math.pow(gene, 2), 0);
      };
    } else if (fitnessFunctionValue === "Rosenbrock") {
      fitnessFunctionFunction = (individual) => {
        let sum = 0;
        for (let i = 0; i < individual.length - 1; i++) {
          sum +=
            100 * Math.pow(individual[i + 1] - Math.pow(individual[i], 2), 2) +
            Math.pow(1 - individual[i], 2);
        }
        return sum;
      };
    } else if (fitnessFunctionValue === "Rastrigin") {
      fitnessFunctionFunction = (individual) => {
        return (
          10 * individual.length +
          individual.reduce(
            (sum, gene) =>
              sum + (Math.pow(gene, 2) - 10 * Math.cos(2 * Math.PI * gene)),
            0
          )
        );
      };
    } else if (fitnessFunctionValue === "Traveling Salesman Problem") {
      // Example cities represented as coordinates
      const cities = Array.from({ length: 20 }, (_, i) => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
      }));

      // Euclidean distance between two cities by index
      function distance(cityAIndex, cityBIndex) {
        const a = cities[cityAIndex];
        const b = cities[cityBIndex];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        return Math.sqrt(dx * dx + dy * dy);
      }

      fitnessFunctionFunction = (individual) => {
        let totalDistance = 0;

        for (let i = 0; i < individual.length - 1; i++) {
          totalDistance += distance(individual[i], individual[i + 1]);
        }

        // Return to the starting city to complete the tour
        totalDistance += distance(
          individual[individual.length - 1],
          individual[0]
        );

        return -totalDistance; // Use negative distance for maximization
      };
    }

    const gnt = new Genetic(
      parseInt(populationSizeValue),
      parseFloat(mutationProbabilityValue),
      parseFloat(crossoverProbabilityValue),
      fitnessFunctionFunction,
      crossoverTypeValue,
      selectionMethodValue,
      terminationCriteriaValue,
      dataTypeValue,
      mutationOperatorValue,
      replacementTypeValue
    );

    gnt.runAlgorithm();

    setPop(gnt.top10());
    setBestFitness(gnt.bestfit());
    setIsRunning(false);
  };

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
                Genetic Algorithms are optimization methods inspired by natural
                evolution. They evolve solutions (chromosomes) using selection,
                crossover, and mutation, efficiently searching complex problem
                spaces for optimal results.
              </p>
            </div>
            <div className="grid grid-cols-2 grid-rows-4 gap-2">
              <InputBox
                logo="f"
                parameter="Enter Data Type"
                inputType="Select"
                options={["Binary", "Permutation", "Real Number"]}
                ref={dataType}
              />
              <InputBox
                logo="f"
                parameter="Enter your fitness function (min/max):"
                inputType="Select"
                options={[
                  "Sum of squares",
                  "Rosenbrock",
                  "Rastrigin",
                  "Traveling Salesman Problem",
                ]}
                ref={fitnessFunction}
              />
              <InputBox
                logo="f"
                parameter="Set population size:"
                ref={populationSize}
              />
              <InputBox
                logo="f"
                parameter="Choose selection method:"
                inputType="Select"
                options={[
                  "Random",
                  "Roulette Wheel",
                  "Rank Base",
                  "Tournament",
                  "Truncation",
                ]}
                ref={selectionMethod}
              />
              <InputBox
                logo="f"
                parameter="Select crossover type: "
                inputType="Select"
                options={[
                  "Single Point",
                  "Two Point",
                  "Uniform",
                  "Simple Crossover",
                  "Simple Arithmetic Crossover",
                  "Whole Arithmetic Crossover",
                  "Order Crossover",
                  "Cycle Recombination",
                ]}
                ref={crossoverType}
              />
              <InputBox
                logo="f"
                parameter="Set crossover probability:"
                ref={crossoverProbability}
              />
              <InputBox
                logo="f"
                parameter="Choose mutation operator:"
                inputType="Select"
                options={[
                  "Bit Flip Mutation",
                  "Complementary Mutation",
                  "Swap Mutation",
                  "Insert Mutation",
                  "Scramble Mutation",
                  "Inversion Mutation",
                ]}
                ref={mutationOperator}
              />
              <InputBox
                logo="f"
                parameter="Set mutation probability:"
                ref={mutationProbability}
              />
              <InputBox
                logo="f"
                parameter="Choose termination criteria:"
                inputType="Select"
                options={[
                  "Max Generations",
                  "Stagnation Limit",
                  "Fitness Threshold Stop",
                  "Time Limit",
                  "Population Convergence",
                ]}
                ref={terminationCriteria}
              />
              <InputBox
                logo="f"
                parameter="Choose Replacement Type:"
                inputType="Select"
                options={[
                  "Elitism",
                  "Generational Replacement",
                  "Steady State Replacement",
                  "Tournament Replacement",
                  "Fitness Based Replacement",
                ]}
                ref={replacementType}
              />
            </div>
            <div className="flex justify-end mt-5">
              <button
                onClick={startAlgo}
                className="bg-[#CAD7F7] text-black py-2 px-8 rounded-md mr-2 cursor-pointer hover:bg-[#CAD7F7]/80 transition duration-300 ease-in-out"
              >
                Start
              </button>
              <button className="bg-[#CAD7F7] text-black py-2 px-8 rounded-md cursor-pointer hover:bg-[#CAD7F7]/80 transition duration-300 ease-in-out">
                Stop
              </button>
            </div>
          </div>
          {/* charts and visualization */}

          <div className="h-full w-[50%] pl-20 flex justify-center items-center flex-col">
            {!isRunning ? (
              <>
                <h3 className="font-medium text-lg mb-5">
                  List of top 10 chromosomes:
                </h3>
                <div className="flex justify-center  max-h-[90%] flex-wrap">
                  {pop.length != 0 &&
                    pop.map((gene, index) => <Chromosome genes={gene} />)}
                </div>
                <h3 className="font-medium text-lg my-5">
                  Best Fitness Score: {bestFitness}
                </h3>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <h3 className="mb-4 font-bold">Loading...</h3>
                <PacmanLoader color="white" />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function Chromosome({ genes }) {
  return (
    <ul className="flex items-center border border-gray-300 rounded-lg w-fit py-2 px-2 h-fit text-[10px] mr-3 mb-3">
      {genes &&
        genes.map((value, index) => (
          <li className={index != 0 ? "ml-3" : ""}>{value}</li>
        ))}
    </ul>
  );
}
