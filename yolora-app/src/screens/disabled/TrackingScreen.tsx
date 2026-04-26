import React, { useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ThemeContext } from '../../context/ThemeContext';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { Button, Card } from '../../components';

export const TrackingScreen = () => {
  const { colors } = useContext(ThemeContext);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute<any>();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.container}>
        <Text style={[Typography.accessibleH1, { color: colors.text, textAlign: 'center', marginBottom: Spacing.xl }]}>
          Help is on the way!
        </Text>

        <Card elevated style={{ alignItems: 'center', padding: Spacing.xxl }}>
          <Text style={[Typography.accessibleBody, { color: colors.success, marginBottom: Spacing.md }]}>
            A helper has accepted your request.
          </Text>
          <Text style={[Typography.body, { color: colors.textSecondary, textAlign: 'center' }]}>
            They are currently 2 mins away.
          </Text>
        </Card>

        <View style={{ flex: 1 }} />

        <Button
          title="Cancel Request"
          accessible
          variant="outline"
          onPress={() => navigation.navigate('DisabledHome')}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.xl,
  },
});
