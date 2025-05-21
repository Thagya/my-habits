import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated } from 'react-native';
import { useTheme } from '../context/ThemeContext';

type ProgressChartProps = {
  title: string;
  percentage: number;
  animate?: boolean;
};

const ProgressChart: React.FC<ProgressChartProps> = ({ 
  title, 
  percentage,
  animate = true,
}) => {
  const { colors } = useTheme();
  const width = Dimensions.get('window').width - 48;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    if (animate) {
      // Animate progress bar
      Animated.timing(progressAnim, {
        toValue: percentage,
        duration: 1000,
        useNativeDriver: false,
      }).start();
      
      // Pulse animation if 100% complete
      if (percentage === 100) {
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.05,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      }
    } else {
      progressAnim.setValue(percentage);
    }
  }, [percentage, animate]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: [0, width],
    extrapolate: 'clamp',
  });

  const progressColor = progressAnim.interpolate({
    inputRange: [0, 50, 100],
    outputRange: [colors.primary, colors.primary, colors.success],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View 
      style={[
        styles.container, 
        { transform: [{ scale: scaleAnim }] }
      ]}
    >
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <View style={[styles.progressContainer, { backgroundColor: colors.border }]}>
        <Animated.View 
          style={[
            styles.progressBar, 
            { 
              width: progressWidth, 
              backgroundColor: progressColor,
            }
          ]} 
        />
      </View>
      <Animated.Text 
        style={[
          styles.percentage, 
          { 
            color: progressAnim.interpolate({
              inputRange: [0, 50, 100],
              outputRange: [colors.text, colors.primary, colors.success],
              extrapolate: 'clamp',
            }) 
          }
        ]}
      >
        {Math.round(percentage)}%
      </Animated.Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  progressContainer: {
    height: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
  },
  percentage: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'right',
  },
});

export default ProgressChart;