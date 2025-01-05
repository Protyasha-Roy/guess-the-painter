export interface Painting {
    title: string;
    artist: string;
    imageUrl: string;
    year?: string;
}

export interface GameStats {
    totalPaintings: number;
    totalGuesses: number;
    correctGuesses: number;
    wrongGuesses: number;
    score: number;
}
