export type Habit = {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly';
  createdAt: string;
  completedDates: string[]; // ISO date strings
};

export type HabitFilter = 'all' | 'today' | 'completed';