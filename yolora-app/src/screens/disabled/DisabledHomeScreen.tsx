import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ThemeContext } from '../../context/ThemeContext';
import { AuthContext } from '../../context/AuthContext';
import { SocketContext } from '../../context/SocketContext';
import { Typography } from '../../theme/typography';
import { apiGetNearbyUsers, apiUpdateLocation } from '../../services/api';
import { useLocation } from '../../hooks/useLocation';
import { useVoice } from '../../hooks/useVoice';
import { DisabilityType, NearbyUser, UserRole } from '../../types';

type HelperUiItem = NearbyUser & { avatar: string };

const fillerHelpers: HelperUiItem[] = [
  {
    id: 'mock-1',
    displayName: 'Aysel H.',
    email: 'aysel@example.com',
    role: UserRole.ABLE,
    latitude: 40.4124,
    longitude: 49.8649,
    isOnline: true,
    distance: 200,
    avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
  },
  {
    id: 'mock-2',
    displayName: 'Murad Ə.',
    email: 'murad@example.com',
    role: UserRole.ABLE,
    latitude: 40.4106,
    longitude: 49.8628,
    isOnline: true,
    distance: 400,
    avatar: 'https://randomuser.me/api/portraits/men/31.jpg',
  },
];

const buildRoutePath = (
  from: { latitude: number; longitude: number },
  to: { latitude: number; longitude: number },
) => {
  const latStep = (to.latitude - from.latitude) / 3;
  const lonStep = (to.longitude - from.longitude) / 3;
  return [
    from,
    {
      latitude: from.latitude + latStep + 0.00045,
      longitude: from.longitude + lonStep - 0.00025,
    },
    {
      latitude: from.latitude + latStep * 2 - 0.0003,
      longitude: from.longitude + lonStep * 2 + 0.0003,
    },
    to,
  ];
};

