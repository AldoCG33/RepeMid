// src/database/schema.ts
// Define y ejecuta todos los CREATE TABLE de la app.
// Importar e invocar `initSchema()` una sola vez al arrancar la app.
//
// Convención: cada modelo tiene su propia sección con un comentario claro.
// Cuando agregues un nuevo instrumento o entidad, añade su CREATE TABLE aquí.

import db from './database';

// ─────────────────────────────────────────────────
// MODELO: ViolinPiece — Piezas de repertorio
// ─────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────
// MODELO: PracticeSession — Historial de sesiones (futuro)
// ─────────────────────────────────────────────────
// const CREATE_PRACTICE_SESSIONS = `
//   CREATE TABLE IF NOT EXISTS practice_sessions (
//     id        INTEGER PRIMARY KEY AUTOINCREMENT,
//     pieceId   INTEGER NOT NULL REFERENCES violin_pieces(id) ON DELETE CASCADE,
//     date      TEXT    NOT NULL DEFAULT (date('now')),
//     quality   INTEGER NOT NULL CHECK(quality BETWEEN 0 AND 5),
//     duration  INTEGER,   -- minutos
//     notes     TEXT
//   );
// `;

// ─────────────────────────────────────────────────
// INICIALIZADOR PRINCIPAL
// ─────────────────────────────────────────────────
export function initSchema(): void {
  try {
    db.execSync(CREATE_VIOLIN_PIECES);
    // db.execSync(CREATE_PRACTICE_SESSIONS); // descomentar cuando sea necesario
    console.log('[Schema] Todas las tablas inicializadas correctamente.');
  } catch (error) {
    console.error('[Schema] Error al inicializar tablas:', error);
    throw error;
  }
}
