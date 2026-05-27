// src/screens/PieceDetail/PieceDetail.styles.ts
import { StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgApp,
  },

  // Encabezado
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
  headerTitle: {
    flex: 1,
    fontSize: TYPOGRAPHY.sizeMd,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
  },

  scroll: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },

  // Tarjeta de identidad
  idCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    borderLeftWidth: 5,
    marginBottom: SPACING.xl,
    ...SHADOWS.card,
  },
  idCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  pieceTitle: {
    fontSize: TYPOGRAPHY.sizeMd,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
    maxWidth: '65%',
  },
  composer: {
    fontSize: TYPOGRAPHY.sizeXs,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  statusBadgeText: {
    fontSize: TYPOGRAPHY.sizeTiny,
    fontWeight: TYPOGRAPHY.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  diffPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  diffPillText: {
    fontSize: TYPOGRAPHY.sizeTiny,
    fontWeight: TYPOGRAPHY.semiBold,
  },

  // Sección
  sectionTitle: {
    fontSize: TYPOGRAPHY.sizeXxs,
    fontWeight: TYPOGRAPHY.semiBold,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: SPACING.sm,
  },

  // Grid de stats
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },

  // Notas técnicas
  notesCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
    ...SHADOWS.card,
  },
  notesText: {
    flex: 1,
    fontSize: TYPOGRAPHY.sizeXs,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },

  // Botón de práctica
  practiceBtn: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    ...SHADOWS.button,
  },
  practiceBtnDue: {
    backgroundColor: COLORS.statusRepertoire,
  },
  practiceBtnText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.sizeSm,
    fontWeight: TYPOGRAPHY.bold,
    letterSpacing: 0.4,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: COLORS.bgCard,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.xl,
    paddingBottom: SPACING.xxxl,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.borderLight,
    borderRadius: RADIUS.full,
    alignSelf: 'center',
    marginBottom: SPACING.xl,
  },
  modalTitle: {
    fontSize: TYPOGRAPHY.sizeMd,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  modalSubtitle: {
    fontSize: TYPOGRAPHY.sizeXxs,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
    lineHeight: 18,
  },
  qualityBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.bgApp,
  },
  qualityDot: {
    width: 12,
    height: 12,
    borderRadius: RADIUS.full,
  },
  qualityLabel: {
    fontSize: TYPOGRAPHY.sizeXs,
    fontWeight: TYPOGRAPHY.semiBold,
    color: COLORS.textPrimary,
  },
  qualityDetail: {
    fontSize: TYPOGRAPHY.sizeTiny,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  cancelBtn: {
    marginTop: SPACING.sm,
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  cancelBtnText: {
    fontSize: TYPOGRAPHY.sizeSm,
    color: COLORS.textSecondary,
  },
});
