import { Habit } from '../types/habit';
import { getHabits, saveHabits } from './asyncStorage';
import { formatDate, isThisWeek } from '../utils/dataUtils';

export const createHabit = async (
  name: string,
  frequency: 'daily' | 'weekly',
  userId: string
): Promise<Habit> => {
  const habits = await getHabits(userId);
  
  const newHabit: Habit = {
    id: Date.now().toString(),
    name,
    frequency,
    createdAt: new Date().toISOString(),
    completedDates: [],
  };
  
  await saveHabits([...habits, newHabit], userId);
  return newHabit;
};

export const completeHabit = async (habitId: string, userId: string): Promise<void> => {
  const habits = await getHabits(userId);
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
  
  await saveHabits(updatedHabits, userId);
};

export const uncompleteHabit = async (habitId: string, userId: string): Promise<void> => {
  const habits = await getHabits(userId);
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
  
  await saveHabits(updatedHabits, userId);
};

export const deleteHabit = async (habitId: string, userId: string): Promise<void> => {
  const habits = await getHabits(userId);
  const updatedHabits = habits.filter(habit => habit.id !== habitId);
  await saveHabits(updatedHabits, userId);
};

export const calculateTodayProgress = (habits: Habit[]): number => {
  const today = formatDate(new Date());
  const dailyHabits = habits.filter(habit => habit.frequency === 'daily');
  
  if (dailyHabits.length === 0) return 0;
  
  const completedToday = dailyHabits.filter(habit => 
    habit.completedDates.includes(today)
  ).length;
  
  return (completedToday / dailyHabits.length) * 100;
};

export const calculateWeeklyProgress = (habits: Habit[]): number => {
  const weeklyHabits = habits.filter(habit => habit.frequency === 'weekly');
  
  if (weeklyHabits.length === 0) return 0;
  
  const completedThisWeek = weeklyHabits.filter(habit => 
    habit.completedDates.some(date => isThisWeek(date))
  ).length;
  
  return (completedThisWeek / weeklyHabits.length) * 100;
};