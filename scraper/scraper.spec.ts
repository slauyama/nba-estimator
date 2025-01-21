import { test, expect, ElementHandle } from "@playwright/test";
import insertRecordIntoNBATeams, {
  TeamRecord,
} from "./sql/insert_record_into_nba_teams";
import createTableNBATeams from "./sql/create_table_nba_teams";

async function parseNameWinsLossesFromRow(
  tr: ElementHandle<SVGElement | HTMLElement>
): Promise<TeamRecord> {
  const [nameElementHandle, winsElementHandle, lossesElementHandle] =
    await Promise.all([
      tr.$('[data-stat="team_name"] > a'),
      tr.$('[data-stat="wins"]'),
      tr.$('[data-stat="losses"]'),
    ]);
  const [name, wins, losses] = await Promise.all([
    nameElementHandle?.textContent(),
    winsElementHandle?.textContent(),
    lossesElementHandle?.textContent(),
  ]);
  return {
    name,
    wins,
    losses,
  };
}

test("visit bball reference", async ({ page, browser }) => {
  await createTableNBATeams();

  await page.goto(
    "https://www.basketball-reference.com/leagues/NBA_2025_standings.html"
  );

  await Promise.all([
    page.waitForSelector("#confs_standings_E"),
    page.waitForSelector("#confs_standings_W"),
  ]);

  const eastRows = await page.$$("#confs_standings_E > tbody > tr");
  const westRows = await page.$$("#confs_standings_W > tbody > tr");
  const allRows = [...eastRows, ...westRows];
  const parsedRows = await Promise.all(allRows.map(parseNameWinsLossesFromRow));

  await insertRecordIntoNBATeams(parsedRows);
});
