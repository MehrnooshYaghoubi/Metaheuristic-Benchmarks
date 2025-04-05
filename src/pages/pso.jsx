import { NavLink } from "react-router";

export default function PSO() {
  return (
    <div className="flex flex-col items-center justify-center h-screen font-[montserrat]">
      <h3 className="font-medium text-2xl">Particle Swarm Optimization</h3>
      <ul className="list-none text-center">
        <li>Particle Swarm Optimization</li>
        <li>Particle Swarm Optimization</li>
        <li>Particle Swarm Optimization</li>
      </ul>
    <NavLink to="/">Back</NavLink>

    </div>
  );
}