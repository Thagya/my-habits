"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { View, StyleSheet, Animated, Dimensions } from "react-native"

type ConfettiProps = {
  active: boolean
  onComplete: () => void
  colors: string[]
  count?: number
  duration?: number
}

const { width, height } = Dimensions.get("window")

const Confetti: React.FC<ConfettiProps> = ({ active, onComplete, colors, count = 30, duration = 2000 }) => {
  // Create a ref to store our confetti pieces
  const confettiRefs = useRef<
    Array<{
      x: Animated.Value
      y: Animated.Value
      rotation: Animated.Value
      scale: Animated.Value
      opacity: Animated.Value
    }>
  >([])

  useEffect(() => {
    if (active) {
      // Initialize confetti pieces
      confettiRefs.current = Array(count)
        .fill(0)
        .map(() => ({
          x: new Animated.Value(0),
          y: new Animated.Value(0),
          rotation: new Animated.Value(0),
          scale: new Animated.Value(0),
          opacity: new Animated.Value(0),
        }))

      // Animate confetti
      const animations = confettiRefs.current.map((confetti) => {
        const delay = Math.random() * 500

        return Animated.parallel([
          // All these animations can use native driver
          Animated.timing(confetti.opacity, {
            toValue: 1,
            duration: 300,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(confetti.scale, {
            toValue: Math.random() * 0.5 + 0.5,
            duration: 300,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(confetti.x, {
            toValue: Math.random() * width - width / 2,
            duration,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(confetti.y, {
            toValue: height,
            duration,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(confetti.rotation, {
            toValue: Math.random() * 360,
            duration,
            delay,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.delay(duration - 300 + delay),
            Animated.timing(confetti.opacity, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ]),
        ])
      })

      Animated.parallel(animations).start(() => {
        onComplete()
      })
    }
  }, [active, count, duration, onComplete])

  if (!active) return null

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {confettiRefs.current.map((confetti, index) => {
        const color = colors[index % colors.length]

        return (
          <Animated.View
            key={index}
            style={[
              styles.confetti,
              {
                backgroundColor: color,
                opacity: confetti.opacity,
                transform: [
                  { translateX: confetti.x },
                  { translateY: confetti.y },
                  {
                    rotate: confetti.rotation.interpolate({
                      inputRange: [0, 360],
                      outputRange: ["0deg", "360deg"],
                    }),
                  },
                  { scale: confetti.scale },
                ],
              },
            ]}
          />
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  confetti: {
    position: "absolute",
    top: -20,
    left: width / 2,
    width: 10,
    height: 10,
  },
})

export default Confetti
