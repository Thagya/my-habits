import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  FlatList,
  RefreshControl
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useHabits } from '../context/HabitContext';
import Calender from '../components/Calender';
import { formatDate } from '../utils/dataUtils';

const CalendarScreen: React.FC = () => {
  const { colors } = useTheme();
  const { habits, refreshHabits, isLoading } = useHabits();
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [selectedHabitId, setSelectedHabitId] = useState<string | undefined>(undefined);

  useEffect(() => {
    refreshHabits();
  }, []);

  // Get habits completed on the selected date
  const getHabitsForDate = () => {
    return habits.filter(habit => 
      habit.completedDates.includes(selectedDate)
    );
  };

  // Calculate the longest streak for a habit
  const calculateLongestStreak = (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return 0;
    
    // Sort dates in ascending order
    const sortedDates = [...habit.completedDates].sort();
    
    let currentStreak = 1;
    let longestStreak = 1;
    
    for (let i = 1; i < sortedDates.length; i++) {
      const currentDate = new Date(sortedDates[i]);
      const prevDate = new Date(sortedDates[i - 1]);
      
      // Check if dates are consecutive
      const diffTime = Math.abs(currentDate.getTime() - prevDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }
    
    return longestStreak;
  };

  // Calculate current streak for a habit
  const calculateCurrentStreak = (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return 0;
    
    // Sort dates in descending order (newest first)
    const sortedDates = [...habit.completedDates]
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    if (sortedDates.length === 0) return 0;
    
    // Check if the most recent date is today or yesterday
    const mostRecentDate = new Date(sortedDates[0]);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const isRecentEnough = 
      mostRecentDate.getTime() === today.getTime() || 
      mostRecentDate.getTime() === yesterday.getTime();
    
    if (!isRecentEnough) return 0;
    
    // Count consecutive days
    let streak = 1;
    let currentDate = new Date(sortedDates[0]);
    
    for (let i = 1; i < sortedDates.length; i++) {
      const nextDate = new Date(sortedDates[i]);
      
      // Check if dates are consecutive
      const expectedPrevDate = new Date(currentDate);
      expectedPrevDate.setDate(expectedPrevDate.getDate() - 1);
      
      if (nextDate.getTime() === expectedPrevDate.getTime()) {
        streak++;
        currentDate = nextDate;
      } else {
        break;
      }
    }
    
    return streak;
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={refreshHabits}
          colors={[colors.primary]}
        />
      }
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Habit Streaks</Text>
        <Text style={[styles.subtitle, { color: colors.text }]}>
          Track your consistency over time
        </Text>
      </View>
      
      <View style={styles.habitFilterContainer}>
        <TouchableOpacity
          style={[
            styles.habitFilterButton,
            !selectedHabitId && { backgroundColor: colors.primary }
          ]}
          onPress={() => setSelectedHabitId(undefined)}
        >
          <Text 
            style={[
              styles.habitFilterText,
              { color: !selectedHabitId ? '#FFFFFF' : colors.text }
            ]}
          >
            All Habits
          </Text>
        </TouchableOpacity>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {habits.map(habit => (
            <TouchableOpacity
              key={habit.id}
              style={[
                styles.habitFilterButton,
                selectedHabitId === habit.id && { backgroundColor: colors.primary }
              ]}
              onPress={() => setSelectedHabitId(habit.id)}
            >
              <Text 
                style={[
                  styles.habitFilterText,
                  { color: selectedHabitId === habit.id ? '#FFFFFF' : colors.text }
                ]}
              >
                {habit.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <Calender 
        habits={habits}
        onSelectDay={setSelectedDate}
        selectedHabitId={selectedHabitId}
      />
      
      <View style={styles.selectedDateContainer}>
        <Text style={[styles.selectedDateText, { color: colors.text }]}>
          Selected Date: {selectedDate}
        </Text>
      </View>
      
      <View style={[styles.completedHabitsContainer, { backgroundColor: colors.card }]}>
        <Text style={[styles.completedHabitsTitle, { color: colors.text }]}>
          Completed Habits on {selectedDate}
        </Text>
        
        {getHabitsForDate().length === 0 ? (
          <Text style={[styles.noHabitsText, { color: colors.text }]}>
            No habits completed on this date
          </Text>
        ) : (
          <FlatList
            data={getHabitsForDate()}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={[styles.habitItem, { borderColor: colors.border }]}>
                <Text style={[styles.habitName, { color: colors.text }]}>{item.name}</Text>
                <Text style={[styles.habitFrequency, { color: colors.text }]}>
                  {item.frequency === 'daily' ? 'Daily' : 'Weekly'}
                </Text>
              </View>
            )}
            scrollEnabled={false}
          />
        )}
      </View>
      
      {selectedHabitId && (
        <View style={[styles.streakContainer, { backgroundColor: colors.card }]}>
          <Text style={[styles.streakTitle, { color: colors.text }]}>
            Streak Information
          </Text>
          
          <View style={styles.streakInfo}>
            <View style={styles.streakItem}>
              <Text style={[styles.streakLabel, { color: colors.text }]}>
                Current Streak:
              </Text>
              <Text style={[styles.streakValue, { color: colors.primary }]}>
                {calculateCurrentStreak(selectedHabitId)} days
              </Text>
            </View>
            
            <View style={styles.streakItem}>
              <Text style={[styles.streakLabel, { color: colors.text }]}>
                Longest Streak:
              </Text>
              <Text style={[styles.streakValue, { color: colors.primary }]}>
                {calculateLongestStreak(selectedHabitId)} days
              </Text>
            </View>
          </View>
        </View>
      )}
      
      <View style={styles.tipContainer}>
        <Text style={[styles.tipTitle, { color: colors.text }]}>Tip</Text>
        <Text style={[styles.tipText, { color: colors.text }]}>
          Consistency is key! Try to complete your habits daily to build a strong streak.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingBottom: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  habitFilterContainer: {
    flexDirection: 'row',
    padding: 16,
  },
  habitFilterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
  },
  habitFilterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  selectedDateContainer: {
    padding: 16,
    alignItems: 'center',
  },
  selectedDateText: {
    fontSize: 16,
    fontWeight: '500',
  },
  completedHabitsContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
  },
  completedHabitsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  noHabitsText: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  habitItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  habitName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  habitFrequency: {
    fontSize: 14,
  },
  streakContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
  },
  streakTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  streakInfo: {
    marginBottom: 8,
  },
  streakItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  streakLabel: {
    fontSize: 16,
  },
  streakValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  tipContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 149, 0, 0.1)',
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default CalendarScreen;