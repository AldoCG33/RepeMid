// src/components/StatBox.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme';
import { statStyles } from './StatBox.styles';

interface StatBoxProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  highlight?: boolean;
  color?: string;
}

export default function StatBox({ icon, label, value, highlight, color }: StatBoxProps) {
  const valueColor = color ?? (highlight ? COLORS.accent : COLORS.textPrimary);
  return (
    <View style={statStyles.box}>
      <Ionicons name={icon} size={18} color={COLORS.textSecondary} />
      <Text style={statStyles.label}>{label}</Text>
      <Text style={[statStyles.value, { color: valueColor }]}>{value}</Text>
    </View>
  );
}
