import {
  GAMES_IN_SEASON,
  MAX_CONFERENCE_WINS,
  MIN_CONFERENCE_WINS,
  TOTAL_GAMES,
} from "./constants";
import { pluralize } from "./helper/pluralize";
import {
  BasketballReferenceTeamShortCode,
  Conference,
  NBATeam,
  TeamWinsMap,
} from "./types/nba";

export interface State {
  estimatedWins: TeamWinsMap;
  lastUpdate: Partial<{
    date: string;
    wins: number;
  }>;
}

type ReducerActions =
  | {
      type: "RESET_ESTIMATED_WINS";
      currentWinsMap: TeamWinsMap;
    }
  | {
      type: "CLICK_SAVE";
      currentWins: number;
      saveToLocalStorage: (state: State) => void;
    }
  | {
      type: "CHANGE_ESTIMATED_WINS_FOR_TEAM";
      teamShortcode: BasketballReferenceTeamShortCode;
      wins: number;
    };

export function reducer(state: State, action: ReducerActions): State {
  switch (action.type) {
    case "CLICK_SAVE": {
      const lastUpdate = {
        date: new Date().toISOString(),
        wins: action.currentWins,
      };

      action.saveToLocalStorage({
        estimatedWins: state.estimatedWins,
        lastUpdate,
      });
      return {
        ...state,
        lastUpdate,
      };
    }
    case "CHANGE_ESTIMATED_WINS_FOR_TEAM": {
      const clampedWins = Math.max(Math.min(action.wins, GAMES_IN_SEASON), 0);
      return {
        ...state,
        estimatedWins: {
          ...state.estimatedWins,
          [action.teamShortcode]: clampedWins,
        },
      };
    }
    // Use
    case "RESET_ESTIMATED_WINS": {
      // Should this action reset lastUpdate
      // Should this action reset remove local storage data?
      return {
        ...state,
        estimatedWins: action.currentWinsMap,
      };
    }
  }
}

function getTotalEstimatesWins(estimatedWins: TeamWinsMap) {
  return Object.values(estimatedWins).reduce((acc, win) => acc + win, 0);
}

function getConferenceEstimatedWins(
  nbaTeams: NBATeam[],
  estimatedWins: TeamWinsMap,
  conference: Conference
) {
  return nbaTeams.reduce(
    (acc, nbaTeam) =>
      nbaTeam.conference === conference
        ? acc + estimatedWins[nbaTeam.basketball_reference_team_shortcode]
        : acc,
    0
  );
}

export function getCurrentWinsMap(nbaTeams: NBATeam[]): TeamWinsMap {
  return nbaTeams.reduce((acc: Partial<TeamWinsMap>, nbaTeam) => {
    acc[nbaTeam.basketball_reference_team_shortcode] = nbaTeam.wins;
    return acc;
  }, {}) as TeamWinsMap;
}

export function getValidationMessage(
  { estimatedWins, lastUpdate }: State,
  nbaTeams: NBATeam[]
) {
  const totalEstimateWins = getTotalEstimatesWins(estimatedWins);
  const easternEstimatedWins = getConferenceEstimatedWins(
    nbaTeams,
    estimatedWins,
    Conference.Eastern
  );
  const westernEstimatedWins = getConferenceEstimatedWins(
    nbaTeams,
    estimatedWins,
    Conference.Western
  );

  if (
    JSON.stringify(estimatedWins) ===
    JSON.stringify(getCurrentWinsMap(nbaTeams))
  ) {
    if (lastUpdate.date === undefined) {
      return "Error";
    }

    const lastUpdateDate = new Date(lastUpdate.date);
    const lastUpdateString = `${lastUpdateDate.toLocaleDateString()} ${lastUpdateDate.toLocaleTimeString()}`;
    return `NBA standings are saved. Last Updated: ${lastUpdateString}`;
  } else if (totalEstimateWins !== TOTAL_GAMES) {
    const totalGamesDifference = Math.abs(TOTAL_GAMES - totalEstimateWins);

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
  }

  return null;
}
