import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useHabits } from '../context/HabitContext';
import HabitForm from '../components/HabitForm';

const CreateHabitScreen: React.FC = () => {
  const { colors } = useTheme();
  const { createHabit } = useHabits();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateHabit = async (name: string, frequency: 'daily' | 'weekly') => {
    setIsLoading(true);
    
    try {
      await createHabit(name, frequency);
      Alert.alert('Success', 'Habit created successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to create habit');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <HabitForm onSubmit={handleCreateHabit} isLoading={isLoading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

export default CreateHabitScreen;