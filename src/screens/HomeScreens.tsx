// src/screens/HomeScreens.tsx
import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StatusBar, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ViolinPiece } from '../types';
import { getAllPieces, getPiecesForToday } from '../database/models/pieceModel';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../theme';
import { RootStackParamList } from '../navigation/AppNavigator';
import PieceCard from '../components/PieceCard';
import EmptyState from '../components/EmptyState';

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [todayPieces, setTodayPieces] = useState<ViolinPiece[]>([]);
  const [allPieces, setAllPieces]     = useState<ViolinPiece[]>([]);
  const [isLoading, setIsLoading]     = useState(true);

  // Recarga ambas listas cada vez que la pantalla recibe foco
  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      try {
        setTodayPieces(getPiecesForToday());
        setAllPieces(getAllPieces());
      } catch (e) {
        console.error('[HomeScreen] Error al cargar:', e);
        setTodayPieces([]);
        setAllPieces([]);
      } finally {
        setIsLoading(false);
      }
    }, [])
  );

  const totalPieces = allPieces.length;
  const dueCount    = todayPieces.length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bgCard} />

      {/* Encabezado */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.greeting}>¡A practicar!</Text>
          <Text style={styles.subtitle}>
            {totalPieces > 0
              ? `${totalPieces} pieza${totalPieces > 1 ? 's' : ''} en repertorio`
              : 'Tu repertorio está vacío'}
          </Text>
        </View>

        {/* Badge naranja: piezas pendientes hoy */}
        {dueCount > 0 && (
          <View style={styles.dueBadge}>
            <Ionicons name="notifications" size={14} color={COLORS.white} />
            <Text style={styles.dueBadgeText}>{dueCount} hoy</Text>
          </View>
        )}

        {/* Badge verde: al día */}
        {dueCount === 0 && totalPieces > 0 && (
          <View style={styles.upToDateBadge}>
            <Ionicons name="checkmark-circle" size={14} color={COLORS.statusRepertoire} />
            <Text style={styles.upToDateText}>¡Al día!</Text>
          </View>
        )}
      </View>

      {/* Contenido */}
      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 60 }} size="large" color={COLORS.accent} />
      ) : (
        <FlatList
          data={allPieces}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <PieceCard
              piece={item}
              onPress={(p) => navigation.navigate('PieceDetail', { id: p.id })}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            dueCount > 0 ? (
              <View style={styles.todaySection}>
                {/* Título de sección */}
                <View style={styles.todaySectionHeader}>
                  <Ionicons name="flame" size={16} color={COLORS.warning} />
                  <Text style={styles.todaySectionTitle}>Para practicar hoy</Text>
                  <View style={styles.todayCountBubble}>
                    <Text style={styles.todayCountText}>{dueCount}</Text>
                  </View>
                </View>

                {/* Piezas vencidas */}
                {todayPieces.map((p) => (
                  <PieceCard
                    key={p.id}
                    piece={p}
                    onPress={() => navigation.navigate('PieceDetail', { id: p.id })}
                    highlighted
                  />
                ))}

                {/* Separador con "Todo el repertorio" */}
                {totalPieces > 0 && (
                  <Text style={styles.allPiecesLabel}>Todo el repertorio</Text>
                )}
              </View>
            ) : null
          }
          ListEmptyComponent={
            <EmptyState
              title="Aún no tienes piezas en tu repertorio."
              subtitle="Presiona el botón + para agregar la primera."
            />
          }
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddPiece')}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={30} color={COLORS.white} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgApp,
  },
  header: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.bgCard,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  greeting: {
    fontSize: TYPOGRAPHY.sizeLg,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.sizeSm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  dueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.warning,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    ...SHADOWS.card,
  },
  dueBadgeText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.sizeTiny,
    fontWeight: TYPOGRAPHY.bold,
  },
  upToDateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.statusRepertoire + '22',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  upToDateText: {
    color: COLORS.statusRepertoire,
    fontSize: TYPOGRAPHY.sizeTiny,
    fontWeight: TYPOGRAPHY.semiBold,
  },
  list: {
    padding: SPACING.lg,
    paddingBottom: 100,
  },
  todaySection: {
    marginBottom: SPACING.lg,
  },
  todaySectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  todaySectionTitle: {
    fontSize: TYPOGRAPHY.sizeXxs,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.warning,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    flex: 1,
  },
  todayCountBubble: {
    backgroundColor: COLORS.warning,
    borderRadius: RADIUS.full,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayCountText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.sizeTiny,
    fontWeight: TYPOGRAPHY.bold,
  },
  allPiecesLabel: {
    fontSize: TYPOGRAPHY.sizeXxs,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: SPACING.xl,
    marginBottom: SPACING.sm,
  },
  fab: {
    position: 'absolute',
    bottom: SPACING.xxl,
    right: SPACING.xxl,
    backgroundColor: COLORS.accent,
    width: 60,
    height: 60,
    borderRadius: RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.fab,
  },
});
