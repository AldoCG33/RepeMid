// src/components/DifficultyPicker.tsx
// Selector visual de dificultad del 1 al 5.
// Extrae la lógica y UI del formulario de AddPieceScreen.

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, DIFFICULTY_COLORS, DIFFICULTY_LABELS } from '../theme';
import { styles } from './styles/DifficultyPicker.styles';

// ─────────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────────
interface DifficultyPickerProps {
  value: number;              // 1-5
  onChange: (v: number) => void;
}

// ─────────────────────────────────────────────────
// COMPONENTE
// ─────────────────────────────────────────────────
export default function DifficultyPicker({ value, onChange }: DifficultyPickerProps) {
  return (
    <View>
      {/* Botones 1-5 */}
      <View style={styles.row}>
        {[1, 2, 3, 4, 5].map((level) => {
          const active = value === level;
          const color  = DIFFICULTY_COLORS[level];
          return (
            <TouchableOpacity
              key={level}
              style={[
                styles.btn,
                active && { backgroundColor: color, borderColor: color },
              ]}
              onPress={() => onChange(level)}
              activeOpacity={0.75}
            >
              <Text style={[styles.btnNumber, active && styles.btnNumberActive]}>
                {level}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Etiqueta descriptiva del nivel activo */}
      <View style={[styles.hint, { backgroundColor: DIFFICULTY_COLORS[value] + '18' }]}>
        <Ionicons name="stats-chart" size={13} color={DIFFICULTY_COLORS[value]} />
        <Text style={[styles.hintText, { color: DIFFICULTY_COLORS[value] }]}>
          {DIFFICULTY_LABELS[value]}
        </Text>
      </View>
    </View>
  );
}
