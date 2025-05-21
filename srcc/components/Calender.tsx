import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Dimensions
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Habit } from '../types/habit';
import { formatDate, getDaysInMonth, isToday } from '../utils/dataUtils';

type CalendarProps = {
  habits: Habit[];
  onSelectDay: (date: string) => void;
  selectedHabitId?: string;
};

const Calendar: React.FC<CalendarProps> = ({ 
  habits, 
  onSelectDay,
  selectedHabitId 
}) => {
  const { colors } = useTheme();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));

  const screenWidth = Dimensions.get('window').width;
  const dayWidth = (screenWidth - 32) / 7; // 7 days per week, 32px for padding

  // Get all completed dates for the selected habit or all habits
  const getCompletedDates = () => {
    if (selectedHabitId) {
      const habit = habits.find(h => h.id === selectedHabitId);
      return habit ? habit.completedDates : [];
    }
    
    // Combine all completed dates from all habits
    const allDates = new Set<string>();
    habits.forEach(habit => {
      habit.completedDates.forEach(date => {
        allDates.add(date);
      });
    });
    
    return Array.from(allDates);
  };

  const completedDates = getCompletedDates();

  // Check if a date has a completed habit
  const isDateCompleted = (dateString: string) => {
    return completedDates.includes(dateString);
  };

  // Check if a date is part of a streak
  const getStreakInfo = (dateString: string) => {
    if (!isDateCompleted(dateString)) return { isStreak: false, streakLength: 0 };
    
    // Check previous days to find streak length
    let streakLength = 1;
    let currentDate = new Date(dateString);
    
    // Look back up to 30 days to find the streak length
    for (let i = 1; i <= 30; i++) {
      currentDate.setDate(currentDate.getDate() - 1);
      const prevDateString = formatDate(currentDate);
      
      if (isDateCompleted(prevDateString)) {
        streakLength++;
      } else {
        break;
      }
    }
    
    return { isStreak: streakLength > 1, streakLength };
  };

  // Generate days for the current month
  const generateDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const days = [];
    
    // Add empty cells for days before the first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<View key={`empty-${i}`} style={[styles.day, { width: dayWidth }]} />);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentYear, currentMonth, i);
      const dateString = formatDate(date);
      const isCurrentDay = isToday(dateString);
      const isSelected = dateString === selectedDate;
      const completed = isDateCompleted(dateString);
      const { isStreak, streakLength } = getStreakInfo(dateString);
      
      days.push(
        <TouchableOpacity
          key={i}
          style={[
            styles.day,
            { width: dayWidth },
            isCurrentDay && styles.today,
            isSelected && styles.selected,
            completed && { backgroundColor: isStreak ? colors.success : colors.primary },
          ]}
          onPress={() => {
            setSelectedDate(dateString);
            onSelectDay(dateString);
          }}
        >
          <Text 
            style={[
              styles.dayText, 
              { color: completed || isSelected ? '#FFFFFF' : colors.text }
            ]}
          >
            {i}
          </Text>
          {isStreak && (
            <View style={styles.streakBadge}>
              <Text style={styles.streakText}>{streakLength}</Text>
            </View>
          )}
        </TouchableOpacity>
      );
    }
    
    return days;
  };

  // Navigate to previous month
  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  // Navigate to next month
  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Day names
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goToPrevMonth}>
          <Text style={[styles.navButton, { color: colors.primary }]}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={[styles.monthTitle, { color: colors.text }]}>
          {monthNames[currentMonth]} {currentYear}
        </Text>
        <TouchableOpacity onPress={goToNextMonth}>
          <Text style={[styles.navButton, { color: colors.primary }]}>{'>'}</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.daysHeader}>
        {dayNames.map((day, index) => (
          <View key={index} style={[styles.dayName, { width: dayWidth }]}>
            <Text style={[styles.dayNameText, { color: colors.text }]}>{day}</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.calendar}>
        {generateDays()}
      </View>
      
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: colors.primary }]} />
          <Text style={[styles.legendText, { color: colors.text }]}>Completed</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: colors.success }]} />
          <Text style={[styles.legendText, { color: colors.text }]}>Streak</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  navButton: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingHorizontal: 16,
  },
  daysHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dayName: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  dayNameText: {
    fontSize: 14,
    fontWeight: '500',
  },
  calendar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  day: {
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    margin: 1,
    position: 'relative',
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
  },
  today: {
    borderWidth: 2,
    borderColor: '#FF9500',
  },
  selected: {
    backgroundColor: '#007AFF',
  },
  streakBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#FF9500',
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 4,
  },
  legendText: {
    fontSize: 14,
  },
});

export default Calendar;