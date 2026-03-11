// src/database/models/pieceModel.ts
// Operaciones CRUD para la entidad ViolinPiece.
// Regla: este archivo solo toca la tabla `violin_pieces`.
// Ninguna screen debería importar `db` directamente; siempre usan estas funciones.

import db from '../database';
import { ViolinPiece, NewViolinPiece, UpdateViolinPiece, PieceStatus } from '../../types';

// ─────────────────────────────────────────────────
// TIPADO INTERNO — Fila cruda de SQLite
// ─────────────────────────────────────────────────
// SQLite devuelve todo como primitivos. Este tipo refleja eso antes
// de convertir el `status` string a nuestro enum PieceStatus.
interface RawPieceRow {
  id: number;
  title: string;
  composer: string;
  status: string;
  lastPracticed: string;
  intervalDays: number;
  difficulty: number;
  easeFactor: number;
  repetitions: number;
  technicalNotes: string | null;
}

// Convierte fila cruda → tipo tipado
function mapRow(row: RawPieceRow): ViolinPiece {
  return {
    ...row,
    status: row.status as PieceStatus,
    technicalNotes: row.technicalNotes ?? undefined,
  };
}

// ─────────────────────────────────────────────────
// READ — Todas las piezas
// ─────────────────────────────────────────────────
// Ordenadas por fecha de próxima práctica ascendente,
// para ver primero las que hay que tocar antes.
export function getAllPieces(): ViolinPiece[] {
  try {
    const rows = db.getAllSync<RawPieceRow>(`
      SELECT * FROM violin_pieces
      ORDER BY
        date(lastPracticed, '+' || CAST(intervalDays AS TEXT) || ' days') ASC,
        title ASC;
    `);
    return rows.map(mapRow);
  } catch (error) {
    console.error('[pieceModel] Error en getAllPieces:', error);
    throw error;
  }
}

// ─────────────────────────────────────────────────
// READ — Solo las piezas de la sesión de hoy
// ─────────────────────────────────────────────────
// Una pieza entra en la rutina de hoy si:
//   fecha(lastPracticed + intervalDays) <= hoy  Y  status != 'dormant'
export function getPiecesForToday(): ViolinPiece[] {
  try {
    const rows = db.getAllSync<RawPieceRow>(`
      SELECT * FROM violin_pieces
      WHERE date(lastPracticed, '+' || CAST(intervalDays AS TEXT) || ' days') <= date('now')
        AND status != 'dormant'
      ORDER BY difficulty DESC;
    `);
    return rows.map(mapRow);
  } catch (error) {
    console.error('[pieceModel] Error en getPiecesForToday:', error);
    throw error;
  }
}

// ─────────────────────────────────────────────────
// READ — Una pieza por ID
// ─────────────────────────────────────────────────
export function getPieceById(id: number): ViolinPiece | null {
  try {
    const row = db.getFirstSync<RawPieceRow>(
      'SELECT * FROM violin_pieces WHERE id = ?;',
      [id]
    );
    return row ? mapRow(row) : null;
  } catch (error) {
    console.error(`[pieceModel] Error en getPieceById(${id}):`, error);
    throw error;
  }
}

// ─────────────────────────────────────────────────
// CREATE — Agregar nueva pieza
// ─────────────────────────────────────────────────
// Los campos SM-2 (easeFactor, intervalDays, repetitions) se inicializan
// con los defaults definidos en el schema; no los pasamos desde la UI.
export function addPiece(piece: NewViolinPiece): number {
  try {
    const result = db.runSync(
      `INSERT INTO violin_pieces (title, composer, difficulty, technicalNotes)
       VALUES (?, ?, ?, ?);`,
      [piece.title, piece.composer, piece.difficulty, piece.technicalNotes ?? null]
    );
    const newId = result.lastInsertRowId;
    console.log(`[pieceModel] Pieza creada → id=${newId}, título="${piece.title}"`);
    return newId;
  } catch (error) {
    console.error('[pieceModel] Error en addPiece:', error);
    throw error;
  }
}

