// src/screens/HomeScreens.tsx
// Pantalla principal de VioMind — con Rutina Exprés, visualización SM-2 y FAB expandible.

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  StyleSheet,
  Animated,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ViolinPiece } from '../types';
import { getAllPieces, getPiecesForToday, getExpressRoutine } from '../database/models/pieceModel';
import { addQuickNote } from '../database/models/quickNoteModel';
import { COLORS, STATUS_COLORS } from '../theme';
import { RootStackParamList } from '../navigation/AppNavigator';
import PieceCard from '../components/PieceCard';
import EmptyState from '../components/EmptyState';
import QuickCaptureModal from '../components/QuickCaptureModal';

import { styles, pillStyles } from './HomeScreen.styles';

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

// ─────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────────
export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [todayPieces, setTodayPieces] = useState<ViolinPiece[]>([]);
  const [allPieces, setAllPieces]     = useState<ViolinPiece[]>([]);
  const [isLoading, setIsLoading]     = useState(true);
  const [fabOpen, setFabOpen]         = useState(false);
  const [quickCaptureVisible, setQuickCaptureVisible] = useState(false);

  // Animaciones del FAB expandible
  const fabAnim      = useRef(new Animated.Value(0)).current;
  const fabRotation  = useRef(new Animated.Value(0)).current;

  // Recarga ambas listas cada vez que la pantalla recibe foco
  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      try {
        setTodayPieces(getPiecesForToday());
        setAllPieces(getAllPieces());
      } catch (e) {
        console.error('[HomeScreen] Error al cargar:', e);
        setTodayPieces([]);
        setAllPieces([]);
      } finally {
        setIsLoading(false);
      }
    }, [])
  );

  const totalPieces = allPieces.length;
  const dueCount    = todayPieces.length;

  // ── Contadores por estado para el resumen ──
  const learningCount   = allPieces.filter(p => p.status === 'learning').length;
  const polishingCount  = allPieces.filter(p => p.status === 'polishing').length;
  const repertoireCount = allPieces.filter(p => p.status === 'repertoire').length;

  // ── Animación del FAB ──
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

  const secondaryTranslateY = fabAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -72],
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

  // ── Backdrop para cerrar el FAB al tocar fuera ──
  const backdropOpacity = fabAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.3],
  });

  // ── Captura Rápida — handler ──
  const handleQuickCaptureSave = (note: string) => {
    try {
      addQuickNote(note);
      console.log('[HomeScreen] Nota rápida guardada.');
    } catch (e) {
      console.error('[HomeScreen] Error al guardar nota rápida:', e);
    }
  };

  // ── ListHeaderComponent ──
  const renderHeader = () => (
    <View>
      {/* ────── Tarjeta de Rutina Exprés ────── */}
      <TouchableOpacity
        style={styles.expressCardWrapper}
        activeOpacity={0.88}
        onPress={() => {
          const routine = getExpressRoutine();
          navigation.navigate('WarmUpSession', { routine });
        }}
      >
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
                Rutina de Calentamiento (20 min)
              </Text>
              <Text style={styles.expressSubtitle}>
                1 Escala aleatoria + 2 Piezas a repasar
              </Text>
            </View>

            <View style={styles.expressIconCircle}>
              <Ionicons name="musical-notes" size={32} color={COLORS.accent} />
            </View>
          </View>

          {/* Barra inferior de "Iniciar" */}
          <View style={styles.expressFooter}>
            <Text style={styles.expressFooterText}>Comenzar ahora</Text>
            <Ionicons name="arrow-forward" size={16} color="rgba(255,255,255,0.9)" />
          </View>
        </LinearGradient>
      </TouchableOpacity>

      {/* ────── Resumen de estados SM-2 ────── */}
      {totalPieces > 0 && (
        <View style={styles.statusSummaryRow}>
          <StatusPill
            color={STATUS_COLORS.learning}
            label="Aprendiendo"
            count={learningCount}
          />
          <StatusPill
            color={STATUS_COLORS.polishing}
            label="Puliendo"
            count={polishingCount}
          />
          <StatusPill
            color={STATUS_COLORS.repertoire}
            label="Repertorio"
            count={repertoireCount}
          />
        </View>
      )}

      {/* ────── Sección "Para practicar hoy" ────── */}
      {dueCount > 0 && (
        <View style={styles.todaySection}>
          <View style={styles.todaySectionHeader}>
            <Ionicons name="flame" size={16} color={COLORS.warning} />
            <Text style={styles.todaySectionTitle}>Para practicar hoy</Text>
            <View style={styles.todayCountBubble}>
              <Text style={styles.todayCountText}>{dueCount}</Text>
            </View>
          </View>

          {todayPieces.map((p) => (
            <PieceCard
              key={p.id}
              piece={p}
              onPress={() => navigation.navigate('PieceDetail', { id: p.id })}
              highlighted
            />
          ))}

          {/* Separador "Todo el repertorio" */}
          {totalPieces > 0 && (
            <Text style={styles.allPiecesLabel}>Todo el repertorio</Text>
          )}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bgCard} />

      {/* ────── Encabezado ────── */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.greeting}>¡A practicar!</Text>
          <Text style={styles.subtitle}>
            {totalPieces > 0
              ? `${totalPieces} pieza${totalPieces > 1 ? 's' : ''} en repertorio`
              : 'Tu repertorio está vacío'}
          </Text>
        </View>

        {/* Badge naranja: piezas pendientes hoy */}
        {dueCount > 0 && (
          <View style={styles.dueBadge}>
            <Ionicons name="notifications" size={14} color={COLORS.white} />
            <Text style={styles.dueBadgeText}>{dueCount} hoy</Text>
          </View>
        )}

        {/* Badge verde: al día */}
        {dueCount === 0 && totalPieces > 0 && (
          <View style={styles.upToDateBadge}>
            <Ionicons name="checkmark-circle" size={14} color={COLORS.statusRepertoire} />
            <Text style={styles.upToDateText}>¡Al día!</Text>
          </View>
        )}
      </View>

      {/* ────── Contenido ────── */}
      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 60 }} size="large" color={COLORS.accent} />
      ) : (
        <FlatList
          data={allPieces}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <PieceCard
              piece={item}
              onPress={(p) => navigation.navigate('PieceDetail', { id: p.id })}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={
            <EmptyState
              title="Aún no tienes piezas en tu repertorio."
              subtitle="Presiona el botón + para agregar la primera."
            />
          }
        />
      )}

      {/* ────── FAB Expandible ────── */}

      {/* Backdrop oscuro */}
      {fabOpen && (
        <Animated.View
          style={[StyleSheet.absoluteFill, { backgroundColor: '#000', opacity: backdropOpacity }]}
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
              { translateY: secondaryTranslateY },
              { scale: secondaryScale },
            ],
            opacity: secondaryOpacity,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.fabSecondary}
          onPress={() => {
            toggleFab();
            setQuickCaptureVisible(true);
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

      {/* Botón principal: Agregar pieza */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          if (fabOpen) {
            toggleFab();
            navigation.navigate('AddPiece');
          } else {
            toggleFab();
          }
        }}
        activeOpacity={0.85}
      >
        <Animated.View style={{ transform: [{ rotate: rotateIcon }] }}>
          <Ionicons name="add" size={30} color={COLORS.white} />
        </Animated.View>
      </TouchableOpacity>

      {/* ────── Modal Captura Rápida ────── */}
      <QuickCaptureModal
        visible={quickCaptureVisible}
        onClose={() => setQuickCaptureVisible(false)}
        onSave={handleQuickCaptureSave}
      />
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────
// COMPONENTE AUXILIAR: Pill de estado SM-2
// ─────────────────────────────────────────────────
function StatusPill({ color, label, count }: { color: string; label: string; count: number }) {
  return (
    <View style={[pillStyles.pill, { borderColor: color + '44' }]}>
      <View style={[pillStyles.dot, { backgroundColor: color }]} />
      <Text style={[pillStyles.count, { color }]}>{count}</Text>
      <Text style={pillStyles.label}>{label}</Text>
    </View>
  );
}
