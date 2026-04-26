import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ThemeContext } from '../../context/ThemeContext';
import { AuthContext } from '../../context/AuthContext';
import { SocketContext } from '../../context/SocketContext';
import { useLocation } from '../../hooks/useLocation';
import { useVoice } from '../../hooks/useVoice';
import { DisabilityType } from '../../types';
import { Typography } from '../../theme/typography';

export const RequestHelpScreen = () => {
  const { colors } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const { requestHelp } = useContext(SocketContext);
  const { location, isLoading: isLocationLoading } = useLocation();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isBlindMode = user?.disabilityType === DisabilityType.BLIND;

  const handleRequest = async () => {
    if (!location || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await requestHelp({
        latitude: location.latitude,
        longitude: location.longitude,
        description: 'Immediate in-app assistance requested.',
      });
      navigation.navigate('Tracking', { requestId: response.helpRequest.id });
    } catch (error) {
      console.error('Failed to request help:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const voiceCommands = useMemo(
    () => [
      {
        keywords: ['request help', 'send request', 'komək'],
        description: 'Send help request',
        action: handleRequest,
      },
      {
        keywords: ['open map', 'map'],
        description: 'Open map tab',
        action: () => navigation.navigate('MapTab'),
      },
      {
        keywords: ['cancel', 'go back'],
        description: 'Go home',
        action: () => navigation.navigate('HomeTab'),
      },
    ],
    [navigation, handleRequest],
  );

  const { speak, startListening, isListening } = useVoice(voiceCommands);

  useEffect(() => {
    if (!isBlindMode) {
      return;
    }
    speak('Voice assistance enabled. Say Request Help to send SOS.');
    startListening().catch(() => {});
  }, [isBlindMode, speak, startListening]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        <Text style={[Typography.h2, { color: colors.text }]}>Kömək sorğusu</Text>
        <Text style={[Typography.body, { color: colors.textSecondary, marginTop: 8 }]}>
          Ətrafınızdakı 1 km radiusdakı könüllülərə real-time bildiriş göndəriləcək.
        </Text>

        <View style={[styles.mainCard, { backgroundColor: colors.surface }]}>
          {isLocationLoading ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : (
            <>
              <TouchableOpacity
                disabled={isSubmitting || !location}
                onPress={handleRequest}
                style={[
                  styles.sosButton,
                  {
                    backgroundColor: colors.primary,
                    opacity: isSubmitting || !location ? 0.6 : 1,
                  },
                ]}>
                <Icon name="alert-circle" color="#FFFFFF" size={34} />
                <Text style={styles.sosLabel}>{isSubmitting ? 'Göndərilir...' : 'KÖMƏK İSTƏ'}</Text>
              </TouchableOpacity>

              <Text style={[Typography.caption, { color: colors.textMuted, marginTop: 16, textAlign: 'center' }]}>
                {location
                  ? `Mövcud koordinatlar: ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
                  : 'Lokasiya tapılmadı'}
              </Text>
            </>
          )}
        </View>

        {isBlindMode ? (
          <View style={[styles.voiceCard, { backgroundColor: colors.surface }]}>
            <Icon name="mic" size={18} color={isListening ? colors.primary : colors.textMuted} />
            <Text style={[Typography.caption, { color: colors.text, marginLeft: 8 }]}>
              Voice mode {isListening ? 'listening' : 'idle'}
            </Text>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  mainCard: {
    marginTop: 20,
    borderRadius: 20,
    padding: 18,
    minHeight: 280,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sosButton: {
    width: '100%',
    borderRadius: 20,
    minHeight: 150,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  sosLabel: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  voiceCard: {
    marginTop: 16,
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