// ─────────────────────────────────────────────────
// UPDATE — Editar metadata de una pieza (no afecta SM-2)
// ─────────────────────────────────────────────────
export function updatePiece(id: number, changes: UpdateViolinPiece): void {
  try {
    // Construimos el SET dinámicamente con solo los campos que llegaron
    const fields: string[] = [];
    const values: (string | number | null)[] = [];

    if (changes.title !== undefined)         { fields.push('title = ?');          values.push(changes.title); }
    if (changes.composer !== undefined)      { fields.push('composer = ?');       values.push(changes.composer); }
    if (changes.difficulty !== undefined)    { fields.push('difficulty = ?');     values.push(changes.difficulty); }
    if (changes.technicalNotes !== undefined){ fields.push('technicalNotes = ?'); values.push(changes.technicalNotes ?? null); }

    if (fields.length === 0) return; // Nada que actualizar

    values.push(id);
    db.runSync(
      `UPDATE violin_pieces SET ${fields.join(', ')} WHERE id = ?;`,
      values
    );
    console.log(`[pieceModel] Pieza ${id} actualizada.`);
  } catch (error) {
    console.error(`[pieceModel] Error en updatePiece(${id}):`, error);
    throw error;
  }
}

// ─────────────────────────────────────────────────
// UPDATE — Registrar una sesión de práctica (corazón del SM-2)
// ─────────────────────────────────────────────────
// quality: calificación 0-5
//   0-2 → reinicia (no recordaba la pieza)
//   3-5 → avanza (tocó correctamente)
export function updateAfterPractice(id: number, quality: 0 | 1 | 2 | 3 | 4 | 5): void {
  try {
    const piece = getPieceById(id);
    if (!piece) throw new Error(`[pieceModel] Pieza con id=${id} no encontrada.`);

    let { intervalDays, easeFactor, repetitions } = piece;

    if (quality < 3) {
      // Respuesta fallida: reiniciar contador
      intervalDays = 1;
      repetitions  = 0;
    } else {
      // Respuesta exitosa: avanzar según SM-2
      repetitions += 1;

      if (repetitions === 1)      { intervalDays = 1; }
      else if (repetitions === 2) { intervalDays = 6; }
      else                        { intervalDays = Math.round(intervalDays * easeFactor); }

      // Ajustar el factor de facilidad (mínimo 1.3)
      easeFactor = Math.max(
        1.3,
        easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)
      );
    }

    // Promover/degradar el status automáticamente
    let newStatus: PieceStatus;
    if (intervalDays >= 21)      { newStatus = PieceStatus.Repertoire; }
    else if (repetitions >= 2)   { newStatus = PieceStatus.Polishing;  }
    else                         { newStatus = PieceStatus.Learning;   }

    db.runSync(
      `UPDATE violin_pieces
       SET lastPracticed = date('now'),
           intervalDays  = ?,
           easeFactor    = ?,
           repetitions   = ?,
           status        = ?
       WHERE id = ?;`,
      [intervalDays, easeFactor, repetitions, newStatus, id]
    );

    console.log(
      `[pieceModel] Práctica registrada → id=${id}, q=${quality}, ` +
      `intervalo=${intervalDays}d, status=${newStatus}`
    );
  } catch (error) {
    console.error(`[pieceModel] Error en updateAfterPractice(${id}):`, error);
    throw error;
  }
}

// ─────────────────────────────────────────────────
// UPDATE — Poner pieza en modo Dormant
// ─────────────────────────────────────────────────
export function setPieceDormant(id: number): void {
  try {
    db.runSync(
      `UPDATE violin_pieces SET status = 'dormant' WHERE id = ?;`,
      [id]
    );
    console.log(`[pieceModel] Pieza ${id} → dormant.`);
  } catch (error) {
    console.error(`[pieceModel] Error en setPieceDormant(${id}):`, error);
    throw error;
  }
}

// ─────────────────────────────────────────────────
// DELETE — Eliminar una pieza permanentemente
// ─────────────────────────────────────────────────
export function deletePiece(id: number): void {
  try {
    db.runSync('DELETE FROM violin_pieces WHERE id = ?;', [id]);
    console.log(`[pieceModel] Pieza ${id} eliminada.`);
  } catch (error) {
    console.error(`[pieceModel] Error en deletePiece(${id}):`, error);
    throw error;
  }
}
