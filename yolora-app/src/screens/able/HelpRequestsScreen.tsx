import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ThemeContext } from '../../context/ThemeContext';
import { SocketContext } from '../../context/SocketContext';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { Button, Card } from '../../components';
import { IncomingHelpRequest } from '../../types';

export const HelpRequestsScreen = () => {
  const { colors } = useContext(ThemeContext);
  const { incomingRequests, acceptRequest } = useContext(SocketContext);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  const handleAccept = async (req: IncomingHelpRequest) => {
    setAcceptingId(req.id);
    try {
      await acceptRequest(req.id, req.latitude, req.longitude);
      navigation.navigate('Navigate', {
        requestId: req.id,
        requesterLatitude: req.latitude,
        requesterLongitude: req.longitude,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setAcceptingId(null);
    }
  };

  const renderItem = ({ item }: { item: IncomingHelpRequest }) => (
    <Card elevated>
      <View style={styles.requestHeader}>
        <Text style={[Typography.h3, { color: colors.text }]}>{item.requesterName}</Text>
        <Text style={[Typography.caption, { color: colors.primary, textTransform: 'capitalize' }]}>
          {item.disabilityType}
        </Text>
      </View>
      <Text style={[Typography.body, { color: colors.textSecondary, marginBottom: Spacing.md }]}>
        Needs assistance nearby.
      </Text>
      
      <View style={styles.actionRow}>
        <Button
          title="Accept"
          onPress={() => handleAccept(item)}
          loading={acceptingId === item.id}
          style={{ flex: 1, marginRight: Spacing.sm }}
        />
        <Button
          title="Ignore"
          variant="outline"
          onPress={() => {}} // Remove from local list or ignore
          style={{ flex: 1, marginLeft: Spacing.sm }}
        />
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[Typography.h2, { color: colors.text }]}>
            Help Requests
          </Text>
        </View>

        {incomingRequests.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={[Typography.body, { color: colors.textSecondary }]}>
              No requests nearby at the moment.
            </Text>
          </View>
        ) : (
          <FlatList
            data={incomingRequests}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: Spacing.xxl }}
          />
        )}
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
    marginBottom: Spacing.xl,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
