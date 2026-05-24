// src/screens/WarmUpSessionScreen.tsx
// Pantalla de la Rutina Exprés — muestra los 3 slots del calentamiento:
//   1. Escala aleatoria
//   2. Reto técnico (pieza en Learning/Polishing)
//   3. Repaso de memoria (pieza en Repertoire)

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../navigation/AppNavigator';
import { ViolinPiece, PieceStatus } from '../types';
import {
  COLORS,
  STATUS_COLORS,
  STATUS_LABELS,
  SPACING,
} from '../theme';
import { styles } from './styles/WarmUpSessionScreen.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'WarmUpSession'>;

// ─────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────
function urgencyLabel(piece: ViolinPiece): string {
  const last = new Date(piece.lastPracticed);
  const next = new Date(last);
  next.setDate(next.getDate() + Math.round(piece.intervalDays));
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (next <= today) return '¡Pendiente hoy!';
  const diff = Math.ceil((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return `Próxima en ${diff} día${diff !== 1 ? 's' : ''}`;
}

// ─────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────────
export default function WarmUpSessionScreen({ route, navigation }: Props) {
  const { routine } = route.params;

  const handleStartPractice = () => {
    // TODO: Aquí se implementará el flujo de sesión con timer.
    // Por ahora, si hay pieza de reto, vamos a su detalle.
    if (routine.challenge) {
      navigation.navigate('PieceDetail', { id: routine.challenge.id });
    } else if (routine.review) {
      navigation.navigate('PieceDetail', { id: routine.review.id });
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>

      {/* ── Encabezado ────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={26} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerTitleBlock}>
          <Text style={styles.headerTitle}>Rutina Exprés</Text>
          <Text style={styles.headerSubtitle}>Calentamiento de 20 minutos</Text>
        </View>
        <View style={styles.timerBadge}>
          <Ionicons name="time-outline" size={14} color={COLORS.accent} />
          <Text style={styles.timerText}>~20 min</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >

        {/* ── SLOT 1: Escala ─────────────────────── */}
        <View style={[styles.slotCard, { borderLeftColor: COLORS.accent }]}>
          <View style={styles.slotHeader}>
            <View style={[styles.slotNumber, { backgroundColor: COLORS.accent }]}>
              <Text style={styles.slotNumberText}>1</Text>
            </View>
            <Text style={[styles.slotLabel, { color: COLORS.accent }]}>
              Calentamiento
            </Text>
            <Text style={styles.slotDuration}>~5 min</Text>
          </View>

          <Text style={styles.slotTitle}>{routine.warmup}</Text>
          <Text style={styles.slotSubtitle}>Escala aleatoria — 2 octavas</Text>

          <View style={styles.slotHint}>
            <Ionicons name="bulb-outline" size={12} color={COLORS.accent} />
            <Text style={[styles.slotHintText, { color: COLORS.accent }]}>
              Toca lento, con metrónomo, afinación perfecta
            </Text>
          </View>
        </View>

        {/* ── SLOT 2: Reto técnico ───────────────── */}
        <View style={[styles.slotCard, { borderLeftColor: COLORS.statusLearning }]}>
          <View style={styles.slotHeader}>
            <View style={[styles.slotNumber, { backgroundColor: COLORS.statusLearning }]}>
              <Text style={styles.slotNumberText}>2</Text>
            </View>
            <Text style={[styles.slotLabel, { color: COLORS.statusLearning }]}>
              Reto técnico
            </Text>
            <Text style={styles.slotDuration}>~8 min</Text>
          </View>

          {routine.challenge ? (
            <>
              <Text style={styles.slotTitle}>{routine.challenge.title}</Text>
              <Text style={styles.slotSubtitle}>{routine.challenge.composer}</Text>

              <View style={styles.slotHint}>
                <Ionicons
                  name="pulse-outline"
                  size={12}
                  color={STATUS_COLORS[routine.challenge.status]}
                />
                <Text style={[styles.slotHintText, { color: STATUS_COLORS[routine.challenge.status] }]}>
                  {STATUS_LABELS[routine.challenge.status]} · {urgencyLabel(routine.challenge)}
                </Text>
              </View>
            </>
          ) : (
            <View style={styles.emptySlot}>
              <Ionicons name="checkmark-circle" size={18} color={COLORS.statusRepertoire} />
              <Text style={styles.emptySlotText}>
                No hay piezas en aprendizaje. ¡Agrega una nueva!
              </Text>
            </View>
          )}
        </View>

        {/* ── SLOT 3: Repaso de repertorio ────────── */}
        <View style={[styles.slotCard, { borderLeftColor: COLORS.statusRepertoire }]}>
          <View style={styles.slotHeader}>
            <View style={[styles.slotNumber, { backgroundColor: COLORS.statusRepertoire }]}>
              <Text style={styles.slotNumberText}>3</Text>
            </View>
            <Text style={[styles.slotLabel, { color: COLORS.statusRepertoire }]}>
              Repaso de memoria
            </Text>
            <Text style={styles.slotDuration}>~7 min</Text>
          </View>

          {routine.review ? (
            <>
              <Text style={styles.slotTitle}>{routine.review.title}</Text>
              <Text style={styles.slotSubtitle}>{routine.review.composer}</Text>

              <View style={styles.slotHint}>
                <Ionicons
                  name="pulse-outline"
                  size={12}
                  color={COLORS.statusRepertoire}
                />
                <Text style={[styles.slotHintText, { color: COLORS.statusRepertoire }]}>
                  {STATUS_LABELS[routine.review.status]} · {urgencyLabel(routine.review)}
                </Text>
              </View>
            </>
          ) : (
            <View style={styles.emptySlot}>
              <Ionicons name="musical-notes" size={18} color={COLORS.textDisabled} />
              <Text style={styles.emptySlotText}>
                Aún no tienes piezas en repertorio consolidado.
              </Text>
            </View>
          )}
        </View>

        {/* ── Botón de inicio ────────────────────── */}
        <TouchableOpacity
          style={styles.startBtn}
          onPress={handleStartPractice}
          activeOpacity={0.82}
        >
          <Ionicons name="play" size={22} color={COLORS.white} />
          <Text style={styles.startBtnText}>Comenzar sesión</Text>
        </TouchableOpacity>

        {/* ── Tip ────────────────────────────────── */}
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
