import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useHabits } from '../context/HabitContext';
import ProgressChart from '../components/ProgressChart';

const ProgressScreen: React.FC = () => {
  const { colors } = useTheme();
  const { todayProgress, weeklyProgress, refreshHabits, isLoading } = useHabits();

  useEffect(() => {
    refreshHabits();
  }, []);

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={refreshHabits}
          colors={[colors.primary]}
        />
      }
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Your Progress</Text>
        <Text style={[styles.subtitle, { color: colors.text }]}>
          Track your habit completion over time
        </Text>
      </View>
      
      <View style={styles.chartsContainer}>
        <ProgressChart
          title="Today's Progress"
          percentage={todayProgress}
        />
        
        <ProgressChart
          title="Weekly Progress"
          percentage={weeklyProgress}
        />
      </View>
      
      <View style={[styles.statsContainer, { backgroundColor: colors.card }]}>
        <Text style={[styles.statsTitle, { color: colors.text }]}>
          Statistics
        </Text>
        
        <View style={styles.statRow}>
          <Text style={[styles.statLabel, { color: colors.text }]}>
            Daily Habits Completed Today:
          </Text>
          <Text style={[styles.statValue, { color: colors.primary }]}>
            {Math.round(todayProgress)}%
          </Text>
        </View>
        
        <View style={styles.statRow}>
          <Text style={[styles.statLabel, { color: colors.text }]}>
            Weekly Habits Completed This Week:
          </Text>
          <Text style={[styles.statValue, { color: colors.primary }]}>
            {Math.round(weeklyProgress)}%
          </Text>
        </View>
      </View>
      
      <Text style={[styles.tip, { color: colors.text }]}>
        Tip: Consistency is key to building good habits. Try to complete your habits at the same time each day.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
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
  chartsContainer: {
    marginBottom: 24,
  },
  statsContainer: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 14,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  tip: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 24,
  },
});

export default ProgressScreen;