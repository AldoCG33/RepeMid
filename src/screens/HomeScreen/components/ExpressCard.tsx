// src/screens/HomeScreen/components/ExpressCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../../theme';
import { RoutineConfig } from '../../../database/models/settingsModel';
import { styles } from '../HomeScreen.styles';

interface ExpressCardProps {
  routineConfig: RoutineConfig;
  onConfigPress: () => void;
  onStartPress: () => void;
}

export function ExpressCard({ routineConfig, onConfigPress, onStartPress }: ExpressCardProps) {
  return (
    <View style={styles.expressCardWrapper}>
      <LinearGradient
        colors={[COLORS.accent, COLORS.accentLight, '#F5B041']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.expressCard}
      >
        {/* Círculo decorativo de fondo */}
        <View style={styles.expressCircleBg} />

        <View style={styles.expressContent}>
          <View style={styles.expressTextBlock}>
            <View style={styles.expressLabelRow}>
              <Ionicons name="flash" size={14} color={COLORS.white} />
              <Text style={styles.expressLabel}>RUTINA EXPRÉS</Text>
            </View>
            <Text style={styles.expressTitle}>
              Rutina (~{routineConfig.timeEstimateMins} min)
            </Text>
            <Text style={styles.expressSubtitle}>
              1 Escala y ritmo aleatorio + piezas más urgentes del algoritmo
            </Text>
          </View>

          <TouchableOpacity
            style={styles.expressIconCircle}
            onPress={onConfigPress}
            activeOpacity={0.8}
          >
            <Ionicons name="options" size={26} color={COLORS.accent} />
          </TouchableOpacity>
        </View>

        {/* Barra inferior de "Iniciar" */}
        <TouchableOpacity
          style={styles.expressFooter}
          activeOpacity={0.85}
          onPress={onStartPress}
        >
          <Text style={styles.expressFooterText}>Comenzar ahora</Text>
          <Ionicons name="arrow-forward" size={16} color="rgba(255,255,255,0.9)" />
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}
