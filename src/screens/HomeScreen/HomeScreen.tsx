// src/screens/HomeScreen/HomeScreen.tsx
import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, FlatList, ActivityIndicator, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ViolinPiece, PieceStatus } from '../../types';
import { getPiecesForToday, getAllPieces, getExpressRoutine } from '../../database/models/pieceModel';
import { addQuickNote } from '../../database/models/quickNoteModel';
import { getRoutineConfig, RoutineConfig, DEFAULT_ROUTINE_CONFIG } from '../../database/models/settingsModel';
import { COLORS } from '../../theme';
import { RootStackParamList } from '../../navigation/AppNavigator';
import PieceCard from '../../components/PieceCard';
import EmptyState from '../../components/EmptyState';
import QuickCaptureModal from '../../components/QuickCaptureModal';
import RoutineConfigModal from '../../components/RoutineConfigModal';

import { styles } from './HomeScreen.styles';
import { StatusPill } from './components/StatusPill';
import { ExpressCard } from './components/ExpressCard';
import { HomeFAB } from './components/HomeFAB';

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [todayPieces, setTodayPieces] = useState<ViolinPiece[]>([]);
  const [allPieces, setAllPieces]     = useState<ViolinPiece[]>([]);
  const [isLoading, setIsLoading]     = useState(true);
  const [quickCaptureVisible, setQuickCaptureVisible] = useState(false);
  const [configVisible, setConfigVisible] = useState(false);
  const [routineConfig, setRoutineConfig] = useState<RoutineConfig>(DEFAULT_ROUTINE_CONFIG);
  const [statusFilter, setStatusFilter] = useState<PieceStatus | null>(null);

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      try {
        setTodayPieces(getPiecesForToday());
        setAllPieces(getAllPieces());
        setRoutineConfig(getRoutineConfig());
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

  const learningCount   = allPieces.filter(p => p.status === 'learning').length;
  const polishingCount  = allPieces.filter(p => p.status === 'polishing').length;
  const repertoireCount = allPieces.filter(p => p.status === 'repertoire').length;

  // Lista filtrada por estado
  const filteredPieces = useMemo(() => {
    if (!statusFilter) return allPieces;
    return allPieces.filter(p => p.status === statusFilter);
  }, [allPieces, statusFilter]);

  // Toggle: si ya está activo ese filtro, lo quita; si no, lo activa
  const toggleFilter = useCallback((status: PieceStatus) => {
    setStatusFilter(prev => (prev === status ? null : status));
  }, []);

  const handleQuickCaptureSave = (note: string) => {
    try {
      addQuickNote(note);
      console.log('[HomeScreen] Nota rápida guardada.');
    } catch (e) {
      console.error('[HomeScreen] Error al guardar nota rápida:', e);
    }
  };

  const renderHeader = () => (
    <View>
      {/* Tarjeta de Rutina Exprés */}
      <ExpressCard
        routineConfig={routineConfig}
        onConfigPress={() => setConfigVisible(true)}
        onStartPress={() => {
          const routine = getExpressRoutine(routineConfig);
          navigation.navigate('WarmUpSession', { routine });
        }}
      />

      {/* Resumen de estados SM-2 — ahora funcionan como filtros */}
      {totalPieces > 0 && (
        <View style={styles.statusSummaryRow}>
          <StatusPill
            color={COLORS.statusLearning}
            label="Aprendiendo"
            count={learningCount}
            active={statusFilter === PieceStatus.Learning}
            onPress={() => toggleFilter(PieceStatus.Learning)}
          />
          <StatusPill
            color={COLORS.statusPolishing}
            label="Puliendo"
            count={polishingCount}
            active={statusFilter === PieceStatus.Polishing}
            onPress={() => toggleFilter(PieceStatus.Polishing)}
          />
          <StatusPill
            color={COLORS.statusRepertoire}
            label="Repertorio"
            count={repertoireCount}
            active={statusFilter === PieceStatus.Repertoire}
            onPress={() => toggleFilter(PieceStatus.Repertoire)}
          />
        </View>
      )}

      {/* Sección "Para practicar hoy" */}
      {dueCount > 0 && (
        <View style={styles.todaySection}>
          <View style={styles.todaySectionHeader}>
            <Ionicons name="flame" size={16} color={COLORS.warning} />
            <Text style={styles.todaySectionTitle}>Para practicar hoy</Text>
            <View style={styles.todayCountBubble}>
              <Text style={styles.todayCountText}>{dueCount}</Text>
            </View>
          </View>

          {todayPieces.map((p) => (
            <PieceCard
              key={p.id}
              piece={p}
              onPress={() => navigation.navigate('PieceDetail', { id: p.id })}
              highlighted
            />
          ))}
        </View>
      )}

      {/* Separador "Todo el repertorio" o indicador de filtro activo */}
      {totalPieces > 0 && (
        <Text style={styles.allPiecesLabel}>
          {statusFilter
            ? `Filtrando: ${statusFilter === 'learning' ? 'Aprendiendo' : statusFilter === 'polishing' ? 'Puliendo' : 'Repertorio'}`
            : 'Todo el repertorio'}
        </Text>
      )}
    </View>
  );

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
          data={filteredPieces}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <PieceCard
              piece={item}
              onPress={(p) => navigation.navigate('PieceDetail', { id: p.id })}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={
            <EmptyState
              title="Aún no tienes piezas en tu repertorio."
              subtitle="Presiona el botón + para agregar la primera."
            />
          }
        />
      )}

      {/* FAB Expandible */}
      <HomeFAB
        onQuickCapturePress={() => setQuickCaptureVisible(true)}
        onAddPiecePress={() => navigation.navigate('AddPiece')}
      />

      {/* Modal Captura Rápida */}
      <QuickCaptureModal
        visible={quickCaptureVisible}
        onClose={() => setQuickCaptureVisible(false)}
        onSave={handleQuickCaptureSave}
      />

      {/* Modal Configuración Rutina */}
      <RoutineConfigModal
        visible={configVisible}
        onClose={() => setConfigVisible(false)}
        onSave={() => {
          setRoutineConfig(getRoutineConfig());
        }}
      />
    </SafeAreaView>
  );
}
