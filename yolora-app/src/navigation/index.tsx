import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';

import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { UserRole } from '../types';

// Auth Screens
import { OnboardingScreen } from '../screens/auth/OnboardingScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';

// Disabled User Screens
import { DisabledHomeScreen } from '../screens/disabled/DisabledHomeScreen';
import { RequestHelpScreen } from '../screens/disabled/RequestHelpScreen';
import { TrackingScreen } from '../screens/disabled/TrackingScreen';

// Able User Screens
import { AbleHomeScreen } from '../screens/able/AbleHomeScreen';
import { HelpRequestsScreen } from '../screens/able/HelpRequestsScreen';
import { NavigateScreen } from '../screens/able/NavigateScreen';

const AuthStack = createNativeStackNavigator();
const DisabledStack = createNativeStackNavigator();
const AbleStack = createNativeStackNavigator();

const AuthNavigator = () => {
  const { colors } = useContext(ThemeContext);
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
      <AuthStack.Screen name="Onboarding" component={OnboardingScreen} />
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
};

const DisabledNavigator = () => {
  const { colors } = useContext(ThemeContext);
  return (
    <DisabledStack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
      <DisabledStack.Screen name="DisabledHome" component={DisabledHomeScreen} />
      <DisabledStack.Screen name="RequestHelp" component={RequestHelpScreen} />
      <DisabledStack.Screen name="Tracking" component={TrackingScreen} />
    </DisabledStack.Navigator>
  );
};

const AbleNavigator = () => {
  const { colors } = useContext(ThemeContext);
  return (
    <AbleStack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
      <AbleStack.Screen name="AbleHome" component={AbleHomeScreen} />
      <AbleStack.Screen name="HelpRequests" component={HelpRequestsScreen} />
      <AbleStack.Screen name="Navigate" component={NavigateScreen} />
    </AbleStack.Navigator>
  );
};

export const RootNavigator = () => {
  const { isAuthenticated, user, isLoading } = useContext(AuthContext);
  const { colors } = useContext(ThemeContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {!isAuthenticated ? (
        <AuthNavigator />
      ) : user?.role === UserRole.DISABLED ? (
        <DisabledNavigator />
      ) : (
        <AbleNavigator />
      )}
    </NavigationContainer>
  );
};
