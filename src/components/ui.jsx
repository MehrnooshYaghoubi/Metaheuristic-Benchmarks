import { forwardRef } from "react";
import { NavLink } from "react-router";
import { ArrowLeft } from "lucide-react";
import Header from "../titlebar";

/* ---------------------------------------------------------------------------
   Shared UI primitives.

   Every page is built from these, so spacing, borders and type stay consistent
   and a change here propagates everywhere. Pages should not hand-roll inputs
   or buttons.
--------------------------------------------------------------------------- */

const cx = (...parts) => parts.filter(Boolean).join(" ");

/* --- Page shell ---------------------------------------------------------- */

/**
 * The frame every route sits in: fixed titlebar, optional page header, and a
 * single scroll container for the body. Nothing above the body scrolls, so the
 * window can be resized to any height without the controls escaping the view.
 */
export function PageShell({
  title,
  subtitle,
  back = "/",
  actions,
  /** `fill` hands height management to the page (used by full-height tables). */
  fill = false,
  children,
}) {
  return (
    <div className="flex h-full flex-col bg-base">
      <Header />
      <div className="flex min-h-0 flex-1 flex-col">
        {title && (
          <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2 border-b border-line px-6 py-4">
            <NavLink
              to={back}
              className="flex size-7 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink"
              aria-label="Back"
            >
              <ArrowLeft size={16} />
            </NavLink>
            <div className="min-w-0">
              <h1 className="truncate text-[15px] font-semibold tracking-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="truncate text-xs text-ink-muted">{subtitle}</p>
              )}
            </div>
            {actions && (
              <div className="ml-auto flex items-center gap-2">{actions}</div>
            )}
          </div>
        )}
        <div
          className={cx(
            "min-h-0 flex-1",
            fill ? "overflow-hidden" : "overflow-auto"
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

/* --- Surfaces ------------------------------------------------------------ */

export function Card({ title, description, actions, className, children }) {
  return (
    <section
      className={cx(
        "rounded-[12px] border border-line bg-surface",
        className
      )}
    >
      {(title || actions) && (
        <div className="flex items-center gap-3 border-b border-line px-5 py-3">
          <div className="min-w-0">
            {title && (
              <h2 className="text-[13px] font-semibold tracking-tight">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-0.5 text-xs text-ink-muted">{description}</p>
            )}
          </div>
          {actions && <div className="ml-auto flex gap-2">{actions}</div>}
        </div>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

/** A labelled readout for a single number. */
export function Stat({ label, value, hint, tone = "default" }) {
  return (
    <div className="rounded-lg border border-line bg-surface-2 px-4 py-3">
      <div className="text-[11px] tracking-wide text-ink-muted uppercase">
        {label}
      </div>
      <div
        className={cx(
          "mt-1 font-mono text-[15px] break-all",
          tone === "accent" && "text-accent",
          tone === "good" && "text-good"
        )}
      >
        {value ?? <span className="text-ink-faint">—</span>}
      </div>
      {hint && <div className="mt-1 text-[11px] text-ink-faint">{hint}</div>}
    </div>
  );
}

/** Centred placeholder for panels that have no data yet. */
export function Empty({ icon: Icon, title, hint }) {
  return (
    <div className="flex h-full min-h-[180px] flex-col items-center justify-center gap-2 px-6 text-center">
      {Icon && <Icon size={22} className="text-ink-faint" />}
      <p className="text-[13px] text-ink-muted">{title}</p>
      {hint && <p className="max-w-xs text-xs text-ink-faint">{hint}</p>}
    </div>
  );
}

/* --- Controls ------------------------------------------------------------ */

const controlBase =
  "w-full rounded-lg border border-line bg-surface-2 px-3 py-2 text-[13px] text-ink " +
  "transition-colors placeholder:text-ink-faint hover:border-line-strong " +
  "focus:border-accent focus:outline-none " +
  "disabled:cursor-not-allowed disabled:text-ink-faint disabled:opacity-60";

/**
 * A labelled form control. `options` switches it to a <select>.
 *
 * The label sits above the control and is allowed to wrap onto two lines,
 * with a reserved min-height so controls in the same grid row stay aligned
 * whether or not their label wraps.
 */
export const Field = forwardRef(function Field(
  {
    label,
    hint,
    options,
    type = "text",
    className,
    labelClassName,
    ...rest
  },
  ref
) {
  return (
    <label className={cx("flex flex-col gap-1.5", className)}>
      <span
        className={cx(
          "text-[11px] leading-tight font-medium text-ink-muted",
          labelClassName
        )}
      >
        {label}
      </span>
      {options ? (
        <select ref={ref} className={cx(controlBase, "cursor-pointer")} {...rest}>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <input ref={ref} type={type} className={controlBase} {...rest} />
      )}
      {hint && <span className="text-[11px] text-ink-faint">{hint}</span>}
    </label>
  );
});

export function Checkbox({ label, ...rest }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-[13px] text-ink-muted select-none hover:text-ink">
      <input
        type="checkbox"
        className="size-3.5 accent-[color:var(--color-accent)]"
        {...rest}
      />
      {label}
    </label>
  );
}

const buttonVariants = {
  primary:
    "bg-accent text-white hover:bg-accent-hover disabled:bg-accent/40 disabled:text-white/60",
  secondary:
    "border border-line bg-surface-2 text-ink hover:border-line-strong hover:bg-surface disabled:text-ink-faint",
  ghost: "text-ink-muted hover:bg-surface-2 hover:text-ink",
};

export function Button({
  variant = "secondary",
  size = "md",
  className,
  children,
  ...rest
}) {
  return (
    <button
      className={cx(
        "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg font-medium",
        "transition-colors disabled:cursor-not-allowed",
        size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-[13px]",
        buttonVariants[variant],
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

/** Segmented control — a compact alternative to a row of tabs or links. */
export function SegmentedNav({ items }) {
  return (
    <nav className="flex gap-0.5 rounded-lg border border-line bg-surface p-0.5">
      {items.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          end
          className={({ isActive }) =>
            cx(
              "rounded-[6px] px-3 py-1.5 text-xs font-medium transition-colors",
              isActive
                ? "bg-accent-soft text-accent"
                : "text-ink-muted hover:bg-surface-2 hover:text-ink"
            )
          }
        >
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

/** Groups related fields inside a parameter panel. */
export function FieldGroup({ title, children, className }) {
  return (
    <fieldset className={className}>
      <legend className="mb-3 w-full border-b border-line pb-2 text-[11px] font-semibold tracking-wide text-ink-faint uppercase">
        {title}
      </legend>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-x-4 gap-y-4">
        {children}
      </div>
    </fieldset>
  );
}
