"use client";

import { Conference, NBATeam, TeamWinsMap } from "./types/nba";
import {
  MAX_CONFERENCE_WINS,
  MIN_CONFERENCE_WINS,
  TOTAL_GAMES,
} from "./constants";
import { useLocalStorage } from "./hooks/use_local_storage";
import { pluralize } from "./helper/pluralize";
import { SortDirection, SortType } from "./types/sort";
import { ConferenceTable } from "./conference_table";

const { Asc, Desc } = SortDirection;
const { Name, CurrentRecord, EstimatedRecord } = SortType;

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
      return `Western Conference standings are invalid. Remove ${pluralize(
        westernEstimatedWins - MAX_CONFERENCE_WINS,
        "win"
      )}.`;
    } else if (westernEstimatedWins < MIN_CONFERENCE_WINS) {
      return `Western Conference standings are invalid. Add ${pluralize(
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

export function NBATeamsTable({ nbaTeams }: { nbaTeams: NBATeam[] }) {
  function useCurrentWinsAsDefault(): TeamWinsMap {
    return nbaTeams.reduce((acc: Partial<TeamWinsMap>, nbaTeam) => {
      acc[nbaTeam.basketball_reference_team_shortcode] = nbaTeam.wins;
      return acc;
    }, {}) as TeamWinsMap;
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
