import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/user';
import { Habit } from '../types/habit';

// Keys
const USER_KEY = '@habit_tracker:user';
const USERS_KEY = '@habit_tracker:users'; // Store all registered users
const HABITS_KEY = '@habit_tracker:habits:';
const THEME_KEY = '@habit_tracker:theme';

// User functions
export const saveUser = async (user: User): Promise<void> => {
  try {
    // Save current user
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    
    // Also save to users list for login functionality
    const usersJson = await AsyncStorage.getItem(USERS_KEY);
    const users: User[] = usersJson ? JSON.parse(usersJson) : [];
    
    // Check if user already exists
    const existingUserIndex = users.findIndex(u => u.email === user.email);
    
    if (existingUserIndex >= 0) {
      // Update existing user
      users[existingUserIndex] = user;
    } else {
      // Add new user
      users.push(user);
    }
    
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Error saving user:', error);
  }
};

export const getUser = async (): Promise<User | null> => {
  try {
    const userJson = await AsyncStorage.getItem(USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

export const removeUser = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error('Error removing user:', error);
  }
};

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const usersJson = await AsyncStorage.getItem(USERS_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  } catch (error) {
    console.error('Error getting all users:', error);
    return [];
  }
};


export const saveHabits = async (habits: Habit[], userId: string): Promise<void> => {
  try {
    const key = `${HABITS_KEY}${userId}`;
    await AsyncStorage.setItem(key, JSON.stringify(habits));
  } catch (error) {
    console.error('Error saving habits:', error);
  }
};

export const getHabits = async (userId: string): Promise<Habit[]> => {
  try {
    const key = `${HABITS_KEY}${userId}`;
    const habitsJson = await AsyncStorage.getItem(key);
    return habitsJson ? JSON.parse(habitsJson) : [];
  } catch (error) {
    console.error('Error getting habits:', error);
    return [];
  }
};


export const saveTheme = async (isDark: boolean): Promise<void> => {
  try {
    await AsyncStorage.setItem(THEME_KEY, JSON.stringify(isDark));
  } catch (error) {
    console.error('Error saving theme:', error);
  }
};

export const getTheme = async (): Promise<boolean | null> => {
  try {
    const themeJson = await AsyncStorage.getItem(THEME_KEY);
    return themeJson ? JSON.parse(themeJson) : null;
  } catch (error) {
    console.error('Error getting theme:', error);
    return null;
  }
};