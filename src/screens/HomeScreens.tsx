// src/screens/HomeScreens.tsx
import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StatusBar, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ViolinPiece } from '../types';
import { getAllPieces } from '../database/models/pieceModel';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../theme';
import { RootStackParamList } from '../navigation/AppNavigator';
import PieceCard from '../components/PieceCard';
import EmptyState from '../components/EmptyState';

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [pieces, setPieces]       = useState<ViolinPiece[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Recarga la lista cada vez que la pantalla recibe foco
  // (incluyendo al regresar de AddPieceScreen)
  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      try {
        setPieces(getAllPieces());
      } catch (e) {
        console.error('[HomeScreen] Error al cargar:', e);
        setPieces([]);
      } finally {
        setIsLoading(false);
      }
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bgCard} />

      {/* Encabezado */}
      <View style={styles.header}>
        <Text style={styles.greeting}>¡A practicar!</Text>
        <Text style={styles.subtitle}>
          {pieces.length > 0
            ? `${pieces.length} pieza${pieces.length > 1 ? 's' : ''} en repertorio`
            : 'Tu repertorio está vacío'}
        </Text>
      </View>

      {/* Lista o spinner */}
      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 60 }} size="large" color={COLORS.accent} />
      ) : (
        <FlatList
          data={pieces}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <PieceCard
              piece={item}
              onPress={(p) => navigation.navigate('PieceDetail', { id: p.id })}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
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
    padding: SPACING.xl,
    backgroundColor: COLORS.bgCard,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
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
  list: {
    padding: SPACING.lg,
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
