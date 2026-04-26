import React, { useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ThemeContext } from '../../context/ThemeContext';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { Button, Card } from '../../components';

export const OnboardingScreen = () => {
  const { colors } = useContext(ThemeContext);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[Typography.h1, { color: colors.primary, textAlign: 'center' }]}>
            Yolora
          </Text>
          <Text style={[Typography.body, { color: colors.textSecondary, textAlign: 'center', marginTop: Spacing.sm }]}>
            Connecting those who need help with those who can provide it.
          </Text>
        </View>

        <Card style={styles.card} elevated>
          <Text style={[Typography.h3, { color: colors.text, marginBottom: Spacing.xl, textAlign: 'center' }]}>
            Get Started
          </Text>
          <Button
            title="Login"
            onPress={() => navigation.navigate('Login')}
            style={{ marginBottom: Spacing.md }}
          />
          <Button
            title="Create an Account"
            variant="outline"
            onPress={() => navigation.navigate('Register')}
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
    justifyContent: 'center',
  },
  header: {
    marginBottom: Spacing.xxxl,
    alignItems: 'center',
  },
  card: {
    padding: Spacing.xl,
  },
});
