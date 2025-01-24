import { SVGProps } from "react";
import { SvgIds } from "../types/svg";
import { SortDirection } from "../types/sort";

export function SVGIcon({
  id,
  ...props
}: { id: SvgIds } & SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" {...props}>
      <use href={`sprite.svg#${id}`} />
    </svg>
  );
}

interface SortIconProps {
  sortDirection: SortDirection;
  renderCondition: boolean;
}
export function SortIcon({ sortDirection, renderCondition }: SortIconProps) {
  return (
    <SVGIcon
      id={sortDirection === SortDirection.Asc ? "chevron-down" : "chevron-up"}
      className={`ml-1 mb-1 inline-block ${
        renderCondition ? "visible" : "invisible"
      }`}
      height={16}
      width={16}
      strokeWidth="1.5"
      fill="none"
      stroke="currentColor"
    />
  );
}
