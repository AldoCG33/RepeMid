// src/screens/WarmUpSession/components/RoutineSummary.tsx
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, STATUS_COLORS, STATUS_LABELS } from '../../../theme';
import { ExpressRoutine } from '../../../database/models/pieceModel';
import { urgencyLabel } from '../utils';
import { styles } from '../WarmUpSession.styles';

interface RoutineSummaryProps {
  routine: ExpressRoutine;
  onStartPress: () => void;
  onBackPress: () => void;
}

export function RoutineSummary({
  routine,
  onStartPress,
  onBackPress,
}: RoutineSummaryProps) {
    const estimatedTime = (routine.warmUps.length * 5) + (routine.technicalPieces.length * 8) + (routine.repertoirePieces.length * 7);

  let slotNumber = 1;

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
          <Text style={styles.timerText}>~{estimatedTime} min</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── ESCALA / CALENTAMIENTO ── */}
        {routine.warmUps.length > 0 ? routine.warmUps.map((warmUp, idx) => {
          const num = slotNumber++;
          const hintText = warmUp.scale.hint || 'Toca lento, con metrónomo y afinación perfecta.';
          return (
            <View key={`warmup-${idx}`} style={[styles.slotCard, { borderLeftColor: COLORS.accent }]}>
              <View style={styles.slotHeader}>
                <View style={[styles.slotNumber, { backgroundColor: COLORS.accent }]}>
                  <Text style={styles.slotNumberText}>{num}</Text>
                </View>
                <Text style={[styles.slotLabel, { color: COLORS.accent }]}>
                  Calentamiento
                </Text>
                <Text style={styles.slotDuration}>~5 min</Text>
              </View>
              <Text style={styles.slotTitle}>{warmUp.scale.name}</Text>
              <Text style={styles.slotSubtitle}>{warmUp.rhythm} · {warmUp.scale.accidentals}</Text>
              <View style={styles.slotHint}>
                <Ionicons name="bulb-outline" size={12} color={COLORS.accent} />
                <Text style={[styles.slotHintText, { color: COLORS.accent }]}>
                  {hintText}
                </Text>
              </View>
            </View>
          );
        }) : null}

        {/* ── RETOS TÉCNICOS ── */}
        {routine.technicalPieces.length > 0 ? (
          routine.technicalPieces.map((piece, idx) => {
            const num = slotNumber++;
            return (
              <View key={`tech-${piece.id}-${idx}`} style={[styles.slotCard, { borderLeftColor: COLORS.statusLearning }]}>
                <View style={styles.slotHeader}>
                  <View style={[styles.slotNumber, { backgroundColor: COLORS.statusLearning }]}>
                    <Text style={styles.slotNumberText}>{num}</Text>
                  </View>
                  <Text style={[styles.slotLabel, { color: COLORS.statusLearning }]}>
                    Reto técnico
                  </Text>
                  <Text style={styles.slotDuration}>~8 min</Text>
                </View>
                <Text style={styles.slotTitle}>{piece.title}</Text>
                <Text style={styles.slotSubtitle}>{piece.composer}</Text>
                <View style={styles.slotHint}>
                  <Ionicons name="pulse-outline" size={12} color={STATUS_COLORS[piece.status]} />
                  <Text style={[styles.slotHintText, { color: STATUS_COLORS[piece.status] }]}>
                    {STATUS_LABELS[piece.status]} · {urgencyLabel(piece)}
                  </Text>
                </View>
              </View>
            );
          })
        ) : (
          <View style={[styles.slotCard, { borderLeftColor: COLORS.statusLearning }]}>
            <View style={styles.slotHeader}>
              <View style={[styles.slotNumber, { backgroundColor: COLORS.statusLearning }]}>
                <Text style={styles.slotNumberText}>{slotNumber++}</Text>
              </View>
              <Text style={[styles.slotLabel, { color: COLORS.statusLearning }]}>Reto técnico</Text>
            </View>
            <View style={styles.emptySlot}>
              <Ionicons name="checkmark-circle" size={18} color={COLORS.statusRepertoire} />
              <Text style={styles.emptySlotText}>No hay piezas en aprendizaje. ¡Agrega una nueva!</Text>
            </View>
          </View>
        )}

        {/* ── REPASO DE MEMORIA ── */}
        {routine.repertoirePieces.length > 0 ? (
          routine.repertoirePieces.map((piece, idx) => {
            const num = slotNumber++;
            return (
              <View key={`rep-${piece.id}-${idx}`} style={[styles.slotCard, { borderLeftColor: COLORS.statusRepertoire }]}>
                <View style={styles.slotHeader}>
                  <View style={[styles.slotNumber, { backgroundColor: COLORS.statusRepertoire }]}>
                    <Text style={styles.slotNumberText}>{num}</Text>
                  </View>
                  <Text style={[styles.slotLabel, { color: COLORS.statusRepertoire }]}>
                    Repaso de memoria
                  </Text>
                  <Text style={styles.slotDuration}>~7 min</Text>
                </View>
                <Text style={styles.slotTitle}>{piece.title}</Text>
                <Text style={styles.slotSubtitle}>{piece.composer}</Text>
                <View style={styles.slotHint}>
                  <Ionicons name="pulse-outline" size={12} color={COLORS.statusRepertoire} />
                  <Text style={[styles.slotHintText, { color: COLORS.statusRepertoire }]}>
                    {STATUS_LABELS[piece.status]} · {urgencyLabel(piece)}
                  </Text>
                </View>
              </View>
            );
          })
        ) : (
          <View style={[styles.slotCard, { borderLeftColor: COLORS.statusRepertoire }]}>
            <View style={styles.slotHeader}>
              <View style={[styles.slotNumber, { backgroundColor: COLORS.statusRepertoire }]}>
                <Text style={styles.slotNumberText}>{slotNumber++}</Text>
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
