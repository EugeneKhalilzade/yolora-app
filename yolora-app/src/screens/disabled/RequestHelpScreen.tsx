import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ThemeContext } from '../../context/ThemeContext';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { Button } from '../../components';
import { SocketContext } from '../../context/SocketContext';
import { useLocation } from '../../hooks/useLocation';

export const RequestHelpScreen = () => {
  const { colors } = useContext(ThemeContext);
  const { requestHelp } = useContext(SocketContext);
  const { location, fetchLocation, isLoading: locLoading } = useLocation();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  const handleRequest = async () => {
    if (!location) return;
    setRequesting(true);
    try {
      await requestHelp({
        latitude: location.latitude,
        longitude: location.longitude,
        description: 'I need assistance here.',
      });
      // In a real app, listen for request_created and navigate with the ID
      navigation.navigate('Tracking', { requestId: 'pending' });
    } catch (e) {
      console.error(e);
      setRequesting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.container}>
        <Text style={[Typography.accessibleH1, { color: colors.text, textAlign: 'center', marginBottom: Spacing.xl }]}>
          Confirm Help Request
        </Text>

        {locLoading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: Spacing.xxl }} />
        ) : (
          <Button
            title={requesting ? "Sending..." : "SEND REQUEST NOW"}
            accessible
            variant="danger"
            onPress={handleRequest}
            disabled={requesting || !location}
            style={{ marginBottom: Spacing.xl, height: 120 }}
          />
        )}

        <Button
          title="Cancel"
          accessible
          variant="outline"
          onPress={() => navigation.goBack()}
        />
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
});
