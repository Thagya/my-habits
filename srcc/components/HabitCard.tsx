"use client"

import type React from "react"
import { useState, useRef } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native"
import type { Habit } from "../types/habit"
import { useTheme } from "../context/ThemeContext"
import { formatDate } from "../utils/dataUtils"

type HabitCardProps = {
  habit: Habit
  onComplete: () => void
  onUncomplete: () => void
  onDelete: () => void
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, onComplete, onUncomplete, onDelete }) => {
  const { colors } = useTheme()
  const today = formatDate(new Date())
  const isCompletedToday = habit.completedDates.includes(today)
  const [isAnimating, setIsAnimating] = useState(false)

  // Animation values - IMPORTANT: Keep separate values for different animation types
  const scaleAnim = useRef(new Animated.Value(1)).current

  const handleComplete = () => {
    setIsAnimating(true)

    // Only use native driver for transform animations
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.03,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsAnimating(false)
      // Call the actual complete function after animation
      onComplete()
    })
  }

  const handleUncomplete = () => {
    onUncomplete()
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderLeftColor: isCompletedToday ? colors.success : colors.primary,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <View style={styles.content}>
        <Text style={[styles.name, { color: colors.text }]}>{habit.name}</Text>
        <Text style={[styles.frequency, { color: colors.text }]}>
          {habit.frequency === "daily" ? "Daily" : "Weekly"}
        </Text>

        <View style={styles.statusContainer}>
          <Text
            style={[
              styles.status,
              {
                color: isCompletedToday ? colors.success : colors.text,
                opacity: isCompletedToday ? 1 : 0.6,
              },
            ]}
          >
            {isCompletedToday ? "Completed today" : "Not completed today"}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        {isCompletedToday ? (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.warning }]}
            onPress={handleUncomplete}
            disabled={isAnimating}
          >
            <Text style={styles.actionText}>Undo</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.success }]}
            onPress={handleComplete}
            disabled={isAnimating}
          >
            <Text style={styles.actionText}>Complete</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.deleteButton, { backgroundColor: colors.error, marginTop: 8 }]}
          onPress={onDelete}
          disabled={isAnimating}
        >
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    borderWidth: 1,
    borderLeftWidth: 6,
    marginBottom: 16,
    flexDirection: "row",
    overflow: "hidden",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  frequency: {
    fontSize: 14,
    marginBottom: 8,
  },
  statusContainer: {
    marginTop: 8,
  },
  status: {
    fontSize: 14,
    fontWeight: "500",
  },
  actions: {
    padding: 8,
    justifyContent: "center",
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  actionText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 12,
  },
})

export default HabitCard
