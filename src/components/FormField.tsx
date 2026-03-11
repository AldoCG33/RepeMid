// src/components/FormField.tsx
// Campo de formulario reutilizable: label + TextInput + mensaje de error.
// Úsalo en cualquier formulario de la app para consistencia visual.

import React, { forwardRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  StyleSheet,
} from 'react-native';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../theme';

// ─────────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────────
interface FormFieldProps extends TextInputProps {
  label: string;
  error?: string;
  isFocused?: boolean;
}

// ─────────────────────────────────────────────────
// COMPONENTE
// forwardRef permite que el padre controle el foco (ej: ir al siguiente campo)
// ─────────────────────────────────────────────────
const FormField = forwardRef<TextInput, FormFieldProps>(
  ({ label, error, isFocused, style, ...inputProps }, ref) => {
    return (
      <View style={styles.wrapper}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          ref={ref}
          style={[
            styles.input,
            isFocused && styles.inputFocused,
            error    && styles.inputError,
            style,
          ]}
          placeholderTextColor={COLORS.textDisabled}
          {...inputProps}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    );
  }
);

FormField.displayName = 'FormField';
export default FormField;

// ─────────────────────────────────────────────────
// ESTILOS
// ─────────────────────────────────────────────────
const styles = StyleSheet.create({
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
