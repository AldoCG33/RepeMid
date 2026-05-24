// src/components/styles/QuickCaptureModal.styles.ts
// Estilos extraídos del componente QuickCaptureModal.

import { StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../../theme';

export const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  positioner: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: COLORS.bgCard,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.xl,
    paddingBottom: SPACING.xxxl,
    ...SHADOWS.card,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.statusLearning,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: TYPOGRAPHY.sizeMd,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
  },
  input: {
    backgroundColor: COLORS.bgApp,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    padding: SPACING.lg,
    fontSize: TYPOGRAPHY.sizeSm,
    color: COLORS.textPrimary,
    minHeight: 100,
    maxHeight: 160,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.md,
  },
  charCount: {
    fontSize: TYPOGRAPHY.sizeTiny,
    color: COLORS.textDisabled,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.accent,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.full,
    ...SHADOWS.button,
  },
  saveButtonDisabled: {
    backgroundColor: COLORS.borderLight,
    elevation: 0,
    shadowOpacity: 0,
  },
  saveText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.sizeXs,
    fontWeight: TYPOGRAPHY.semiBold,
  },
  saveTextDisabled: {
    color: COLORS.textDisabled,
  },
});
