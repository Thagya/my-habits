

import type React from "react"
import { useEffect, useRef } from "react"
import { View, StyleSheet, Animated } from "react-native"

type CompletionAnimationProps = {
  visible: boolean
  onAnimationComplete: () => void
  color: string
}

const CompletionAnimation: React.FC<CompletionAnimationProps> = ({ visible, onAnimationComplete, color }) => {
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
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 300,
          delay: 500,
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
            styles.circle,
            {
              backgroundColor: color,
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        />
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
  circle: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
})

export default CompletionAnimation;
