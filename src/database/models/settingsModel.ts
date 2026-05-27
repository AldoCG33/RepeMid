// src/database/models/settingsModel.ts
// Operaciones CRUD para configuraciones de la app.

import db from '../database';

// Tipos base para la Rutina Exprés
export interface RoutineConfig {
  numScales: number;
  numLearning: number;
  numRepertoire: number;
  timeEstimateMins: number; // un estimado de tiempo
}

// Configuración por defecto si el usuario no ha elegido nada
export const DEFAULT_ROUTINE_CONFIG: RoutineConfig = {
  numScales: 1,
  numLearning: 1,
  numRepertoire: 1,
  timeEstimateMins: 20,
};

// ─────────────────────────────────────────────────
// GUARDAR CONFIGURACIÓN
// ─────────────────────────────────────────────────
export function saveRoutineConfig(config: RoutineConfig): void {
  try {
    const value = JSON.stringify(config);
    db.runSync(
      `INSERT OR REPLACE INTO settings (key, value) VALUES ('routine_config', ?);`,
      [value]
    );
    console.log('[settingsModel] Rutina exprés guardada:', config);
  } catch (error) {
    console.error('[settingsModel] Error al guardar configuración de rutina:', error);
    throw error;
  }
}

// ─────────────────────────────────────────────────
// LEER CONFIGURACIÓN
// ─────────────────────────────────────────────────
export function getRoutineConfig(): RoutineConfig {
  try {
    const row = db.getFirstSync<{ value: string }>(
      `SELECT value FROM settings WHERE key = 'routine_config';`
    );
    if (!row) {
      return DEFAULT_ROUTINE_CONFIG;
    }
    return JSON.parse(row.value) as RoutineConfig;
  } catch (error) {
    console.error('[settingsModel] Error al leer configuración de rutina:', error);
    return DEFAULT_ROUTINE_CONFIG; // fallback seguro
  }
}
