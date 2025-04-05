import { NavLink } from "react-router";


export default function GeneticAlgorithm() {
  return (
    <div className="flex flex-col items-center justify-center h-screen font-[montserrat]">
      <h3 className="font-medium text-2xl">Genetic Algorithm</h3>
      <ul className="list-none text-center">
        <li >Selection</li>
        <li>Crossover</li>
        <li>Mutation</li>
      </ul>
    
    <NavLink to="/">Back</NavLink>
    </div>
  );
}