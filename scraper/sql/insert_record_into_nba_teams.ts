const connectionPool = require("../db");

export interface TeamRecord {
  name?: string | null;
  wins?: string | null;
  losses?: string | null;
}

function convertDataToSQLValues(data: TeamRecord) {
  return `('${data.name}', ${data.wins}, ${data.losses}, CURRENT_TIMESTAMP)`;
}

export default async function insertRecordIntoNBATeams(
  parsedRows: TeamRecord[]
) {
  const insertRecordsSqlString = `INSERT INTO nba_teams (name, wins, losses, updated_at)
  VALUES ${parsedRows.map(convertDataToSQLValues)}
  ON CONFLICT(name)
  DO UPDATE SET
    wins = EXCLUDED.wins,
    losses = EXCLUDED.losses,
    updated_at = EXCLUDED.updated_at;`;

  await connectionPool.query(insertRecordsSqlString);
}
