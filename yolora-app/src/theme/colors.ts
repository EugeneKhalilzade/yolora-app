// ──────────────────────────────────────────────
// Yolora — Color Palette
// ──────────────────────────────────────────────

export const Colors = {
  light: {
    primary: '#6C63FF',       // Vibrant purple
    primaryDark: '#5A52D5',
    primaryLight: '#8B85FF',
    secondary: '#00D4AA',     // Teal accent
    secondaryDark: '#00B894',
    background: '#F8F9FE',
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    text: '#1A1A2E',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    border: '#E5E7EB',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    disabled: '#D1D5DB',
    overlay: 'rgba(0, 0, 0, 0.5)',
    cardShadow: 'rgba(108, 99, 255, 0.08)',
    helpButton: '#FF6B6B',
    helpButtonPressed: '#EE5A5A',
    acceptButton: '#10B981',
    rejectButton: '#EF4444',
    mapMarkerAble: '#10B981',
    mapMarkerDisabled: '#F59E0B',
    mapMarkerSelf: '#6C63FF',
  },
  dark: {
    primary: '#8B85FF',
    primaryDark: '#6C63FF',
    primaryLight: '#A8A3FF',
    secondary: '#00E4BB',
    secondaryDark: '#00D4AA',
    background: '#0F0F23',
    surface: '#1A1A2E',
    surfaceElevated: '#252547',
    text: '#F0F0F5',
    textSecondary: '#9CA3AF',
    textMuted: '#6B7280',
    border: '#2D2D50',
    error: '#F87171',
    success: '#34D399',
    warning: '#FBBF24',
    disabled: '#4B5563',
    overlay: 'rgba(0, 0, 0, 0.7)',
    cardShadow: 'rgba(0, 0, 0, 0.3)',
    helpButton: '#FF6B6B',
    helpButtonPressed: '#EE5A5A',
    acceptButton: '#34D399',
    rejectButton: '#F87171',
    mapMarkerAble: '#34D399',
    mapMarkerDisabled: '#FBBF24',
    mapMarkerSelf: '#8B85FF',
  },
};

export type ThemeColors = typeof Colors.light;
