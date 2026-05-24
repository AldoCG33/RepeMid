// src/components/styles/FormField.styles.ts
// Estilos extraídos del componente FormField.

import { StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../../theme';

export const styles = StyleSheet.create({
  wrapper: {
    marginBottom: SPACING.xl,
  },
  label: {
    fontSize: TYPOGRAPHY.sizeXxs,
    fontWeight: TYPOGRAPHY.semiBold,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: SPACING.sm,
  },
  input: {
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md + 2,
    fontSize: TYPOGRAPHY.sizeSm,
    color: COLORS.textPrimary,
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
  },
  inputFocused: {
    borderColor: COLORS.borderFocus,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontSize: TYPOGRAPHY.sizeTiny,
    marginTop: SPACING.xs + 2,
    marginLeft: SPACING.xs,
  },
});
