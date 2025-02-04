"use client";

import { BasketballReferenceTeamShortCode, NBATeam } from "./types/nba";
import { GAMES_IN_SEASON } from "./constants";
import { SVGIcon } from "./components/svg_icon";

function cleanNumber(number: number) {
  return number?.toString();
}

interface NBATeamTableRowProps {
  team: NBATeam;
  estimatedWins: number;
  setEstimatedWinForTeam: (
    teamShortcode: BasketballReferenceTeamShortCode,
    wins: number
  ) => void;
}
export function NBATeamTableRow({
  team,
  estimatedWins,
  setEstimatedWinForTeam,
}: NBATeamTableRowProps) {
  return (
    <tr className="text-xs sm:text-sm border-b border-gray-800 bg-gray-900 hover:bg-gray-800 last-of-type:border-none">
      <th
        scope="row"
        className="p-1 sm:px-4 sm:py-2 font- font-normal whitespace-nowrap text-white"
      >
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href={`https://www.basketball-reference.com/teams/${team.basketball_reference_team_shortcode}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <SVGIcon
            id={team.basketball_reference_team_shortcode}
            height={20}
            width={20}
          />
          {team.name}
        </a>
      </th>
      <td className="p-1 sm:px-4 sm:py-2 text-center">
        {team.wins} - {team.losses}
      </td>
      <td className="p-1 sm:px-4 sm:py-2 flex gap-2 justify-center">
        <input
          type="number"
          className="rounded max-w-[35px] text-xs sm:text-sm [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [appearance:textfield]  border-x-0 text-center block bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-900 focus:border-blue-900 out-of-range:text-red-800  out-of-range:bg-red-300"
          placeholder="0"
          value={cleanNumber(estimatedWins)}
          onChange={(event) =>
            setEstimatedWinForTeam(
              team.basketball_reference_team_shortcode,
              Number(event.target.value)
            )
          }
          max={GAMES_IN_SEASON - team.losses}
          min={team.wins}
        />{" "}
        <span> - {GAMES_IN_SEASON - estimatedWins}</span>
      </td>
    </tr>
  );
}
