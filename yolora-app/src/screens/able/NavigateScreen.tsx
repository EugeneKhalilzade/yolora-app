import React, { useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ThemeContext } from '../../context/ThemeContext';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { Button, Card } from '../../components';

export const NavigateScreen = () => {
  const { colors } = useContext(ThemeContext);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute<any>();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[Typography.h2, { color: colors.text }]}>
            Navigate to Requester
          </Text>
        </View>

        {/* Map Placeholder */}
        <View style={[styles.mapPlaceholder, { backgroundColor: colors.surfaceElevated }]}>
          <Text style={[Typography.bodyBold, { color: colors.textMuted }]}>
            Map with directions to ({route.params?.requesterLatitude.toFixed(2)}, {route.params?.requesterLongitude.toFixed(2)})
          </Text>
        </View>

        <Card elevated style={{ marginTop: Spacing.xl }}>
          <Text style={[Typography.h3, { color: colors.text, marginBottom: Spacing.sm }]}>
            Arrival
          </Text>
          <Text style={[Typography.body, { color: colors.textSecondary, marginBottom: Spacing.md }]}>
            Once you meet the requester, mark the request as complete.
          </Text>
          <Button
            title="Complete Request"
            variant="primary"
            onPress={() => navigation.navigate('AbleHome')}
          />
        </Card>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.xl,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  mapPlaceholder: {
    flex: 1,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
});
