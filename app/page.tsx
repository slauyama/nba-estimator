import Image from "next/image";
import connectionPool from "./db";
import { NBATeamsTable } from "./nba_table";
import { NBATeam } from "./types/nba";
import { TOTAL_GAMES } from "./constants";

function NBASeasonProgressBar({ totalWins }: { totalWins: number }) {
  const percentageComplete = (totalWins / TOTAL_GAMES) * 100;
  return (
    <div className="w-full">
      <p className="text-sm pb-2">
        {percentageComplete === 100
          ? "Season Complete!"
          : `The season is ${percentageComplete.toPrecision(
              2
            )}% complete.`}{" "}
      </p>
      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-900">
        <div
          className="bg-gray-700 rounded-full text-xs font-medium h-2"
          style={{ width: `${percentageComplete}%` }}
        />
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
      <a
        className="flex items-center gap-1 hover:underline hover:underline-offset-4"
        href="https://www.reddit.com/r/nba//"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          aria-hidden
          src="/NBARedditLogo.png"
          alt="NBA Reddit Logo"
          width={20}
          height={20}
        />
        /r/nba
      </a>
      <a
        className="flex items-center gap-1 hover:underline hover:underline-offset-4"
        href="https://www.basketball-reference.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          aria-hidden
          src="/BasketballReferenceLogo.png"
          alt="Basketball Reference Logo"
          width={20}
          height={20}
        />
        Basketball Reference
      </a>
    </footer>
  );
}

export default async function Home() {
  const selectNBATeams = `SELECT * 
    FROM nba_teams 
    ORDER BY wins DESC;`;
  const response = await connectionPool.query(selectNBATeams);
  const nbaTeams: NBATeam[] = response.rows;
  const wins = nbaTeams.reduce((acc, team) => acc + team.wins, 0);

  return (
    <div className="grid items-center justify-items-center min-h-screen p-6 pb-20 gap-16 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-6 items-center sm:items-start">
        <h1 className="text-3xl font-bold">Guess the 2025 NBA Standings </h1>
        <NBATeamsTable nbaTeams={nbaTeams} />
        <NBASeasonProgressBar totalWins={wins} />
        {/* <p>
          Put your NBA knowledge to the test. Instead of arguing online how X
          team is overrated or underated, make your season prediction now! Check
          back in at the end of the seaon and see how you did. Privacy policy
          This website does not save any information and stores your prediction
          in your browser. If you clear your local storage you will lose all
          your estimates!
        </p> */}
      </main>
      <Footer />
    </div>
  );
}
