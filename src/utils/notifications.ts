// src/utils/notifications.ts
// Helper para notificaciones locales de revisión SM-2.
// Usa el id de la pieza como identificador de notificación para poder
// cancelarla y reprogramarla cada vez que se registra una nueva práctica.

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { ViolinPiece } from '../types';

// Configurar cómo se muestran las notificaciones cuando la app está en primer plano
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// ─── Permisos ───────────────────────────────────────────────────────────────

/**
 * Solicita permisos de notificación al usuario.
 * Llama esta función una sola vez al iniciar la app.
 * @returns true si se concedieron permisos, false si no.
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('practice-reminders', {
      name: 'Recordatorios de práctica',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#6C63FF',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  if (existingStatus === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

// ─── Programar notificación ─────────────────────────────────────────────────

/**
 * Programa una notificación local para el día de la próxima revisión de la pieza.
 * Si ya existe una notificación para esta pieza, la cancela primero.
 *
 * @param piece       La pieza actualizada (con el nuevo intervalDays).
 * @param daysFromNow Días desde hoy hasta la próxima práctica.
 */
export async function scheduleReviewNotification(
  piece: ViolinPiece,
  daysFromNow: number,
): Promise<void> {
  try {
    // Cancelar notificación previa de esta pieza (si existe)
    await cancelPieceNotification(piece.id);

    // No programar si el intervalo es 0 o negativo
    if (daysFromNow <= 0) return;

    // Calcular cuándo disparar: en X días a las 9:00 AM
    const trigger = new Date();
    trigger.setDate(trigger.getDate() + daysFromNow);
    trigger.setHours(9, 0, 0, 0);

    await Notifications.scheduleNotificationAsync({
      identifier: notifId(piece.id),
      content: {
        title: '🎻 Hora de practicar',
        body: `"${piece.title}" te espera hoy en tu repertorio.`,
        data: { pieceId: piece.id },
        sound: true,
      },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: trigger },
    });

    console.log(
      `[notifications] Notificación programada → "${piece.title}" en ${daysFromNow} días (${trigger.toLocaleDateString('es-MX')})`
    );
  } catch (error) {
    // Las notificaciones son no-críticas: solo loguear, nunca lanzar
    console.warn('[notifications] Error al programar notificación:', error);
  }
}

// ─── Cancelar notificación ──────────────────────────────────────────────────

/**
 * Cancela la notificación programada de una pieza específica.
 * Se llama antes de reprogramar o al eliminar una pieza.
 *
 * @param pieceId ID de la pieza.
 */
export async function cancelPieceNotification(pieceId: number): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(notifId(pieceId));
  } catch {
    // Silencioso: puede no existir notificación previa
  }
}

// ─── Helper privado ─────────────────────────────────────────────────────────

/** Genera un identificador único de notificación basado en el id de la pieza. */
function notifId(pieceId: number): string {
  return `piece-review-${pieceId}`;
}
