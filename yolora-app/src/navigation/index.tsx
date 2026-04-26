import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { UserRole } from '../types';

import { OnboardingScreen } from '../screens/auth/OnboardingScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';

import { DisabledHomeScreen } from '../screens/disabled/DisabledHomeScreen';
import { RequestHelpScreen } from '../screens/disabled/RequestHelpScreen';
import { TrackingScreen } from '../screens/disabled/TrackingScreen';

import { AbleHomeScreen } from '../screens/able/AbleHomeScreen';
import { HelpRequestsScreen } from '../screens/able/HelpRequestsScreen';
import { NavigateScreen } from '../screens/able/NavigateScreen';

import { MapScreen } from '../screens/shared/MapScreen';

const AuthStack = createNativeStackNavigator();
const DisabledTab = createBottomTabNavigator();
const AbleTab = createBottomTabNavigator();
const DisabledStack = createNativeStackNavigator();
const AbleStack = createNativeStackNavigator();

const TabLabelIcon = ({
  focused,
  iconName,
  label,
  color,
}: {
  focused: boolean;
  iconName: string;
  label: string;
  color: string;
}) => (
  <View style={{ alignItems: 'center', justifyContent: 'center', gap: 3 }}>
    <Icon name={iconName} size={24} color={color} />
    <Text style={{ color, fontSize: 12, fontWeight: focused ? '700' : '500' }}>{label}</Text>
  </View>
);

const CenterTabIcon = ({
  focused,
  iconName,
  color,
}: {
  focused: boolean;
  iconName: string;
  color: string;
}) => (
  <View
    style={{
      width: 62,
      height: 62,
      borderRadius: 31,
      marginTop: -26,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: color,
      shadowColor: color,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.35,
      shadowRadius: 12,
      elevation: 8,
      borderWidth: focused ? 2 : 0,
      borderColor: 'rgba(255,255,255,0.75)',
    }}>
    <Icon name={iconName} size={28} color="#FFFFFF" />
  </View>
);

const PlaceholderScreen = ({ title }: { title: string }) => {
  const { colors } = useContext(ThemeContext);
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.background,
      }}>
      <Text style={{ color: colors.text, fontSize: 18, fontWeight: '600' }}>{title}</Text>
    </View>
  );
};

const ProfileScreen = () => {
  const { colors } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext);
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        backgroundColor: colors.background,
      }}>
      <Text style={{ color: colors.text, fontSize: 20, fontWeight: '700' }}>{user?.displayName}</Text>
      <Text style={{ color: colors.textSecondary }}>{user?.email}</Text>
      <Text
        onPress={logout}
        style={{
          color: colors.primary,
          fontSize: 16,
          fontWeight: '700',
          marginTop: 12,
          paddingHorizontal: 16,
          paddingVertical: 10,
          borderRadius: 12,
          backgroundColor: colors.primary + '12',
        }}>
        Logout
      </Text>
    </View>
  );
};

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

const DisabledTabNavigator = () => {
  const { colors } = useContext(ThemeContext);
  return (
    <DisabledTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#EAEBF2',
          height: 80,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarShowLabel: false,
      }}>
      <DisabledTab.Screen
        name="HomeTab"
        component={DisabledHomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabLabelIcon focused={focused} iconName="home" label="Əsas" color={focused ? colors.primary : colors.textMuted} />
          ),
        }}
      />
      <DisabledTab.Screen
        name="MapTab"
        component={MapScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabLabelIcon focused={focused} iconName="map-outline" label="Xəritə" color={focused ? colors.primary : colors.textMuted} />
          ),
        }}
      />
      <DisabledTab.Screen
        name="RequestHelpTab"
        component={RequestHelpScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <CenterTabIcon focused={focused} iconName="mic" color={colors.primary} />
          ),
        }}
      />
      <DisabledTab.Screen
        name="ChatTab"
        children={() => <PlaceholderScreen title="Söhbət tezliklə əlavə olunacaq" />}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabLabelIcon
              focused={focused}
              iconName="chatbubble-ellipses-outline"
              label="Söhbət"
              color={focused ? colors.primary : colors.textMuted}
            />
          ),
        }}
      />
      <DisabledTab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabLabelIcon focused={focused} iconName="person-outline" label="Profil" color={focused ? colors.primary : colors.textMuted} />
          ),
        }}
      />
    </DisabledTab.Navigator>
  );
};

const AbleTabNavigator = () => {
  const { colors } = useContext(ThemeContext);
  return (
    <AbleTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#EAEBF2',
          height: 80,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarShowLabel: false,
      }}>
      <AbleTab.Screen
        name="HomeTab"
        component={AbleHomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabLabelIcon focused={focused} iconName="home" label="Əsas" color={focused ? colors.primary : colors.textMuted} />
          ),
        }}
      />
      <AbleTab.Screen
        name="MapTab"
        component={MapScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabLabelIcon focused={focused} iconName="map-outline" label="Xəritə" color={focused ? colors.primary : colors.textMuted} />
          ),
        }}
      />
      <AbleTab.Screen
        name="RequestsTab"
        component={HelpRequestsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <CenterTabIcon focused={focused} iconName="list" color={colors.primary} />
          ),
        }}
      />
      <AbleTab.Screen
        name="ChatTab"
        children={() => <PlaceholderScreen title="Söhbət tezliklə əlavə olunacaq" />}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabLabelIcon
              focused={focused}
              iconName="chatbubble-ellipses-outline"
              label="Söhbət"
              color={focused ? colors.primary : colors.textMuted}
            />
          ),
        }}
      />
      <AbleTab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabLabelIcon focused={focused} iconName="person-outline" label="Profil" color={focused ? colors.primary : colors.textMuted} />
          ),
        }}
      />
    </AbleTab.Navigator>
  );
};

const DisabledStackNavigator = () => (
  <DisabledStack.Navigator>
    <DisabledStack.Screen name="DisabledTabs" component={DisabledTabNavigator} options={{ headerShown: false }} />
    <DisabledStack.Screen
      name="Tracking"
      component={TrackingScreen}
      options={{ headerShown: false }}
    />
  </DisabledStack.Navigator>
);

const AbleStackNavigator = () => (
  <AbleStack.Navigator>
    <AbleStack.Screen name="AbleTabs" component={AbleTabNavigator} options={{ headerShown: false }} />
    <AbleStack.Screen name="Navigate" component={NavigateScreen} options={{ headerShown: false }} />
  </AbleStack.Navigator>
);

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
        <DisabledStackNavigator />
      ) : (
        <AbleStackNavigator />
      )}
    </NavigationContainer>
  );
};
