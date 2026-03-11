// src/theme/tokens.ts
// Fuente de verdad única del diseño de VioMind.
// Todo color, tamaño o sombra debe venir de aquí — nunca hardcodear valores en componentes.

import { Platform } from 'react-native';

// ─────────────────────────────────────────────────
// COLORES
// ─────────────────────────────────────────────────
export const COLORS = {
  // Marca
  accent:      '#E67E22', // Naranja madera de violín — color principal
  accentLight: '#F39C12', // Versión más brillante para hover

  // Texto
  textPrimary:   '#2C3E50',
  textSecondary: '#7F8C8D',
  textDisabled:  '#BDC3C7',

  // Fondos
  bgApp:    '#F5F7FA', // Fondo global
  bgCard:   '#FFFFFF', // Fondo de tarjetas
  bgInput:  '#FFFFFF',

  // Bordes
  borderLight: '#E8ECF0',
  borderFocus: '#E67E22', // Igual que accent

  // Estados de pieza (semáforo SM-2)
  statusLearning:   '#3498DB', // Azul  — aprendiendo
  statusPolishing:  '#F1C40F', // Amarillo — puliendo
  statusRepertoire: '#2ECC71', // Verde — repertorio
  statusDormant:    '#95A5A6', // Gris  — dormida

  // Dificultad 1-5
  diff1: '#27AE60',  // Verde
  diff2: '#2ECC71',  // Verde claro
  diff3: '#F1C40F',  // Amarillo
  diff4: '#E67E22',  // Naranja
  diff5: '#E74C3C',  // Rojo

  // Feedback
  error:   '#E74C3C',
  success: '#2ECC71',
  warning: '#F39C12',

  // Misceláneos
  white: '#FFFFFF',
  transparent: 'transparent',
} as const;

// ─────────────────────────────────────────────────
// COLORES DE STATUS (array indexado por PieceStatus)
// ─────────────────────────────────────────────────
export const STATUS_COLORS = {
  learning:   COLORS.statusLearning,
  polishing:  COLORS.statusPolishing,
  repertoire: COLORS.statusRepertoire,
  dormant:    COLORS.statusDormant,
} as const;

export const STATUS_LABELS = {
  learning:   'Aprendiendo',
  polishing:  'Puliendo',
  repertoire: 'Repertorio',
  dormant:    'Dormida',
} as const;

// ─────────────────────────────────────────────────
// DIFICULTAD
// ─────────────────────────────────────────────────
export const DIFFICULTY_COLORS: Record<number, string> = {
  1: COLORS.diff1,
  2: COLORS.diff2,
  3: COLORS.diff3,
  4: COLORS.diff4,
  5: COLORS.diff5,
};

export const DIFFICULTY_LABELS: Record<number, string> = {
  1: 'Muy fácil',
  2: 'Fácil',
  3: 'Intermedio',
  4: 'Difícil',
  5: 'Avanzado',
};

// ─────────────────────────────────────────────────
// SPACING (sistema de 4px)
// ─────────────────────────────────────────────────
export const SPACING = {
  xs:  4,
  sm:  8,
  md:  12,
  lg:  16,
  xl:  20,
  xxl: 24,
  xxxl: 32,
} as const;

// ─────────────────────────────────────────────────
// RADIOS DE BORDE
// ─────────────────────────────────────────────────
export const RADIUS = {
  sm:  8,
  md:  12,
  lg:  14,
  xl:  20,
  full: 999,
} as const;

// ─────────────────────────────────────────────────
// TIPOGRAFÍA
// ─────────────────────────────────────────────────
export const TYPOGRAPHY = {
  // Tamaños
  sizeLg:   28,
  sizeMd:   20,
  sizeSm:   16,
  sizeXs:   14,
  sizeXxs:  13,
  sizeTiny: 12,
  sizeMicro: 10,

  // Pesos
  bold:     '700' as const,
  semiBold: '600' as const,
  medium:   '500' as const,
  regular:  '400' as const,

  // Familia (expandible para Google Fonts en el futuro)
  fontDefault: Platform.OS === 'ios' ? 'System' : 'Roboto',
} as const;

// ─────────────────────────────────────────────────
// SOMBRAS (iOS + Android unificados)
// ─────────────────────────────────────────────────
export const SHADOWS = {
  card: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  fab: {
    elevation: 6,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  button: {
    elevation: 4,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.30,
    shadowRadius: 6,
  },
} as const;
