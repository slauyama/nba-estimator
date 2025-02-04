import Image from "next/image";
import { connectionPool } from "./db";
import { NBATeamsTable } from "./nba_table";
import { NBATeam } from "./types/nba";

function Footer() {
  return (
    <footer className="flex gap-6 text-xs lg:text-base items-center justify-center">
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

  return (
    <div className="grid items-center justify-items-center min-h-screen py-2 px-1 md:p-6 md:pb-2 lg:pb-6 gap-16 font-[family-name:var(--font-geist-sans)]">
      <main className="p-6 w-full lg:w-auto flex flex-col gap-6">
        <h1 className="text-xl sm:text-3xl font-bold">
          Guess the 2025 NBA Standings
        </h1>
        <NBATeamsTable nbaTeams={nbaTeams} />
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
