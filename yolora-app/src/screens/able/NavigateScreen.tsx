import React, { useContext, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { ThemeContext } from '../../context/ThemeContext';
import { SocketContext } from '../../context/SocketContext';
import { useLocation } from '../../hooks/useLocation';
import { Typography } from '../../theme/typography';

export const NavigateScreen = () => {
  const { colors } = useContext(ThemeContext);
  const { sendHelperLocation, completeHelpRequest } = useContext(SocketContext);
  const { location } = useLocation(true);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute<any>();
  const requestId = (route.params?.requestId as string) || '';
  const requesterId = (route.params?.requesterId as string) || '';
  const requesterName = (route.params?.requesterName as string) || 'Requester';
  const requesterLatitude = (route.params?.requesterLatitude as number) || 40.4093;
  const requesterLongitude = (route.params?.requesterLongitude as number) || 49.8671;

  useEffect(() => {
    if (!location || !requesterId || requestId?.startsWith('mock-')) {
      return;
    }
    sendHelperLocation(requesterId, location);
  }, [location, requesterId, requestId, sendHelperLocation]);

  const handleComplete = async () => {
    if (!requestId.startsWith('mock-')) {
      await completeHelpRequest(requestId);
    }
    navigation.navigate('AbleTabs');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.iconBtn, { backgroundColor: colors.surface }]}>
          <Icon name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[Typography.h3, { color: colors.text }]}>Marşrut</Text>
        <View style={styles.iconBtn} />
      </View>

      <View style={[styles.mapCard, { backgroundColor: colors.surface }]}>
        {location ? (
          <MapView
            provider={PROVIDER_GOOGLE}
            style={StyleSheet.absoluteFill}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.012,
              longitudeDelta: 0.012,
            }}
            showsUserLocation>
            <Marker coordinate={location} title="You" pinColor={colors.mapMarkerSelf} />
            <Marker
              coordinate={{ latitude: requesterLatitude, longitude: requesterLongitude }}
              title={requesterName || 'Requester'}
              pinColor={colors.mapMarkerDisabled}
            />
            <Polyline
              coordinates={[
                { latitude: location.latitude, longitude: location.longitude },
                { latitude: requesterLatitude, longitude: requesterLongitude },
              ]}
              strokeColor={colors.primary}
              strokeWidth={4}
            />
          </MapView>
        ) : null}
      </View>

      <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
        <Text style={[Typography.h3, { color: colors.text }]}>{requesterName || 'Requester'}</Text>
        <Text style={[Typography.body, { color: colors.textSecondary, marginTop: 6 }]}>
          Canlı mövqe paylaşımı aktivdir. İstifadəçi ilə görüşdükdən sonra sorğunu tamamlayın.
        </Text>

        <TouchableOpacity onPress={handleComplete} style={[styles.completeButton, { backgroundColor: colors.primary }]}>
          <Text style={styles.completeLabel}>Sorğunu tamamla</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapCard: {
    height: 360,
    borderRadius: 18,
    overflow: 'hidden',
  },
  infoCard: {
    marginTop: 12,
    borderRadius: 18,
    padding: 16,
  },
  completeButton: {
    marginTop: 14,
    minHeight: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
