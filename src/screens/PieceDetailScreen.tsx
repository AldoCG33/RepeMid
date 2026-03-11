// src/screens/PieceDetailScreen.tsx
// Pantalla de detalle de una pieza del repertorio.
// Muestra sus estadísticas SM-2 y permite registrar una sesión de práctica
// evaluando la calidad del 0 al 5 (algoritmo SuperMemo-2).

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList }           from '../navigation/AppNavigator';
import { getPieceById, updateAfterPractice, deletePiece } from '../database/models/pieceModel';
import { ViolinPiece, PieceStatus }     from '../types';
import {
  COLORS, STATUS_COLORS, STATUS_LABELS,
  DIFFICULTY_COLORS, DIFFICULTY_LABELS,
  SPACING, RADIUS, TYPOGRAPHY, SHADOWS,
} from '../theme';

// ─────────────────────────────────────────────────
// TIPOS
// ─────────────────────────────────────────────────
type Props = NativeStackScreenProps<RootStackParamList, 'PieceDetail'>;
type Quality = 0 | 1 | 2 | 3 | 4 | 5;

// ─────────────────────────────────────────────────
// DATOS DE CALIFICACIÓN DEL 0 AL 5
// ─────────────────────────────────────────────────
const QUALITY_OPTIONS: { value: Quality; label: string; detail: string; color: string }[] = [
  { value: 0, label: '0 — Olvido total',          detail: 'No recordé nada de la pieza',           color: '#E74C3C' },
  { value: 1, label: '1 — Muy difícil',            detail: 'Solo recordé fragmentos sueltos',       color: '#E67E22' },
  { value: 2, label: '2 — Con mucho esfuerzo',     detail: 'Toqué, pero con muchos errores',        color: '#F39C12' },
  { value: 3, label: '3 — Con esfuerzo',           detail: 'Salió, pero no con fluidez',            color: '#F1C40F' },
  { value: 4, label: '4 — Bien',                   detail: 'Salió con algunos tropiezos menores',   color: '#2ECC71' },
  { value: 5, label: '5 — Perfecto',               detail: 'Fluido, sin errores, sin titubear',     color: '#27AE60' },
];

// ─────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────────
export default function PieceDetailScreen({ route, navigation }: Props) {
  const { id } = route.params;

  const [piece, setPiece]           = useState<ViolinPiece | null>(null);
  const [isLoading, setIsLoading]   = useState(true);
  const [showRating, setShowRating] = useState(false);
  const [isSaving, setIsSaving]     = useState(false);

  // Carga (y recarga) la pieza cada vez que la pantalla recibe foco
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
    }, [id])
  );

  // ── Registrar práctica ─────────────────────────
  function handleQualitySelect(quality: Quality) {
    if (!piece) return;
    setIsSaving(true);
    try {
      updateAfterPractice(piece.id, quality);
      setShowRating(false);
      // Recargar los datos actualizados
      const updated = getPieceById(piece.id);
      if (updated) setPiece(updated);
    } catch {
      Alert.alert('Error', 'No se pudo registrar la práctica.');
    } finally {
      setIsSaving(false);
    }
  }

  // ── Eliminar pieza ─────────────────────────────
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

  // ── Pantalla de carga ──────────────────────────
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
      <Modal
        visible={showRating}
        animationType="slide"
        transparent
        onRequestClose={() => !isSaving && setShowRating(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>¿Cómo salió la práctica?</Text>
            <Text style={styles.modalSubtitle}>
              Sé honesto — el algoritmo ajusta el intervalo según tu evaluación
            </Text>

            {isSaving ? (
              <ActivityIndicator color={COLORS.accent} size="large" style={{ marginVertical: 32 }} />
            ) : (
              QUALITY_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  style={[styles.qualityBtn, { borderColor: opt.color + '44' }]}
                  onPress={() => handleQualitySelect(opt.value)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.qualityDot, { backgroundColor: opt.color }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.qualityLabel}>{opt.label}</Text>
                    <Text style={styles.qualityDetail}>{opt.detail}</Text>
                  </View>
                </TouchableOpacity>
              ))
            )}

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setShowRating(false)}
              disabled={isSaving}
            >
              <Text style={styles.cancelBtnText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────
// SUB-COMPONENTE: StatBox
// ─────────────────────────────────────────────────
interface StatBoxProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  highlight?: boolean;
  color?: string;
}

