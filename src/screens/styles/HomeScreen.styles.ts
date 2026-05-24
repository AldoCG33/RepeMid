// src/screens/styles/HomeScreen.styles.ts
// Estilos extraídos del HomeScreen para mantener la vista limpia y enfocada en la lógica.

import { StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../../theme';

// ─────────────────────────────────────────────────
// PILL (componente auxiliar StatusPill)
// ─────────────────────────────────────────────────
export const pillStyles = StyleSheet.create({
  pill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
    ...SHADOWS.card,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: RADIUS.full,
  },
  count: {
    fontSize: TYPOGRAPHY.sizeSm,
    fontWeight: TYPOGRAPHY.bold,
  },
  label: {
    fontSize: TYPOGRAPHY.sizeMicro,
    color: COLORS.textSecondary,
    flexShrink: 1,
  },
});

// ─────────────────────────────────────────────────
// ESTILOS PRINCIPALES
// ─────────────────────────────────────────────────
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgApp,
  },
  // ── Header ──
  header: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.bgCard,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  greeting: {
    fontSize: TYPOGRAPHY.sizeLg,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.sizeSm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  dueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.warning,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    ...SHADOWS.card,
  },
  dueBadgeText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.sizeTiny,
    fontWeight: TYPOGRAPHY.bold,
  },
  upToDateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.statusRepertoire + '22',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  upToDateText: {
    color: COLORS.statusRepertoire,
    fontSize: TYPOGRAPHY.sizeTiny,
    fontWeight: TYPOGRAPHY.semiBold,
  },
  // ── Lista ──
  list: {
    padding: SPACING.lg,
    paddingBottom: 100,
  },
  // ── Tarjeta Rutina Exprés ──
  expressCardWrapper: {
    marginBottom: SPACING.lg,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    ...SHADOWS.button,
  },
  expressCard: {
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    overflow: 'hidden',
    position: 'relative',
  },
  expressCircleBg: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  expressContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expressTextBlock: {
    flex: 1,
    marginRight: SPACING.md,
  },
  expressLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  expressLabel: {
    fontSize: TYPOGRAPHY.sizeMicro,
    fontWeight: TYPOGRAPHY.bold,
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: 1.2,
  },
  expressTitle: {
    fontSize: TYPOGRAPHY.sizeMd,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.white,
    marginBottom: SPACING.xs,
    lineHeight: 26,
  },
  expressSubtitle: {
    fontSize: TYPOGRAPHY.sizeXs,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 20,
  },
  expressIconCircle: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.card,
  },
  expressFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.lg,
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.sm,
  },
  expressFooterText: {
    fontSize: TYPOGRAPHY.sizeXs,
    fontWeight: TYPOGRAPHY.semiBold,
    color: 'rgba(255,255,255,0.9)',
  },
  // ── Resumen SM-2 ──
  statusSummaryRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  // ── Sección "Para practicar hoy" ──
  todaySection: {
    marginBottom: SPACING.lg,
  },
  todaySectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  todaySectionTitle: {
    fontSize: TYPOGRAPHY.sizeXxs,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.warning,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    flex: 1,
  },
  todayCountBubble: {
    backgroundColor: COLORS.warning,
    borderRadius: RADIUS.full,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayCountText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.sizeTiny,
    fontWeight: TYPOGRAPHY.bold,
  },
  allPiecesLabel: {
    fontSize: TYPOGRAPHY.sizeXxs,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: SPACING.xl,
    marginBottom: SPACING.sm,
  },
  // ── FAB expandible ──
  fab: {
    position: 'absolute',
    bottom: SPACING.xxl,
    right: SPACING.xxl,
    backgroundColor: COLORS.accent,
    width: 60,
    height: 60,
    borderRadius: RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
    ...SHADOWS.fab,
  },
  fabSecondaryContainer: {
    position: 'absolute',
    bottom: SPACING.xxl,
    right: SPACING.xxl,
    alignItems: 'center',
    flexDirection: 'row-reverse',
    zIndex: 15,
  },
  fabSecondary: {
    backgroundColor: COLORS.statusLearning,
    width: 46,
    height: 46,
    borderRadius: RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 7,         // centrar respecto al FAB principal
    ...SHADOWS.fab,
  },
  fabLabel: {
    backgroundColor: COLORS.textPrimary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.sm,
    marginRight: SPACING.sm,
  },
  fabLabelText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.sizeTiny,
    fontWeight: TYPOGRAPHY.semiBold,
  },
});
