// src/screens/WarmUpSession/components/SessionTimer.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { SessionStep, formatTime } from '../utils';
import { COLORS } from '../../../theme';
import { timerStyles } from './SessionTimer.styles';

interface SessionTimerProps {
  steps: SessionStep[];
  currentStep: number;
  timeLeft: number;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
  isPaused: boolean;
  setIsPaused: (paused: boolean) => void;
  nextStep: () => void;
  onClose: () => void;
  progressAnim: Animated.Value;
  pulseAnim: Animated.Value;
  fadeAnim: Animated.Value;
}

export function SessionTimer({
  steps,
  currentStep,
  timeLeft,
  setTimeLeft,
  isPaused,
  setIsPaused,
  nextStep,
  onClose,
  progressAnim,
  pulseAnim,
  fadeAnim,
}: SessionTimerProps) {
  const step = steps[currentStep];
  if (!step) return null;

  const totalSteps = steps.length;

  const barWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bgApp }} edges={['top', 'bottom']}>
      {/* ── Header con progreso global ── */}
      <View style={timerStyles.sessionHeader}>
        <TouchableOpacity
          onPress={onClose}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close" size={26} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <View style={timerStyles.stepIndicatorRow}>
          {steps.map((_, i) => (
            <View
              key={`dot-${i}`}
              style={[
                timerStyles.stepDot,
                i === currentStep && { backgroundColor: step.color, transform: [{ scale: 1.3 }] },
                i < currentStep && { backgroundColor: COLORS.statusRepertoire },
              ]}
            />
          ))}
        </View>
        <Text style={timerStyles.stepCount}>{currentStep + 1}/{totalSteps}</Text>
      </View>

      {/* ── Contenido central ── */}
      <Animated.View style={[timerStyles.centerContent, { opacity: fadeAnim, transform: [{ scale: pulseAnim }] }]}>
        {/* Tipo del paso */}
        <View style={[timerStyles.typeBadge, { backgroundColor: step.color + '20' }]}>
          <Ionicons name={step.icon} size={14} color={step.color} />
          <Text style={[timerStyles.typeBadgeText, { color: step.color }]}>
            {step.type === 'warmup' ? 'CALENTAMIENTO' : step.type === 'challenge' ? 'RETO TÉCNICO' : 'REPASO'}
          </Text>
        </View>

        {/* Título */}
        <Text style={timerStyles.stepTitle}>{step.title}</Text>
        <Text style={timerStyles.stepSubtitle}>{step.subtitle}</Text>

        {/* Timer circular */}
        <View style={timerStyles.timerCircleOuter}>
          <View style={[timerStyles.timerCircleInner, { borderColor: step.color }]}>
            <Text style={[timerStyles.timerDigits, { color: step.color }]}>
              {formatTime(timeLeft)}
            </Text>
            <Text style={timerStyles.timerLabel}>
              {isPaused ? 'EN PAUSA' : 'restante'}
            </Text>
          </View>
        </View>

        {/* Barra de progreso */}
        <View style={timerStyles.progressBarBg}>
          <Animated.View
            style={[
              timerStyles.progressBarFill,
              { width: barWidth, backgroundColor: step.color },
            ]}
          />
        </View>
      </Animated.View>

      {/* ── Controles ── */}
      <View style={timerStyles.controls}>
        {/* Saltar */}
        <TouchableOpacity
          style={timerStyles.controlBtn}
          onPress={nextStep}
          activeOpacity={0.7}
        >
          <Ionicons name="play-skip-forward" size={24} color={COLORS.textSecondary} />
          <Text style={timerStyles.controlLabel}>Saltar</Text>
        </TouchableOpacity>

        {/* Pausa / Reanudar */}
        <TouchableOpacity
          style={[timerStyles.mainControlBtn, { backgroundColor: step.color }]}
          onPress={() => setIsPaused(!isPaused)}
          activeOpacity={0.85}
        >
          <Ionicons
            name={isPaused ? 'play' : 'pause'}
            size={32}
            color={COLORS.white}
          />
        </TouchableOpacity>

        {/* +1 min */}
        <TouchableOpacity
          style={timerStyles.controlBtn}
          onPress={() => setTimeLeft(prev => prev + 60)}
          activeOpacity={0.7}
        >
          <Ionicons name="add-circle-outline" size={24} color={COLORS.textSecondary} />
          <Text style={timerStyles.controlLabel}>+1 min</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
