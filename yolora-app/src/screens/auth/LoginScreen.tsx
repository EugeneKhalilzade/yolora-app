import React, { useContext, useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { ThemeContext } from '../../context/ThemeContext';
import { AuthContext } from '../../context/AuthContext';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { Button, Input, Card } from '../../components';
import { useVoice } from '../../hooks/useVoice';

export const LoginScreen = () => {
  const { colors } = useContext(ThemeContext);
  const { login, isLoading, error, clearError } = useContext(AuthContext);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await login(email, password);
    } catch (e) {
      // Error is handled in context and displayed below
    }
  };

  const voiceCommands = useMemo(
    () => [
      {
        keywords: ['login', 'log in', 'daxil ol'],
        description: 'Submit login form',
        action: handleLogin,
      },
      {
        keywords: ['register', 'sign up'],
        description: 'Open register page',
        action: () => navigation.navigate('Register'),
      },
    ],
    [navigation, handleLogin],
  );

  const { startListening, speak, isListening } = useVoice(voiceCommands);

  useEffect(() => {
    speak('You can say Login or Register.');
  }, [speak]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
          <Text style={[Typography.h2, { color: colors.text, marginBottom: Spacing.xl }]}>
            Welcome Back
          </Text>

          <TouchableOpacity
            onPress={() => startListening()}
            style={[
              styles.voiceButton,
              { backgroundColor: isListening ? colors.primary : colors.surface, borderColor: colors.border },
            ]}>
            <Icon name="mic" size={16} color={isListening ? '#FFFFFF' : colors.primary} />
            <Text
              style={[
                Typography.caption,
                { marginLeft: 6, color: isListening ? '#FFFFFF' : colors.primary, fontWeight: '700' },
              ]}>
              Voice Login
            </Text>
          </TouchableOpacity>
          
          <Card elevated>
            <Input
              label="Email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                clearError();
              }}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Input
              label="Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                clearError();
              }}
              placeholder="Enter your password"
              secureTextEntry
            />

            {error ? (
              <Text style={[Typography.small, { color: colors.error, marginBottom: Spacing.md }]}>
                {error}
              </Text>
            ) : null}

            <Button
              title="Login"
              onPress={handleLogin}
              loading={isLoading}
              style={{ marginTop: Spacing.md }}
            />
            
            <Button
              title="Don't have an account? Sign up"
              variant="ghost"
              onPress={() => navigation.navigate('Register')}
              style={{ marginTop: Spacing.md }}
            />
          </Card>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.xl,
    justifyContent: 'center',
  },
  voiceButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: Spacing.md,
  },
});
