import { SVGProps } from "react";
import { SvgIds } from "./svg-ids.d";

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

export type SortDirection = "ASC" | "DESC";
interface SortIconProps {
  sortDirection: SortDirection;
  renderCondition: boolean;
}
export function SortIcon({ sortDirection, renderCondition }: SortIconProps) {
  return (
    <SVGIcon
      id={sortDirection === "ASC" ? "chevron-down" : "chevron-up"}
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
