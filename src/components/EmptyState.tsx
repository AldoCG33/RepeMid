// src/components/EmptyState.tsx
// Pantalla de estado vacío genérico y reutilizable.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY } from '../theme';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
}

export default function EmptyState({
  icon = 'musical-note',
  title,
  subtitle,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={52} color={COLORS.borderLight} />
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: SPACING.xxxl * 2,
    paddingHorizontal: SPACING.xxxl,
  },
  title: {
    fontSize: TYPOGRAPHY.sizeSm,
    color: COLORS.textDisabled,
    textAlign: 'center',
    marginTop: SPACING.lg,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.sizeXs,
    color: COLORS.textDisabled,
    textAlign: 'center',
    marginTop: SPACING.sm,
    lineHeight: 20,
  },
});
