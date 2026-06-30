import React, { useState } from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle, StyleProp } from 'react-native';
import { EaseView } from 'react-native-ease';
import { colors, spacing, borderRadius } from '../../theme';

interface AnimatedButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  accessibilityLabel?: string;
  accessibilityRole?: 'button' | 'link' | 'none';
}

export const AnimatedButton = ({
  title,
  onPress,
  disabled = false,
  style,
  textStyle,
  accessibilityLabel,
  accessibilityRole,
}: AnimatedButtonProps) => {
  const [pressed, setPressed] = useState(false);

  // Separate layout-related style properties from visual ones
  const flattenedStyle = StyleSheet.flatten(style) || {};
  const {
    flex,
    margin,
    marginHorizontal,
    marginVertical,
    marginLeft,
    marginRight,
    marginTop,
    marginBottom,
    width,
    height,
    alignSelf,
    position,
    top,
    bottom,
    left,
    right,
    ...visualStyle
  } = flattenedStyle as any;

  const layoutStyle = {
    flex,
    margin,
    marginHorizontal,
    marginVertical,
    marginLeft,
    marginRight,
    marginTop,
    marginBottom,
    width,
    height,
    alignSelf,
    position,
    top,
    bottom,
    left,
    right,
  };

  return (
    <Pressable
      onPressIn={() => !disabled && setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={onPress}
      disabled={disabled}
      style={layoutStyle}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole}
    >
      <EaseView
        animate={{ scale: pressed ? 0.95 : 1 }}
        transition={{ type: 'spring', damping: 15, stiffness: 200 }}
        style={[styles.button, visualStyle, disabled && styles.disabledButton]}
      >
        <Text style={[styles.buttonText, textStyle]}>{title}</Text>
      </EaseView>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.accent.green,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: colors.text.dark,
    fontWeight: '700',
    fontSize: 16,
  },
});
