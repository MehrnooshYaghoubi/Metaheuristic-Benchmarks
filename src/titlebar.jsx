import { Minus, Square, X } from "lucide-react";
import { getCurrentWindow } from "@tauri-apps/api/window";

/**
 * Custom window chrome. Outside a Tauri shell (e.g. `npm run dev` in a plain
 * browser) there is no window to drive, so the controls are hidden rather than
 * rendered as dead buttons.
 */
function useTauriWindow() {
  try {
    return getCurrentWindow();
  } catch {
    return null;
  }
}

export default function Header() {
  const appWindow = useTauriWindow();

  const controls = appWindow && [
    { icon: Minus, label: "Minimise", onClick: () => appWindow.minimize() },
    { icon: Square, label: "Maximise", onClick: () => appWindow.toggleMaximize() },
    // Previously `() => appWindow.close` — referenced the method without
    // calling it, so the close button did nothing.
    { icon: X, label: "Close", onClick: () => appWindow.close(), danger: true },
  ];

  return (
    <header
      data-tauri-drag-region
      className="flex h-9 shrink-0 items-center justify-between border-b border-line bg-base pr-1 pl-4 select-none"
    >
      <div className="pointer-events-none flex items-center gap-2">
        <img src="./icon.svg" alt="" className="size-[14px]" />
        <span className="text-xs font-medium tracking-tight text-ink-muted">
          MetaSlove
        </span>
      </div>

      {controls && (
        <div className="flex items-center">
          {controls.map(({ icon: Icon, label, onClick, danger }) => (
            <button
              key={label}
              onClick={onClick}
              aria-label={label}
              className={`flex h-9 w-11 cursor-pointer items-center justify-center text-ink-muted transition-colors ${
                danger ? "hover:bg-bad hover:text-white" : "hover:bg-surface-2 hover:text-ink"
              }`}
            >
              <Icon size={14} />
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
