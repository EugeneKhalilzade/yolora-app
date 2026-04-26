import React, { useContext } from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { Spacing } from '../theme/spacing';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  elevated?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  elevated = false,
}) => {
  const { colors } = useContext(ThemeContext);

  const containerStyle: ViewStyle = {
    backgroundColor: elevated ? colors.surfaceElevated : colors.surface,
    borderRadius: 16,
    padding: Spacing.lg,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: elevated ? 0.3 : 0.1,
    shadowRadius: elevated ? 12 : 8,
    elevation: elevated ? 6 : 3,
    marginBottom: Spacing.md,
  };

  if (onPress) {
    return (
      <TouchableOpacity
        style={[containerStyle, style]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[containerStyle, style]}>{children}</View>;
};
