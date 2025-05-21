"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { View, Text, StyleSheet, Animated } from "react-native"
import { useTheme } from "../context/ThemeContext"

type StreakAnimationProps = {
  streakCount: number
  visible: boolean
  onAnimationComplete: () => void
}

const StreakAnimation: React.FC<StreakAnimationProps> = ({ streakCount, visible, onAnimationComplete }) => {
  const { colors } = useTheme()

  // Use separate Animated.Values for scale and opacity with native driver
  const scaleAnim = useRef(new Animated.Value(0)).current
  const opacityAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (visible) {
      // Reset animations
      scaleAnim.setValue(0)
      opacityAnim.setValue(0)

      // Start animations
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(1500),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onAnimationComplete()
      })
    }
  }, [visible, onAnimationComplete])

  if (!visible) return null

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.streakContainer,
            {
              backgroundColor: colors.primary,
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={styles.streakText}>{streakCount} Day Streak!</Text>
          <Text style={styles.streakEmoji}>🔥</Text>
        </Animated.View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  streakContainer: {
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  streakText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  streakEmoji: {
    fontSize: 40,
  },
})

export default StreakAnimation
