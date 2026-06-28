export const colors = {
  bg: {
    primary: '#0A0A0C', // Midnight — main background
    secondary: '#1C1C1E', // Card / Input backgrounds
    elevated: '#2C2C2E', // Borders, subtle surfaces
  },
  accent: {
    green: '#34C759', // CTA, profit, progress
    red: '#FF3B30', // Loss, error, destructive
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#8E8E93', // Muted labels
    subtle: '#E5E5EA', // Tag text
    placeholder: '#555555',
    dark: '#000000', // CTA text on green button
  },
  state: {
    selectedBg: '#1C2E24', // Background on selection (green tint)
  },
} as const;
