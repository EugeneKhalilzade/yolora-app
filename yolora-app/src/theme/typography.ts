// ──────────────────────────────────────────────
// Yolora — Typography
// ──────────────────────────────────────────────

import { TextStyle } from 'react-native';

export const Typography: Record<string, TextStyle> = {
  h1: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  bodyBold: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  small: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
  button: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
    letterSpacing: 0.5,
  },
  // Accessibility: larger text for disabled users
  accessibleH1: {
    fontSize: 40,
    fontWeight: '700',
    lineHeight: 48,
  },
  accessibleBody: {
    fontSize: 22,
    fontWeight: '500',
    lineHeight: 32,
  },
  accessibleButton: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
  },
};
