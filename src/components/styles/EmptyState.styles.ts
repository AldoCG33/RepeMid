// src/components/styles/EmptyState.styles.ts
// Estilos extraídos del componente EmptyState.

import { StyleSheet } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../../theme';

export const styles = StyleSheet.create({
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
