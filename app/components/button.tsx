import { MouseEventHandler } from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  variant?: "primary" | "default";
}

export function Button({
  onClick,
  disabled,
  children,
  variant = "default",
}: ButtonProps) {
  const baseStyles =
    "inline-flex rounded-md px-3 py-2 text-sm font-semibold shadow-sm disabled:bg-slate-500 focus-visible:outline-2 focus-visible:outline-offset-2";

  function getVariantStyles() {
    if (variant === "default") {
      return "bg-white hover:bg-gray-50 text-gray-900 focus-visible:outline-white";
    } else if (variant === "primary") {
      return "bg-indigo-600 hover:bg-indigo-500 text-white focus-visible:outline-indigo-600";
    }
  }

  return (
    <button
      type="button"
      className={baseStyles + " " + getVariantStyles()}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
