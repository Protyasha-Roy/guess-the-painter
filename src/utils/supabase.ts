import { createClient } from '@supabase/supabase-js';
import CryptoJS from 'crypto-js';
import type { GameStats } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const encryptionKey = import.meta.env.VITE_ENCRYPTION_KEY;

if (!supabaseUrl || !supabaseAnonKey || !encryptionKey) {
  throw new Error('Missing environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface User {
  id: string;
  username: string;
}

export interface DBStats {
  user_id: string;
  total_paintings: number;
  total_guesses: number;
  correct_guesses: number;
  wrong_guesses: number;
  score: number;
  rank: number;
}

// Encrypt password before storing
const encryptPassword = (password: string): string => {
  return CryptoJS.AES.encrypt(password, encryptionKey).toString();
};

// Verify password during login
const verifyPassword = (password: string, hash: string): boolean => {
  try {
    const decrypted = CryptoJS.AES.decrypt(hash, encryptionKey).toString(CryptoJS.enc.Utf8);
    return password === decrypted;
  } catch {
    return false;
  }
};

export async function loginUser(username: string, password: string): Promise<User | null> {
  try {
    // Get user by username
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, username, password_hash')
      .eq('username', username)
      .single();

    if (userError || !user) return null;

    // Verify password
    if (!verifyPassword(password, user.password_hash)) return null;

    return {
      id: user.id,
      username: user.username
    };
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
}

export async function registerUser(username: string, password: string): Promise<User | null> {
  try {
    // Check if username exists
    const { data: existing } = await supabase
      .from('users')
      .select('username')
      .eq('username', username)
      .single();

    if (existing) return null;

    // Create new user
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert([{
        username,
        password_hash: encryptPassword(password)
      }])
      .select('id, username')
      .single();

    if (userError || !user) return null;

    // Initialize user stats
    const { error: statsError } = await supabase
      .from('user_stats')
      .insert([{
        user_id: user.id,
        total_paintings: 0,
        total_guesses: 0,
        correct_guesses: 0,
        wrong_guesses: 0,
        score: 0
      }]);

    if (statsError) {
      console.error('Error creating user stats:', statsError);
      // Delete the user if stats creation fails
      await supabase.from('users').delete().eq('id', user.id);
      return null;
    }

    return {
      id: user.id,
      username: user.username
    };
  } catch (error) {
    console.error('Registration error:', error);
    return null;
  }
}

export async function getUserStats(userId: string): Promise<GameStats | null> {
  try {
    // Get the user's stats
    const { data: userStats, error: statsError } = await supabase
      .from('user_stats')
      .select('user_id, total_paintings, total_guesses, correct_guesses, wrong_guesses, score, rank')
      .eq('user_id', userId)
      .single();

    if (statsError) throw statsError;
    if (!userStats) return null;

    return {
      totalPaintings: userStats.total_paintings || 0,
      totalGuesses: userStats.total_guesses || 0,
      correctGuesses: userStats.correct_guesses || 0,
      wrongGuesses: userStats.wrong_guesses || 0,
      score: userStats.score || 0,
      rank: userStats.rank || 1
    };
  } catch (error) {
    console.error('Error getting user stats:', error);
    return null;
  }
}

export async function updateUserStats(userId: string, isCorrect: boolean): Promise<GameStats | null> {
  try {
    // First get current stats
    const { data: currentStats, error: fetchError } = await supabase
      .from('user_stats')
      .select('user_id, total_paintings, total_guesses, correct_guesses, wrong_guesses, score, rank')
      .eq('user_id', userId)
      .single();

    if (fetchError || !currentStats) return null;

    // Calculate new stats
    const newStats = {
      total_guesses: currentStats.total_guesses + 1,
      correct_guesses: isCorrect ? currentStats.correct_guesses + 1 : currentStats.correct_guesses,
      wrong_guesses: isCorrect ? currentStats.wrong_guesses : currentStats.wrong_guesses + 1,
      score: isCorrect ? currentStats.score + 10 : currentStats.score,
    };

    // Update stats in database
    const { data, error } = await supabase
      .from('user_stats')
      .update(newStats)
      .eq('user_id', userId)
      .select('user_id, total_paintings, total_guesses, correct_guesses, wrong_guesses, score, rank')
      .single();

    if (error) throw error;
    if (!data) return null;
    
    return {
      totalPaintings: data.total_paintings || 0,
      totalGuesses: data.total_guesses || 0,
      correctGuesses: data.correct_guesses || 0,
      wrongGuesses: data.wrong_guesses || 0,
      score: data.score || 0,
      rank: data.rank || 1
    };
  } catch (error) {
    console.error('Error updating user stats:', error);
    return null;
  }
}

export async function incrementTotalPaintings(userId: string): Promise<GameStats | null> {
  try {
    // First get current stats
    const { data: currentStats, error: fetchError } = await supabase
      .from('user_stats')
      .select('user_id, total_paintings, total_guesses, correct_guesses, wrong_guesses, score, rank')
      .eq('user_id', userId)
      .single();

    if (fetchError || !currentStats) return null;

    // Update total_paintings by incrementing current value
    const { data, error } = await supabase
      .from('user_stats')
      .update({ total_paintings: currentStats.total_paintings + 1 })
      .eq('user_id', userId)
      .select('user_id, total_paintings, total_guesses, correct_guesses, wrong_guesses, score, rank')
      .single();

    if (error) throw error;
    if (!data) return null;
    
    return {
      totalPaintings: data.total_paintings || 0,
      totalGuesses: data.total_guesses || 0,
      correctGuesses: data.correct_guesses || 0,
      wrongGuesses: data.wrong_guesses || 0,
      score: data.score || 0,
      rank: data.rank || 1
    };
  } catch (error) {
    console.error('Error incrementing total paintings:', error);
    return null;
  }
}

export async function getLeaderboard() {
  try {
    // Get top 10 stats with user IDs
    const { data: statsData, error: statsError } = await supabase
      .from('user_stats')
      .select(`
        user_id,
        score,
        total_paintings,
        total_guesses,
        correct_guesses,
        wrong_guesses,
        rank
      `)
      .order('rank', { ascending: true })
      .limit(10);

    if (statsError) throw statsError;
    if (!statsData) return null;

    // Get usernames for these users
    const userIds = statsData.map(stat => stat.user_id);
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('id, username')
      .in('id', userIds);

    if (usersError) throw usersError;
    if (!usersData) return null;

    // Create a map of user_id to username
    const usernameMap = new Map(usersData.map(user => [user.id, user.username]));

    // Calculate efficiency stats for display
    return statsData.map(stat => ({
      username: usernameMap.get(stat.user_id) || 'Unknown User',
      score: stat.score,
      total_paintings: stat.total_paintings,
      total_guesses: stat.total_guesses,
      correct_guesses: stat.correct_guesses,
      wrong_guesses: stat.wrong_guesses,
      rank: stat.rank || 1,
      efficiency: stat.total_guesses > 0 
        ? Math.round((stat.score / stat.total_guesses) * 10) / 10 
        : 0
    }));
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return null;
  }
}
