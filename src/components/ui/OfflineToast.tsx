import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EaseView } from 'react-native-ease';
import { useAppSelector } from '../../store/hooks';
import { spacing, borderRadius } from '../../theme';
import { t } from '../../helpers/i18n';

type ToastType = 'offline' | 'online';

export const OfflineToast = () => {
  const insets = useSafeAreaInsets();
  const isOffline = useAppSelector((state) => state.user.isOffline);
  const prevIsOfflineRef = useRef(isOffline);

  // Subscribe to Redux language to trigger instant local translation re-renders
  useAppSelector((state) => state.user.language);

  const [visible, setVisible] = useState(false);
  const [toastType, setToastType] = useState<ToastType>('offline');
  const [text, setText] = useState('');

  console.log('[OfflineToast] render visible:', visible, 'isOffline:', isOffline, 'toastType:', toastType);

  useEffect(() => {
    const prevIsOffline = prevIsOfflineRef.current;
    prevIsOfflineRef.current = isOffline;

    if (isOffline) {
      // Transition: Online -> Offline
      setToastType('offline');
      setText(t.feed.offlineToast);
      setVisible(true);

      // Auto-hide offline banner after 5 seconds to clear the UI
      const timer = setTimeout(() => {
        console.log('[OfflineToast] 5s Timeout fired! Setting visible: false');
        setVisible(false);
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      // Transition: Offline -> Online (only if we were actually offline previously)
      if (prevIsOffline) {
        setToastType('online');
        setText(t.feed.onlineToast);
        setVisible(true);

        // Auto-hide online success banner after 3 seconds
        const timer = setTimeout(() => {
          console.log('[OfflineToast] 3s Timeout fired! Setting visible: false');
          setVisible(false);
        }, 3000);
        return () => clearTimeout(timer);
      } else {
        // App started online, keep toast hidden
        setVisible(false);
      }
    }
  }, [isOffline]);

  const handleDismiss = () => {
    setVisible(false);
  };

  const isTypeOffline = toastType === 'offline';

  return (
    <Pressable
      onPress={handleDismiss}
      style={[
        styles.toastWrapper,
        { top: insets.top + spacing.md },
      ]}
      pointerEvents={visible ? 'auto' : 'none'}
    >
      <EaseView
        animate={{
          translateY: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{ type: 'spring', damping: 15, stiffness: 180 }}
        style={[
          styles.toastContainer,
          isTypeOffline ? styles.offlineContainer : styles.onlineContainer,
        ]}
      >
        <Text style={styles.toastText}>
          {isTypeOffline ? '⚠️ ' : '✅ '}
          {text}
        </Text>
      </EaseView>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  toastWrapper: {
    position: 'absolute',
    left: '5%',
    right: '5%',
    width: '90%',
    zIndex: 9999,
  },
  toastContainer: {
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  offlineContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.95)', // Crimson red warning with opacity
    borderColor: 'rgba(248, 113, 113, 0.4)',
  },
  onlineContainer: {
    backgroundColor: 'rgba(16, 185, 129, 0.95)', // Emerald green success with opacity
    borderColor: 'rgba(110, 231, 183, 0.4)',
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.1,
  },
});
