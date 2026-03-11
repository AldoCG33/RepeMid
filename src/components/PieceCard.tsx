// src/components/PieceCard.tsx
// Tarjeta visual de una pieza del repertorio.
// Reutilizable en HomeScreen, listas de búsqueda, etc.

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ViolinPiece, PieceStatus } from '../types';
import {
  COLORS,
  STATUS_COLORS,
  STATUS_LABELS,
  SPACING,
  RADIUS,
  TYPOGRAPHY,
  SHADOWS,
} from '../theme';

// ─────────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────────
interface PieceCardProps {
  piece: ViolinPiece;
  onPress?: (piece: ViolinPiece) => void;
}

// ─────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────
function isDueToday(piece: ViolinPiece): boolean {
  const last = new Date(piece.lastPracticed);
  const next = new Date(last);
  next.setDate(next.getDate() + Math.round(piece.intervalDays));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return next <= today;
}

function nextPracticeLabel(piece: ViolinPiece): string {
  if (piece.status === PieceStatus.Dormant) return 'Dormida';
  if (isDueToday(piece)) return '¡Hoy!';
  const days = Math.round(piece.intervalDays);
  return `En ${days} día${days !== 1 ? 's' : ''}`;
}

// ─────────────────────────────────────────────────
// COMPONENTE
// ─────────────────────────────────────────────────
export default function PieceCard({ piece, onPress }: PieceCardProps) {
  const statusColor = STATUS_COLORS[piece.status];
  const statusLabel = STATUS_LABELS[piece.status];
  const due         = isDueToday(piece);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress?.(piece)}
      activeOpacity={0.82}
    >
      {/* Borde izquierdo de color según estado */}
      <View style={[styles.strip, { backgroundColor: statusColor }]} />

      <View style={styles.content}>
        {/* Título + badge de estado */}
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={1}>{piece.title}</Text>
          <View style={[styles.badge, { backgroundColor: statusColor + '22' }]}>
            <Text style={[styles.badgeText, { color: statusColor }]}>
              {statusLabel}
            </Text>
          </View>
        </View>

        {/* Compositor */}
        <Text style={styles.composer}>{piece.composer}</Text>

        {/* Pie: dificultad · próxima práctica · reps */}
        <View style={styles.footer}>
          <View style={styles.stat}>
            <Ionicons name="musical-notes-outline" size={13} color={COLORS.textDisabled} />
            <Text style={styles.statText}>Dif {piece.difficulty}/5</Text>
          </View>

          <View style={styles.stat}>
            <Ionicons
              name="time-outline"
              size={13}
              color={due ? COLORS.accent : COLORS.textDisabled}
            />
            <Text style={[styles.statText, due && styles.dueText]}>
              {nextPracticeLabel(piece)}
            </Text>
          </View>

          <View style={styles.stat}>
            <Ionicons name="refresh-outline" size={13} color={COLORS.textDisabled} />
            <Text style={styles.statText}>{piece.repetitions} reps</Text>
          </View>
        </View>
      </View>

      <Ionicons
        name="chevron-forward"
        size={18}
        color={COLORS.borderLight}
        style={{ alignSelf: 'center' }}
      />
    </TouchableOpacity>
  );
}

// ─────────────────────────────────────────────────
// ESTILOS
// ─────────────────────────────────────────────────
const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
    paddingRight: SPACING.md,
    overflow: 'hidden',
    ...SHADOWS.card,
  },
  strip: {
    width: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  title: {
    flex: 1,
    fontSize: TYPOGRAPHY.sizeSm,
    fontWeight: TYPOGRAPHY.semiBold,
    color: COLORS.textPrimary,
    marginRight: SPACING.sm,
  },
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  badgeText: {
    fontSize: TYPOGRAPHY.sizeMicro,
    fontWeight: TYPOGRAPHY.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  composer: {
    fontSize: TYPOGRAPHY.sizeXs,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginBottom: SPACING.sm,
  },
  footer: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  statText: {
    fontSize: TYPOGRAPHY.sizeTiny,
    color: COLORS.textDisabled,
  },
  dueText: {
    color: COLORS.accent,
    fontWeight: TYPOGRAPHY.semiBold,
  },
});
