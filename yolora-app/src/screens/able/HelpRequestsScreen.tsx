import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
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
import { SocketContext } from '../../context/SocketContext';
import { useLocation } from '../../hooks/useLocation';
import { apiGetNearbyRequests } from '../../services/api';
import { DisabilityType, NearbyHelpRequest } from '../../types';
import { Typography } from '../../theme/typography';

type UiRequest = {
  id: string;
  requesterId: string;
  requesterName: string;
  disabilityType: string;
  latitude: number;
  longitude: number;
  description: string;
  distance: number;
  source: 'live' | 'socket' | 'mock';
};

const screenshotFiller: UiRequest[] = [
  {
    id: 'mock-r1',
    requesterId: 'mock-user-1',
    requesterName: 'Aynur M.',
    disabilityType: 'blind',
    latitude: 40.4099,
    longitude: 49.8679,
    description: 'Need help finding the elevator near 28 May Metro.',
    distance: 220,
    source: 'mock',
  },
  {
    id: 'mock-r2',
    requesterId: 'mock-user-2',
    requesterName: 'Farid M.',
    disabilityType: 'wheelchair',
    latitude: 40.4111,
    longitude: 49.8688,
    description: 'Need assistance crossing road due to construction.',
    distance: 430,
    source: 'mock',
  },
  {
    id: 'mock-r3',
    requesterId: 'mock-user-3',
    requesterName: 'Leyla K.',
    disabilityType: 'deaf',
    latitude: 40.4086,
    longitude: 49.8664,
    description: 'Need communication assistance at pharmacy.',
    distance: 760,
    source: 'mock',
  },
];

const iconByDisability: Record<string, string> = {
  blind: 'eye-off-outline',
  deaf: 'ear-outline',
  wheelchair: 'body-outline',
};

const normalizeRequest = (request: NearbyHelpRequest): UiRequest => ({
  id: request.id,
  requesterId: request.requester.id,
  requesterName: request.requester.displayName,
  disabilityType: request.requester.disabilityType || DisabilityType.BLIND,
  latitude: request.latitude,
  longitude: request.longitude,
  description: request.description || 'Immediate assistance requested.',
  distance: request.distance || 0,
  source: 'live',
});

export const HelpRequestsScreen = () => {
  const { colors } = useContext(ThemeContext);
  const { incomingRequests, acceptHelpRequest, rejectHelpRequest } = useContext(SocketContext);
  const { location, isLoading: locationLoading } = useLocation(true);
  const [liveRequests, setLiveRequests] = useState<UiRequest[]>([]);
  const [hiddenRequestIds, setHiddenRequestIds] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  useEffect(() => {
    if (!location) {
      return;
    }

    const loadNearbyRequests = async () => {
      setIsRefreshing(true);
      try {
        const requests = await apiGetNearbyRequests(location.latitude, location.longitude);
        setLiveRequests(requests.map(normalizeRequest));
      } catch (error) {
        console.warn('Failed to load nearby requests:', error);
      } finally {
        setIsRefreshing(false);
      }
    };

    loadNearbyRequests().catch(() => {});
  }, [location]);

  const requests = useMemo(() => {
    const socketRequests: UiRequest[] = incomingRequests.map((request) => ({
      id: request.id,
      requesterId: request.requesterId,
      requesterName: request.requesterName,
      disabilityType: request.disabilityType,
      latitude: request.latitude,
      longitude: request.longitude,
      description: request.description || 'Immediate help requested.',
      distance: 0,
      source: 'socket',
    }));

    const merged = [...socketRequests, ...liveRequests, ...screenshotFiller];
    const dedup = new Map<string, UiRequest>();
    merged.forEach((item) => {
      if (!dedup.has(item.id)) {
        dedup.set(item.id, item);
      }
    });
    return Array.from(dedup.values()).filter((item) => !hiddenRequestIds.includes(item.id));
  }, [hiddenRequestIds, incomingRequests, liveRequests]);

  const handleAccept = async (request: UiRequest) => {
    if (!location) {
      return;
    }

    if (request.source === 'mock') {
      navigation.navigate('Navigate', {
        requestId: request.id,
        requesterId: request.requesterId,
        requesterName: request.requesterName,
        requesterLatitude: request.latitude,
        requesterLongitude: request.longitude,
      });
      return;
    }

    await acceptHelpRequest(request.id, location);
    navigation.navigate('Navigate', {
      requestId: request.id,
      requesterId: request.requesterId,
      requesterName: request.requesterName,
      requesterLatitude: request.latitude,
      requesterLongitude: request.longitude,
    });
  };

  const handleReject = async (request: UiRequest) => {
    if (request.source === 'mock') {
      setHiddenRequestIds((prev) => [...prev, request.id]);
      return;
    }
    await rejectHelpRequest(request.id);
  };

  const renderItem = ({ item }: { item: UiRequest }) => {
    const icon = iconByDisability[item.disabilityType] || 'person-outline';
    return (
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <View style={styles.row}>
          <View style={styles.row}>
            <View style={[styles.avatar, { backgroundColor: colors.primary + '1A' }]}>
              <Text style={{ color: colors.primary, fontWeight: '700' }}>{item.requesterName.charAt(0)}</Text>
            </View>
            <View>
              <Text style={[Typography.bodyBold, { color: colors.text }]}>{item.requesterName}</Text>
              <Text style={[Typography.small, { color: colors.textMuted }]}>
                {(item.distance / 1000).toFixed(1)} km • {item.source === 'mock' ? 'demo' : 'live'}
              </Text>
            </View>
          </View>
          <View style={[styles.typeTag, { backgroundColor: colors.primary + '16' }]}>
            <Icon name={icon} size={14} color={colors.primary} />
            <Text style={[Typography.small, { color: colors.primary, marginLeft: 4, fontWeight: '700' }]}>
              {item.disabilityType}
            </Text>
          </View>
        </View>

        <Text style={[Typography.caption, { color: colors.textSecondary, marginTop: 10 }]}>
          {item.description}
        </Text>

        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => handleReject(item)}
            style={[styles.actionBtn, { borderColor: colors.border }]}>
            <Text style={{ color: colors.text, fontWeight: '600' }}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleAccept(item)}
            style={[styles.actionBtn, { backgroundColor: colors.primary, borderColor: colors.primary }]}>
            <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>Accept</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[Typography.h2, { color: colors.text }]}>Aktiv sorğular</Text>
        {locationLoading || isRefreshing ? <ActivityIndicator color={colors.primary} /> : null}
      </View>

      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 110,
  },
  card: {
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  actions: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionBtn: {
    minWidth: 90,
    minHeight: 40,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
