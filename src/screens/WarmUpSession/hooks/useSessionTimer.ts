// src/screens/WarmUpSession/hooks/useSessionTimer.ts
import { useState, useEffect, useRef, useCallback } from 'react';
import { Animated, Vibration } from 'react-native';
import { SessionStep } from '../utils';

interface UseSessionTimerResult {
  sessionActive: boolean;
  setSessionActive: (active: boolean) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  timeLeft: number;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
  isPaused: boolean;
  setIsPaused: (paused: boolean) => void;
  isComplete: boolean;
  setIsComplete: (complete: boolean) => void;
  progressAnim: Animated.Value;
  pulseAnim: Animated.Value;
  fadeAnim: Animated.Value;
  timerRef: React.MutableRefObject<ReturnType<typeof setInterval> | null>;
  startSession: () => void;
  nextStep: () => void;
}

export function useSessionTimer(steps: SessionStep[]): UseSessionTimerResult {
  // Estado de la sesión
  const [sessionActive, setSessionActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Animaciones
  const progressAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Timer interval
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Iniciar sesión ──
  const startSession = useCallback(() => {
    if (steps.length === 0) return;
    setSessionActive(true);
    setCurrentStep(0);
    setTimeLeft(steps[0].durationSecs);
    setIsPaused(false);
    setIsComplete(false);
    progressAnim.setValue(1);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [steps, fadeAnim, progressAnim]);

  // ── Avanzar al siguiente paso ──
  const nextStep = useCallback(() => {
    const next = currentStep + 1;
    if (next >= steps.length) {
      // Sesión completa
      if (timerRef.current) clearInterval(timerRef.current);
      setIsComplete(true);
      Vibration.vibrate([0, 200, 100, 200]);
      return;
    }
    setCurrentStep(next);
    setTimeLeft(steps[next].durationSecs);
    setIsPaused(false);
    progressAnim.setValue(1);
    Vibration.vibrate(100);
  }, [currentStep, steps, progressAnim]);

  // ── Timer countdown ──
  useEffect(() => {
    if (!sessionActive || isPaused || isComplete) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Tiempo agotado, avanzar
          nextStep();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [sessionActive, isPaused, isComplete, nextStep]);

  // ── Animar progreso ──
  useEffect(() => {
    if (!sessionActive || isComplete || steps.length === 0) return;
    const step = steps[currentStep];
    if (!step) return;
    const progress = timeLeft / step.durationSecs;
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [timeLeft, sessionActive, isComplete, steps, currentStep, progressAnim]);

  // ── Animación de pulso cuando está en pausa ──
  useEffect(() => {
    if (isPaused) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.05, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isPaused, pulseAnim]);

  // ── Cleanup ──
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return {
    sessionActive,
    setSessionActive,
    currentStep,
    setCurrentStep,
    timeLeft,
    setTimeLeft,
    isPaused,
    setIsPaused,
    isComplete,
    setIsComplete,
    progressAnim,
    pulseAnim,
    fadeAnim,
    timerRef,
    startSession,
    nextStep,
  };
}
