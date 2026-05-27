// src/database/schema.ts
// Define y ejecuta todos los CREATE TABLE de la app.

import db from './database';

// ─────────────────────────────────────────────────────────────────────────────
// MODELO: ViolinPiece — Piezas de repertorio
// ─────────────────────────────────────────────────────────────────────────────
const CREATE_VIOLIN_PIECES = `
  CREATE TABLE IF NOT EXISTS violin_pieces (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    title           TEXT    NOT NULL,
    composer        TEXT    NOT NULL DEFAULT '',
    status          TEXT    NOT NULL DEFAULT 'learning'
                            CHECK(status IN ('learning','polishing','repertoire','dormant')),
    lastPracticed   TEXT    NOT NULL DEFAULT (date('now')),
    intervalDays    REAL    NOT NULL DEFAULT 1,
    difficulty      INTEGER NOT NULL DEFAULT 1 CHECK(difficulty BETWEEN 1 AND 5),
    easeFactor      REAL    NOT NULL DEFAULT 2.5,
    repetitions     INTEGER NOT NULL DEFAULT 0,
    technicalNotes  TEXT
  );
`;

// ─────────────────────────────────────────────────────────────────────────────
// MODELO: QuickNote — Notas de captura rápida
// ─────────────────────────────────────────────────────────────────────────────
const CREATE_QUICK_NOTES = `
  CREATE TABLE IF NOT EXISTS quick_notes (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    note        TEXT    NOT NULL,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now', 'localtime'))
  );
`;

// ─────────────────────────────────────────────────────────────────────────────
// MODELO: Settings — Configuración general de la app (clave-valor)
// ─────────────────────────────────────────────────────────────────────────────
const CREATE_SETTINGS = `
  CREATE TABLE IF NOT EXISTS settings (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`;

// ─────────────────────────────────────────────────────────────────────────────
// INICIALIZADOR PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────
export function initSchema(): void {
  try {
    db.execSync(CREATE_VIOLIN_PIECES);
    db.execSync(CREATE_QUICK_NOTES);
    db.execSync(CREATE_SETTINGS);
    console.log('[Schema] Todas las tablas inicializadas correctamente.');
  } catch (error) {
    console.error('[Schema] Error al inicializar tablas:', error);
    throw error;
  }
}
