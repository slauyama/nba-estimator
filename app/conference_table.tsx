"use client";

import { useState } from "react";
import {
  BasketballReferenceTeamShortCode,
  NBATeam,
  TeamWinsMap,
} from "./types/nba";
import { SortIcon } from "./components/svg_icon";
import { SortDirection, SortType } from "./types/sort";
import { NBATeamTableRow } from "./nba_table_row";

const { Asc, Desc } = SortDirection;
const { Name, CurrentRecord, EstimatedRecord } = SortType;

export function ConferenceTable({
  nbaTeams,
  estimatedWins,
  setEstimatedWinForTeam,
}: {
  nbaTeams: NBATeam[];
  estimatedWins: TeamWinsMap;
  setEstimatedWinForTeam: (
    teamShortcode: BasketballReferenceTeamShortCode,
    wins: number,
  ) => void;
}) {
  const [sortType, setSortType] = useState<SortType>(CurrentRecord);
  const [sortDirection, setSortDirection] = useState<SortDirection>(Desc);

  nbaTeams.sort((a, b) => {
    let difference;
    if (sortType === CurrentRecord) {
      difference = a.wins - b.wins;
    } else if (sortType === EstimatedRecord) {
      difference =
        estimatedWins[a.basketball_reference_team_shortcode] -
        estimatedWins[b.basketball_reference_team_shortcode];
    } else {
      if (a.name === b.name) {
        difference = 0;
      } else {
        difference = a.name > b.name ? 1 : -1;
      }
    }
    return sortDirection === Asc ? difference : -difference;
  });

  function handleClickTableHeader(sortTypeClicked: SortType) {
    if (sortTypeClicked === sortType) {
      setSortDirection(sortDirection === Asc ? Desc : Asc);
    } else {
      setSortType(sortTypeClicked);
      setSortDirection(sortTypeClicked === Name ? Asc : Desc);
    }
  }

  return (
    <div className="relative overflow-hidden rounded-md">
      <table className="w-full">
        <thead className="text-xs sm:text-sm bg-gray-800 text-gray-200">
          <tr>
            <th
              scope="col"
              className="cursor-pointer p-1 sm:px-6 sm:py-2 hover:bg-gray-700"
              onClick={() => handleClickTableHeader(Name)}
            >
              <p className="inline-block" title="Team Name">
                Team
              </p>
              <SortIcon
                sortDirection={sortDirection}
                renderCondition={sortType === Name}
              />
            </th>
            <th
              scope="col"
              className="cursor-pointer p-1 sm:px-6 sm:py-2 hover:bg-gray-700"
              onClick={() => handleClickTableHeader(CurrentRecord)}
            >
              <p className="inline-block" title="Current Record">
                Current
              </p>
              <SortIcon
                sortDirection={sortDirection}
                renderCondition={sortType === CurrentRecord}
              />
            </th>
            <th
              scope="col"
              className="cursor-pointer p-1 sm:px-6 sm:py-2 hover:bg-gray-700"
              onClick={() => handleClickTableHeader(EstimatedRecord)}
            >
              <p className="inline-block" title="Estimated Record">
                Estimate
              </p>
              <SortIcon
                sortDirection={sortDirection}
                renderCondition={sortType === EstimatedRecord}
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {nbaTeams.map((nbaTeam) => (
            <NBATeamTableRow
              key={nbaTeam.name}
              team={nbaTeam}
              estimatedWins={
                estimatedWins[nbaTeam.basketball_reference_team_shortcode]
              }
              setEstimatedWinForTeam={setEstimatedWinForTeam}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
