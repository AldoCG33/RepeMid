// src/screens/WarmUpSession/WarmUpSessionScreen.tsx
import React, { useRef } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { buildSteps } from './utils';
import { useSessionTimer } from './hooks/useSessionTimer';
import { SessionTimer } from './components/SessionTimer';
import { SessionComplete } from './components/SessionComplete';
import { RoutineSummary } from './components/RoutineSummary';

type Props = NativeStackScreenProps<RootStackParamList, 'WarmUpSession'>;

export default function WarmUpSessionScreen({ route, navigation }: Props) {
  const { routine } = route.params;
  const steps = useRef(buildSteps(routine)).current;

  const {
    sessionActive,
    setSessionActive,
    currentStep,
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
  } = useSessionTimer(steps);

  if (isComplete) {
    return (
      <SessionComplete
        totalSteps={steps.length}
        onHomePress={() => navigation.goBack()}
      />
    );
  }

  if (sessionActive) {
    return (
      <SessionTimer
        steps={steps}
        currentStep={currentStep}
        timeLeft={timeLeft}
        setTimeLeft={setTimeLeft}
        isPaused={isPaused}
        setIsPaused={setIsPaused}
        nextStep={nextStep}
        onClose={() => {
          if (timerRef.current) clearInterval(timerRef.current);
          setSessionActive(false);
          setIsComplete(false);
        }}
        progressAnim={progressAnim}
        pulseAnim={pulseAnim}
        fadeAnim={fadeAnim}
      />
    );
  }

  return (
    <RoutineSummary
      routine={routine}
      onStartPress={startSession}
      onBackPress={() => navigation.goBack()}
    />
  );
}
