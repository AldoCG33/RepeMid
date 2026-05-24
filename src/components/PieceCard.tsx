// src/components/PieceCard.tsx
// Tarjeta visual de una pieza del repertorio.
// Ahora muestra información del algoritmo de repetición espaciada (SM-2).

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ViolinPiece, PieceStatus } from '../types';
import { COLORS, STATUS_COLORS, STATUS_LABELS } from '../theme';
import { styles } from './styles/PieceCard.styles';

// ─────────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────────
interface PieceCardProps {
  piece: ViolinPiece;
  onPress?: (piece: ViolinPiece) => void;
  /** Si true, aplica un borde naranja de alerta (usada en la sección "Para hoy") */
  highlighted?: boolean;
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

function daysSinceLastPractice(piece: ViolinPiece): number {
  const last = new Date(piece.lastPracticed);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  last.setHours(0, 0, 0, 0);
  return Math.floor((today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
}

function nextPracticeLabel(piece: ViolinPiece): string {
  if (piece.status === PieceStatus.Dormant) return 'Dormida';
  if (isDueToday(piece)) return '¡Hoy!';
  const days = Math.round(piece.intervalDays);
  return `En ${days} día${days !== 1 ? 's' : ''}`;
}

/** Devuelve un icono representativo del estado SM-2 */
function statusIcon(status: PieceStatus): keyof typeof Ionicons.glyphMap {
  switch (status) {
    case PieceStatus.Learning:   return 'book-outline';
    case PieceStatus.Polishing:  return 'sparkles-outline';
    case PieceStatus.Repertoire: return 'trophy-outline';
    case PieceStatus.Dormant:    return 'moon-outline';
  }
}

/** Genera la línea descriptiva que evidencia el algoritmo */
function algorithmHint(piece: ViolinPiece): string {
  if (piece.status === PieceStatus.Dormant) return 'En pausa — no se programarán repasos';

  const days = daysSinceLastPractice(piece);
  const interval = Math.round(piece.intervalDays);

  if (days === 0) return `Intervalo actual: ${interval} día${interval !== 1 ? 's' : ''}`;
  if (days === 1) return `Hace 1 día que no la tocas · Intervalo: ${interval}d`;
  return `Hace ${days} días que no la tocas · Intervalo: ${interval}d`;
}

// ─────────────────────────────────────────────────
// COMPONENTE
// ─────────────────────────────────────────────────
export default function PieceCard({ piece, onPress, highlighted }: PieceCardProps) {
  const statusColor = STATUS_COLORS[piece.status];
  const statusLabel = STATUS_LABELS[piece.status];
  const due         = isDueToday(piece);
  const icon        = statusIcon(piece.status);

  return (
    <TouchableOpacity
      style={[styles.card, highlighted && styles.cardHighlighted]}
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
            <Ionicons name={icon} size={10} color={statusColor} style={{ marginRight: 3 }} />
            <Text style={[styles.badgeText, { color: statusColor }]}>
              {statusLabel}
            </Text>
          </View>
        </View>

        {/* Compositor */}
        <Text style={styles.composer}>{piece.composer}</Text>

        {/* ✨ Línea del algoritmo de repetición espaciada */}
        <View style={styles.algorithmRow}>
          <Ionicons name="pulse-outline" size={12} color={statusColor} />
          <Text style={[styles.algorithmText, { color: statusColor }]}>
            {algorithmHint(piece)}
          </Text>
        </View>

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
