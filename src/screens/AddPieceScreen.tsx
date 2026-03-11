// src/screens/AddPieceScreen.tsx
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  TextInput,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../navigation/AppNavigator';
import { addPiece } from '../database/models/pieceModel';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../theme';
import FormField from '../components/FormField';
import DifficultyPicker from '../components/DifficultyPicker';

type AddPieceScreenProps = NativeStackScreenProps<RootStackParamList, 'AddPiece'>;

interface FormErrors {
  title?: string;
  composer?: string;
}

export default function AddPieceScreen({ navigation }: AddPieceScreenProps) {
  const [title, setTitle] = useState('');
  const [composer, setComposer] = useState('');
  const [difficulty, setDifficulty] = useState(3);
  const [technicalNotes, setNotes] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [focusedField, setFocused] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const composerRef = useRef<TextInput>(null);
  const notesRef = useRef<TextInput>(null);

  function validate(): boolean {
    const e: FormErrors = {};
    if (!title.trim()) e.title = 'El título es obligatorio.';
    else if (title.trim().length < 2) e.title = 'Debe tener al menos 2 caracteres.';
    if (composer.trim().length > 0 && composer.trim().length < 2)
      e.composer = 'Debe tener al menos 2 caracteres.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    setIsSaving(true);
    try {
      addPiece({
        title: title.trim(),
        composer: composer.trim() || 'Desconocido',
        difficulty,
        technicalNotes: technicalNotes.trim() || undefined,
      });
      navigation.goBack();
    } catch {
      Alert.alert('Error al guardar', 'No se pudo registrar la pieza. Intenta de nuevo.');
    } finally {
      setIsSaving(false);
    }
  }

  const canSave = title.trim().length >= 2 && !isSaving;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>

      {/* Encabezado */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={26} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Nueva Pieza</Text>
          <Text style={styles.headerSubtitle}>Agrega a tu repertorio</Text>
        </View>
      </View>

      {/* Formulario */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Título */}
          <FormField
            label="Título *"
            placeholder="ej. el rey de la huasteca"
            value={title}
            onChangeText={(t) => { setTitle(t); setErrors(e => ({ ...e, title: undefined })); }}
            onFocus={() => setFocused('title')}
            onBlur={() => setFocused(null)}
            isFocused={focusedField === 'title'}
            error={errors.title}
            returnKeyType="next"
            onSubmitEditing={() => composerRef.current?.focus()}
            autoCapitalize="words"
            maxLength={120}
          />

          {/* Compositor */}
          <FormField
            ref={composerRef}
            label="Compositor"
            placeholder="ej. Juan Gabriel"
            value={composer}
            onChangeText={(t) => { setComposer(t); setErrors(e => ({ ...e, composer: undefined })); }}
            onFocus={() => setFocused('composer')}
            onBlur={() => setFocused(null)}
            isFocused={focusedField === 'composer'}
            error={errors.composer}
            returnKeyType="next"
            onSubmitEditing={() => notesRef.current?.focus()}
            autoCapitalize="words"
            maxLength={80}
          />

          {/* Dificultad */}
          <Text style={styles.sectionLabel}>Dificultad</Text>
          <DifficultyPicker value={difficulty} onChange={setDifficulty} />

          <View style={styles.divider} />

          {/* Notas técnicas */}
          <FormField
            ref={notesRef}
            label="Notas técnicas (opcional)"
            placeholder="ej. Cuidar el cambio de posición en el compás 32..."
            value={technicalNotes}
            onChangeText={setNotes}
            onFocus={() => setFocused('notes')}
            onBlur={() => setFocused(null)}
            isFocused={focusedField === 'notes'}
            multiline
            returnKeyType="done"
            maxLength={500}
            style={styles.notesInput}
          />

          {/* Botón guardar */}
          <TouchableOpacity
            style={[styles.saveBtn, !canSave && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={!canSave}
            activeOpacity={0.8}
          >
            {isSaving
              ? <ActivityIndicator color={COLORS.white} size="small" />
              : <>
                <Ionicons name="checkmark-circle" size={20} color={COLORS.white} />
                <Text style={styles.saveBtnText}>Guardar en Repertorio</Text>
              </>
            }
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
