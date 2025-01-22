"use client";

import { useState } from "react";
import { NBATeam, TeamWinsMap } from "./types/nba";
import { SortIcon } from "./svg_icon";
import { SortDirection, SortType } from "./types/sort";
import { NBATeamTableRow } from "./nba_table_row";

const { Asc, Desc } = SortDirection;
const { Name, CurrentRecord, EstimatedRecord } = SortType;

export function ConferenceTable({
  nbaTeams,
  estimatedWins,
  setEstimatedWins,
}: {
  nbaTeams: NBATeam[];
  estimatedWins: TeamWinsMap;
  setEstimatedWins: (estimatedWins: TeamWinsMap) => void;
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
    <div className="relative overflow-auto rounded-lg">
      <table>
        <thead className="text-xs bg-gray-800 text-gray-200">
          <tr>
            <th
              scope="col"
              className="px-6 py-2 hover:bg-gray-700"
              onClick={() => handleClickTableHeader(Name)}
            >
              <p className="inline-block">Team</p>
              <SortIcon
                sortDirection={sortDirection}
                renderCondition={sortType === Name}
              />
            </th>
            <th
              scope="col"
              className="px-6 py-2 hover:bg-gray-700"
              onClick={() => handleClickTableHeader(CurrentRecord)}
            >
              <p className="inline-block">Current Record</p>
              <SortIcon
                sortDirection={sortDirection}
                renderCondition={sortType === CurrentRecord}
              />
            </th>
            <th
              scope="col"
              className="px-6 py-2 hover:bg-gray-700"
              onClick={() => handleClickTableHeader(EstimatedRecord)}
            >
              <p className="inline-block">Estimated Record</p>
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
              setEstimatedWins={(estimatedWin) => {
                setEstimatedWins({
                  ...estimatedWins,
                  [nbaTeam.basketball_reference_team_shortcode]: estimatedWin,
                });
              }}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