export const DisabledHomeScreen = () => {
  const { colors } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext);
  const { sendLocationUpdate } = useContext(SocketContext);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { location } = useLocation(true);
  const [nearbyHelpers, setNearbyHelpers] = useState<HelperUiItem[]>([]);

  const isBlindMode = user?.disabilityType === DisabilityType.BLIND;

  const voiceCommands = useMemo(
    () => [
      {
        keywords: ['request help', 'help', 'komək'],
        description: 'Open help request screen',
        action: () => navigation.navigate('RequestHelpTab'),
      },
      {
        keywords: ['open map', 'map', 'xəritə'],
        description: 'Open map tab',
        action: () => navigation.navigate('MapTab'),
      },
      {
        keywords: ['logout', 'sign out'],
        description: 'Logout',
        action: () => logout(),
      },
    ],
    [logout, navigation],
  );

  const { isListening, speak, startListening } = useVoice(voiceCommands);

  const center = location || { latitude: 40.4093, longitude: 49.8671 };

  useEffect(() => {
    if (!location) {
      return;
    }

    const syncAndLoad = async () => {
      await apiUpdateLocation(location.latitude, location.longitude);
      sendLocationUpdate(location);
      const helpers = await apiGetNearbyUsers(
        location.latitude,
        location.longitude,
        1000,
        UserRole.ABLE,
      );
      const withAvatar = helpers.map((helper, index) => ({
        ...helper,
        avatar:
          index % 2 === 0
            ? 'https://randomuser.me/api/portraits/women/32.jpg'
            : 'https://randomuser.me/api/portraits/men/31.jpg',
      }));
      setNearbyHelpers(withAvatar);
    };

    syncAndLoad().catch(() => {
      setNearbyHelpers([]);
    });
  }, [location, sendLocationUpdate]);

  useEffect(() => {
    if (!isBlindMode) {
      return;
    }
    speak('Blind mode active. Say Request Help, Open Map, or Logout.');
    startListening().catch(() => {});
  }, [isBlindMode, speak, startListening]);

  const helpersToRender = nearbyHelpers.length ? nearbyHelpers.slice(0, 2) : fillerHelpers;
  const routeTarget = {
    latitude: helpersToRender[0].latitude,
    longitude: helpersToRender[0].longitude,
  };
  const routePath = buildRoutePath(center, routeTarget);
  const topLeftMarker = {
    latitude: center.latitude + 0.0025,
    longitude: center.longitude - 0.002,
  };
  const parkingMarker = {
    latitude: center.latitude + 0.0004,
    longitude: center.longitude + 0.0018,
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerIconButton}>
            <Icon name="menu-outline" size={34} color="#1B1E4A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Yolo AI</Text>
          <TouchableOpacity style={styles.headerIconButton}>
            <Icon name="notifications-outline" size={32} color="#1B1E4A" />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        <View style={styles.mapWrapper}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={StyleSheet.absoluteFill}
            initialRegion={{
              latitude: center.latitude,
              longitude: center.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}>
            <Marker coordinate={topLeftMarker} anchor={{ x: 0.5, y: 0.5 }}>
              <View style={[styles.smallWheelchairMarker, { backgroundColor: '#20C8D9' }]}>
                <MaterialCommunityIcon name="wheelchair-accessibility" size={18} color="#FFFFFF" />
              </View>
            </Marker>

            <Marker coordinate={routeTarget} anchor={{ x: 0.5, y: 0.5 }}>
              <View style={[styles.smallWheelchairMarker, { backgroundColor: '#2E6BFF' }]}>
                <MaterialCommunityIcon name="wheelchair-accessibility" size={18} color="#FFFFFF" />
              </View>
            </Marker>

            <Marker coordinate={parkingMarker} anchor={{ x: 0.5, y: 0.5 }}>
              <View style={styles.parkingMarker}>
                <Text style={styles.parkingMarkerText}>P</Text>
              </View>
            </Marker>

            <Polyline coordinates={routePath} strokeColor="#2E6BFF" strokeWidth={5} />

            <Marker coordinate={center} anchor={{ x: 0.5, y: 0.5 }}>
              <View style={styles.selfMarker}>
                <Icon name="navigate" size={34} color="#FFFFFF" />
              </View>
            </Marker>
          </MapView>
        </View>

        <View style={styles.quickActionsRow}>
          <TouchableOpacity style={styles.quickActionItem}>
            <Icon name="navigate-outline" size={30} color="#1B1E4A" />
            <Text style={styles.quickActionText}>Naviqasiya</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionItem}>
            <Icon name="bus-outline" size={30} color="#1B1E4A" />
            <Text style={styles.quickActionText}>Dayanacaqlar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionItem}>
            <Icon name="people-outline" size={30} color="#1B1E4A" />
            <Text style={styles.quickActionText}>Könüllülər</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.volunteerCard}>
          <Text style={styles.sectionTitle}>Yaxın könüllülər</Text>
          <View style={styles.separator} />
          {helpersToRender.map((helper, index) => (
            <View key={helper.id} style={styles.helperRow}>
              <Image source={{ uri: helper.avatar }} style={styles.avatar} />
              <View style={{ flex: 1 }}>
                <Text style={styles.helperName}>{helper.displayName}</Text>
                <Text style={styles.helperDistance}>
                  {(helper.distance / 1000).toFixed(1)} km uzaqda
                </Text>
              </View>
              {index < helpersToRender.length - 1 ? <View style={styles.rowDivider} /> : null}
            </View>
          ))}

          <TouchableOpacity
            onPress={() => navigation.navigate('RequestHelpTab')}
            style={[styles.helpButton, { backgroundColor: colors.primary }]}>
            <Text style={styles.helpButtonText}>Kömək istə</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {isBlindMode ? (
        <View style={[styles.voicePill, { backgroundColor: isListening ? colors.primary : '#FFFFFF' }]}>
          <Icon name="mic" size={16} color={isListening ? '#FFFFFF' : colors.primary} />
          <Text
            style={[
              Typography.small,
              {
                marginLeft: 6,
                color: isListening ? '#FFFFFF' : colors.primary,
                fontWeight: '700',
              },
            ]}>
            Voice mode
          </Text>
        </View>
      ) : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F8',
  },
  scrollContent: {
    paddingBottom: 110,
  },
  header: {
    height: 84,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    backgroundColor: '#FFFFFF',
  },
  headerIconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 54,
    lineHeight: 60,
    fontWeight: '700',
    color: '#1B1E4A',
  },
  notificationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EF4444',
    position: 'absolute',
    top: 6,
    right: 3,
  },
  mapWrapper: {
    height: 410,
    backgroundColor: '#EDEFF5',
  },
  smallWheelchairMarker: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  parkingMarker: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#2E6BFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  parkingMarkerText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },
  selfMarker: {
    width: 92,
    height: 92,
    borderRadius: 46,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2E6BFF',
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    marginTop: 14,
    gap: 10,
  },
  quickActionItem: {
    flex: 1,
    minHeight: 112,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#212548',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 7,
    elevation: 3,
  },
  quickActionText: {
    marginTop: 10,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    color: '#1B1E4A',
  },
  volunteerCard: {
    marginTop: 14,
    marginHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  sectionTitle: {
    fontSize: 48,
    lineHeight: 54,
    fontWeight: '700',
    color: '#13163D',
  },
  separator: {
    marginTop: 12,
    marginBottom: 2,
    height: 1,
    backgroundColor: '#ECEEF5',
  },
  helperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    position: 'relative',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 10,
    backgroundColor: '#EEF1FF',
  },
  helperName: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '600',
    color: '#1B1E4A',
  },
  helperDistance: {
    marginTop: 2,
    fontSize: 18,
    lineHeight: 24,
    color: '#7C82A4',
  },
  rowDivider: {
    position: 'absolute',
    left: 52,
    right: 0,
    bottom: 0,
    height: 1,
    backgroundColor: '#ECEEF5',
  },
  helpButton: {
    marginTop: 12,
    minHeight: 66,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpButtonText: {
    color: '#FFFFFF',
    fontSize: 27,
    lineHeight: 32,
    fontWeight: '700',
  },
  voicePill: {
    position: 'absolute',
    right: 16,
    bottom: 92,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.14,
    shadowRadius: 6,
    elevation: 4,
  },
});
