import React, { createContext, useState, useEffect, useContext } from 'react';
import { Habit, HabitFilter } from '../types/habit';
import { getHabits, saveHabits } from '../services/asyncStorage';
import { 
  createHabit as createHabitService,
  completeHabit as completeHabitService,
  uncompleteHabit as uncompleteHabitService,
  deleteHabit as deleteHabitService,
  calculateTodayProgress,
  calculateWeeklyProgress
} from '../services/habitService';
import { isToday, formatDate, areDatesConsecutive } from '../utils/dataUtils';
import { useAuth } from './AuthContext';

type HabitContextType = {
  habits: Habit[];
  filteredHabits: Habit[];
  filter: HabitFilter;
  setFilter: (filter: HabitFilter) => void;
  isLoading: boolean;
  createHabit: (name: string, frequency: 'daily' | 'weekly') => Promise<void>;
  completeHabit: (habitId: string) => Promise<void>;
  uncompleteHabit: (habitId: string) => Promise<void>;
  deleteHabit: (habitId: string) => Promise<void>;
  refreshHabits: () => Promise<void>;
  todayProgress: number;
  weeklyProgress: number;
  getCurrentStreak: (habitId: string) => number;
  getLongestStreak: (habitId: string) => number;
};

const HabitContext = createContext<HabitContextType>({
  habits: [],
  filteredHabits: [],
  filter: 'all',
  setFilter: () => {},
  isLoading: true,
  createHabit: async () => {},
  completeHabit: async () => {},
  uncompleteHabit: async () => {},
  deleteHabit: async () => {},
  refreshHabits: async () => {},
  todayProgress: 0,
  weeklyProgress: 0,
  getCurrentStreak: () => 0,
  getLongestStreak: () => 0,
});

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [filter, setFilter] = useState<HabitFilter>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [todayProgress, setTodayProgress] = useState(0);
  const [weeklyProgress, setWeeklyProgress] = useState(0);

  const refreshHabits = async () => {
    if (!user) {
      setHabits([]);
      setTodayProgress(0);
      setWeeklyProgress(0);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    const loadedHabits = await getHabits(user.email);
    setHabits(loadedHabits);
    setTodayProgress(calculateTodayProgress(loadedHabits));
    setWeeklyProgress(calculateWeeklyProgress(loadedHabits));
    setIsLoading(false);
  };

  // Refresh habits when user changes
  useEffect(() => {
    refreshHabits();
  }, [user]);

  const createHabit = async (name: string, frequency: 'daily' | 'weekly') => {
    if (!user) return;
    
    const newHabit: Habit = {
      id: Date.now().toString(),
      name,
      frequency,
      createdAt: new Date().toISOString(),
      completedDates: [],
    };
    
    const updatedHabits = [...habits, newHabit];
    await saveHabits(updatedHabits, user.email);
    refreshHabits();
  };

  const completeHabit = async (habitId: string) => {
    if (!user) return;
    
    const today = formatDate(new Date());
    const updatedHabits = habits.map(habit => {
      if (habit.id === habitId) {
        // Check if already completed today
        if (!habit.completedDates.includes(today)) {
          return {
            ...habit,
            completedDates: [...habit.completedDates, today],
          };
        }
      }
      return habit;
    });
    
    await saveHabits(updatedHabits, user.email);
    refreshHabits();
  };

  const uncompleteHabit = async (habitId: string) => {
    if (!user) return;
    
    const today = formatDate(new Date());
    const updatedHabits = habits.map(habit => {
      if (habit.id === habitId) {
        return {
          ...habit,
          completedDates: habit.completedDates.filter(date => date !== today),
        };
      }
      return habit;
    });
    
    await saveHabits(updatedHabits, user.email);
    refreshHabits();
  };

  const deleteHabit = async (habitId: string) => {
    if (!user) return;
    
    const updatedHabits = habits.filter(habit => habit.id !== habitId);
    await saveHabits(updatedHabits, user.email);
    refreshHabits();
  };

  // Calculate current streak for a habit
  const getCurrentStreak = (habitId: string): number => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit || habit.completedDates.length === 0) return 0;
    
    // Sort dates in descending order (newest first)
    const sortedDates = [...habit.completedDates]
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    // Check if the most recent date is today or yesterday
    const mostRecentDate = new Date(sortedDates[0]);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const isRecentEnough = 
      formatDate(mostRecentDate) === formatDate(today) || 
      formatDate(mostRecentDate) === formatDate(yesterday);
    
    if (!isRecentEnough) return 0;
    
    // Count consecutive days
    let streak = 1;
    let currentDate = sortedDates[0];
    
    for (let i = 1; i < sortedDates.length; i++) {
      const nextDate = sortedDates[i];
      
      // Check if dates are consecutive
      if (areDatesConsecutive(nextDate, currentDate)) {
        streak++;
        currentDate = nextDate;
      } else {
        break;
      }
    }
    
    return streak;
  };

  // Calculate longest streak for a habit
  const getLongestStreak = (habitId: string): number => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit || habit.completedDates.length === 0) return 0;
    
    // Sort dates in ascending order
    const sortedDates = [...habit.completedDates]
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    
    let currentStreak = 1;
    let longestStreak = 1;
    
    for (let i = 1; i < sortedDates.length; i++) {
      if (areDatesConsecutive(sortedDates[i-1], sortedDates[i])) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }
    
    return longestStreak;
  };

  // Filter habits based on selected filter
  const filteredHabits = habits.filter(habit => {
    const today = formatDate(new Date());
    
    if (filter === 'all') {
      return true;
    }
    
    if (filter === 'today') {
      // Show habits that need to be completed today (not completed yet)
      return !habit.completedDates.includes(today);
    }
    
    if (filter === 'completed') {
      // Show habits that have been completed today
      return habit.completedDates.includes(today);
    }
    
    return true;
  });

  return (
    <HabitContext.Provider 
      value={{ 
        habits, 
        filteredHabits,
        filter, 
        setFilter,
        isLoading, 
        createHabit, 
        completeHabit, 
        uncompleteHabit, 
        deleteHabit,
        refreshHabits,
        todayProgress,
        weeklyProgress,
        getCurrentStreak,
        getLongestStreak
      }}
    >
      {children}
    </HabitContext.Provider>
  );
};

export const useHabits = () => useContext(HabitContext);