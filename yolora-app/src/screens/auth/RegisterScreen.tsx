import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ThemeContext } from '../../context/ThemeContext';
import { AuthContext } from '../../context/AuthContext';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { Button, Input, Card } from '../../components';
import { UserRole, DisabilityType } from '../../types';

export const RegisterScreen = () => {
  const { colors } = useContext(ThemeContext);
  const { register, isLoading, error, clearError } = useContext(AuthContext);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.ABLE);
  const [disabilityType, setDisabilityType] = useState<DisabilityType>(DisabilityType.BLIND);

  const handleRegister = async () => {
    try {
      await register(
        email,
        password,
        displayName,
        role,
        role === UserRole.DISABLED ? disabilityType : undefined
      );
    } catch (e) {
      // Handled in context
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[Typography.h2, { color: colors.text, marginBottom: Spacing.xl }]}>
          Create Account
        </Text>
        
        <Card elevated>
          <Input
            label="Name"
            value={displayName}
            onChangeText={(text) => { setDisplayName(text); clearError(); }}
            placeholder="Enter your name"
          />
          <Input
            label="Email"
            value={email}
            onChangeText={(text) => { setEmail(text); clearError(); }}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            label="Password"
            value={password}
            onChangeText={(text) => { setPassword(text); clearError(); }}
            placeholder="Create a password"
            secureTextEntry
          />

          <Text style={[Typography.bodyBold, { color: colors.text, marginTop: Spacing.md, marginBottom: Spacing.sm }]}>
            I want to:
          </Text>
          <View style={styles.roleContainer}>
            <TouchableOpacity
              style={[
                styles.roleButton,
                { borderColor: role === UserRole.ABLE ? colors.primary : colors.border },
                role === UserRole.ABLE && { backgroundColor: colors.primaryLight + '20' }
              ]}
              onPress={() => setRole(UserRole.ABLE)}
            >
              <Text style={[Typography.bodyBold, { color: role === UserRole.ABLE ? colors.primary : colors.textSecondary }]}>
                Provide Help
              </Text>
            </TouchableOpacity>
            <View style={{ width: Spacing.sm }} />
            <TouchableOpacity
              style={[
                styles.roleButton,
                { borderColor: role === UserRole.DISABLED ? colors.primary : colors.border },
                role === UserRole.DISABLED && { backgroundColor: colors.primaryLight + '20' }
              ]}
              onPress={() => setRole(UserRole.DISABLED)}
            >
              <Text style={[Typography.bodyBold, { color: role === UserRole.DISABLED ? colors.primary : colors.textSecondary }]}>
                Get Help
              </Text>
            </TouchableOpacity>
          </View>

          {role === UserRole.DISABLED && (
            <View style={{ marginTop: Spacing.md }}>
              <Text style={[Typography.bodyBold, { color: colors.text, marginBottom: Spacing.sm }]}>
                Disability Type:
              </Text>
              <View style={styles.disabilityContainer}>
                {Object.values(DisabilityType).map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.disabilityChip,
                      { backgroundColor: disabilityType === type ? colors.primary : colors.surfaceElevated }
                    ]}
                    onPress={() => setDisabilityType(type)}
                  >
                    <Text style={[
                      Typography.caption,
                      { color: disabilityType === type ? '#fff' : colors.text, textTransform: 'capitalize' }
                    ]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {error ? (
            <Text style={[Typography.small, { color: colors.error, marginVertical: Spacing.md }]}>
              {error}
            </Text>
          ) : null}

          <Button
            title="Sign Up"
            onPress={handleRegister}
            loading={isLoading}
            style={{ marginTop: Spacing.xl }}
          />
          
          <Button
            title="Already have an account? Login"
            variant="ghost"
            onPress={() => navigation.goBack()}
            style={{ marginTop: Spacing.sm }}
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: Spacing.xl,
    paddingBottom: Spacing.xxxl,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roleButton: {
    flex: 1,
    padding: Spacing.md,
    borderWidth: 2,
    borderRadius: 12,
    alignItems: 'center',
  },
  disabilityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  disabilityChip: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'transparent',
  },
});
