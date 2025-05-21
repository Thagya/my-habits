import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './srcc/context/ThemeContext';
import { AuthProvider } from './srcc/context/AuthContext';
import { HabitProvider } from './srcc/context/HabitContext';
import AppNavigator from './srcc/navigation/AppNavigator';

const App = () => {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <HabitProvider>
            <AppNavigator />
          </HabitProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default App;