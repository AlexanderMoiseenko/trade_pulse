import React, { useState } from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { EaseView } from 'react-native-ease';
import { colors, spacing, borderRadius } from '../../theme';

interface AnimatedButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const AnimatedButton = ({
  title,
  onPress,
  disabled = false,
  style,
  textStyle,
}: AnimatedButtonProps) => {
  const [pressed, setPressed] = useState(false);

  return (
    <Pressable
      onPressIn={() => !disabled && setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={onPress}
      disabled={disabled}
      style={style}
    >
      <EaseView
        animate={{ scale: pressed ? 0.95 : 1 }}
        transition={{ type: 'spring', damping: 15, stiffness: 200 }}
        style={[styles.button, disabled && styles.disabledButton]}
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
