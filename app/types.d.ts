export interface NBATeam {
  id: number;
  name: string;
  wins: number;
  losses: number;
  basketball_reference_team_shortcode:
    | "WAS"
    | "UTA"
    | "TOR"
    | "SAS"
    | "SAC"
    | "POR"
    | "PHO"
    | "PHI"
    | "ORL"
    | "OKC"
    | "NYK"
    | "NOP"
    | "NJN"
    | "MIN"
    | "MIL"
    | "MIA"
    | "MEM"
    | "LAL"
    | "LAC"
    | "IND"
    | "HOU"
    | "GSW"
    | "DET"
    | "DEN"
    | "DAL"
    | "CLE"
    | "CHO"
    | "CHI"
    | "BOS"
    | "ATL";
  conference: "eastern" | "western";
  updated_at: string;
}
