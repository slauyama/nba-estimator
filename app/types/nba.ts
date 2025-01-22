export type BasketballReferenceTeamShortCode =
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

export enum Conference {
  Eastern = "eastern",
  Western = "western",
}

export interface NBATeam {
  id: number;
  name: string;
  wins: number;
  losses: number;
  basketball_reference_team_shortcode: BasketballReferenceTeamShortCode;
  conference: Conference;
  updated_at: string;
}
