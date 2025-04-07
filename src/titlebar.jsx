import { Minus, Square, X } from "lucide-react";
import { getCurrentWindow } from "@tauri-apps/api/window";

export default function Header() {
  const appWindow = getCurrentWindow();

  return (
    <header
      data-tauri-drag-region
      className="flex w-full justify-between py-3 pl-10 pr-4 border-b-1 border-gray-800 solid select-none"
    >
      <div className="flex">
        <img
          src="./icon.svg "
          alt="logo"
          className="mr-3 w-[20px] aspect-auto"
        />
        <h3>MetaSlove</h3>
      </div>
      <div className="flex items-center justify-around">
        <button
          className="mr-4 hover:text-red-400 transition duration-300 ease-in-out cursor-pointer"
          onClick={() => appWindow.minimize()}
        >
          <Minus size={16} />
        </button>
        <button
          className="mr-4 hover:text-red-400 transition duration-300 ease-in-out cursor-pointer"
          onClick={() => appWindow.toggleMaximize()}
        >
          <Square size={15} />
        </button>
        <button onClick={() => appWindow.close}>
          <X
            size={16}
            className=" hover:text-red-400 transition duration-300 ease-in-out cursor-pointer"
          />
        </button>
      </div>
    </header>
  );
}
