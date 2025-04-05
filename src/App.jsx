import { NavLink } from "react-router";
``
function App() {
  return (
    <main className="flex flex-col items-center justify-center h-screen font-[montserrat]">
      <h3 className="font-medium text-2xl">Welcome To MetaSolve</h3>
      <ul className="list-none flex flex-col items-center justify-center">
        <NavLink to="/ga">Genetic Algorithm</NavLink>
        <NavLink to="/pso">PSO Algorithm</NavLink>
      </ul>
    </main>
  );
}

export default App;
