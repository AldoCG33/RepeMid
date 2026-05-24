// src/components/QuickCaptureModal.tsx
// Modal minimalista para Captura Rápida de ideas/notas durante la práctica.

import React, { useRef, useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme';
import { styles } from './styles/QuickCaptureModal.styles';

// ─────────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────────
interface QuickCaptureModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (note: string) => void;
}

// ─────────────────────────────────────────────────
// COMPONENTE
// ─────────────────────────────────────────────────
export default function QuickCaptureModal({ visible, onClose, onSave }: QuickCaptureModalProps) {
  const [text, setText] = useState('');
  const inputRef = useRef<TextInput>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Auto-focus al abrir
  useEffect(() => {
    if (visible) {
      setText('');
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
      // Pequeño delay para que el modal se monte antes de enfocar
      const timeout = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(timeout);
    } else {
      fadeAnim.setValue(0);
    }
  }, [visible]);

  const handleSave = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSave(trimmed);
    setText('');
    onClose();
  };

  const canSave = text.trim().length > 0;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      {/* Fondo semitransparente */}
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      />

      {/* Contenedor del formulario */}
      <KeyboardAvoidingView
        style={styles.positioner}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        pointerEvents="box-none"
      >
        <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
          {/* Encabezado */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.iconCircle}>
                <Ionicons name="flash" size={16} color={COLORS.white} />
              </View>
              <Text style={styles.title}>Captura Rápida</Text>
            </View>

            <TouchableOpacity onPress={onClose} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
              <Ionicons name="close" size={22} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Campo de texto */}
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="Escribe una idea, pasaje, o recordatorio…"
            placeholderTextColor={COLORS.textDisabled}
            value={text}
            onChangeText={setText}
            multiline
            maxLength={500}
            textAlignVertical="top"
            returnKeyType="default"
          />

          {/* Contador + Botón */}
          <View style={styles.footer}>
            <Text style={styles.charCount}>{text.length}/500</Text>

            <TouchableOpacity
              style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
              onPress={handleSave}
              activeOpacity={0.85}
              disabled={!canSave}
            >
              <Ionicons
                name="checkmark"
                size={18}
                color={canSave ? COLORS.white : COLORS.textDisabled}
              />
              <Text style={[styles.saveText, !canSave && styles.saveTextDisabled]}>
                Guardar
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
