// src/components/StatBox.styles.ts
import { StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../theme';

export const statStyles = StyleSheet.create({
  box: {
    width: '48%',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.card,
  },
  label: {
    fontSize: TYPOGRAPHY.sizeTiny,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    marginBottom: 2,
  },
  value: {
    fontSize: TYPOGRAPHY.sizeSm,
    fontWeight: TYPOGRAPHY.semiBold,
  },
});
