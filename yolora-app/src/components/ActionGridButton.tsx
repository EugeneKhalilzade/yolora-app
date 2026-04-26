import React, { useContext } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { Typography } from '../theme/typography';
import { Spacing } from '../theme/spacing';
import Icon from 'react-native-vector-icons/Ionicons';

interface ActionGridButtonProps {
  title: string;
  iconName: string;
  onPress: () => void;
}

export const ActionGridButton: React.FC<ActionGridButtonProps> = ({ title, iconName, onPress }) => {
  const { colors } = useContext(ThemeContext);

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
        <Icon name={iconName} size={22} color={colors.primary} />
      </View>
      <Text style={[Typography.caption, { color: colors.text, marginTop: Spacing.md, fontWeight: '600' }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    padding: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    aspectRatio: 1, // Make it square
    width: '47%', // Fits 2 in a row with gap
    borderWidth: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
