// src/screens/WarmUpSession/utils.ts
import { Ionicons } from '@expo/vector-icons';
import { ViolinPiece } from '../../types';
import { COLORS, STATUS_LABELS } from '../../theme';

export interface SessionStep {
  type: 'warmup' | 'challenge' | 'review';
  title: string;
  subtitle: string;
  durationSecs: number;
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
  piece?: ViolinPiece;
}

export function urgencyLabel(piece: ViolinPiece): string {
  const last = new Date(piece.lastPracticed);
  const next = new Date(last);
  next.setDate(next.getDate() + Math.round(piece.intervalDays));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (next <= today) return '¡Pendiente hoy!';
  const diff = Math.ceil((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return `Próxima en ${diff} día${diff !== 1 ? 's' : ''}`;
}

export function formatTime(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

import { ExpressRoutine } from '../../database/models/pieceModel';

export function buildSteps(routine: ExpressRoutine): SessionStep[] {
  const steps: SessionStep[] = [];
  
  // Calentamiento (Escala + Ritmo)
  const { scale, rhythm } = routine.warmUp;
  steps.push({
    type: 'warmup',
    title: scale.name,
    subtitle: `${rhythm} · ${scale.accidentals}`,
    durationSecs: 5 * 60,
    color: COLORS.accent,
    icon: 'musical-note',
  });

  // Reto técnico
  if (routine.technicalPiece) {
    const piece = routine.technicalPiece;
    steps.push({
      type: 'challenge',
      title: piece.title,
      subtitle: `${piece.composer} · ${STATUS_LABELS[piece.status]}`,
      durationSecs: 8 * 60,
      color: COLORS.statusLearning,
      icon: 'flame',
      piece,
    });
  }

  // Repaso
  if (routine.repertoirePiece) {
    const piece = routine.repertoirePiece;
    steps.push({
      type: 'review',
      title: piece.title,
      subtitle: `${piece.composer} · ${urgencyLabel(piece)}`,
      durationSecs: 7 * 60,
      color: COLORS.statusRepertoire,
      icon: 'refresh',
      piece,
    });
  }

  return steps;
}
