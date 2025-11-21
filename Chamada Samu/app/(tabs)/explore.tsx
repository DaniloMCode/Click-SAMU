import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
// 1. Importação exata como no código do professor
import { IconSymbol } from '@/components/ui/icon-symbol';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';

export default function RastreioScreen() {
  // 2. Estados idênticos aos do exemplo do professor
  const [location, setLocation] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Estado extra apenas para o visual do "Chamada Samu" (Status do socorro)
  const [statusChamado, setStatusChamado] = useState('Aguardando despacho...');

  // Simulação visual do status (pode manter para não ficar vazio)
  useEffect(() => {
    setTimeout(() => setStatusChamado("Ambulância Despachada!"), 3000);
    setTimeout(() => setStatusChamado("Motorista a caminho (5 min)"), 8000);
  }, []);

  // 3. Lógica do GPS (Cópia fiel da lógica do professor)
  useEffect(() => {
    (async () => {
      // Solicitar Permissão
      let { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setErrorMsg('Permissão para acesso à localização negada.');
        return;
      }

      // Obter a Localização
      let current_location = await Location.getCurrentPositionAsync({});
      
      // Salvar no estado
      setLocation(current_location);
    })();
  }, []);

  // 4. Preparar o texto de exibição como no exemplo
  let textDisplay = 'Buscando localização...';
  let latitude = '...';
  let longitude = '...';

  if (errorMsg) {
    textDisplay = errorMsg;
  } else if (location) {
    // Formatação dos dados para exibir no cartão
    latitude = location.coords.latitude;
    longitude = location.coords.longitude;
    textDisplay = `Precisão: ${location.coords.accuracy}m`;
  }

  return (
    <View style={styles.container}>
      {/* Área do Mapa (Visual) */}
      <View style={styles.mapArea}>
        <IconSymbol size={80} name="location.fill" color="#0a7ea4" />
        <Text style={{marginTop: 10, color: '#666'}}>Sua Localização Atual (GPS)</Text>
        
        {/* Exibição dos dados do GPS */}
        {location ? (
          <View style={styles.coordContainer}>
            <Text style={styles.coordText}>Latitude: {latitude}</Text>
            <Text style={styles.coordText}>Longitude: {longitude}</Text>
            <Text style={styles.accuracyText}>{textDisplay}</Text>
          </View>
        ) : (
          <ActivityIndicator size="large" color="#0a7ea4" style={{marginTop: 20}} />
        )}
      </View>

      {/* Card de Status (Visual do App) */}
      <View style={styles.statusCard}>
        <Text style={styles.statusTitle}>Status do Socorro</Text>
        <Text style={styles.statusMain}>{statusChamado}</Text>
        
        <View style={styles.driverInfo}>
          <IconSymbol size={40} name="staroflife.fill" color="#d32f2f" />
          <View style={{marginLeft: 15}}>
            <Text style={{fontWeight: 'bold'}}>Unidade Avançada (USA)</Text>
            <Text>Placa: BRA-2024</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#eee' },
  mapArea: { flex: 2, alignItems: 'center', justifyContent: 'center', backgroundColor: '#e0e0e0' },
  coordContainer: { marginTop: 15, alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 10, elevation: 2 },
  coordText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  accuracyText: { fontSize: 14, color: '#666', marginTop: 5 },
  statusCard: {
    flex: 1, backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, elevation: 10,
  },
  statusTitle: { fontSize: 14, color: '#888', textTransform: 'uppercase' },
  statusMain: { fontSize: 22, fontWeight: 'bold', color: '#000', marginVertical: 10 },
  driverInfo: { flexDirection: 'row', alignItems: 'center', marginTop: 20, padding: 15, backgroundColor: '#f9f9f9', borderRadius: 10 }
});