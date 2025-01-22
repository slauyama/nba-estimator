export const GAMES_IN_SEASON = 82;
export const TEAMS = 30;
export const TOTAL_GAMES = (GAMES_IN_SEASON * TEAMS) / 2; // 1230

// Out of the 82 games, 30 are outside of conference and 52 are within the conference
// Maximum wins for conference is winning all non conference games plus splitting conference games
// (30 * 15) + (52 * 15 / 2)
export const MAX_CONFERENCE_WINS = 840;
// Minimum wins for conference is losing all non conference games plus splitting conference games
// (0 * 15) + (52 * 15 / 2)
export const MIN_CONFERENCE_WINS = 390;
