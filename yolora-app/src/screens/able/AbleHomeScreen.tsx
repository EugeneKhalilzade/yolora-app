import React, { useContext, useMemo } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { ThemeContext } from '../../context/ThemeContext';
import { AuthContext } from '../../context/AuthContext';
import { SocketContext } from '../../context/SocketContext';
import { Typography } from '../../theme/typography';

export const AbleHomeScreen = () => {
  const { colors } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const { incomingRequests } = useContext(SocketContext);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const quickStats = useMemo(
    () => [
      { id: 'active', label: 'Aktiv sorğu', value: incomingRequests.length.toString(), icon: 'notifications-outline' },
      { id: 'radius', label: 'Əhatə radiusu', value: '1 km', icon: 'locate-outline' },
      { id: 'response', label: 'Orta cavab', value: '2.3 dəq', icon: 'timer-outline' },
    ],
    [incomingRequests.length],
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={[Typography.caption, { color: colors.textSecondary }]}>Xoş gəldiniz</Text>
            <Text style={[Typography.h2, { color: colors.text }]}>{user?.displayName || 'Helper'}</Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('MapTab')}
            style={[styles.mapButton, { backgroundColor: colors.primary }]}>
            <Icon name="map" size={18} color="#FFFFFF" />
            <Text style={styles.mapButtonText}>Map</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.heroCard, { backgroundColor: colors.surface }]}>
          <Text style={[Typography.h3, { color: colors.text }]}>Yaxında kömək sorğuları mövcuddur</Text>
          <Text style={[Typography.body, { color: colors.textSecondary, marginTop: 8 }]}>
            Canlı sorğulara baxın, uyğun olanı qəbul edin və marşrutla istifadəçiyə yönəlin.
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('RequestsTab')}
            style={[styles.heroAction, { backgroundColor: colors.primary }]}>
            <Text style={styles.heroActionText}>Sorğuları aç</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          {quickStats.map((stat) => (
            <View key={stat.id} style={[styles.statCard, { backgroundColor: colors.surface }]}>
              <Icon name={stat.icon} size={20} color={colors.primary} />
              <Text style={[Typography.bodyBold, { color: colors.text, marginTop: 8 }]}>{stat.value}</Text>
              <Text style={[Typography.small, { color: colors.textMuted, marginTop: 3 }]}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.screenshotCard, { backgroundColor: colors.surface }]}>
          <Text style={[Typography.h3, { color: colors.text }]}>Screenshot-ready sorğular</Text>
          <Text style={[Typography.body, { color: colors.textSecondary, marginTop: 6 }]}>
            Yardımçı rolü üçün demoda göstərmək məqsədilə əlavə nümunə sorğular avtomatik görünür.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  mapButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  heroCard: {
    marginTop: 16,
    borderRadius: 18,
    padding: 16,
  },
  heroAction: {
    marginTop: 14,
    borderRadius: 14,
    minHeight: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroActionText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
  },
  statsRow: {
    marginTop: 14,
    flexDirection: 'row',
    gap: 8,
  },
  statCard: {
    flex: 1,
    borderRadius: 14,
    padding: 12,
  },
  screenshotCard: {
    marginTop: 14,
    borderRadius: 18,
    padding: 16,
  },
});
