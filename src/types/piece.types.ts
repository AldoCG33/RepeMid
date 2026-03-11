// src/types/piece.types.ts
// Tipos y enums asociados al modelo ViolinPiece.
// Si en el futuro agregas otro instrumento (ej. arpaModel.ts),
// crea su propio archivo: harp.types.ts

// Estados del ciclo de vida de una pieza en el sistema SM-2
export enum PieceStatus {
  Learning   = 'learning',    // Azul  — revisión frecuente, recién empezada
  Polishing  = 'polishing',   // Amarillo — afinando detalles técnicos
  Repertoire = 'repertoire',  // Verde — consolidada, intervalos largos
  Dormant    = 'dormant',     // Gris  — en pausa voluntaria
}

// Refleja EXACTAMENTE las columnas de la tabla `violin_pieces` en SQLite
export interface ViolinPiece {
  id: number;               // INTEGER PRIMARY KEY AUTOINCREMENT
  title: string;            // Título de la pieza
  composer: string;         // Compositor
  status: PieceStatus;      // Estado actual en el ciclo SM-2
  lastPracticed: string;    // Fecha ISO 'YYYY-MM-DD' de la última práctica
  intervalDays: number;     // REAL — días hasta la próxima práctica
  difficulty: number;       // INTEGER 1-5
  easeFactor: number;       // REAL — factor de facilidad SM-2 (default 2.5)
  repetitions: number;      // INTEGER — revisiones exitosas consecutivas
  technicalNotes?: string;  // Anotaciones libres (opcional)
}

// Payload para CREAR una pieza nueva.
// No incluye id (lo asigna SQLite), ni campos SM-2 (los inicializa la DB).
export interface NewViolinPiece {
  title: string;
  composer: string;
  difficulty: number;        // 1-5
  technicalNotes?: string;
}

// Payload para EDITAR una pieza existente (campos opcionales)
export interface UpdateViolinPiece {
  title?: string;
  composer?: string;
  difficulty?: number;
  technicalNotes?: string;
}
