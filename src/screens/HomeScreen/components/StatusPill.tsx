// src/screens/HomeScreen/components/StatusPill.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '../../../theme';
import { pillStyles } from '../HomeScreen.styles';

interface StatusPillProps {
  color: string;
  label: string;
  count: number;
  active?: boolean;
  onPress?: () => void;
}

export function StatusPill({ color, label, count, active = false, onPress }: StatusPillProps) {
  return (
    <TouchableOpacity
      style={[
        pillStyles.pill,
        { borderColor: active ? color : color + '44' },
        active && { backgroundColor: color + '18' },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[pillStyles.dot, { backgroundColor: color }]} />
      <Text style={[pillStyles.count, { color }]}>{count}</Text>
      <Text style={[pillStyles.label, active && { color, fontWeight: '600' }]}>{label}</Text>
    </TouchableOpacity>
  );
}
