// src/screens/WarmUpSession/WarmUpSession.styles.ts
// Estilos de la pantalla de Rutina Exprés / WarmUpSession.

import { StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgApp,
  },

  // ── Header ──
  header: {
    backgroundColor: COLORS.bgCard,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  headerTitleBlock: {
    flex: 1,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.sizeMd,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: TYPOGRAPHY.sizeXxs,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.accent + '18',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  timerText: {
    fontSize: TYPOGRAPHY.sizeTiny,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.accent,
  },

  scroll: {
    padding: SPACING.xl,
    paddingBottom: SPACING.xxxl * 2,
  },

  // ── Slot genérico ──
  slotCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
    borderLeftWidth: 4,
    ...SHADOWS.card,
  },
  slotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  slotNumber: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotNumberText: {
    fontSize: TYPOGRAPHY.sizeTiny,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.white,
  },
  slotLabel: {
    fontSize: TYPOGRAPHY.sizeXxs,
    fontWeight: TYPOGRAPHY.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  slotDuration: {
    fontSize: TYPOGRAPHY.sizeTiny,
    color: COLORS.textDisabled,
    marginLeft: 'auto',
  },
  slotTitle: {
    fontSize: TYPOGRAPHY.sizeMd,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  slotSubtitle: {
    fontSize: TYPOGRAPHY.sizeXs,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  slotHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginTop: SPACING.sm,
    backgroundColor: COLORS.bgApp,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
  },
  slotHintText: {
    fontSize: TYPOGRAPHY.sizeMicro,
    fontWeight: TYPOGRAPHY.medium,
    letterSpacing: 0.2,
  },

  // ── Empty slot ──
  emptySlot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.bgApp,
    padding: SPACING.md,
    borderRadius: RADIUS.sm,
  },
  emptySlotText: {
    fontSize: TYPOGRAPHY.sizeXs,
    color: COLORS.textDisabled,
    flex: 1,
  },

  // ── Botón principal ──
  startBtn: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
    ...SHADOWS.button,
  },
  startBtnText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.sizeSm,
    fontWeight: TYPOGRAPHY.bold,
    letterSpacing: 0.4,
  },

  // ── Tip inferior ──
  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    backgroundColor: COLORS.accent + '10',
    borderRadius: RADIUS.sm,
    padding: SPACING.md,
    marginTop: SPACING.xl,
  },
  tipText: {
    flex: 1,
    fontSize: TYPOGRAPHY.sizeTiny,
    color: COLORS.accent,
    lineHeight: 18,
  },
});
