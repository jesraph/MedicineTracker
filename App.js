import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MedicineProvider } from './context/MedicineContext';
import EditorScreen from './screens/EditorScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <MedicineProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={EditorScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </MedicineProvider>
  );
}