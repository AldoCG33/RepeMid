// src/screens/WarmUpSession/components/SessionComplete.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../../theme';
import { completeStyles } from './SessionComplete.styles';

interface SessionCompleteProps {
  totalSteps: number;
  onHomePress: () => void;
}

export function SessionComplete({ totalSteps, onHomePress }: SessionCompleteProps) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bgApp }} edges={['top', 'bottom']}>
      <View style={completeStyles.completeContainer}>
        <View style={completeStyles.completeIconCircle}>
          <Ionicons name="checkmark" size={48} color={COLORS.white} />
        </View>
        <Text style={completeStyles.completeTitle}>¡Sesión completada!</Text>
        <Text style={completeStyles.completeSubtitle}>
          Practicaste {totalSteps} ejercicio{totalSteps !== 1 ? 's' : ''} en tu rutina exprés.
        </Text>
        <Text style={completeStyles.completeTip}>
          Recuerda registrar la práctica de cada pieza para actualizar el algoritmo SM-2.
        </Text>
        <TouchableOpacity
          style={completeStyles.completeBtn}
          onPress={onHomePress}
          activeOpacity={0.85}
        >
          <Ionicons name="home" size={20} color={COLORS.white} />
          <Text style={completeStyles.completeBtnText}>Volver al inicio</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
