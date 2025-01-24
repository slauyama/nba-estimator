"use client";

import { Conference, NBATeam } from "./types/nba";
import { useLocalStorage } from "./hooks/use_local_storage";
import { ConferenceTable } from "./conference_table";
import { useEffect, useReducer } from "react";
import {
  getCurrentWinsMap,
  getValidationMessage,
  reducer,
  State,
} from "./reducer";
import { Dialog, useDialogControl } from "./components/dialog";
import { Button } from "./components/button";

export function NBATeamsTable({ nbaTeams }: { nbaTeams: NBATeam[] }) {
  const [localStorage, setLocalStorage] = useLocalStorage<State>("store");
  const { isOpen, open, close } = useDialogControl();

  const [state, dispatch] = useReducer(reducer, {
    estimatedWins: getCurrentWinsMap(nbaTeams),
    lastUpdate: {},
  });

  useEffect(() => {
    if (localStorage !== undefined) {
      dispatch({
        type: "LOAD_FROM_LOCAL_STORAGE",
        state: {
          estimatedWins: localStorage.estimatedWins,
          lastUpdate: localStorage?.lastUpdate ?? {},
        },
      });
    }
  }, [localStorage]);
  const { estimatedWins } = state;

  function saveToLocalStorage() {
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

  function handleClickSave() {
    if (localStorage !== undefined) {
      return open();
    }
    saveToLocalStorage();
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
        <Button
          disabled={
            !!getValidationMessage(state, nbaTeams, localStorage?.estimatedWins)
          }
          onClick={handleClickSave}
          variant="primary"
        >
          Save
        </Button>
        <p className="self-center font-semibold">
          {getValidationMessage(state, nbaTeams, localStorage?.estimatedWins)}
        </p>
      </section>
      <Dialog isOpen={isOpen} onClose={close}>
        <>
          <div className="bg-gray-800/90 p-6">
            <h3 className="text-lg font-bold text-white" id="modal-title">
              Update Standings
            </h3>
            <p className="mt-2 text-sm">
              Are you sure you want to update your standings? Updating will
              lower your max score and this action cannot be undone.
            </p>
          </div>
          <div className="bg-gray-800 p-4 flex gap-3 flex-row-reverse">
            <Button
              variant="primary"
              onClick={() => {
                saveToLocalStorage();
                close();
              }}
            >
              Confirm
            </Button>
            <Button onClick={close}>Cancel</Button>
          </div>
        </>
      </Dialog>
    </div>
  );
}
