import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
// 1. Importação necessária para detectar a altura dos botões do celular
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  
  // 2. Pega as medidas das áreas seguras (topo, base, laterais)
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#d32f2f',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0,
          
          // 3. FÓRMULA MÁGICA:
          // A altura da barra será 60px + a altura da barra de botões do Android
          height: 60 + insets.bottom, 
          
          // O preenchimento embaixo será a altura da barra de botões + um respiro
          paddingBottom: insets.bottom + 5, 
          paddingTop: 5,

          // Sombras para ficar bonito
          elevation: 10, 
          shadowColor: '#000', 
          shadowOpacity: 0.1,
          shadowRadius: 10,
        },
      }}>
      
      {/* 1. Rastreio */}
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Rastreio',
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="location.fill" color={color} />,
        }}
      />

      {/* 2. Chamada (Destaque) */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'CHAMAR',
          tabBarIcon: ({ color }) => (
            <View style={{
              backgroundColor: '#fff',
              borderRadius: 30,
              padding: 2,
              marginTop: -25, // Sobe o ícone para fora da barra
              elevation: 5,
              shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 4
            }}>
              <IconSymbol size={44} name="phone.circle.fill" color="#d32f2f" />
            </View>
          ),
          tabBarLabelStyle: { color: '#d32f2f', fontWeight: 'bold', marginBottom: 5 }
        }}
      />

      {/* 3. Perfil */}
      <Tabs.Screen
        name="produto"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="person.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}