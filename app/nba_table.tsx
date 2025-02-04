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
import { TOTAL_GAMES } from "./constants";

interface ScoringSectionProps {
  lastUpdateWins?: number;
  currentCorrectWins: number;
  currentWins: number;
}
function ScoringSection({
  lastUpdateWins,
  currentCorrectWins,
  currentWins,
}: ScoringSectionProps) {
  const { isOpen, open, close } = useDialogControl();

  if (lastUpdateWins === undefined) {
    return null;
  }

  const currentScore = currentCorrectWins - lastUpdateWins;
  const maxScore = TOTAL_GAMES - lastUpdateWins;
  const maxScorePercentage = (maxScore / TOTAL_GAMES) * 100;
  const currentScorePercentage = (currentScore / TOTAL_GAMES) * 100;

  const percentageComplete = (currentWins / TOTAL_GAMES) * 100;

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex gap-4">
          <div
            className="flex gap-2 cursor-pointer hover:underline"
            onClick={open}
          >
            <div className="h-4 w-4 sm:h-5 sm:w-5 rounded-sm bg-gray-500" />
            <p className="text-xs sm:text-sm">Current Score: {currentScore}</p>
          </div>
          <div
            className="flex gap-2 cursor-pointer hover:underline"
            onClick={open}
          >
            <div className="h-4 w-4 sm:h-5 sm:w-5 rounded-sm bg-gray-700" />
            <p className="text-xs sm:text-sm">Your Max Score: {maxScore}</p>
          </div>
        </div>
        <div className="w-full rounded-full h-2 bg-[repeating-linear-gradient(45deg,#374151_0px,#374151_7px,#111827_7px,#111827_14px)]">
          <div
            className="bg-gray-700 rounded-full h-2"
            style={{ width: `${maxScorePercentage}%` }}
          >
            <div
              className="bg-gray-500 rounded-full h-2"
              style={{ width: `${currentScorePercentage}%` }}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-xs sm:text-sm">
          {percentageComplete === 100
            ? "Season Complete!"
            : `The season is ${percentageComplete.toPrecision(
                2
              )}% complete.`}{" "}
        </p>
        <div className="w-full rounded-full h-2 bg-gray-700">
          <div
            className="bg-gray-500 rounded-full h-2"
            style={{ width: `${percentageComplete}%` }}
          />
        </div>
      </div>
      <Dialog isOpen={isOpen} onClose={close}>
        <div className="bg-gray-800 p-6 flex-col flex gap-2">
          <p className="text-sm">
            <span className="font-bold">Your Current Score</span> is the number
            of wins you have predicted excluding all games that have been
            completed before your standing was submitted / updated.
          </p>
          <p className="text-sm">
            <span className="font-bold">Your Max Score</span> is the number of
            games remaining when your standing was submitted / updated.
          </p>
          <p className="text-sm">
            For example if you submitted your standing before the season
            started, your max score would be 1320 (total number of NBA games)
            and your current score would the sum of every win that you estimated
            correctly. If you submitted it after 120 games have been played your
            max score would be 1200 and your current score would be all correct
            estimated This is to incentivize earlier estimates over newer ones.
          </p>
          <div className="text-right">
            <Button onClick={close}>Close</Button>
          </div>
        </div>
      </Dialog>
    </section>
  );
}

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
    <div className="flex flex-col gap-8">
      <div className="flex flex-col lg:flex-row gap-2">
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
      <section className="flex gap-4">
        <Button
          disabled={
            !!getValidationMessage(state, nbaTeams, localStorage?.estimatedWins)
          }
          onClick={handleClickSave}
          variant="primary"
        >
          Save
        </Button>
        <p className="text-sm sm:text-base self-center font-normal sm:font-semibold">
          {getValidationMessage(state, nbaTeams, localStorage?.estimatedWins)}
        </p>
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
      </section>
      <ScoringSection
        lastUpdateWins={localStorage?.lastUpdate?.wins}
        currentCorrectWins={nbaTeams.reduce(
          (acc, nbaTeam) =>
            acc +
            Math.min(
              nbaTeam.wins,
              estimatedWins[nbaTeam.basketball_reference_team_shortcode]
            ),
          0
        )}
        currentWins={nbaTeams.reduce((acc, team) => acc + team.wins, 0)}
      />
    </div>
  );
}
