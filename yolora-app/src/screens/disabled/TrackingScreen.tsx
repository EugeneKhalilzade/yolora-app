import React, { useContext } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { ThemeContext } from '../../context/ThemeContext';
import { SocketContext } from '../../context/SocketContext';
import { useLocation } from '../../hooks/useLocation';
import { Typography } from '../../theme/typography';

export const TrackingScreen = () => {
  const { colors } = useContext(ThemeContext);
  const { helperLocation, acceptedRequest, rejectHelpRequest } = useContext(SocketContext);
  const { location } = useLocation(true);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute<any>();
  const requestId = route.params?.requestId as string | undefined;

  const handleCancel = async () => {
    if (!requestId) {
      navigation.navigate('DisabledTabs');
      return;
    }
    await rejectHelpRequest(requestId);
    navigation.navigate('DisabledTabs');
  };

  const helperCoords =
    helperLocation ||
    (acceptedRequest
      ? {
          latitude: acceptedRequest.helperLatitude,
          longitude: acceptedRequest.helperLongitude,
        }
      : null);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.iconBtn, { backgroundColor: colors.surface }]}>
          <Icon name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[Typography.h3, { color: colors.text }]}>Yardım izlənir</Text>
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
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            region={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            showsUserLocation>
            <Marker coordinate={location} pinColor={colors.mapMarkerSelf} title="You" />
            {helperCoords ? (
              <>
                <Marker coordinate={helperCoords} pinColor={colors.mapMarkerAble} title="Helper" />
                <Polyline
                  coordinates={[
                    { latitude: location.latitude, longitude: location.longitude },
                    helperCoords,
                  ]}
                  strokeWidth={4}
                  strokeColor={colors.primary}
                />
              </>
            ) : null}
          </MapView>
        ) : null}
      </View>

      <View style={[styles.statusCard, { backgroundColor: colors.surface }]}>
        <Text style={[Typography.h3, { color: colors.text }]}>
          {helperCoords ? 'Könüllü sizə yaxınlaşır' : 'Sorğu göndərildi'}
        </Text>
        <Text style={[Typography.body, { color: colors.textSecondary, marginTop: 8 }]}>
          {helperCoords
            ? 'Marşrut xəritədə göstərilir. Səsli yönləndirmə aktivdir.'
            : 'Yaxındakı könüllülərə web socket + push bildiriş göndərildi.'}
        </Text>

        <TouchableOpacity onPress={handleCancel} style={[styles.cancelButton, { borderColor: colors.border }]}>
          <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600' }}>Sorğunu ləğv et</Text>
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
    marginBottom: 14,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapCard: {
    borderRadius: 20,
    overflow: 'hidden',
    height: 360,
  },
  statusCard: {
    marginTop: 14,
    borderRadius: 18,
    padding: 16,
  },
  cancelButton: {
    marginTop: 16,
    borderWidth: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
});
