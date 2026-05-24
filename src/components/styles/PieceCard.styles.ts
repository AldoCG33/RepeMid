// src/components/styles/PieceCard.styles.ts
// Estilos extraídos del componente PieceCard.

import { StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../../theme';

export const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
    paddingRight: SPACING.md,
    overflow: 'hidden',
    ...SHADOWS.card,
  },
  cardHighlighted: {
    borderWidth: 1.5,
    borderColor: COLORS.warning + '88',
  },
  strip: {
    width: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  title: {
    flex: 1,
    fontSize: TYPOGRAPHY.sizeSm,
    fontWeight: TYPOGRAPHY.semiBold,
    color: COLORS.textPrimary,
    marginRight: SPACING.sm,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  badgeText: {
    fontSize: TYPOGRAPHY.sizeMicro,
    fontWeight: TYPOGRAPHY.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  composer: {
    fontSize: TYPOGRAPHY.sizeXs,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginBottom: SPACING.xs,
  },
  // ✨ Fila del algoritmo
  algorithmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.bgApp,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
  },
  algorithmText: {
    fontSize: TYPOGRAPHY.sizeMicro,
    fontWeight: TYPOGRAPHY.medium,
    letterSpacing: 0.2,
  },
  footer: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  statText: {
    fontSize: TYPOGRAPHY.sizeTiny,
    color: COLORS.textDisabled,
  },
  dueText: {
    color: COLORS.accent,
    fontWeight: TYPOGRAPHY.semiBold,
  },
});
