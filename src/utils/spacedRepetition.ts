// src/utils/spacedRepetition.ts
// "Cerebro" de VioMind: algoritmo de repetición espaciada adaptado para músicos.
// Basado en SM-2 simplificado con multiplicadores diseñados para el ciclo
// de aprendizaje musical (Learning → Polishing → Repertoire → Dormant).

import { PieceStatus } from '../types';

// ─── Constantes de los multiplicadores ─────────────────────────────────────
//
//  quality 1-2  → FALLO: la memoria muscular no respondió.
//                 Se reinicia el intervalo a 1 día (práctica obligatoria mañana).
//
//  quality 3    → ACEPTABLE: la pieza salió pero con dudas o errores leves.
//                 Multiplicador x1.2 — avance mínimo para reforzar sin castigar.
//
//  quality 4    → BIEN: ejecución correcta con pequeñas imperfecciones.
//                 Multiplicador x1.5 — ritmo estándar de repetición espaciada.
//
//  quality 5    → PERFECTO: nivel concierto, dominio total.
//                 Multiplicador x2.5 — empuja la revisión varias semanas adelante.

const MULTIPLIERS: Record<number, number> = {
  3: 1.2,
  4: 1.5,
  5: 2.5,
};

// ─── Tipos públicos ─────────────────────────────────────────────────────────

/** Calificación del músico al terminar de tocar la pieza (1-5). */
export type PracticeQuality = 1 | 2 | 3 | 4 | 5;

/** Resultado que devuelve calculateNextReview. */
export interface ReviewResult {
  /** Nuevo intervalo en días hasta la próxima revisión. Siempre ≥ 1. */
  nextIntervalDays: number;
  /** Nuevo estado de la pieza derivado del intervalo calculado. */
  nextStatus: PieceStatus;
}

// ─── Función principal ──────────────────────────────────────────────────────

/**
 * Calcula el próximo intervalo de revisión y el estado resultante
 * de una pieza musical según el rendimiento del músico.
 *
 * @param currentInterval  Días transcurridos desde la última revisión (≥ 1).
 * @param quality          Calificación del músico: 1=Desastre · 5=Nivel concierto.
 * @returns                { nextIntervalDays, nextStatus }
 *
 * @example
 * // Pieza practicada hace 7 días, tocada perfectamente:
 * calculateNextReview(7, 5);
 * // → { nextIntervalDays: 18, nextStatus: 'repertoire' }
 */
export function calculateNextReview(
  currentInterval: number,
  quality: PracticeQuality,
): ReviewResult {
  // ── 1. Calcular el nuevo intervalo ────────────────────────────────────────
  let nextIntervalDays: number;

  if (quality <= 2) {
    // FALLO: reinicio total — toca repasarla mañana sin importar el historial.
    nextIntervalDays = 1;
  } else {
    const multiplier = MULTIPLIERS[quality];
    // Math.ceil garantiza que el resultado siempre sea un entero ≥ 1.
    nextIntervalDays = Math.ceil(currentInterval * multiplier);
  }

  // Cota de seguridad: nunca puede ser menor a 1.
  nextIntervalDays = Math.max(1, nextIntervalDays);

  // ── 2. Determinar el estado según el intervalo resultante ─────────────────
  const nextStatus = deriveStatus(nextIntervalDays);

  return { nextIntervalDays, nextStatus };
}

// ─── Helper privado ─────────────────────────────────────────────────────────

/**
 * Convierte un intervalo en días al estado correspondiente del ciclo musical.
 *
 *  1 – 2  días  → Learning   (recién retomada, práctica urgente)
 *  3 – 3  días  → Polishing  (afinando, revisión muy próxima)
 *  4 – 21 días  → Repertoire (consolidada, intervalos largos)
 *  > 21   días  → Dormant    (mantenimiento a largo plazo)
 */
function deriveStatus(intervalDays: number): PieceStatus {
  if (intervalDays <= 2)  return PieceStatus.Learning;
  if (intervalDays <= 3)  return PieceStatus.Polishing;
  if (intervalDays <= 21) return PieceStatus.Repertoire;
  return PieceStatus.Dormant;
}
