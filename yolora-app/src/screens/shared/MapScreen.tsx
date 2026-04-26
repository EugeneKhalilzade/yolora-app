import React, { useContext, useEffect, useMemo, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { ThemeContext } from '../../context/ThemeContext';
import { AuthContext } from '../../context/AuthContext';
import { SocketContext } from '../../context/SocketContext';
import { useLocation } from '../../hooks/useLocation';
import { apiGetActiveRequest, apiGetNearbyUsers, apiUpdateLocation } from '../../services/api';
import { HelpRequest, HelpRequestStatus, NearbyUser, UserRole } from '../../types';
import { Typography } from '../../theme/typography';

export const MapScreen = () => {
  const { colors } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const { helperLocation, userLocations, sendLocationUpdate } = useContext(SocketContext);
  const { location } = useLocation(true);
  const [nearbyUsers, setNearbyUsers] = useState<NearbyUser[]>([]);
  const [activeRequest, setActiveRequest] = useState<HelpRequest | null>(null);

  useEffect(() => {
    if (!location || !user) {
      return;
    }

    const syncMapData = async () => {
      await apiUpdateLocation(location.latitude, location.longitude);
      sendLocationUpdate(location);

      const nearby = await apiGetNearbyUsers(
        location.latitude,
        location.longitude,
        1000,
        user.role === UserRole.DISABLED ? UserRole.ABLE : UserRole.DISABLED,
      );
      setNearbyUsers(nearby);

      const currentActiveRequest = await apiGetActiveRequest();
      setActiveRequest(currentActiveRequest);
    };

    syncMapData().catch((error) => {
      console.warn('Failed to sync map data:', error);
    });
  }, [location, sendLocationUpdate, user]);

  useEffect(() => {
    if (!Object.keys(userLocations).length) {
      return;
    }

    setNearbyUsers((prev) =>
      prev.map((nearbyUser) => {
        const liveLocation = userLocations[nearbyUser.id];
        if (!liveLocation) {
          return nearbyUser;
        }
        return {
          ...nearbyUser,
          latitude: liveLocation.latitude,
          longitude: liveLocation.longitude,
        };
      }),
    );
  }, [userLocations]);

  const routeLine = useMemo(() => {
    if (!location) {
      return null;
    }

    if (user?.role === UserRole.DISABLED && helperLocation) {
      return [
        { latitude: location.latitude, longitude: location.longitude },
        helperLocation,
      ];
    }

    if (
      user?.role === UserRole.ABLE &&
      activeRequest?.status === HelpRequestStatus.ACCEPTED &&
      activeRequest.requesterLatitude &&
      activeRequest.requesterLongitude
    ) {
      return [
        { latitude: location.latitude, longitude: location.longitude },
        {
          latitude: activeRequest.requesterLatitude,
          longitude: activeRequest.requesterLongitude,
        },
      ];
    }

    return null;
  }, [activeRequest, helperLocation, location, user?.role]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[Typography.h2, { color: colors.text }]}>Xəritə</Text>
        <Text style={[Typography.caption, { color: colors.textSecondary }]}>1 km radius • live updates</Text>
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
            region={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.012,
              longitudeDelta: 0.012,
            }}
            showsUserLocation
            showsMyLocationButton>
            <Marker coordinate={location} title="You" pinColor={colors.mapMarkerSelf} />
            {nearbyUsers.map((nearbyUser) => (
              <Marker
                key={nearbyUser.id}
                coordinate={{ latitude: nearbyUser.latitude, longitude: nearbyUser.longitude }}
                title={nearbyUser.displayName}
                description={`${(nearbyUser.distance / 1000).toFixed(1)} km`}
                pinColor={
                  nearbyUser.role === UserRole.ABLE
                    ? colors.mapMarkerAble
                    : colors.mapMarkerDisabled
                }
              />
            ))}

            {routeLine ? (
              <Polyline coordinates={routeLine} strokeColor={colors.primary} strokeWidth={4} />
            ) : null}
          </MapView>
        ) : (
          <View style={styles.loadingContainer}>
            <Text style={[Typography.body, { color: colors.textSecondary }]}>Loading location...</Text>
          </View>
        )}
      </View>

      <View style={[styles.legendCard, { backgroundColor: colors.surface }]}>
        <Text style={[Typography.caption, { color: colors.textSecondary }]}>
          Purple: You • Blue: Helpers • Orange: Disabled users
        </Text>
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
    marginBottom: 12,
  },
  mapCard: {
    flex: 1,
    borderRadius: 18,
    overflow: 'hidden',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendCard: {
    marginTop: 12,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
  },
});
