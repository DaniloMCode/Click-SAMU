import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#d32f2f', // Cor do SAMU quando ativo
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: Platform.select({
          ios: { position: 'absolute' },
          default: { height: 60, paddingBottom: 10 },
        }),
      }}>
      
      {/* 1. Rastreio (Esquerda) */}
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Rastreio',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="location.fill" color={color} />, // Ícone de Mapa
        }}
      />

      {/* 2. Chamada (Centro - Home) - OBS: 'index' geralmente é a rota padrão */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'CHAMAR',
          tabBarIcon: ({ color }) => <IconSymbol size={32} name="phone.fill" color={color} />, // Ícone de Telefone
        }}
      />

      {/* 3. Dados/Perfil (Direita) */}
      <Tabs.Screen
        name="produto"
        options={{
          title: 'Meu Perfil',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />, // Ícone de Pessoa
        }}
      />
    </Tabs>
  );
}
