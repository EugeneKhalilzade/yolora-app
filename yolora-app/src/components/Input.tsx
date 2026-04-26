import React, { useContext } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextInputProps,
} from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { Typography } from '../theme/typography';
import { Spacing } from '../theme/spacing';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  icon,
  style,
  ...props
}) => {
  const { colors } = useContext(ThemeContext);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[Typography.bodyBold, { color: colors.text, marginBottom: Spacing.xs }]}>
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.surface,
            borderColor: error ? colors.error : colors.border,
          },
        ]}
      >
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <TextInput
          style={[
            Typography.body,
            styles.input,
            { color: colors.text },
            style,
          ]}
          placeholderTextColor={colors.textMuted}
          {...props}
        />
      </View>
      {error && (
        <Text style={[Typography.small, { color: colors.error, marginTop: Spacing.xs }]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    minHeight: 56,
    paddingHorizontal: Spacing.md,
  },
  iconContainer: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: Spacing.md,
  },
});
