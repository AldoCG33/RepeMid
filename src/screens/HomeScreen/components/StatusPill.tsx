// src/screens/HomeScreen/components/StatusPill.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { pillStyles } from '../HomeScreen.styles';

interface StatusPillProps {
  color: string;
  label: string;
  count: number;
}

export function StatusPill({ color, label, count }: StatusPillProps) {
  return (
    <View style={[pillStyles.pill, { borderColor: color + '44' }]}>
      <View style={[pillStyles.dot, { backgroundColor: color }]} />
      <Text style={[pillStyles.count, { color }]}>{count}</Text>
      <Text style={pillStyles.label}>{label}</Text>
    </View>
  );
}
