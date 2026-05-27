// src/screens/PieceDetail/PieceDetailScreen.tsx
import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../navigation/AppNavigator';
import { getPieceById, updateAfterPractice, deletePiece } from '../../database/models/pieceModel';
import { ViolinPiece } from '../../types';
import { scheduleReviewNotification, cancelPieceNotification } from '../../utils/notifications';
import {
  COLORS, STATUS_COLORS, STATUS_LABELS,
  DIFFICULTY_COLORS, DIFFICULTY_LABELS,
  SPACING,
} from '../../theme';
import { StatBox } from '../../components';
import { styles } from './PieceDetail.styles';
import { RatingModal, Quality } from './components/RatingModal';

type Props = NativeStackScreenProps<RootStackParamList, 'PieceDetail'>;

function nextPracticeDate(piece: ViolinPiece): string {
  const last = new Date(piece.lastPracticed);
  const next = new Date(last);
  next.setDate(next.getDate() + Math.round(piece.intervalDays));
  return next.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
}

function isDueToday(piece: ViolinPiece): boolean {
  const last = new Date(piece.lastPracticed);
  const next = new Date(last);
  next.setDate(next.getDate() + Math.round(piece.intervalDays));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return next <= today;
}

export default function PieceDetailScreen({ route, navigation }: Props) {
  const { id } = route.params;

  const [piece, setPiece]           = useState<ViolinPiece | null>(null);
  const [isLoading, setIsLoading]   = useState(true);
  const [showRating, setShowRating] = useState(false);
  const [isSaving, setIsSaving]     = useState(false);

  useFocusEffect(
    useCallback(() => {
      try {
        const data = getPieceById(id);
        if (!data) { navigation.goBack(); return; }
        setPiece(data);
      } catch (e) {
        console.error('[PieceDetail] Error al cargar pieza:', e);
      } finally {
        setIsLoading(false);
      }
    }, [id, navigation])
  );

  function handleQualitySelect(quality: Quality) {
    if (!piece) return;
    setIsSaving(true);
    try {
      updateAfterPractice(piece.id, quality);
      setShowRating(false);
      const updated = getPieceById(piece.id);
      if (updated) {
        setPiece(updated);
        cancelPieceNotification(updated.id)
          .then(() => scheduleReviewNotification(updated, updated.intervalDays))
          .catch(() => { /* No-crítico: nunca interrumpir el flujo */ });
      }
    } catch {
      Alert.alert('Error', 'No se pudo registrar la práctica.');
    } finally {
      setIsSaving(false);
    }
  }

  function handleDelete() {
    Alert.alert(
      'Eliminar pieza',
      `¿Eliminar "${piece?.title}"? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            try {
              if (piece) deletePiece(piece.id);
              navigation.goBack();
            } catch {
              Alert.alert('Error', 'No se pudo eliminar la pieza.');
            }
          },
        },
      ]
    );
  }

  if (isLoading || !piece) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator style={{ marginTop: 80 }} size="large" color={COLORS.accent} />
      </SafeAreaView>
    );
  }

  const statusColor = STATUS_COLORS[piece.status];
  const due         = isDueToday(piece);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* ── Encabezado ───────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={26} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{piece.title}</Text>
        {/* Botón editar */}
        <TouchableOpacity
          onPress={() => navigation.navigate('EditPiece', { id: piece.id })}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={{ marginRight: SPACING.sm }}
        >
          <Ionicons name="create-outline" size={22} color={COLORS.accent} />
        </TouchableOpacity>
        {/* Botón eliminar */}
        <TouchableOpacity onPress={handleDelete}>
          <Ionicons name="trash-outline" size={22} color={COLORS.error} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* ── Tarjeta de identificación ─────────── */}
        <View style={[styles.idCard, { borderLeftColor: statusColor }]}>
          <View style={styles.idCardTop}>
            <View>
              <Text style={styles.pieceTitle}>{piece.title}</Text>
              <Text style={styles.composer}>{piece.composer}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: statusColor + '22' }]}>
              <Text style={[styles.statusBadgeText, { color: statusColor }]}>
                {STATUS_LABELS[piece.status]}
              </Text>
            </View>
          </View>
          <View style={[styles.diffPill, { backgroundColor: DIFFICULTY_COLORS[piece.difficulty] + '22' }]}>
            <Ionicons name="stats-chart" size={13} color={DIFFICULTY_COLORS[piece.difficulty]} />
            <Text style={[styles.diffPillText, { color: DIFFICULTY_COLORS[piece.difficulty] }]}>
              {DIFFICULTY_LABELS[piece.difficulty]} (Dif {piece.difficulty}/5)
            </Text>
          </View>
        </View>

        {/* ── Estadísticas SM-2 ─────────────────── */}
        <Text style={styles.sectionTitle}>Estadísticas de práctica</Text>
        <View style={styles.statsGrid}>
          <StatBox
            icon="calendar-outline"
            label="Última práctica"
            value={new Date(piece.lastPracticed).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
          />
          <StatBox
            icon="time-outline"
            label="Próxima práctica"
            value={due ? '¡Hoy!' : nextPracticeDate(piece)}
            highlight={due}
          />
          <StatBox
            icon="refresh-outline"
            label="Repeticiones"
            value={`${piece.repetitions}`}
          />
          <StatBox
            icon="pulse-outline"
            label="Intervalo actual"
            value={`${Math.round(piece.intervalDays)} días`}
          />
          <StatBox
            icon="speedometer-outline"
            label="Factor de facilidad"
            value={piece.easeFactor.toFixed(2)}
          />
          <StatBox
            icon="layers-outline"
            label="Estado"
            value={STATUS_LABELS[piece.status]}
            color={statusColor}
          />
        </View>

        {/* ── Notas técnicas ────────────────────── */}
        {piece.technicalNotes ? (
          <>
            <Text style={styles.sectionTitle}>Notas técnicas</Text>
            <View style={styles.notesCard}>
              <Ionicons name="document-text-outline" size={16} color={COLORS.textSecondary} />
              <Text style={styles.notesText}>{piece.technicalNotes}</Text>
            </View>
          </>
        ) : null}

        {/* ── Botón principal ───────────────────── */}
        <TouchableOpacity
          style={[styles.practiceBtn, due && styles.practiceBtnDue]}
          onPress={() => setShowRating(true)}
          activeOpacity={0.82}
        >
          <Ionicons name="musical-note" size={22} color={COLORS.white} />
          <Text style={styles.practiceBtnText}>
            {due ? '¡Practicar ahora!' : 'Registrar práctica'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ── Modal de calificación (0-5) ──────────── */}
      <RatingModal
        visible={showRating}
        onClose={() => setShowRating(false)}
        onSelectQuality={handleQualitySelect}
        isSaving={isSaving}
      />
    </SafeAreaView>
  );
}
