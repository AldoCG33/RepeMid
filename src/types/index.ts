// src/types/index.ts
// Barrel file — punto de entrada único para todos los tipos de la app.
//
// Las screens y modelos importan desde '@types' o '../types' y obtienen
// todo lo necesario sin tener que conocer la estructura interna.
//
// Ejemplo de uso:
//   import { ViolinPiece, PieceStatus, NewViolinPiece } from '../types';

export * from './piece.types';

// Cuando creemos más modelos, agregar sus exports aquí:
// export * from './session.types';
// export * from './harp.types';
