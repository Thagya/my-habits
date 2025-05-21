"use client"

import type React from "react"
import { useRef } from "react"
import { TouchableOpacity, Text, StyleSheet, Animated, type TouchableOpacityProps, type GestureResponderEvent } from "react-native"

type AnimatedButtonProps = TouchableOpacityProps & {
  title: string
  backgroundColor: string
  textColor?: string
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  title,
  backgroundColor,
  textColor = "#FFFFFF",
  onPress,
  disabled,
  ...rest
}) => {
  // Use a single Animated.Value for scale with native driver
  const scaleAnim = useRef(new Animated.Value(1)).current

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.95,
      duration: 100,
      useNativeDriver: true,
    }).start()
  }

  const handlePressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start()
  }

  const handlePress = (event: GestureResponderEvent) => {
    if (onPress) {
      onPress(event)
    }
  }

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor }, disabled && styles.disabled]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={0.8}
        {...rest}
      >
        <Text style={[styles.text, { color: textColor }]}>{title}</Text>
      </TouchableOpacity>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontWeight: "600",
    fontSize: 14,
  },
  disabled: {
    opacity: 0.6,
  },
})

export default AnimatedButton
