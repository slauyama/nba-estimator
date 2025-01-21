const connectionPool = require("../db");

const createTableSQLString = `CREATE TABLE IF NOT EXISTS nba_teams (
  id SERIAL PRIMARY KEY,
  name VARCHAR (50) UNIQUE NOT NULL,
  wins SMALLINT NOT NULL,
  losses SMALLINT NOT NULL,
  basketball_reference_team_shortcode VARCHAR(50) UNIQUE,
  conference VARCHAR(50),
  updated_at TIMESTAMP
);`;

const insertBasketballReferenceShortcodeString = `INSERT INTO nba_teams 
  (name, wins, losses, basketball_reference_team_shortcode, conference)
VALUES 
  ('Atlanta Hawks', 0, 0, 'ATL', 'eastern'),
  ('Boston Celtics', 0, 0, 'BOS', 'eastern'),
  ('Brooklyn Nets', 0, 0, 'NJN', 'eastern'),
  ('Charlotte Hornets', 0, 0, 'CHO', 'eastern'),
  ('Chicago Bulls', 0, 0, 'CHI', 'eastern'),
  ('Cleveland Cavaliers', 0, 0, 'CLE', 'eastern'),
  ('Dallas Mavericks', 0, 0, 'DAL', 'western'),
  ('Denver Nuggets', 0, 0, 'DEN', 'western'),
  ('Detroit Pistons', 0, 0, 'DET', 'eastern'),
  ('Golden State Warriors', 0, 0, 'GSW', 'western'),
  ('Houston Rockets', 0, 0, 'HOU', 'western'),
  ('Indiana Pacers', 0, 0, 'IND', 'eastern'),
  ('Los Angeles Clippers', 0, 0, 'LAC', 'western'),
  ('Los Angeles Lakers', 0, 0, 'LAL', 'western'),
  ('Memphis Grizzlies', 0, 0, 'MEM', 'western'),
  ('Miami Heat', 0, 0, 'MIA', 'eastern'),
  ('Milwaukee Bucks', 0, 0, 'MIL', 'eastern'),
  ('Minnesota Timberwolves', 0, 0, 'MIN', 'western'),
  ('New Orleans Pelicans', 0, 0, 'NOP', 'western'),
  ('New York Knicks', 0, 0, 'NYK', 'eastern'),
  ('Oklahoma City Thunder', 0, 0, 'OKC', 'western'),
  ('Orlando Magic', 0, 0, 'ORL', 'eastern'),
  ('Philadelphia 76ers', 0, 0, 'PHI', 'eastern'),
  ('Phoenix Suns', 0, 0, 'PHO', 'western'),
  ('Portland Trail Blazers', 0, 0, 'POR', 'western'),
  ('Sacramento Kings', 0, 0, 'SAC', 'western'),
  ('San Antonio Spurs', 0, 0, 'SAS', 'western'),
  ('Toronto Raptors', 0, 0, 'TOR', 'eastern'),
  ('Utah Jazz', 0, 0, 'UTA', 'western'),
  ('Washington Wizards', 0, 0, 'WAS', 'eastern')
ON CONFLICT(name)
DO NOTHING;`;

export default async function createTableNBATeams() {
  await connectionPool.query(createTableSQLString);
  await connectionPool.query(insertBasketballReferenceShortcodeString);
}
