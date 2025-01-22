"use client";

import { useState } from "react";
import {
  BasketballReferenceTeamShortCode,
  Conference,
  NBATeam,
} from "./types/nba";
import {
  MAX_CONFERENCE_WINS,
  MIN_CONFERENCE_WINS,
  TOTAL_GAMES,
} from "./constants";
import { SortIcon } from "./svg_icon";
import { useLocalStorage } from "./hooks/use_local_storage";
import { pluralize } from "./helper/pluralize";
import { SortDirection, SortType } from "./types/sort";
import { NBATeamTableRow } from "./nba_table_row";

const { Asc, Desc } = SortDirection;
const { Name, CurrentRecord, EstimatedRecord } = SortType;

function ConferenceTable({
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
      nbaTeam.conference === Conference.Eastern
        ? acc + estimatedWins[nbaTeam.name]
        : acc,
    0
  );

  const westernEstimatedWins = nbaTeams.reduce(
    (acc, nbaTeam) =>
      nbaTeam.conference === Conference.Western
        ? acc + estimatedWins[nbaTeam.name]
        : acc,
    0
  );

  function getMessage() {
    // Check current estimates wins with saved estimated wins
    if (JSON.stringify(estimatedWins) === JSON.stringify({})) {
      const lastUpdateTime = `${new Date(
        updateTime
      ).toLocaleDateString()} ${new Date(updateTime).toLocaleTimeString()}`;

      return `NBA standings are saved. Last Updated: ${lastUpdateTime}`;
    } else if (totalEstimateWins !== TOTAL_GAMES) {
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

  const errrorMessage = getMessage();

  function handleClick() {
    setUpdateTime(new Date().toISOString());
  }

  return (
    <section className="mt-4 flex gap-4">
      <button
        type="button"
        className="inline-flex rounded-md bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-slate-500 "
        disabled={errrorMessage !== null}
        onClick={handleClick}
      >
        Save
      </button>
      <p className="self-center font-semibold">{errrorMessage}</p>
    </section>
  );
}

type TeamWinsMap = Record<BasketballReferenceTeamShortCode, number>;

export function NBATeamsTable({ nbaTeams }: { nbaTeams: NBATeam[] }) {
  function useCurrentWinsAsDefault(): Partial<TeamWinsMap> {
    return nbaTeams.reduce((acc: Partial<TeamWinsMap>, nbaTeam) => {
      acc[nbaTeam.basketball_reference_team_shortcode] = nbaTeam.wins;
      return acc;
    }, {});
  }
  const [estimatedWins, setEstimatedWins] = useLocalStorage<TeamWinsMap>(
    "estimates",
    useCurrentWinsAsDefault() as TeamWinsMap
  );

  if (Object.keys(estimatedWins).length === 0) {
    return null;
  }
  return (
    <div className="flex-col">
      <div className="overflow-auto flex gap-2">
        <ConferenceTable
          nbaTeams={nbaTeams.filter(
            (nbaTeam) => nbaTeam.conference === Conference.Eastern
          )}
          estimatedWins={estimatedWins}
          setEstimatedWins={setEstimatedWins}
        />
        <ConferenceTable
          nbaTeams={nbaTeams.filter(
            (nbaTeam) => nbaTeam.conference === Conference.Western
          )}
          estimatedWins={estimatedWins}
          setEstimatedWins={setEstimatedWins}
        />
      </div>

      <SaveSection estimatedWins={estimatedWins} nbaTeams={nbaTeams} />
    </div>
  );
}
