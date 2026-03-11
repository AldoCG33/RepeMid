// src/database/database.ts
// Singleton de conexión a SQLite.
//
// Al importar `db` desde aquí, siempre obtienes la MISMA instancia abierta.
// Ningún otro archivo debería llamar a openDatabaseSync directamente.

import * as SQLite from 'expo-sqlite';

// openDatabaseSync crea el archivo 'viomind.db' en el directorio de datos
// del dispositivo si no existe, o lo abre si ya existe.
const db = SQLite.openDatabaseSync('viomind.db');

export default db;
