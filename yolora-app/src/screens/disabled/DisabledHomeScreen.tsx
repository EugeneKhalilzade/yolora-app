import React, { useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ThemeContext } from '../../context/ThemeContext';
import { AuthContext } from '../../context/AuthContext';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { Button } from '../../components';

export const DisabledHomeScreen = () => {
  const { colors } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[Typography.h2, { color: colors.text }]}>
            Hello, {user?.displayName}
          </Text>
          <TouchableOpacity onPress={logout} style={{ padding: Spacing.sm }}>
            <Text style={{ color: colors.error, ...Typography.bodyBold }}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Button
            title="REQUEST HELP"
            accessible
            variant="danger"
            style={styles.helpButton}
            onPress={() => navigation.navigate('RequestHelp')}
          />
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
    marginBottom: Spacing.xxl,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpButton: {
    width: '100%',
    height: 200,
    borderRadius: 32,
  },
});
