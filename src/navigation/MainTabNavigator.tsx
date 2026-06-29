import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EaseView } from 'react-native-ease';
import { useAppSelector } from '../store/hooks';
import { FeedScreen } from '../screens/FeedScreen';
import { PortfolioScreen } from '../screens/PortfolioScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { colors, spacing, borderRadius } from '../theme';
import { t } from '../helpers/i18n';

type Tab = 'markets' | 'portfolio' | 'profile';

// Custom lightweight vector icons built with pure React Native Views
const MarketsIcon = ({ color }: { color: string }) => (
  <View style={[styles.iconContainer, { flexDirection: 'row', alignItems: 'flex-end' }]}>
    <View style={[styles.marketsBar, { height: 8, backgroundColor: color }]} />
    <View style={[styles.marketsBar, { height: 14, backgroundColor: color }]} />
    <View style={[styles.marketsBar, { height: 11, backgroundColor: color }]} />
  </View>
);

const PortfolioIcon = ({ color }: { color: string }) => (
  <View style={styles.iconContainer}>
    {/* Handle */}
    <View style={[styles.portfolioHandle, { borderColor: color }]} />
    {/* Body */}
    <View style={[styles.portfolioBody, { borderColor: color }]} />
  </View>
);

const ProfileIcon = ({ color }: { color: string }) => (
  <View style={styles.iconContainer}>
    {/* Head */}
    <View style={[styles.profileHead, { borderColor: color }]} />
    {/* Body */}
    <View style={[styles.profileBody, { borderColor: color }]} />
  </View>
);

// Tab configuration list for scalable tab bar rendering
const TABS_CONFIG = [
  { id: 'markets', labelKey: 'markets' as const, Icon: MarketsIcon },
  { id: 'portfolio', labelKey: 'portfolio' as const, Icon: PortfolioIcon },
  { id: 'profile', labelKey: 'profile' as const, Icon: ProfileIcon },
] as const;

export const MainTabNavigator = () => {
  const [activeTab, setActiveTab] = useState<Tab>('markets');
  const insets = useSafeAreaInsets();

  // Subscribe to Redux language to trigger UI updates on language switch
  useAppSelector(state => state.user.language);

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'markets':
        return <FeedScreen />;
      case 'portfolio':
        return <PortfolioScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <FeedScreen />;
    }
  };

  const renderTabButton = (tabId: Tab, label: string, Icon: React.ComponentType<{ color: string }>) => {
    const isActive = activeTab === tabId;
    const color = isActive ? colors.accent.green : colors.text.secondary;

    return (
      <Pressable
        key={tabId}
        onPress={() => setActiveTab(tabId)}
        style={styles.tabPressable}
      >
        <EaseView
          animate={{
            scale: isActive ? 1.05 : 1.0,
            backgroundColor: isActive ? colors.state.selectedBg : 'transparent',
          }}
          transition={{ type: 'spring', damping: 14, stiffness: 220 }}
          style={[
            styles.tabButton,
            isActive && styles.activeTabButton,
          ]}
        >
          <Icon color={color} />
          <Text style={[styles.tabLabel, isActive ? styles.activeText : styles.inactiveText]}>
            {label}
          </Text>
        </EaseView>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      {/* Content Area */}
      <View style={styles.contentArea}>
        {renderActiveScreen()}
      </View>

      {/* Floating Bottom Tab Bar */}
      <View
        style={[
          styles.tabBar,
          {
            height: 64 + insets.bottom,
            paddingBottom: insets.bottom || spacing.sm,
          },
        ]}
      >
        {TABS_CONFIG.map(tab =>
          renderTabButton(tab.id, t.tabs[tab.labelKey], tab.Icon)
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  contentArea: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colors.bg.secondary,
    borderTopWidth: 1,
    borderTopColor: colors.bg.elevated,
    paddingHorizontal: spacing.md,
  },
  tabPressable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    width: '90%',
    maxWidth: 110,
    borderWidth: 1,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  activeTabButton: {
    borderColor: 'rgba(52, 199, 89, 0.25)',
  },
  iconContainer: {
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  marketsBar: {
    width: 3,
    marginHorizontal: 1,
    borderRadius: 1.5,
  },
  portfolioHandle: {
    width: 8,
    height: 3,
    borderTopWidth: 1.5,
    borderLeftWidth: 1.5,
    borderRightWidth: 1.5,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    marginBottom: -1.5,
  },
  portfolioBody: {
    width: 18,
    height: 11,
    borderWidth: 1.5,
    borderRadius: 3,
  },
  profileHead: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    marginBottom: 1,
  },
  profileBody: {
    width: 14,
    height: 5,
    borderTopWidth: 1.5,
    borderLeftWidth: 1.5,
    borderRightWidth: 1.5,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  activeText: {
    color: colors.accent.green,
  },
  inactiveText: {
    color: colors.text.secondary,
  },
});
