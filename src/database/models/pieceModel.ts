// src/database/models/pieceModel.ts
// Operaciones CRUD para la entidad ViolinPiece.
// Regla: este archivo solo toca la tabla `violin_pieces`.

import db from '../database';
import { ViolinPiece, NewViolinPiece, UpdateViolinPiece, PieceStatus } from '../../types';
import { getRandomScale, getRandomRhythm, ScaleInfo } from '../../utils/scales';

// ─────────────────────────────────────────────────
// TIPADO INTERNO — Fila cruda de SQLite
// ─────────────────────────────────────────────────
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
// TIPOS — Rutina Exprés
// ─────────────────────────────────────────────────
import { RoutineConfig } from './settingsModel';

export interface ExpressRoutine {
  warmUps: {
    scale: ScaleInfo;
    rhythm: string;
  }[];
  technicalPieces: ViolinPiece[];
  repertoirePieces: ViolinPiece[];
}

export function getExpressRoutine(config: RoutineConfig): ExpressRoutine {
  const warmUps = [];
  for (let i = 0; i < config.numScales; i++) {
    warmUps.push({
      scale: getRandomScale(),
      rhythm: getRandomRhythm(),
    });
  }

  // Retos técnicos
  let technicalPieces: ViolinPiece[] = [];
  if (config.numLearning > 0) {
    try {
      const rows = db.getAllSync<RawPieceRow>(
        `SELECT * FROM violin_pieces
         WHERE status IN ('learning', 'polishing')
         ORDER BY
           date(lastPracticed, '+' || CAST(intervalDays AS TEXT) || ' days') ASC,
           difficulty DESC
         LIMIT ?;`,
        [config.numLearning]
      );
      technicalPieces = rows.map(mapRow);
    } catch (error) {
      console.warn('[pieceModel] Error en getExpressRoutine (technicalPieces):', error);
    }
  }

  // Repaso
  let repertoirePieces: ViolinPiece[] = [];
  if (config.numRepertoire > 0) {
    try {
      const rows = db.getAllSync<RawPieceRow>(
        `SELECT * FROM violin_pieces
         WHERE status = 'repertoire'
         ORDER BY
           date(lastPracticed, '+' || CAST(intervalDays AS TEXT) || ' days') ASC,
           difficulty DESC
         LIMIT ?;`,
        [config.numRepertoire]
      );
      repertoirePieces = rows.map(mapRow);
    } catch (error) {
      console.warn('[pieceModel] Error en getExpressRoutine (repertoirePieces):', error);
    }
  }

  return {
    warmUps,
    technicalPieces,
    repertoirePieces,
  };
}

// ─────────────────────────────────────────────────
// CREATE — Agregar nueva pieza
// ─────────────────────────────────────────────────
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
// UPDATE — Editar metadata de una pieza
// ─────────────────────────────────────────────────
export function updatePiece(id: number, changes: UpdateViolinPiece): void {
  try {
    const fields: string[] = [];
    const values: (string | number | null)[] = [];

    if (changes.title !== undefined)          { fields.push('title = ?');          values.push(changes.title); }
    if (changes.composer !== undefined)       { fields.push('composer = ?');       values.push(changes.composer); }
    if (changes.difficulty !== undefined)     { fields.push('difficulty = ?');     values.push(changes.difficulty); }
    if (changes.technicalNotes !== undefined) { fields.push('technicalNotes = ?'); values.push(changes.technicalNotes ?? null); }

    if (fields.length === 0) return;

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
// UPDATE — Registrar una sesión de práctica (SM-2)
// ─────────────────────────────────────────────────
export function updateAfterPractice(id: number, quality: 0 | 1 | 2 | 3 | 4 | 5): void {
  try {
    const piece = getPieceById(id);
    if (!piece) throw new Error(`[pieceModel] Pieza con id=${id} no encontrada.`);

    let { intervalDays, easeFactor, repetitions } = piece;

    if (quality < 3) {
      intervalDays = 1;
      repetitions  = 0;
    } else {
      repetitions += 1;
      if (repetitions === 1)      { intervalDays = 1; }
      else if (repetitions === 2) { intervalDays = 6; }
      else                        { intervalDays = Math.round(intervalDays * easeFactor); }

      easeFactor = Math.max(
        1.3,
        easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)
      );
    }

    let newStatus: PieceStatus;
    if (intervalDays >= 21)    { newStatus = PieceStatus.Repertoire; }
    else if (repetitions >= 2) { newStatus = PieceStatus.Polishing;  }
    else                       { newStatus = PieceStatus.Learning;   }

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
    db.runSync(`UPDATE violin_pieces SET status = 'dormant' WHERE id = ?;`, [id]);
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
