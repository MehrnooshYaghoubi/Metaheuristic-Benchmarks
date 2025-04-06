import { NavLink } from "react-router";

export default function GeneticAlgorithm() {
  return (
    <div className="flex flex-col items-center justify-center h-screen font-[montserrat] bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 p-6">
      <h3 className="font-bold text-4xl text-purple-700 mb-6">
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
    </div>
  );
}