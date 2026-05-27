// src/screens/EditPiece/EditPieceScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../navigation/AppNavigator';
import { getPieceById, updatePiece } from '../../database/models/pieceModel';
import { ViolinPiece } from '../../types';
import { COLORS } from '../../theme';
import { FormField, DifficultyPicker } from '../../components';
import { styles } from './EditPiece.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'EditPiece'>;

interface FormErrors {
  title?: string;
  composer?: string;
}

export default function EditPieceScreen({ route, navigation }: Props) {
  const { id } = route.params;

  const [original, setOriginal] = useState<ViolinPiece | null>(null);

  const [title, setTitle]         = useState('');
  const [composer, setComposer]   = useState('');
  const [difficulty, setDiff]     = useState(3);
  const [notes, setNotes]         = useState('');
  const [errors, setErrors]       = useState<FormErrors>({});
  const [focused, setFocused]     = useState<string | null>(null);
  const [isSaving, setIsSaving]   = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const composerRef = useRef<TextInput>(null);
  const notesRef    = useRef<TextInput>(null);

  useEffect(() => {
    try {
      const piece = getPieceById(id);
      if (!piece) { navigation.goBack(); return; }
      setOriginal(piece);
      setTitle(piece.title);
      setComposer(piece.composer);
      setDiff(piece.difficulty);
      setNotes(piece.technicalNotes ?? '');
    } catch (e) {
      console.error('[EditPiece] Error al cargar:', e);
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  }, [id, navigation]);

  function validate(): boolean {
    const e: FormErrors = {};
    if (!title.trim())                e.title    = 'El título es obligatorio.';
    else if (title.trim().length < 2) e.title    = 'Debe tener al menos 2 caracteres.';
    if (composer.trim().length > 0 && composer.trim().length < 2)
      e.composer = 'Debe tener al menos 2 caracteres.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function hasChanges(): boolean {
    if (!original) return false;
    return (
      title.trim()    !== original.title          ||
      composer.trim() !== original.composer        ||
      difficulty      !== original.difficulty      ||
      (notes.trim() || '') !== (original.technicalNotes ?? '')
    );
  }

  function handleSave() {
    if (!validate()) return;
    if (!hasChanges()) { navigation.goBack(); return; }

    setIsSaving(true);
    try {
      updatePiece(id, {
        title:         title.trim(),
        composer:      composer.trim() || 'Desconocido',
        difficulty,
        technicalNotes: notes.trim() || undefined,
      });
      navigation.goBack();
    } catch {
      Alert.alert('Error', 'No se pudieron guardar los cambios.');
    } finally {
      setIsSaving(false);
    }
  }

  function handleBack() {
    if (!hasChanges()) { navigation.goBack(); return; }
    Alert.alert(
      'Descartar cambios',
      '¿Salir sin guardar los cambios?',
      [
        { text: 'Seguir editando', style: 'cancel' },
        { text: 'Descartar',       style: 'destructive', onPress: () => navigation.goBack() },
      ]
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator style={{ marginTop: 80 }} size="large" color={COLORS.accent} />
      </SafeAreaView>
    );
  }

  const canSave = title.trim().length >= 2 && !isSaving;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Encabezado */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={26} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Editar pieza</Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>{original?.title}</Text>
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
          {/* Aviso: los campos SM-2 no se editan aquí */}
          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={16} color={COLORS.accent} />
            <Text style={styles.infoText}>
              El intervalo y el factor de facilidad son gestionados automáticamente por el algoritmo SM-2.
            </Text>
          </View>

          {/* Título */}
          <FormField
            label="Título *"
            placeholder="ej. Concierto en La Menor"
            value={title}
            onChangeText={(t) => { setTitle(t); setErrors(e => ({ ...e, title: undefined })); }}
            onFocus={() => setFocused('title')}
            onBlur={() => setFocused(null)}
            isFocused={focused === 'title'}
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
            placeholder="ej. A. Vivaldi"
            value={composer}
            onChangeText={(t) => { setComposer(t); setErrors(e => ({ ...e, composer: undefined })); }}
            onFocus={() => setFocused('composer')}
            onBlur={() => setFocused(null)}
            isFocused={focused === 'composer'}
            error={errors.composer}
            returnKeyType="next"
            onSubmitEditing={() => notesRef.current?.focus()}
            autoCapitalize="words"
            maxLength={80}
          />

          {/* Dificultad */}
          <Text style={styles.sectionLabel}>Dificultad</Text>
          <DifficultyPicker value={difficulty} onChange={setDiff} />

          <View style={styles.divider} />

          {/* Notas técnicas */}
          <FormField
            ref={notesRef}
            label="Notas técnicas (opcional)"
            placeholder="ej. Cuidar el cambio de posición en el compás 32..."
            value={notes}
            onChangeText={setNotes}
            onFocus={() => setFocused('notes')}
            onBlur={() => setFocused(null)}
            isFocused={focused === 'notes'}
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
            {isSaving ? (
              <ActivityIndicator color={COLORS.white} size="small" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={20} color={COLORS.white} />
                <Text style={styles.saveBtnText}>Guardar cambios</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
