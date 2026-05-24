// src/components/FormField.tsx
// Campo de formulario reutilizable: label + TextInput + mensaje de error.
// Úsalo en cualquier formulario de la app para consistencia visual.

import React, { forwardRef } from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';
import { COLORS } from '../theme';
import { styles } from './styles/FormField.styles';

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
