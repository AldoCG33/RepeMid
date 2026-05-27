// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen           from '../screens/HomeScreen';
import AddPieceScreen       from '../screens/AddPiece';
import PieceDetailScreen    from '../screens/PieceDetail';
import EditPieceScreen      from '../screens/EditPiece';
import WarmUpSessionScreen  from '../screens/WarmUpSession';

import { ExpressRoutine } from '../database/models/pieceModel';

export type RootStackParamList = {
  Home:           undefined;
  AddPiece:       undefined;
  PieceDetail:    { id: number };
  EditPiece:      { id: number };
  WarmUpSession:  { routine: ExpressRoutine };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Home"           component={HomeScreen} />
        <Stack.Screen name="AddPiece"       component={AddPieceScreen} />
        <Stack.Screen name="PieceDetail"    component={PieceDetailScreen} />
        <Stack.Screen name="EditPiece"      component={EditPieceScreen} />
        <Stack.Screen name="WarmUpSession"  component={WarmUpSessionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
