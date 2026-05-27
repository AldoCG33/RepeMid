// src/components/RoutineConfigModal.tsx
import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme';
import { getRoutineConfig, saveRoutineConfig, RoutineConfig, DEFAULT_ROUTINE_CONFIG } from '../database/models/settingsModel';
import { styles } from './RoutineConfigModal.styles';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
}

export default function RoutineConfigModal({ visible, onClose, onSave }: Props) {
  const [config, setConfig] = useState<RoutineConfig>(DEFAULT_ROUTINE_CONFIG);

  useEffect(() => {
    if (visible) {
      setConfig(getRoutineConfig());
    }
  }, [visible]);

  const updateField = (field: keyof RoutineConfig, delta: number) => {
    setConfig(prev => {
      const newVal = prev[field] + delta;
      if (newVal < 0) return prev; // No negativos
      // Limites razonables
      if (field === 'numScales' && newVal > 5) return prev;
      if (field === 'numLearning' && newVal > 5) return prev;
      if (field === 'numRepertoire' && newVal > 10) return prev;

      // Calcular nuevo tiempo estimado (~5m escala, ~8m learning, ~7m review)
      const estimated = 
        (field === 'numScales' ? newVal : prev.numScales) * 5 +
        (field === 'numLearning' ? newVal : prev.numLearning) * 8 +
        (field === 'numRepertoire' ? newVal : prev.numRepertoire) * 7;

      return { ...prev, [field]: newVal, timeEstimateMins: estimated };
    });
  };

  const handleSave = () => {
    saveRoutineConfig(config);
    onSave(); // recargar
    onClose();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Personalizar Rutina</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>Ajusta la cantidad de piezas que quieres practicar en cada sesión exprés.</Text>

          <View style={styles.row}>
            <View style={styles.labelContainer}>
              <Text style={styles.labelText}>Escalas de Calentamiento</Text>
              <Text style={styles.hintText}>~5 min c/u</Text>
            </View>
            <View style={styles.counter}>
              <TouchableOpacity onPress={() => updateField('numScales', -1)} style={styles.btn}>
                <Ionicons name="remove" size={20} color={COLORS.textPrimary} />
              </TouchableOpacity>
              <Text style={styles.value}>{config.numScales}</Text>
              <TouchableOpacity onPress={() => updateField('numScales', 1)} style={styles.btn}>
                <Ionicons name="add" size={20} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.labelContainer}>
              <Text style={styles.labelText}>Retos Técnicos (Aprender)</Text>
              <Text style={styles.hintText}>~8 min c/u</Text>
            </View>
            <View style={styles.counter}>
              <TouchableOpacity onPress={() => updateField('numLearning', -1)} style={styles.btn}>
                <Ionicons name="remove" size={20} color={COLORS.textPrimary} />
              </TouchableOpacity>
              <Text style={styles.value}>{config.numLearning}</Text>
              <TouchableOpacity onPress={() => updateField('numLearning', 1)} style={styles.btn}>
                <Ionicons name="add" size={20} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.labelContainer}>
              <Text style={styles.labelText}>Repaso de Memoria</Text>
              <Text style={styles.hintText}>~7 min c/u</Text>
            </View>
            <View style={styles.counter}>
              <TouchableOpacity onPress={() => updateField('numRepertoire', -1)} style={styles.btn}>
                <Ionicons name="remove" size={20} color={COLORS.textPrimary} />
              </TouchableOpacity>
              <Text style={styles.value}>{config.numRepertoire}</Text>
              <TouchableOpacity onPress={() => updateField('numRepertoire', 1)} style={styles.btn}>
                <Ionicons name="add" size={20} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tiempo estimado:</Text>
            <Text style={styles.totalValue}>~{config.timeEstimateMins} min</Text>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Guardar Rutina</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
