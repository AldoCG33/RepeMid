// src/components/styles/DifficultyPicker.styles.ts
// Estilos extraídos del componente DifficultyPicker.

import { StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../../theme';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  btn: {
    flex: 1,
    paddingVertical: SPACING.md + 2,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
    backgroundColor: COLORS.bgCard,
  },
  btnNumber: {
    fontSize: TYPOGRAPHY.sizeMd - 2,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textDisabled,
  },
  btnNumberActive: {
    color: COLORS.white,
  },
  hint: {
    marginTop: SPACING.sm + 2,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  hintText: {
    fontSize: TYPOGRAPHY.sizeXxs,
    fontWeight: TYPOGRAPHY.semiBold,
  },
});
