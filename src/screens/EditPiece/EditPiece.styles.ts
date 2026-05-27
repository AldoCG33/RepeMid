// src/screens/EditPiece/EditPiece.styles.ts
import { StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgApp,
  },
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
    fontSize: TYPOGRAPHY.sizeMd,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: TYPOGRAPHY.sizeXxs,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  scroll: {
    padding: SPACING.xl,
    paddingBottom: SPACING.xxxl,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    backgroundColor: COLORS.accent + '12',
    borderRadius: RADIUS.sm,
    padding: SPACING.md,
    marginBottom: SPACING.xl,
  },
  infoText: {
    flex: 1,
    fontSize: TYPOGRAPHY.sizeTiny,
    color: COLORS.accent,
    lineHeight: 18,
  },
  sectionLabel: {
    fontSize: TYPOGRAPHY.sizeXxs,
    fontWeight: TYPOGRAPHY.semiBold,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: SPACING.sm,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: SPACING.xxl,
  },
  notesInput: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  saveBtn: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
    ...SHADOWS.button,
  },
  saveBtnDisabled: {
    opacity: 0.45,
    elevation: 0,
    shadowOpacity: 0,
  },
  saveBtnText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.sizeSm,
    fontWeight: TYPOGRAPHY.bold,
    letterSpacing: 0.4,
  },
});
