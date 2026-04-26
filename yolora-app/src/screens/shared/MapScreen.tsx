import React, { useContext, useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, Text, SafeAreaView } from 'react-native';
import Mapbox from '@rnmapbox/maps';
import { ThemeContext } from '../../context/ThemeContext';
import { AuthContext } from '../../context/AuthContext';
import { SocketContext } from '../../context/SocketContext';
import { useLocation } from '../../hooks/useLocation';
import { apiGetActiveRequest, apiGetNearbyUsers, apiUpdateLocation } from '../../services/api';
import { HelpRequest, HelpRequestStatus, NearbyUser, UserRole } from '../../types';
import { Typography } from '../../theme/typography';

Mapbox.setAccessToken('YOUR_PUBLIC_MAPBOX_TOKEN');

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
        [location.longitude, location.latitude],
        [helperLocation.longitude, helperLocation.latitude],
      ];
    }

    if (
      user?.role === UserRole.ABLE &&
      activeRequest?.status === HelpRequestStatus.ACCEPTED &&
      activeRequest.requesterLatitude &&
      activeRequest.requesterLongitude
    ) {
      return [
        [location.longitude, location.latitude],
        [activeRequest.requesterLongitude, activeRequest.requesterLatitude],
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
      
      {location ? (
        <Mapbox.MapView
          style={styles.map}
          styleURL={Mapbox.StyleURL.Dark}
          scaleBarEnabled={false}
          logoEnabled={false}
          attributionEnabled={false}
        >
          <Mapbox.Camera
            zoomLevel={14}
            centerCoordinate={[location.longitude, location.latitude]}
            animationMode={'flyTo'}
            animationDuration={0}
          />

          {/* Self Marker */}
          <Mapbox.PointAnnotation id="self" coordinate={[location.longitude, location.latitude]}>
            <View style={[styles.marker, { backgroundColor: colors.mapMarkerSelf }]} />
          </Mapbox.PointAnnotation>
          
          {/* Nearby Users */}
          {nearbyUsers.map(u => (
            <Mapbox.PointAnnotation
              key={u.id}
              id={`user-${u.id}`}
              coordinate={[u.longitude, u.latitude]}
            >
              <View style={[styles.marker, { backgroundColor: u.role === UserRole.DISABLED ? colors.mapMarkerDisabled : colors.mapMarkerAble }]} />
            </Mapbox.PointAnnotation>
          ))}

          {/* Route Line */}
          {routeLine && (
            <Mapbox.ShapeSource id="routeSource" shape={{
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: routeLine
              }
            }}>
              <Mapbox.LineLayer
                id="routeFill"
                style={{
                  lineColor: colors.primary,
                  lineWidth: 4,
                  lineCap: 'round',
                  lineJoin: 'round',
                }}
              />
            </Mapbox.ShapeSource>
          )}
        </Mapbox.MapView>
      ) : (
        <View style={styles.loadingContainer}>
          <Text style={[Typography.body, { color: colors.textSecondary }]}>Loading map...</Text>
        </View>
      )}
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
  map: {
    flex: 1,
    borderRadius: 18,
    overflow: 'hidden',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  marker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  }
});
