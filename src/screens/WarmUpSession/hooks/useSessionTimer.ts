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

  // Ref para mantener siempre el valor actual de currentStep
  // (evita stale closures en callbacks del timer)
  const currentStepRef = useRef(currentStep);
  currentStepRef.current = currentStep;

  // Flag para evitar doble avance cuando el timer llega a 0
  const advancingRef = useRef(false);

  // Animaciones
  const progressAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Timer interval
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Iniciar sesión ──
  const startSession = useCallback(() => {
    if (steps.length === 0) return;
    advancingRef.current = false;
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
  // Lee siempre del ref para tener el valor más reciente
  const nextStep = useCallback(() => {
    // Evitar doble avance por race condition del setInterval
    if (advancingRef.current) return;
    advancingRef.current = true;

    const current = currentStepRef.current;
    const next = current + 1;

    if (next >= steps.length) {
      // Sesión completa
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setIsComplete(true);
      Vibration.vibrate([0, 200, 100, 200]);
      advancingRef.current = false;
      return;
    }
    setCurrentStep(next);
    setTimeLeft(steps[next].durationSecs);
    setIsPaused(false);
    progressAnim.setValue(1);
    Vibration.vibrate(100);

    // Liberar el flag después de un breve delay para que React procese el estado
    setTimeout(() => {
      advancingRef.current = false;
    }, 50);
  }, [steps, progressAnim]);

  // ── Timer countdown ──
  // Ya NO llama a nextStep dentro de setTimeLeft.
  // Solo decrementa; la detección de tiempo agotado se hace en otro useEffect.
  useEffect(() => {
    if (!sessionActive || isPaused || isComplete) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [sessionActive, isPaused, isComplete]);

  // ── Detectar tiempo agotado y avanzar al siguiente paso ──
  useEffect(() => {
    if (sessionActive && !isPaused && !isComplete && timeLeft === 0) {
      nextStep();
    }
  }, [timeLeft, sessionActive, isPaused, isComplete, nextStep]);

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
