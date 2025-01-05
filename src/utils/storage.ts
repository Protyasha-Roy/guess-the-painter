import type { GameStats, User, UserGameData } from '../types';

const CURRENT_USER_KEY = 'guessThePainter_currentUser';
const USERS_KEY = 'guessThePainter_users';

const defaultStats: GameStats = {
  totalPaintings: 0,
  totalGuesses: 0,
  correctGuesses: 0,
  wrongGuesses: 0,
  score: 0,
  rank: 0,
};

export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem(CURRENT_USER_KEY);
  return userJson ? JSON.parse(userJson) : null;
};

export const setCurrentUser = (user: User): void => {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
};

export const clearCurrentUser = (): void => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

export const getAllUsers = (): UserGameData[] => {
  const usersJson = localStorage.getItem(USERS_KEY);
  return usersJson ? JSON.parse(usersJson) : [];
};

export const saveUser = (userData: UserGameData): void => {
  const users = getAllUsers();
  const existingUserIndex = users.findIndex(u => u.user.username === userData.user.username);
  
  if (existingUserIndex >= 0) {
    users[existingUserIndex] = userData;
  } else {
    users.push(userData);
  }
  
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const authenticateUser = (username: string, password: string): boolean => {
  const users = getAllUsers();
  const user = users.find(u => u.user.username === username);
  return user ? user.user.password === password : false;
};

export const getGameStats = (): GameStats => {
  const currentUser = getCurrentUser();
  if (!currentUser) return defaultStats;

  const users = getAllUsers();
  const userData = users.find(u => u.user.username === currentUser.username);
  return userData ? userData.stats : defaultStats;
};

export const updateGameStats = (isCorrect: boolean): GameStats => {
  const currentUser = getCurrentUser();
  if (!currentUser) return defaultStats;

  const stats = getGameStats();
  const newStats: GameStats = {
    ...stats,
    totalGuesses: stats.totalGuesses + 1,
    correctGuesses: isCorrect ? stats.correctGuesses + 1 : stats.correctGuesses,
    wrongGuesses: isCorrect ? stats.wrongGuesses : stats.wrongGuesses + 1,
    score: isCorrect ? stats.score + 10 : stats.score,
  };

  saveUser({
    user: currentUser,
    stats: newStats
  });

  return newStats;
};

export const incrementTotalPaintings = (): GameStats => {
  const currentUser = getCurrentUser();
  if (!currentUser) return defaultStats;

  const stats = getGameStats();
  const newStats: GameStats = {
    ...stats,
    totalPaintings: stats.totalPaintings + 1,
  };

  saveUser({
    user: currentUser,
    stats: newStats
  });

  return newStats;
};
