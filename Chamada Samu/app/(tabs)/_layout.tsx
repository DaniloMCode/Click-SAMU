import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#d32f2f',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0,
          elevation: 10, // Sombra no Android
          shadowColor: '#000', // Sombra no iOS
          shadowOpacity: 0.1,
          shadowRadius: 10,
          // AJUSTE CRÍTICO DE ALTURA:
          height: Platform.OS === 'android' ? 70 : 90, 
          paddingBottom: Platform.OS === 'android' ? 10 : 30,
          paddingTop: 10,
          position: 'absolute', // Deixa flutuante mas com altura definida
          bottom: 0,
          left: 0,
          right: 0,
        },
        tabBarLabelStyle: {
          fontWeight: '600',
          fontSize: 12,
        }
      }}>
      
      {/* 1. Rastreio (Esquerda) */}
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Rastreio',
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="location.fill" color={color} />,
        }}
      />

      {/* 2. Chamada (Centro) */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'CHAMAR',
          // Ícone destaque (Maior e centralizado)
          tabBarIcon: ({ color }) => (
            <View style={{
              backgroundColor: '#fff',
              borderRadius: 30,
              padding: 2,
              marginTop: -20, // Faz o ícone "saltar" pra fora da barra
              elevation: 5,
              shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 4
            }}>
              <IconSymbol size={44} name="phone.circle.fill" color="#d32f2f" />
            </View>
          ),
          tabBarLabelStyle: { color: '#d32f2f', fontWeight: 'bold', marginBottom: 5 }
        }}
      />

      {/* 3. Perfil (Direita) */}
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
