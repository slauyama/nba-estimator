"use client";

import { useEffect, useState } from "react";
import { NBATeam } from "./types";
import {
  GAMES_IN_SEASON,
  MAX_CONFERENCE_WINS,
  MIN_CONFERENCE_WINS,
  TOTAL_GAMES,
} from "./constants";
import { SortDirection, SortIcon, SVGIcon } from "./svg_icon";
import { useLocalStorage } from "./hooks/use_local_storage";
import { pluralize } from "./helper/pluralize";
import { error } from "console";

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
  function cleanNumber(number: number) {
    return number.toString();
  }

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
      <td className="px-4 py-2 flex gap-2 justify-center">
        <input
          type="number"
          className="rounded max-w-[35px] [appearance:textfield] border-x-0  text-center  text-sm  block bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-900 focus:border-blue-900 out-of-range:text-red-800  out-of-range:bg-red-300"
          placeholder="0"
          value={cleanNumber(estimatedWins)}
          onChange={(event) => {
            setEstimatedWins(
              Math.max(0, Math.min(Number(event.target.value), 82))
            );
          }}
          max={GAMES_IN_SEASON - team.losses}
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
            <td className="px-4 py-2 text-center font-bold">
              Total: {totalWins} - {totalLosses}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

interface SaveSectionProps {
  estimatedWins: Record<string, number>;
  nbaTeams: NBATeam[];
}
function SaveSection({ estimatedWins, nbaTeams }: SaveSectionProps) {
  const [updateTime, setUpdateTime] = useLocalStorage<string>(
    "update_time",
    ""
  );

  const totalEstimateWins = Object.values(estimatedWins).reduce(
    (acc, win) => acc + win,
    0
  );
  const totalGamesDifference = Math.abs(TOTAL_GAMES - totalEstimateWins);

  const easternEstimatedWins = nbaTeams.reduce(
    (acc, nbaTeam) =>
      nbaTeam.conference === "eastern"
        ? acc + estimatedWins[nbaTeam.name]
        : acc,
    0
  );

  const westernEstimatedWins = nbaTeams.reduce(
    (acc, nbaTeam) =>
      nbaTeam.conference === "western"
        ? acc + estimatedWins[nbaTeam.name]
        : acc,
    0
  );

  function getErrorMessage() {
    if (totalEstimateWins !== TOTAL_GAMES) {
      return `NBA standings are invalid. ${
        totalEstimateWins < TOTAL_GAMES ? "Add" : "Remove"
      } ${pluralize(totalGamesDifference, "win")}`;
    } else if (easternEstimatedWins > MAX_CONFERENCE_WINS) {
      return `Eastern Conference standings are invalid. Remove ${pluralize(
        easternEstimatedWins - MAX_CONFERENCE_WINS,
        "win"
      )}.`;
    } else if (easternEstimatedWins < MIN_CONFERENCE_WINS) {
      return `Eastern Conference standings are invalid. Add ${pluralize(
        MIN_CONFERENCE_WINS - easternEstimatedWins,
        "win"
      )}.`;
    } else if (westernEstimatedWins > MAX_CONFERENCE_WINS) {
      return `Eastern Conference standings are invalid. Remove ${pluralize(
        westernEstimatedWins - MAX_CONFERENCE_WINS,
        "win"
      )}.`;
    } else if (westernEstimatedWins < MIN_CONFERENCE_WINS) {
      return `Eastern Conference standings are invalid. Add ${pluralize(
        MIN_CONFERENCE_WINS - westernEstimatedWins,
        "win"
      )}.`;
    } else {
      return null;
    }
  }

  const errrorMessage = getErrorMessage();

  function handleClick() {
    // TODO
  }

  return (
    <section className="mt-4 flex justify-between">
      <p className="self-center font-semibold">
        {errrorMessage ?? "NBA standings are valid"}
      </p>
      <button
        type="button"
        className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-slate-500 "
        disabled={errrorMessage !== null}
        onClick={handleClick}
      >
        Save
      </button>
    </section>
  );
}

export function NBATeamsTable({ nbaTeams }: { nbaTeams: NBATeam[] }) {
  function useCurrentWinsAsDefault(): Record<string, number> {
    return nbaTeams.reduce((acc: Record<string, number>, nbaTeam) => {
      acc[nbaTeam.name] = nbaTeam.wins;
      return acc;
    }, {});
  }
  const [estimatedWins, setEstimatedWins] = useLocalStorage<
    Record<string, number>
  >("estimates", useCurrentWinsAsDefault());

  if (Object.keys(estimatedWins).length === 0) {
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

      <SaveSection estimatedWins={estimatedWins} nbaTeams={nbaTeams} />
    </div>
  );
}
