export interface GameStats {
  totalPaintings: number;
  totalGuesses: number;
  correctGuesses: number;
  wrongGuesses: number;
  score: number;
  rank: number;
}

export interface Painting {
  title: string;
  artist: string;
  imageUrl: string;
  year?: string;
}

export interface User {
  username: string;
  password: string;
}

export interface UserGameData {
  user: User;
  stats: GameStats;
}