function StatBox({ icon, label, value, highlight, color }: StatBoxProps) {
  const valueColor = color ?? (highlight ? COLORS.accent : COLORS.textPrimary);
  return (
    <View style={statStyles.box}>
      <Ionicons name={icon} size={18} color={COLORS.textSecondary} />
      <Text style={statStyles.label}>{label}</Text>
      <Text style={[statStyles.value, { color: valueColor }]}>{value}</Text>
    </View>
  );
}

const statStyles = StyleSheet.create({
  box: {
    width: '48%',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.card,
  },
  label: {
    fontSize: TYPOGRAPHY.sizeTiny,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    marginBottom: 2,
  },
  value: {
    fontSize: TYPOGRAPHY.sizeSm,
    fontWeight: TYPOGRAPHY.semiBold,
  },
});

// ─────────────────────────────────────────────────
// ESTILOS PRINCIPALES
// ─────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgApp,
  },

  // Encabezado
  header: {
    backgroundColor: COLORS.bgCard,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  headerTitle: {
    flex: 1,
    fontSize: TYPOGRAPHY.sizeMd,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
  },

  scroll: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },

  // Tarjeta de identidad
  idCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    borderLeftWidth: 5,
    marginBottom: SPACING.xl,
    ...SHADOWS.card,
  },
  idCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  pieceTitle: {
    fontSize: TYPOGRAPHY.sizeMd,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
    maxWidth: '65%',
  },
  composer: {
    fontSize: TYPOGRAPHY.sizeXs,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  statusBadgeText: {
    fontSize: TYPOGRAPHY.sizeTiny,
    fontWeight: TYPOGRAPHY.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  diffPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  diffPillText: {
    fontSize: TYPOGRAPHY.sizeTiny,
    fontWeight: TYPOGRAPHY.semiBold,
  },

  // Sección
  sectionTitle: {
    fontSize: TYPOGRAPHY.sizeXxs,
    fontWeight: TYPOGRAPHY.semiBold,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: SPACING.sm,
  },

  // Grid de stats
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },

  // Notas técnicas
  notesCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
    ...SHADOWS.card,
  },
  notesText: {
    flex: 1,
    fontSize: TYPOGRAPHY.sizeXs,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },

  // Botón de práctica
  practiceBtn: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    ...SHADOWS.button,
  },
  practiceBtnDue: {
    backgroundColor: COLORS.statusRepertoire,
  },
  practiceBtnText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.sizeSm,
    fontWeight: TYPOGRAPHY.bold,
    letterSpacing: 0.4,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: COLORS.bgCard,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.xl,
    paddingBottom: SPACING.xxxl,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.borderLight,
    borderRadius: RADIUS.full,
    alignSelf: 'center',
    marginBottom: SPACING.xl,
  },
  modalTitle: {
    fontSize: TYPOGRAPHY.sizeMd,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  modalSubtitle: {
    fontSize: TYPOGRAPHY.sizeXxs,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
    lineHeight: 18,
  },
  qualityBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.bgApp,
  },
  qualityDot: {
    width: 12,
    height: 12,
    borderRadius: RADIUS.full,
  },
  qualityLabel: {
    fontSize: TYPOGRAPHY.sizeXs,
    fontWeight: TYPOGRAPHY.semiBold,
    color: COLORS.textPrimary,
  },
  qualityDetail: {
    fontSize: TYPOGRAPHY.sizeTiny,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  cancelBtn: {
    marginTop: SPACING.sm,
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  cancelBtnText: {
    fontSize: TYPOGRAPHY.sizeSm,
    color: COLORS.textSecondary,
  },
});
