INSERT INTO nba_teams 
  (name, wins, losses, basketball_reference_team_shortcode)
VALUES 
  ('Atlanta Hawks', 0, 0, 'ATL'),
  ('Boston Celtics', 0, 0, 'BOS'),
  ('Brooklyn Nets', 0, 0, 'NJN'),
  ('Charlotte Hornets', 0, 0, 'CHO'),
  ('Chicago Bulls', 0, 0, 'CHI'),
  ('Cleveland Cavaliers', 0, 0, 'CLE'),
  ('Dallas Mavericks', 0, 0, 'DAL'),
  ('Denver Nuggets', 0, 0, 'DEN'),
  ('Detroit Pistons', 0, 0, 'DET'),
  ('Golden State Warriors', 0, 0, 'GSW'),
  ('Houston Rockets', 0, 0, 'HOU'),
  ('Indiana Pacers', 0, 0, 'IND'),
  ('Los Angeles Clippers', 0, 0, 'LAC'),
  ('Los Angeles Lakers', 0, 0, 'LAL'),
  ('Memphis Grizzlies', 0, 0, 'MEM'),
  ('Miami Heat', 0, 0, 'MIA'),
  ('Milwaukee Bucks', 0, 0, 'MIL'),
  ('Minnesota Timberwolves', 0, 0, 'MIN'),
  ('New Orleans Pelicans', 0, 0, 'NOP')
  ('New York Knicks', 0, 0, 'NYK'),
  ('Oklahoma City Thunder', 0, 0, 'OKC'),
  ('Orlando Magic', 0, 0, 'ORL'),
  ('Philadelphia 76ers', 0, 0, 'PHI'),
  ('Phoenix Suns', 0, 0, 'PHO'),
  ('Portland Trail Blazers', 0, 0, 'POR'),
  ('Sacramento Kings', 0, 0, 'SAC'),
  ('San Antonio Spurs', 0, 0, 'SAS'),
  ('Toronto Raptors', 0, 0, 'TOR'),
  ('Utah Jazz', 0, 0, 'UTA'),
  ('Washington Wizards', 0, 0, 'WAS'),
ON CONFLICT(name)
DO NOTHING;