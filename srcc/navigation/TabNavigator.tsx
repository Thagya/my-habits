import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HabitListScreen from '../screens/HabitListScreen';
import CreateHabitScreen from '../screens/CreateHabitScreen';
import ProgressScreen from '../screens/ProgressScreen';
import CalendarScreen from '../screens/CalenderScreen';
import { useTheme } from '../context/ThemeContext';
import { Text, StyleSheet, View } from 'react-native';

export type TabParamList = {
  HabitList: undefined;
  CreateHabit: undefined;
  Progress: undefined;
  Calendar: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

// Custom tab bar icons
const TabBarIcon: React.FC<{ focused: boolean; name: string }> = ({ focused, name }) => {
  const { colors } = useTheme();
  
  const getIcon = () => {
    switch (name) {
      case 'HabitList':
        return '📋';
      case 'CreateHabit':
        return '➕';
      case 'Progress':
        return '📊';
      case 'Calendar':
        return '📅';
      default:
        return '📋';
    }
  };
  
  return (
    <View style={styles.iconContainer}>
      <Text style={[
        styles.icon,
        { color: focused ? colors.primary : colors.text }
      ]}>
        {getIcon()}
      </Text>
    </View>
  );
};

const TabNavigator: React.FC = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text,
      }}
    >
      <Tab.Screen 
        name="HabitList" 
        component={HabitListScreen} 
        options={{
          title: 'My Habits',
          tabBarLabel: 'Habits',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="HabitList" />,
        }}
      />
      <Tab.Screen 
        name="CreateHabit" 
        component={CreateHabitScreen} 
        options={{
          title: 'Create Habit',
          tabBarLabel: 'Create',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="CreateHabit" />,
        }}
      />
      <Tab.Screen 
        name="Progress" 
        component={ProgressScreen} 
        options={{
          title: 'Progress',
          tabBarLabel: 'Progress',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="Progress" />,
        }}
      />
      <Tab.Screen 
        name="Calendar" 
        component={CalendarScreen} 
        options={{
          title: 'Calendar',
          tabBarLabel: 'Calendar',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="Calendar" />,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
  },
});

export default TabNavigator;