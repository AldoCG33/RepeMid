// src/utils/scales.ts

export interface ScaleInfo {
  name: string;
  accidentals: string;
  hint?: string;
}

export const VIOLIN_SCALES: ScaleInfo[] = [
  // 🎻 ESCALAS MAYORES (12 Tonos)
  { name: 'Do Mayor (2 oct.)', accidentals: 'Sin alteraciones (Todo natural)', hint: 'Empieza con 3er dedo en cuerda Sol' },
  { name: 'Reb Mayor (2 oct.)', accidentals: '5 Bemoles (Sib, Mib, Lab, Reb, Solb)' },
  { name: 'Re Mayor (2 oct.)', accidentals: '2 Sostenidos (Fa#, Do#)', hint: 'Empieza en cuerda Re al aire' },
  { name: 'Mib Mayor (2 oct.)', accidentals: '3 Bemoles (Sib, Mib, Lab)', hint: 'Empieza con 1er dedo pegado a la cejilla' },
  { name: 'Mi Mayor (2 oct.)', accidentals: '4 Sostenidos (Fa#, Do#, Sol#, Re#)' },
  { name: 'Fa Mayor (2 oct.)', accidentals: '1 Bemol (Sib)', hint: 'El 2do dedo va pegado al 1ro en cuerdas La y Mi' },
  { name: 'Fa# Mayor (2 oct.)', accidentals: '6 Sostenidos (Fa#, Do#, Sol#, Re#, La#, Mi#)' },
  { name: 'Sol Mayor (2 oct.)', accidentals: '1 Sostenido (Fa#)', hint: 'Empieza en cuerda Sol al aire' },
  { name: 'Lab Mayor (2 oct.)', accidentals: '4 Bemoles (Sib, Mib, Lab, Reb)' },
  { name: 'La Mayor (2 oct.)', accidentals: '3 Sostenidos (Fa#, Do#, Sol#)' },
  { name: 'Sib Mayor (2 oct.)', accidentals: '2 Bemoles (Sib, Mib)', hint: 'Empieza con 2do dedo pegado al 1ro' },
  { name: 'Si Mayor (2 oct.)', accidentals: '5 Sostenidos (Fa#, Do#, Sol#, Re#, La#)' },

  // 🎻 ESCALAS MENORES NATURALES (12 Tonos)
  { name: 'Do Menor Natural (2 oct.)', accidentals: '3 Bemoles (Sib, Mib, Lab)' },
  { name: 'Do# Menor Natural (2 oct.)', accidentals: '4 Sostenidos (Fa#, Do#, Sol#, Re#)' },
  { name: 'Re Menor Natural (2 oct.)', accidentals: '1 Bemol (Sib)' },
  { name: 'Mib Menor Natural (2 oct.)', accidentals: '6 Bemoles (Sib, Mib, Lab, Reb, Solb, Dob)' },
  { name: 'Mi Menor Natural (2 oct.)', accidentals: '1 Sostenido (Fa#)' },
  { name: 'Fa Menor Natural (2 oct.)', accidentals: '4 Bemoles (Sib, Mib, Lab, Reb)' },
  { name: 'Fa# Menor Natural (2 oct.)', accidentals: '3 Sostenidos (Fa#, Do#, Sol#)' },
  { name: 'Sol Menor Natural (2 oct.)', accidentals: '2 Bemoles (Sib, Mib)' },
  { name: 'Sol# Menor Natural (2 oct.)', accidentals: '5 Sostenidos (Fa#, Do#, Sol#, Re#, La#)' },
  { name: 'La Menor Natural (2 oct.)', accidentals: 'Sin alteraciones (Todo natural)' },
  { name: 'Sib Menor Natural (2 oct.)', accidentals: '5 Bemoles (Sib, Mib, Lab, Reb, Solb)' },
  { name: 'Si Menor Natural (2 oct.)', accidentals: '2 Sostenidos (Fa#, Do#)' },

  // 🎻 ARPEGIOS MAYORES (12 Tonos)
  { name: 'Do Mayor — Arpegio (2 oct.)', accidentals: 'Notas: Do - Mi - Sol - Do' },
  { name: 'Reb Mayor — Arpegio (2 oct.)', accidentals: 'Notas: Reb - Fa - Lab - Reb' },
  { name: 'Re Mayor — Arpegio (2 oct.)', accidentals: 'Notas: Re - Fa# - La - Re' },
  { name: 'Mib Mayor — Arpegio (2 oct.)', accidentals: 'Notas: Mib - Sol - Sib - Mib' },
  { name: 'Mi Mayor — Arpegio (2 oct.)', accidentals: 'Notas: Mi - Sol# - Si - Mi' },
  { name: 'Fa Mayor — Arpegio (2 oct.)', accidentals: 'Notas: Fa - La - Do - Fa' },
  { name: 'Fa# Mayor — Arpegio (2 oct.)', accidentals: 'Notas: Fa# - La# - Do# - Fa#' },
  { name: 'Sol Mayor — Arpegio (2 oct.)', accidentals: 'Notas: Sol - Si - Re - Sol' },
  { name: 'Lab Mayor — Arpegio (2 oct.)', accidentals: 'Notas: Lab - Do - Mib - Lab' },
  { name: 'La Mayor — Arpegio (2 oct.)', accidentals: 'Notas: La - Do# - Mi - La' },
  { name: 'Sib Mayor — Arpegio (2 oct.)', accidentals: 'Notas: Sib - Re - Fa - Sib' },
  { name: 'Si Mayor — Arpegio (2 oct.)', accidentals: 'Notas: Si - Re# - Fa# - Si' },

  // 🎻 ARPEGIOS MENORES (12 Tonos)
  { name: 'Do Menor — Arpegio (2 oct.)', accidentals: 'Notas: Do - Mib - Sol - Do' },
  { name: 'Do# Menor — Arpegio (2 oct.)', accidentals: 'Notas: Do# - Mi - Sol# - Do#' },
  { name: 'Re Menor — Arpegio (2 oct.)', accidentals: 'Notas: Re - Fa - La - Re' },
  { name: 'Mib Menor — Arpegio (2 oct.)', accidentals: 'Notas: Mib - Solb - Sib - Mib' },
  { name: 'Mi Menor — Arpegio (2 oct.)', accidentals: 'Notas: Mi - Sol - Si - Mi' },
  { name: 'Fa Menor — Arpegio (2 oct.)', accidentals: 'Notas: Fa - Lab - Do - Fa' },
  { name: 'Fa# Menor — Arpegio (2 oct.)', accidentals: 'Notas: Fa# - La - Do# - Fa#' },
  { name: 'Sol Menor — Arpegio (2 oct.)', accidentals: 'Notas: Sol - Sib - Re - Sol' },
  { name: 'Sol# Menor — Arpegio (2 oct.)', accidentals: 'Notas: Sol# - Si - Re# - Sol#' },
  { name: 'La Menor — Arpegio (2 oct.)', accidentals: 'Notas: La - Do - Mi - La' },
  { name: 'Sib Menor — Arpegio (2 oct.)', accidentals: 'Notas: Sib - Reb - Fa - Sib' },
  { name: 'Si Menor — Arpegio (2 oct.)', accidentals: 'Notas: Si - Re - Fa# - Si' },

  // 🎻 DOBLES CUERDAS
  { name: 'Re Mayor en Terceras', accidentals: '2 Sostenidos (Fa#, Do#)', hint: 'Cuida la afinación relativa entre el 1er y 3er dedo.' },
  { name: 'La Mayor en Sextas', accidentals: '3 Sostenidos (Fa#, Do#, Sol#)', hint: 'Dedo grave en cuerda inferior, agudo en superior.' },
  { name: 'Re Mayor en Octavas', accidentals: '2 Sostenidos (Fa#, Do#)', hint: 'Usa 1er y 4to dedo. Mantén el marco de la mano firme.' }
];

export const RHYTHMIC_VARIATIONS: string[] = [
  'Redondas (Arco entero, lento y profundo)',
  'Blancas (2 tiempos por nota)',
  'Negras (Détaché estándar)',
  'Corcheas (2 notas por tiempo, mitad del arco)',
  'Tresillos (3 notas por tiempo, cuida el acento)',
  'Semicorcheas (4 notas por tiempo, ágil y corto)'
];

export function getRandomScale(): ScaleInfo {
  const index = Math.floor(Math.random() * VIOLIN_SCALES.length);
  return VIOLIN_SCALES[index];
}

export function getRandomRhythm(): string {
  const index = Math.floor(Math.random() * RHYTHMIC_VARIATIONS.length);
  return RHYTHMIC_VARIATIONS[index];
}
