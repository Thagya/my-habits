import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useHabits } from '../context/HabitContext';
import { useAuth } from '../context/AuthContext';
import HabitCard from '../components/HabitCard';
import { HabitFilter } from '../types/habit';
import Confetti from '../components/Confetti';
import StreakAnimation from '../components/StreakAnimation';

const HabitListScreen: React.FC = () => {
  const { colors } = useTheme();
  const { 
    filteredHabits, 
    filter, 
    setFilter, 
    isLoading, 
    completeHabit, 
    uncompleteHabit, 
    deleteHabit,
    refreshHabits,
    getCurrentStreak
  } = useHabits();
  const { logout } = useAuth();

  const [showConfetti, setShowConfetti] = useState(false);
  const [showStreakAnimation, setShowStreakAnimation] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [completedHabitId, setCompletedHabitId] = useState<string | null>(null);

  useEffect(() => {
    refreshHabits();
  }, []);

  const handleDeleteHabit = (habitId: string) => {
    Alert.alert(
      'Delete Habit',
      'Are you sure you want to delete this habit?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteHabit(habitId)
        }
      ]
    );
  };

  const handleCompleteHabit = async (habitId: string) => {
    await completeHabit(habitId);
    setCompletedHabitId(habitId);
    
    // Show confetti animation
    setShowConfetti(true);
    
    // Check if this completion creates or extends a streak
    const streak = getCurrentStreak(habitId);
    if (streak >= 3) {
      // Show streak animation for 3+ day streaks
      setCurrentStreak(streak);
      setShowStreakAnimation(true);
    }
  };

  const handleConfettiComplete = () => {
    setShowConfetti(false);
  };

  const handleStreakAnimationComplete = () => {
    setShowStreakAnimation(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => logout()
        }
      ]
    );
  };

  const renderFilterButton = (filterType: HabitFilter, label: string) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        filter === filterType && { backgroundColor: colors.primary }
      ]}
      onPress={() => setFilter(filterType)}
    >
      <Text 
        style={[
          styles.filterButtonText,
          filter === filterType ? { color: '#FFFFFF' } : { color: colors.text }
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Logout button */}
      <TouchableOpacity 
        style={[styles.logoutButton, { backgroundColor: colors.error }]} 
        onPress={handleLogout}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      {/* Confetti animation */}
      <Confetti 
        active={showConfetti} 
        onComplete={handleConfettiComplete}
        colors={[colors.primary, colors.secondary, colors.success, colors.accent, '#FF9500']}
      />
      
      {/* Streak animation */}
      <StreakAnimation 
        streakCount={currentStreak}
        visible={showStreakAnimation}
        onAnimationComplete={handleStreakAnimationComplete}
      />
      
      <View style={styles.filterContainer}>
        {renderFilterButton('all', 'All Habits')}
        {renderFilterButton('today', 'Today\'s Habits')}
        {renderFilterButton('completed', 'Completed Today')}
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : filteredHabits.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.text }]}>
            No habits found. Create a new habit to get started!
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredHabits}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <HabitCard
              habit={item}
              onComplete={() => handleCompleteHabit(item.id)}
              onUncomplete={() => uncompleteHabit(item.id)}
              onDelete={() => handleDeleteHabit(item.id)}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  logoutButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default HabitListScreen;