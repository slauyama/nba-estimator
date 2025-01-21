"use client";

import { useEffect, useState } from "react";
import { NBATeam } from "./types";
import { GAMES_IN_SEASON, TOTAL_GAMES } from "./constants";
import { SortDirection, SortIcon, SVGIcon } from "./svg_icon";

interface NBATeamTableRowProps {
  team: NBATeam;
  estimatedWins: number;
  setEstimatedWins: (wins: number) => void;
}
function NBATeamTableRow({
  team,
  estimatedWins,
  setEstimatedWins,
}: NBATeamTableRowProps) {
  return (
    <tr className="text-sm border-b border-gray-800 bg-gray-900 hover:bg-gray-800">
      <th
        scope="row"
        className="px-4 py-2 font-normal whitespace-nowrap text-white"
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
      <td className="px-4 py-2 text-center">
        {team.wins} - {team.losses}
      </td>
      <td className="px-4 py-2 flex-1 gap-2 justify-center">
        <input
          type="number"
          className="rounded max-w-[35px] [appearance:textfield] border-x-0  text-center  text-sm  block bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-900 focus:border-blue-900"
          placeholder="0"
          value={estimatedWins}
          onChange={(event) => {
            setEstimatedWins(Number(event.target.value));
          }}
          max={GAMES_IN_SEASON}
          min={team.wins}
        />{" "}
        <span> - {GAMES_IN_SEASON - estimatedWins}</span>
      </td>
    </tr>
  );
}

type SortType = "NAME" | "CURRENT_RECORD" | "ESTIMATED_RECORD";

function ConferenceTable({
  nbaTeams,
  estimatedWins,
  setEstimatedWins,
}: {
  nbaTeams: NBATeam[];
  estimatedWins: Record<string, number>;
  setEstimatedWins: (estimatedWins: Record<string, number>) => void;
}) {
  const [sortType, setSortType] = useState<SortType>("ESTIMATED_RECORD");
  const [sortDirection, setSortDirection] = useState<SortDirection>("DESC");

  nbaTeams.sort((a, b) => {
    let difference;
    if (sortType === "CURRENT_RECORD") {
      difference = a.wins - b.wins;
    } else if (sortType === "ESTIMATED_RECORD") {
      difference = estimatedWins[a.name] - estimatedWins[b.name];
    } else {
      if (a.name === b.name) {
        difference = 0;
      } else if (a.name > b.name) {
        difference = 1;
      } else {
        difference = -1;
      }
    }
    return sortDirection === "ASC" ? difference : -difference;
  });

  function sortTable(sortTypeClicked: SortType) {
    if (sortTypeClicked === sortType) {
      setSortDirection(sortDirection === "ASC" ? "DESC" : "ASC");
    } else {
      setSortType(sortTypeClicked);
      setSortDirection(sortTypeClicked === "NAME" ? "ASC" : "DESC");
    }
  }
  const [totalWins, totalLosses] = nbaTeams.reduce(
    (acc, nbaTeam) => {
      const [wins, losses] = acc;
      return [
        wins + estimatedWins[nbaTeam.name],
        losses + (82 - estimatedWins[nbaTeam.name]),
      ];
    },
    [0, 0]
  );

  return (
    <div className="relative overflow-auto rounded-lg">
      <table>
        <thead className="text-xs bg-gray-800 text-gray-200">
          <tr>
            <th
              scope="col"
              className="px-6 py-2 hover:bg-gray-700"
              onClick={() => sortTable("NAME")}
            >
              <p className="inline-block">Team</p>
              <SortIcon
                sortDirection={sortDirection}
                renderCondition={sortType === "NAME"}
              />
            </th>
            <th
              scope="col"
              className="px-6 py-2 hover:bg-gray-700"
              onClick={() => sortTable("CURRENT_RECORD")}
            >
              <p className="inline-block">Current Record</p>
              <SortIcon
                sortDirection={sortDirection}
                renderCondition={sortType === "CURRENT_RECORD"}
              />
            </th>
            <th
              scope="col"
              className="px-6 py-2 hover:bg-gray-700"
              onClick={() => sortTable("ESTIMATED_RECORD")}
            >
              <p className="inline-block">Estimated Record</p>
              <SortIcon
                sortDirection={sortDirection}
                renderCondition={sortType === "ESTIMATED_RECORD"}
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {nbaTeams.map((nbaTeam) => (
            <NBATeamTableRow
              key={nbaTeam.name}
              team={nbaTeam}
              estimatedWins={estimatedWins[nbaTeam.name]}
              setEstimatedWins={(estimatedWin) => {
                setEstimatedWins({
                  ...estimatedWins,
                  [nbaTeam.name]: estimatedWin,
                });
              }}
            />
          ))}
          <tr className="text-sm border-b last-of-type:border-none border-gray-800 bg-gray-900 hover:bg-gray-800">
            <td />
            <td />
            <td className="px-4 py-2">
              {totalWins} - {totalLosses}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function NBATeamsTable({ nbaTeams }: { nbaTeams: NBATeam[] }) {
  const [estimatedWins, setEstimatedWins] = useState<Record<string, number>>(
    {}
  );
  useEffect(() => {
    function useCurrentWinsAsDefault(): Record<string, number> {
      return nbaTeams.reduce((acc: Record<string, number>, nbaTeam) => {
        acc[nbaTeam.name] = nbaTeam.wins;
        return acc;
      }, {});
    }

    const wins = window.localStorage.getItem("wins");
    if (wins === null) {
      return setEstimatedWins(useCurrentWinsAsDefault());
    }
    try {
      return setEstimatedWins(JSON.parse(wins));
    } catch (error) {
      return setEstimatedWins(useCurrentWinsAsDefault());
    }
  }, []);

  useEffect(() => {
    if (Object.keys(estimatedWins).length > 0) {
      window.localStorage.setItem("wins", JSON.stringify(estimatedWins));
      window.localStorage.setItem(
        "local_update_time",
        new Date().toISOString()
      );
    }
  }, [JSON.stringify(estimatedWins)]);

  const totalEstimateWins = Object.values(estimatedWins).reduce(
    (acc, win) => acc + win,
    0
  );
  if (JSON.stringify(estimatedWins) === "{}") {
    return null;
  }
  return (
    <div className="flex-col">
      <div className="relative overflow-auto flex gap-2">
        <ConferenceTable
          nbaTeams={nbaTeams.filter(
            (nbaTeam) => nbaTeam.conference === "eastern"
          )}
          estimatedWins={estimatedWins}
          setEstimatedWins={setEstimatedWins}
        />
        <ConferenceTable
          nbaTeams={nbaTeams.filter(
            (nbaTeam) => nbaTeam.conference === "western"
          )}
          estimatedWins={estimatedWins}
          setEstimatedWins={setEstimatedWins}
        />
      </div>
      <div className="mt-4">
        {totalEstimateWins !== TOTAL_GAMES && (
          <p className="self-center font-semibold">
            Your NBA Standings are invalid. Please{" "}
            {totalEstimateWins < TOTAL_GAMES ? "add" : "remove"}{" "}
            {Math.abs(TOTAL_GAMES - totalEstimateWins)}{" "}
            {Math.abs(TOTAL_GAMES - totalEstimateWins) === 1 ? "win" : "wins"}.
          </p>
        )}
      </div>
    </div>
  );
}
