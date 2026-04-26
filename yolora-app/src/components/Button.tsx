import React, { useContext } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { Typography } from '../theme/typography';
import { Spacing } from '../theme/spacing';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'normal' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessible?: boolean; // Changes to highly accessible design
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'normal',
  disabled = false,
  loading = false,
  style,
  textStyle,
  accessible = false,
  icon,
}) => {
  const { colors } = useContext(ThemeContext);

  const getBackgroundColor = () => {
    if (disabled) return colors.disabled;
    switch (variant) {
      case 'primary': return colors.primary;
      case 'secondary': return colors.secondary;
      case 'outline': return 'transparent';
      case 'ghost': return 'transparent';
      case 'danger': return colors.error;
      default: return colors.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return colors.textMuted;
    switch (variant) {
      case 'primary':
      case 'secondary':
      case 'danger':
        return '#FFFFFF';
      case 'outline':
      case 'ghost':
        return colors.primary;
      default:
        return '#FFFFFF';
    }
  };

  const getBorderColor = () => {
    if (disabled) return colors.disabled;
    if (variant === 'outline') return colors.primary;
    return 'transparent';
  };

  const containerStyle: ViewStyle = {
    backgroundColor: getBackgroundColor(),
    borderColor: getBorderColor(),
    borderWidth: variant === 'outline' ? 2 : 0,
    borderRadius: accessible ? 16 : 12,
    paddingVertical: accessible ? Spacing.xl : size === 'large' ? Spacing.lg : Spacing.md,
    paddingHorizontal: accessible ? Spacing.xxl : Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: accessible ? 80 : size === 'large' ? 56 : 48,
    shadowColor: variant === 'primary' ? colors.primary : '#000',
    shadowOffset: { width: 0, height: variant !== 'ghost' && variant !== 'outline' ? 4 : 0 },
    shadowOpacity: variant !== 'ghost' && variant !== 'outline' ? 0.3 : 0,
    shadowRadius: 8,
    elevation: variant !== 'ghost' && variant !== 'outline' ? 4 : 0,
    opacity: disabled ? 0.6 : 1,
  };

  const tStyle: TextStyle = {
    color: getTextColor(),
    ...(accessible ? Typography.accessibleButton : Typography.button),
    marginLeft: icon ? Spacing.sm : 0,
  };

  return (
    <TouchableOpacity
      style={[containerStyle, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size={accessible ? 'large' : 'small'} />
      ) : (
        <>
          {icon}
          <Text style={[tStyle, textStyle]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};
