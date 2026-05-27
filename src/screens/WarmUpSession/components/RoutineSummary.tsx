// src/screens/WarmUpSession/components/RoutineSummary.tsx
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, STATUS_COLORS, STATUS_LABELS } from '../../../theme';
import { ViolinPiece } from '../../../types';
import { urgencyLabel } from '../utils';
import { styles } from '../WarmUpSession.styles';

interface RoutineSummaryProps {
  routine: {
    warmups: string[];
    challenges: ViolinPiece[];
    reviews: ViolinPiece[];
  };
  config: {
    timeEstimateMins: number;
  };
  onStartPress: () => void;
  onBackPress: () => void;
}

export function RoutineSummary({
  routine,
  config,
  onStartPress,
  onBackPress,
}: RoutineSummaryProps) {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* ── Encabezado ── */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBackPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={26} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerTitleBlock}>
          <Text style={styles.headerTitle}>Rutina Exprés</Text>
          <Text style={styles.headerSubtitle}>Tu sesión personalizada</Text>
        </View>
        <View style={styles.timerBadge}>
          <Ionicons name="time-outline" size={14} color={COLORS.accent} />
          <Text style={styles.timerText}>~{config.timeEstimateMins} min</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── ESCALAS ── */}
        {routine.warmups.map((scale, index) => (
          <View key={`warmup-${index}`} style={[styles.slotCard, { borderLeftColor: COLORS.accent }]}>
            <View style={styles.slotHeader}>
              <View style={[styles.slotNumber, { backgroundColor: COLORS.accent }]}>
                <Text style={styles.slotNumberText}>{index + 1}</Text>
              </View>
              <Text style={[styles.slotLabel, { color: COLORS.accent }]}>
                Calentamiento {routine.warmups.length > 1 ? index + 1 : ''}
              </Text>
              <Text style={styles.slotDuration}>~5 min</Text>
            </View>
            <Text style={styles.slotTitle}>{scale}</Text>
            <Text style={styles.slotSubtitle}>Escala aleatoria — 2 octavas</Text>
            <View style={styles.slotHint}>
              <Ionicons name="bulb-outline" size={12} color={COLORS.accent} />
              <Text style={[styles.slotHintText, { color: COLORS.accent }]}>
                Toca lento, con metrónomo, afinación perfecta
              </Text>
            </View>
          </View>
        ))}

        {/* ── RETOS TÉCNICOS ── */}
        {routine.challenges.map((challenge, index) => (
          <View key={`challenge-${challenge.id}`} style={[styles.slotCard, { borderLeftColor: COLORS.statusLearning }]}>
            <View style={styles.slotHeader}>
              <View style={[styles.slotNumber, { backgroundColor: COLORS.statusLearning }]}>
                <Text style={styles.slotNumberText}>{routine.warmups.length + index + 1}</Text>
              </View>
              <Text style={[styles.slotLabel, { color: COLORS.statusLearning }]}>
                Reto técnico {routine.challenges.length > 1 ? index + 1 : ''}
              </Text>
              <Text style={styles.slotDuration}>~8 min</Text>
            </View>
            <Text style={styles.slotTitle}>{challenge.title}</Text>
            <Text style={styles.slotSubtitle}>{challenge.composer}</Text>
            <View style={styles.slotHint}>
              <Ionicons name="pulse-outline" size={12} color={STATUS_COLORS[challenge.status]} />
              <Text style={[styles.slotHintText, { color: STATUS_COLORS[challenge.status] }]}>
                {STATUS_LABELS[challenge.status]} · {urgencyLabel(challenge)}
              </Text>
            </View>
          </View>
        ))}
        {routine.challenges.length === 0 && (
          <View style={[styles.slotCard, { borderLeftColor: COLORS.statusLearning }]}>
            <View style={styles.slotHeader}>
              <View style={[styles.slotNumber, { backgroundColor: COLORS.statusLearning }]}>
                <Text style={styles.slotNumberText}>{routine.warmups.length + 1}</Text>
              </View>
              <Text style={[styles.slotLabel, { color: COLORS.statusLearning }]}>Reto técnico</Text>
            </View>
            <View style={styles.emptySlot}>
              <Ionicons name="checkmark-circle" size={18} color={COLORS.statusRepertoire} />
              <Text style={styles.emptySlotText}>No hay piezas en aprendizaje. ¡Agrega una nueva!</Text>
            </View>
          </View>
        )}

        {/* ── REPASOS ── */}
        {routine.reviews.map((review, index) => (
          <View key={`review-${review.id}`} style={[styles.slotCard, { borderLeftColor: COLORS.statusRepertoire }]}>
            <View style={styles.slotHeader}>
              <View style={[styles.slotNumber, { backgroundColor: COLORS.statusRepertoire }]}>
                <Text style={styles.slotNumberText}>{routine.warmups.length + Math.max(routine.challenges.length, 1) + index + 1}</Text>
              </View>
              <Text style={[styles.slotLabel, { color: COLORS.statusRepertoire }]}>
                Repaso de memoria {routine.reviews.length > 1 ? index + 1 : ''}
              </Text>
              <Text style={styles.slotDuration}>~7 min</Text>
            </View>
            <Text style={styles.slotTitle}>{review.title}</Text>
            <Text style={styles.slotSubtitle}>{review.composer}</Text>
            <View style={styles.slotHint}>
              <Ionicons name="pulse-outline" size={12} color={COLORS.statusRepertoire} />
              <Text style={[styles.slotHintText, { color: COLORS.statusRepertoire }]}>
                {STATUS_LABELS[review.status]} · {urgencyLabel(review)}
              </Text>
            </View>
          </View>
        ))}
        {routine.reviews.length === 0 && (
          <View style={[styles.slotCard, { borderLeftColor: COLORS.statusRepertoire }]}>
            <View style={styles.slotHeader}>
              <View style={[styles.slotNumber, { backgroundColor: COLORS.statusRepertoire }]}>
                <Text style={styles.slotNumberText}>{routine.warmups.length + Math.max(routine.challenges.length, 1) + 1}</Text>
              </View>
              <Text style={[styles.slotLabel, { color: COLORS.statusRepertoire }]}>Repaso de memoria</Text>
            </View>
            <View style={styles.emptySlot}>
              <Ionicons name="musical-notes" size={18} color={COLORS.textDisabled} />
              <Text style={styles.emptySlotText}>Aún no tienes piezas en repertorio consolidado.</Text>
            </View>
          </View>
        )}

        {/* ── Botón de inicio ── */}
        <TouchableOpacity
          style={styles.startBtn}
          onPress={onStartPress}
          activeOpacity={0.82}
        >
          <Ionicons name="play" size={22} color={COLORS.white} />
          <Text style={styles.startBtnText}>Comenzar sesión</Text>
        </TouchableOpacity>

        {/* ── Tip ── */}
        <View style={styles.tipCard}>
          <Ionicons name="information-circle-outline" size={16} color={COLORS.accent} />
          <Text style={styles.tipText}>
            Al terminar cada pieza, ve a su detalle para registrar la práctica y actualizar
            el algoritmo SM-2 automáticamente.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
