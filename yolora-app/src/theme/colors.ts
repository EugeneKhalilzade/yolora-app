// ──────────────────────────────────────────────
// Yolora — Color Palette
// ──────────────────────────────────────────────

export const Colors = {
  light: {
    primary: '#5C44F4',
    primaryDark: '#4B33DD',
    primaryLight: '#A89BF9',
    secondary: '#2BB8F5',
    secondaryDark: '#1899CF',
    background: '#F3F4F8',
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    text: '#101236',
    textSecondary: '#515782',
    textMuted: '#7D82A7',
    border: '#E4E6F0',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    disabled: '#C5CAE3',
    overlay: 'rgba(16, 18, 54, 0.45)',
    cardShadow: 'rgba(21, 24, 61, 0.08)',
    helpButton: '#5C44F4',
    helpButtonPressed: '#4B33DD',
    acceptButton: '#10B981',
    rejectButton: '#EF4444',
    mapMarkerAble: '#2BB8F5',
    mapMarkerDisabled: '#F59E0B',
    mapMarkerSelf: '#5C44F4',
  },
  dark: {
    primary: '#3B82F6', // Vibrant blue from design
    primaryDark: '#2563EB',
    primaryLight: '#60A5FA',
    secondary: '#10B981',
    secondaryDark: '#059669',
    background: '#0B0F19', // Deep dark blue background
    surface: '#111827', // Card surface
    surfaceElevated: '#1F2937', // Elevated cards
    text: '#F9FAFB', // White text
    textSecondary: '#9CA3AF',
    textMuted: '#6B7280',
    border: '#374151',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    disabled: '#4B5563',
    overlay: 'rgba(0, 0, 0, 0.7)',
    cardShadow: 'rgba(0, 0, 0, 0.5)',
    helpButton: '#EF4444',
    helpButtonPressed: '#DC2626',
    acceptButton: '#10B981',
    rejectButton: '#EF4444',
    mapMarkerAble: '#10B981',
    mapMarkerDisabled: '#F59E0B',
    mapMarkerSelf: '#3B82F6',
  },
};

export type ThemeColors = typeof Colors.light;
