import React, { useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ThemeContext } from '../../context/ThemeContext';
import { AuthContext } from '../../context/AuthContext';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { Button, Card } from '../../components';

export const AbleHomeScreen = () => {
  const { colors } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={[Typography.h2, { color: colors.text }]}>
              Hello, {user?.displayName}
            </Text>
            <Text style={[Typography.body, { color: colors.textSecondary }]}>
              Ready to help someone today?
            </Text>
          </View>
          <TouchableOpacity onPress={logout} style={{ padding: Spacing.sm }}>
            <Text style={{ color: colors.error, ...Typography.bodyBold }}>Logout</Text>
          </TouchableOpacity>
        </View>

        <Card elevated style={{ marginVertical: Spacing.xl }}>
          <Text style={[Typography.h3, { color: colors.text, marginBottom: Spacing.md }]}>
            Nearby Requests
          </Text>
          <Text style={[Typography.body, { color: colors.textSecondary, marginBottom: Spacing.xl }]}>
            There are people nearby who need assistance.
          </Text>
          <Button
            title="View Requests"
            onPress={() => navigation.navigate('HelpRequests')}
          />
        </Card>

        {/* Map placeholder */}
        <View style={[styles.mapPlaceholder, { backgroundColor: colors.surfaceElevated }]}>
          <Text style={[Typography.bodyBold, { color: colors.textMuted }]}>Map View Here</Text>
        </View>

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
