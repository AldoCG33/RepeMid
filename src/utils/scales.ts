// src/utils/scales.ts
// Catálogo estático de escalas para violín.
// Las escalas son universales y finitas — no necesitan vivir en la DB.
// Úsalas directamente desde la Rutina Exprés o cualquier pantalla de práctica.

// ─── Catálogo ────────────────────────────────────────────────────────────────

export const VIOLIN_SCALES: string[] = [
  // Mayores (2 octavas)
  'Sol Mayor (2 oct.)',
  'Re Mayor (2 oct.)',
  'La Mayor (2 oct.)',
  'Mi Mayor (2 oct.)',
  'Si Mayor (2 oct.)',
  'Fa Mayor (2 oct.)',
  'Do Mayor (2 oct.)',

  // Menores
  'La Menor Natural (2 oct.)',
  'La Menor Melódica (2 oct.)',
  'La Menor Armónica (2 oct.)',
  'Mi Menor Natural (2 oct.)',
  'Re Menor Melódica (2 oct.)',
  'Sol Menor Armónica (2 oct.)',

  // Arpegios
  'Sol Mayor — Arpegio (2 oct.)',
  'Re Mayor — Arpegio (2 oct.)',
  'La Mayor — Arpegio (2 oct.)',
  'La Menor — Arpegio (2 oct.)',
  'Mi Menor — Arpegio (2 oct.)',

  // Dobles cuerdas / variaciones
  'Re Mayor en Terceras',
  'La Mayor en Sextas',
  'Re Mayor en Octavas',
];

// ─── Función de selección aleatoria ─────────────────────────────────────────

/**
 * Devuelve una escala aleatoria del catálogo.
 * Útil para el slot de calentamiento de la Rutina Exprés.
 */
export function getRandomScale(): string {
  const index = Math.floor(Math.random() * VIOLIN_SCALES.length);
  return VIOLIN_SCALES[index];
}
