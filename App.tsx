// App.tsx — Punto de entrada de VioMind
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { initSchema } from './src/database/schema';
import { requestNotificationPermission } from './src/utils/notifications';

export default function App() {
  const [dbReady, setDbReady] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        // Crea las tablas si no existen. Solo se ejecuta una vez al iniciar.
        initSchema();
        setDbReady(true);
      } catch (error) {
        console.error('[App] Error crítico al inicializar la DB:', error);
        setDbError('No se pudo inicializar la base de datos.');
      }
      // Pedir permisos de notificación (no-crítico: la app funciona sin ellos)
      await requestNotificationPermission();
    })();
  }, []);

  // Pantalla de error crítico (raro, pero mejor que un crash silencioso)
  if (dbError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>⚠️ Error de inicio</Text>
        <Text style={styles.errorMsg}>{dbError}</Text>
      </View>
    );
  }

  // Esperar a que la DB esté lista antes de renderizar la navegación
  if (!dbReady) return null;

  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#F5F7FA',
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#E74C3C',
    marginBottom: 12,
  },
  errorMsg: {
    fontSize: 15,
    color: '#7F8C8D',
    textAlign: 'center',
  },
});



