// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen        from '../screens/HomeScreens';
import AddPieceScreen    from '../screens/AddPieceScreen';
import PieceDetailScreen from '../screens/PieceDetailScreen';

// Fuente de verdad de las rutas — añadir aquí cualquier pantalla nueva
export type RootStackParamList = {
  Home:        undefined;
  AddPiece:    undefined;
  PieceDetail: { id: number };  // Recibe el id de la pieza a mostrar
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Home"        component={HomeScreen} />
        <Stack.Screen name="AddPiece"    component={AddPieceScreen} />
        <Stack.Screen name="PieceDetail" component={PieceDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
