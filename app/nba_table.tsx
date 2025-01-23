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
import { useReducer } from "react";
import {
  getCurrentWinsMap,
  getValidationMessage,
  reducer,
  State,
} from "./reducer";

const { Asc, Desc } = SortDirection;
const { Name, CurrentRecord, EstimatedRecord } = SortType;

export function NBATeamsTable({ nbaTeams }: { nbaTeams: NBATeam[] }) {
  const [localStorage, setLocalStorage] = useLocalStorage<State>("store");

  const [state, dispatch] = useReducer(reducer, null, () => {
    if (localStorage !== undefined) {
      return {
        estimatedWins: localStorage.estimatedWins,
        lastUpdate: localStorage?.lastUpdate ?? {},
      };
    }

    return {
      estimatedWins: getCurrentWinsMap(nbaTeams),
      lastUpdate: {},
    };
  });
  const { estimatedWins } = state;

  function handleClickSave() {
    const totalCurrentWins = nbaTeams.reduce(
      (acc, nbaTeam) => acc + nbaTeam.wins,
      0
    );

    dispatch({
      type: "CLICK_SAVE",
      currentWins: totalCurrentWins,
      saveToLocalStorage: setLocalStorage,
    });
  }
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
          setEstimatedWinForTeam={(teamShortcode, wins) =>
            dispatch({
              type: "CHANGE_ESTIMATED_WINS_FOR_TEAM",
              teamShortcode,
              wins,
            })
          }
        />
        <ConferenceTable
          nbaTeams={nbaTeams.filter(
            (nbaTeam) => nbaTeam.conference === Conference.Western
          )}
          estimatedWins={estimatedWins}
          setEstimatedWinForTeam={(teamShortcode, wins) =>
            dispatch({
              type: "CHANGE_ESTIMATED_WINS_FOR_TEAM",
              teamShortcode,
              wins,
            })
          }
        />
      </div>

      <section className="mt-4 flex gap-4">
        <button
          type="button"
          className="inline-flex rounded-md bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-slate-500 "
          disabled={!!getValidationMessage(state, nbaTeams)}
          onClick={handleClickSave}
        >
          Save
        </button>

        <p className="self-center font-semibold">
          {getValidationMessage(state, nbaTeams)}
        </p>
      </section>
    </div>
  );
}
