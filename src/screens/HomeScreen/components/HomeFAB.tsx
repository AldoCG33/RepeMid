// src/screens/HomeScreen/components/HomeFAB.tsx
import React, { useState, useRef } from 'react';
import { View, Text, Animated, Pressable, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../../theme';
import { styles } from '../HomeScreen.styles';

interface HomeFABProps {
  onQuickCapturePress: () => void;
  onAddPiecePress: () => void;
}

export function HomeFAB({ onQuickCapturePress, onAddPiecePress }: HomeFABProps) {
  const [fabOpen, setFabOpen] = useState(false);

  // Animaciones del FAB expandible
  const fabAnim = useRef(new Animated.Value(0)).current;
  const fabRotation = useRef(new Animated.Value(0)).current;

  const toggleFab = () => {
    const toValue = fabOpen ? 0 : 1;
    Animated.parallel([
      Animated.spring(fabAnim, {
        toValue,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.timing(fabRotation, {
        toValue,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
    setFabOpen(!fabOpen);
  };

  const addPieceTranslateY = fabAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -72],
  });

  const quickCaptureTranslateY = fabAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -136],
  });

  const secondaryOpacity = fabAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  const secondaryScale = fabAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1],
  });

  const rotateIcon = fabRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  const backdropOpacity = fabAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.3],
  });

  return (
    <>
      {/* Backdrop oscuro */}
      {fabOpen && (
        <Animated.View
          style={[StyleSheet.absoluteFill, { backgroundColor: '#000', opacity: backdropOpacity, zIndex: 10 }]}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={toggleFab} />
        </Animated.View>
      )}

      {/* Botón secundario: Captura Rápida */}
      <Animated.View
        pointerEvents={fabOpen ? 'auto' : 'none'}
        style={[
          styles.fabSecondaryContainer,
          {
            transform: [
              { translateY: quickCaptureTranslateY },
              { scale: secondaryScale },
            ],
            opacity: secondaryOpacity,
            zIndex: 15,
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.fabSecondary, { backgroundColor: COLORS.warning }]}
          onPress={() => {
            toggleFab();
            onQuickCapturePress();
          }}
          activeOpacity={0.85}
        >
          <Ionicons name="flash" size={22} color={COLORS.white} />
        </TouchableOpacity>
        {fabOpen && (
          <View style={styles.fabLabel}>
            <Text style={styles.fabLabelText}>Captura rápida</Text>
          </View>
        )}
      </Animated.View>

      {/* Botón secundario: Agregar pieza */}
      <Animated.View
        pointerEvents={fabOpen ? 'auto' : 'none'}
        style={[
          styles.fabSecondaryContainer,
          {
            transform: [
              { translateY: addPieceTranslateY },
              { scale: secondaryScale },
            ],
            opacity: secondaryOpacity,
            zIndex: 15,
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.fabSecondary, { backgroundColor: COLORS.statusRepertoire }]}
          onPress={() => {
            toggleFab();
            onAddPiecePress();
          }}
          activeOpacity={0.85}
        >
          <Ionicons name="musical-notes" size={22} color={COLORS.white} />
        </TouchableOpacity>
        {fabOpen && (
          <View style={styles.fabLabel}>
            <Text style={styles.fabLabelText}>Agregar pieza</Text>
          </View>
        )}
      </Animated.View>

      {/* Botón principal: Toggle Menú */}
      <TouchableOpacity
        style={[styles.fab, { zIndex: 20 }]}
        onPress={toggleFab}
        activeOpacity={0.85}
      >
        <Animated.View style={{ transform: [{ rotate: rotateIcon }] }}>
          <Ionicons name="add" size={30} color={COLORS.white} />
        </Animated.View>
      </TouchableOpacity>
    </>
  );
}
