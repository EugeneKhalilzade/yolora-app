import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { Typography } from '../theme/typography';
import { Spacing } from '../theme/spacing';

interface YoloAIBannerProps {
  message?: string;
}

export const YoloAIBanner: React.FC<YoloAIBannerProps> = ({ 
  message = "Metro station 200m ahead. Elevator on your left. Quiet zone in Car 3." 
}) => {
  const { colors } = useContext(ThemeContext);

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <View style={styles.header}>
        <Text style={[Typography.caption, { color: 'rgba(255, 255, 255, 0.7)', fontWeight: 'bold', letterSpacing: 0.5 }]}>
          YOLO AI
        </Text>
      </View>
      <Text style={[Typography.bodyBold, { color: '#FFFFFF', marginTop: 4 }]}>
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    padding: Spacing.xl,
    width: '100%',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
});
