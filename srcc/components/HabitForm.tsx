import React, { useState } from 'react';
import { View, StyleSheet, Switch, Text } from 'react-native';
import Input from './Input';
import Button from './Button';
import { useTheme } from '../context/ThemeContext';

type HabitFormProps = {
  onSubmit: (name: string, frequency: 'daily' | 'weekly') => void;
  isLoading?: boolean;
};

const HabitForm: React.FC<HabitFormProps> = ({ onSubmit, isLoading = false }) => {
  const [name, setName] = useState('');
  const [isDaily, setIsDaily] = useState(true);
  const [error, setError] = useState('');
  const { colors } = useTheme();

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('Habit name is required');
      return;
    }
    
    setError('');
    onSubmit(name, isDaily ? 'daily' : 'weekly');
    setName('');
  };

  return (
    <View style={styles.container}>
      <Input
        label="Habit Name"
        value={name}
        onChangeText={setName}
        placeholder="e.g., Exercise, Read, Drink Water"
        error={error}
      />
      
      <View style={styles.frequencyContainer}>
        <Text style={[styles.frequencyLabel, { color: colors.text }]}>Frequency:</Text>
        <View style={styles.switchContainer}>
          <Text style={[styles.switchLabel, { color: colors.text, opacity: isDaily ? 1 : 0.5 }]}>
            Daily
          </Text>
          <Switch
            value={!isDaily}
            onValueChange={value => setIsDaily(!value)}
            trackColor={{ false: colors.primary, true: colors.primary }}
            thumbColor="#FFFFFF"
          />
          <Text style={[styles.switchLabel, { color: colors.text, opacity: isDaily ? 0.5 : 1 }]}>
            Weekly
          </Text>
        </View>
      </View>
      
      <Button
        title="Create Habit"
        onPress={handleSubmit}
        loading={isLoading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  frequencyContainer: {
    marginBottom: 24,
  },
  frequencyLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  switchLabel: {
    fontSize: 16,
    marginHorizontal: 8,
  },
});

export default HabitForm;