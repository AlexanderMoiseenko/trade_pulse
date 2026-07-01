import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EaseView } from 'react-native-ease';
import ReactNativeBiometrics from 'react-native-biometrics';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { resetUser, setLanguage, setBiometricsEnabled } from '../store/userSlice';
import { selectUserName, selectUserAge } from '../store/selectors/userSelectors';
import { colors, spacing, borderRadius } from '../theme';
import { t } from '../helpers/i18n';

export const ProfileScreen = () => {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();

  const name = useAppSelector(selectUserName);
  const age = useAppSelector(selectUserAge);
  
  // Direct state selection for fields that don't have dedicated selectors
  const profession = useAppSelector(state => state.user.profession);
  const interests = useAppSelector(state => state.user.interests) || [];
  const source = useAppSelector(state => state.user.source);

  // Get language directly from Redux to guarantee reactive lockstep sync
  const currentLang = useAppSelector(state => state.user.language) || 'en';
  const isBiometricsEnabled = useAppSelector(state => state.user.isBiometricsEnabled) || false;

  const handleBiometricsToggle = async (targetValue: boolean) => {
    if (targetValue === isBiometricsEnabled) return;

    if (targetValue) {
      try {
        const rnBiometrics = new ReactNativeBiometrics();
        const { available } = await rnBiometrics.isSensorAvailable();

        if (!available) {
          Alert.alert(t.profile.biometricsError, t.profile.biometricsError);
          return;
        }

        const { success } = await rnBiometrics.simplePrompt({
          promptMessage: t.profile.biometricsTestPrompt,
        });

        if (success) {
          dispatch(setBiometricsEnabled(true));
        }
      } catch (err) {
        console.error('[ProfileScreen] Biometrics error:', err);
        Alert.alert(t.profile.biometricsError, t.profile.biometricsError);
      }
    } else {
      dispatch(setBiometricsEnabled(false));
    }
  };

  const handleReset = () => {
    dispatch(resetUser());
  };

  const avatarLetter = name?.charAt(0)?.toUpperCase() || '?';

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.lg }]}>
      <Text style={styles.headerTitle}>{t.profile.title}</Text>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{avatarLetter}</Text>
          </View>
          <Text style={styles.nameText}>{name || t.feed.trader}</Text>
          <Text style={styles.professionText}>
            {profession} · {age} {t.profile.yearsOld}
          </Text>
        </View>

        {/* Interests Section */}
        {interests.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.profile.interests}</Text>
            <View style={styles.interestsRow}>
              {interests.map((tag) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Source Section */}
        {!!source && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.profile.source}</Text>
            <View style={styles.sourceCard}>
              <Text style={styles.sourceText}>{source}</Text>
            </View>
          </View>
        )}

        {/* Settings Section */}
        <Text style={styles.sectionTitle}>{t.profile.settings}</Text>

        <View style={styles.settingsContainer}>
          {/* Language Switch */}
          <View style={styles.settingsRow}>
            <Text style={styles.settingsLabel}>{t.profile.language}</Text>
            <View style={styles.segmentedContainer}>
              {/* Sliding Active Capsule */}
              <EaseView
                animate={{
                  translateX: currentLang === 'en' ? 0 : 50,
                }}
                transition={{ type: 'spring', damping: 18, stiffness: 220 }}
                style={styles.segmentedHighlight}
              />
              
              {/* EN Option */}
              <TouchableOpacity
                style={styles.segmentedButton}
                onPress={() => dispatch(setLanguage('en'))}
                activeOpacity={0.7}
                accessible={true}
                accessibilityRole="button"
                accessibilityState={{ selected: currentLang === 'en' }}
                accessibilityLabel="English"
                accessibilityHint={t.a11y.languageSwitch.replace('{{lang}}', 'English')}
              >
                <Text
                  style={[
                    styles.segmentedText,
                    currentLang === 'en' && styles.segmentedTextActive,
                  ]}
                >
                  EN
                </Text>
              </TouchableOpacity>

              {/* UA Option */}
              <TouchableOpacity
                style={styles.segmentedButton}
                onPress={() => dispatch(setLanguage('uk'))}
                activeOpacity={0.7}
                accessible={true}
                accessibilityRole="button"
                accessibilityState={{ selected: currentLang === 'uk' }}
                accessibilityLabel="Українська"
                accessibilityHint={t.a11y.languageSwitch.replace('{{lang}}', 'Українська')}
              >
                <Text
                  style={[
                    styles.segmentedText,
                    currentLang === 'uk' && styles.segmentedTextActive,
                  ]}
                >
                  UA
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Biometrics Switch */}
          <View style={styles.settingsRow}>
            <Text style={styles.settingsLabel}>{t.profile.biometricsLabel}</Text>
            <View style={styles.segmentedContainer}>
              {/* Sliding Active Capsule */}
              <EaseView
                animate={{
                  translateX: !isBiometricsEnabled ? 0 : 50,
                }}
                transition={{ type: 'spring', damping: 18, stiffness: 220 }}
                style={styles.segmentedHighlight}
              />
              
              {/* OFF Option */}
              <TouchableOpacity
                style={styles.segmentedButton}
                onPress={() => handleBiometricsToggle(false)}
                activeOpacity={0.7}
                accessible={true}
                accessibilityRole="button"
                accessibilityState={{ selected: !isBiometricsEnabled }}
                accessibilityHint={t.a11y.biometricsToggle}
              >
                <Text
                  style={[
                    styles.segmentedText,
                    !isBiometricsEnabled && styles.segmentedTextActive,
                  ]}
                >
                  OFF
                </Text>
              </TouchableOpacity>

              {/* ON Option */}
              <TouchableOpacity
                style={styles.segmentedButton}
                onPress={() => handleBiometricsToggle(true)}
                activeOpacity={0.7}
                accessible={true}
                accessibilityRole="button"
                accessibilityState={{ selected: isBiometricsEnabled }}
                accessibilityHint={t.a11y.biometricsToggle}
              >
                <Text
                  style={[
                    styles.segmentedText,
                    isBiometricsEnabled && styles.segmentedTextActive,
                  ]}
                >
                  ON
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Onboarding Reset */}
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetButtonText}>{t.feed.reset}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
    paddingHorizontal: spacing.xxl,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.text.primary,
    marginBottom: spacing.xl,
  },
  scrollView: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: colors.bg.secondary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.bg.elevated,
    marginBottom: spacing.xl,
  },
  avatarContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.state.selectedBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.accent.green,
    shadowColor: colors.accent.green,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: spacing.md,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.accent.green,
  },
  nameText: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.text.primary,
    marginBottom: 4,
  },
  professionText: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  interestsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  tag: {
    backgroundColor: colors.bg.secondary,
    borderRadius: borderRadius.sm,
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
    margin: 4,
    borderWidth: 1,
    borderColor: colors.bg.elevated,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.subtle,
  },
  sourceCard: {
    backgroundColor: colors.bg.secondary,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.bg.elevated,
  },
  sourceText: {
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: '500',
  },
  settingsContainer: {
    backgroundColor: colors.bg.secondary,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.bg.elevated,
    marginBottom: spacing.xxxl,
    overflow: 'hidden',
  },
  settingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.bg.elevated,
  },
  settingsLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  segmentedContainer: {
    width: 104,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.bg.elevated,
    flexDirection: 'row',
    padding: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  segmentedHighlight: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.accent.green,
    position: 'absolute',
    top: 2,
    left: 2,
  },
  segmentedButton: {
    width: 50,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  segmentedText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text.secondary,
  },
  segmentedTextActive: {
    color: colors.text.dark,
  },
  resetButton: {
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButtonText: {
    fontSize: 14,
    color: colors.accent.red,
    fontWeight: '700',
  },
});
