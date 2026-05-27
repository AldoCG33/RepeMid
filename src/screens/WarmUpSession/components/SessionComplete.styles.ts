// src/screens/WarmUpSession/components/SessionComplete.styles.ts
import { StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../../../theme';

export const completeStyles = StyleSheet.create({
  completeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xxl,
  },
  completeIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.statusRepertoire,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
    ...SHADOWS.fab,
  },
  completeTitle: {
    fontSize: TYPOGRAPHY.sizeLg,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  completeSubtitle: {
    fontSize: TYPOGRAPHY.sizeSm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  completeTip: {
    fontSize: TYPOGRAPHY.sizeXs,
    color: COLORS.accent,
    textAlign: 'center',
    backgroundColor: COLORS.accent + '12',
    padding: SPACING.md,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.xxl,
    lineHeight: 20,
  },
  completeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.accent,
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.lg,
    borderRadius: RADIUS.lg,
    ...SHADOWS.button,
  },
  completeBtnText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.sizeSm,
    fontWeight: TYPOGRAPHY.bold,
  },
});
