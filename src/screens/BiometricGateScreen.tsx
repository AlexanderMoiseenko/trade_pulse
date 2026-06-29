import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';
import { EaseView } from 'react-native-ease';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius } from '../theme';
import { t } from '../helpers/i18n';
import { useAppSelector } from '../store/hooks';

interface BiometricGateScreenProps {
  onUnlock: () => void;
}

export const BiometricGateScreen = ({ onUnlock }: BiometricGateScreenProps) => {
  const insets = useSafeAreaInsets();
  
  // Subscribe to Redux language to trigger instant local translation re-renders
  useAppSelector((state) => state.user.language);

  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pulse, setPulse] = useState(true);

  // Slow spring pulse animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse((prev) => !prev);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const triggerBiometricScan = async () => {
    setIsAuthenticating(true);
    setErrorMessage(null);

    try {
      const rnBiometrics = new ReactNativeBiometrics();
      const { available, biometryType } = await rnBiometrics.isSensorAvailable();

      if (!available) {
        setErrorMessage(t.profile.biometricsError);
        setIsAuthenticating(false);
        return;
      }

      const { success, error } = await rnBiometrics.simplePrompt({
        promptMessage: t.profile.biometricsPrompt,
      });

      if (success) {
        onUnlock();
      } else {
        if (error === 'la_lockout' || error === 'la_biometry_lockout') {
          setErrorMessage(t.profile.biometricsLockout);
        } else {
          setErrorMessage(t.profile.biometricsError);
        }
      }
    } catch (err) {
      console.error('[BiometricGate] Error:', err);
      setErrorMessage(t.profile.biometricsError);
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Run on mount
  useEffect(() => {
    triggerBiometricScan();
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.xxl, paddingBottom: insets.bottom + spacing.xl }]}>
      {/* Title */}
      <Text style={styles.appTitle}>TRADE PULSE</Text>
      
      {/* Pulsing Lock Icon */}
      <View style={styles.centerContainer}>
        <EaseView
          animate={{ scale: pulse ? 1.06 : 0.94 }}
          transition={{ type: 'spring', damping: 12, stiffness: 90 }}
          style={styles.lockWrapper}
        >
          {/* Lock Handle (upper hoop) */}
          <View style={styles.lockHandle} />
          {/* Lock Body */}
          <View style={styles.lockBody}>
            {/* Keyhole */}
            <View style={styles.keyholeCircle} />
            <View style={styles.keyholeBar} />
          </View>
        </EaseView>

        <Text style={styles.promptText}>
          {t.profile.biometricsPrompt}
        </Text>

        {errorMessage && (
          <Text style={styles.errorText}>{errorMessage}</Text>
        )}
      </View>

      {/* Action Footer */}
      <View style={styles.footer}>
        {isAuthenticating ? (
          <ActivityIndicator size="large" color={colors.accent.green} />
        ) : (
          <TouchableOpacity style={styles.retryButton} onPress={triggerBiometricScan}>
            <Text style={styles.retryButtonText}>
              {t.errorBoundary.retry}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xxl,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: '950',
    color: colors.accent.green,
    letterSpacing: 3,
    marginTop: spacing.xl,
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingBottom: spacing.xxl,
  },
  lockWrapper: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxxl,
    position: 'relative',
  },
  lockHandle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 6,
    borderColor: colors.accent.green,
    position: 'absolute',
    top: 6,
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  lockBody: {
    width: 80,
    height: 60,
    backgroundColor: colors.accent.green,
    borderRadius: borderRadius.md,
    position: 'absolute',
    bottom: 0,
    zIndex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  keyholeCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.bg.primary,
    marginTop: -4,
  },
  keyholeBar: {
    width: 4,
    height: 12,
    backgroundColor: colors.bg.primary,
    marginTop: -2,
    borderRadius: 1,
  },
  promptText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    fontWeight: '600',
    paddingHorizontal: spacing.xl,
    lineHeight: 22,
  },
  errorText: {
    fontSize: 13,
    color: colors.accent.red,
    textAlign: 'center',
    fontWeight: '700',
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    lineHeight: 18,
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
  },
  retryButton: {
    backgroundColor: colors.bg.secondary,
    borderWidth: 1,
    borderColor: colors.bg.elevated,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
    minWidth: 180,
    alignItems: 'center',
  },
  retryButtonText: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: '700',
  },
});
