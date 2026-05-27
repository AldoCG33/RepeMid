// src/screens/PieceDetail/components/RatingModal.tsx
import React from 'react';
import { Modal, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { COLORS } from '../../../theme';
import { styles } from '../PieceDetail.styles';

export type Quality = 0 | 1 | 2 | 3 | 4 | 5;

export const QUALITY_OPTIONS: { value: Quality; label: string; detail: string; color: string }[] = [
  { value: 0, label: '0 — Olvido total',          detail: 'No recordé nada de la pieza',           color: '#E74C3C' },
  { value: 1, label: '1 — Muy difícil',            detail: 'Solo recordé fragmentos sueltos',       color: '#E67E22' },
  { value: 2, label: '2 — Con mucho esfuerzo',     detail: 'Toqué, pero con muchos errores',        color: '#F39C12' },
  { value: 3, label: '3 — Con esfuerzo',           detail: 'Salió, pero no con fluidez',            color: '#F1C40F' },
  { value: 4, label: '4 — Bien',                   detail: 'Salió con algunos tropiezos menores',   color: '#2ECC71' },
  { value: 5, label: '5 — Perfecto',               detail: 'Fluido, sin errores, sin titubear',     color: '#27AE60' },
];

interface RatingModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectQuality: (quality: Quality) => void;
  isSaving: boolean;
}

export function RatingModal({ visible, onClose, onSelectQuality, isSaving }: RatingModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={() => !isSaving && onClose()}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalSheet}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>¿Cómo salió la práctica?</Text>
          <Text style={styles.modalSubtitle}>
            Sé honesto — el algoritmo ajusta el intervalo según tu evaluación
          </Text>

          {isSaving ? (
            <ActivityIndicator color={COLORS.accent} size="large" style={{ marginVertical: 32 }} />
          ) : (
            QUALITY_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[styles.qualityBtn, { borderColor: opt.color + '44' }]}
                onPress={() => onSelectQuality(opt.value)}
                activeOpacity={0.8}
              >
                <View style={[styles.qualityDot, { backgroundColor: opt.color }]} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.qualityLabel}>{opt.label}</Text>
                  <Text style={styles.qualityDetail}>{opt.detail}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}

          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={onClose}
            disabled={isSaving}
          >
            <Text style={styles.cancelBtnText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
