// src/types/piece.types.ts
// Tipos y enums asociados al modelo ViolinPiece.

// ── Ciclo de vida SM-2 ────────────────────────────────────────────────────
export enum PieceStatus {
  Learning   = 'learning',    // Azul     — revisión frecuente, recién empezada
  Polishing  = 'polishing',   // Amarillo — afinando detalles técnicos
  Repertoire = 'repertoire',  // Verde    — consolidada, intervalos largos
  Dormant    = 'dormant',     // Gris     — en pausa voluntaria
}

// ── Modelo principal ───────────────────────────────────────────────────────
// Refleja EXACTAMENTE las columnas de la tabla `violin_pieces` en SQLite
export interface ViolinPiece {
  id: number;                 // INTEGER PRIMARY KEY AUTOINCREMENT
  title: string;              // Título de la pieza
  composer: string;           // Compositor
  status: PieceStatus;        // Estado actual en el ciclo SM-2
  lastPracticed: string;      // Fecha ISO 'YYYY-MM-DD' de la última práctica
  intervalDays: number;       // REAL — días hasta la próxima práctica
  difficulty: number;         // INTEGER 1-5
  easeFactor: number;         // REAL — factor de facilidad SM-2 (default 2.5)
  repetitions: number;        // INTEGER — revisiones exitosas consecutivas
  technicalNotes?: string;    // Anotaciones libres (opcional)
}

// ── Payload para CREAR una pieza nueva ────────────────────────────────────
export interface NewViolinPiece {
  title: string;
  composer: string;
  difficulty: number;         // 1-5
  technicalNotes?: string;
}

// ── Payload para EDITAR una pieza existente ────────────────────────────────
export interface UpdateViolinPiece {
  title?: string;
  composer?: string;
  difficulty?: number;
  technicalNotes?: string;
}
