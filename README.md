# Guess the Painter 

An engaging web game that challenges your knowledge of famous artists and their paintings. Test your art history knowledge while having fun!

## Features

-  Guess the artists behind famous paintings
-  Time-based gameplay with 30-second rounds
-  Personal statistics tracking
-  Global leaderboard
-  Sound effects for enhanced experience
-  Responsive design for both desktop and mobile

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Supabase
- Wikidata API

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone [your-repository-url]
cd guess-the-painter
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file with your Supabase credentials
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server
```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## How to Play

1. Log in to track your progress and compete on the leaderboard
2. A random painting will be displayed
3. You have 30 seconds to guess the artist's name
4. Type your guess in the input field
5. Get feedback instantly and see your score increase for correct answers

## Tips
- Try to guess artists full name. But if you are sure of an artist's full name but it's still showing wrong answer. Then try with different names the artist is known as. 
- Remember, spelling must be correct (but not case sensitive).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).
