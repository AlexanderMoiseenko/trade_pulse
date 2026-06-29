import React, { Component, type ReactNode } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { colors, spacing, borderRadius } from '../theme';
import { t } from '../helpers/i18n';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Here we will add Sentry or any other logger in the future
    console.error('[ErrorBoundary caught an error]', error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <View style={styles.container}>
            <StatusBar
              barStyle="light-content"
              backgroundColor={colors.bg.primary}
            />
            <Text style={styles.emoji}>⚠️</Text>
            <Text style={styles.title}>{t.errorBoundary.title}</Text>
            <Text style={styles.message}>
              {this.state.error?.message || t.errorBoundary.message}
            </Text>
            <TouchableOpacity style={styles.button} onPress={this.handleRetry}>
              <Text style={styles.buttonText}>{t.errorBoundary.retry}</Text>
            </TouchableOpacity>
          </View>
        )
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bg.primary,
    padding: spacing.xxl,
  },
  emoji: {
    fontSize: 48,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xxxl,
    lineHeight: 20,
  },
  button: {
    backgroundColor: colors.accent.green,
    borderRadius: borderRadius.md,
    paddingVertical: 14,
    paddingHorizontal: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.text.dark,
    fontSize: 16,
    fontWeight: '700',
  },
});
