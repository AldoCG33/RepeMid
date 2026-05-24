// src/database/models/quickNoteModel.ts
// Operaciones para la tabla `quick_notes` — Captura Rápida.
// Regla: este archivo solo toca la tabla `quick_notes`.

import db from '../database';

// ─────────────────────────────────────────────────
// CREATE — Guardar una nota rápida
// ─────────────────────────────────────────────────
export function addQuickNote(note: string): number {
  try {
    const result = db.runSync(
      `INSERT INTO quick_notes (note) VALUES (?);`,
      [note.trim()]
    );
    const newId = result.lastInsertRowId;
    console.log(`[quickNoteModel] Nota creada → id=${newId}`);
    return newId;
  } catch (error) {
    console.error('[quickNoteModel] Error en addQuickNote:', error);
    throw error;
  }
}
