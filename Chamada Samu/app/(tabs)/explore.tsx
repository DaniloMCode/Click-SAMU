import { IconSymbol } from '@/components/ui/icon-symbol';
import * as Location from 'expo-location';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function RastreioScreen() {
  const params = useLocalSearchParams();
  const chamadoAtivo = params.ativo === 'true';
  
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [statusChamado, setStatusChamado] = useState('Aguardando solicitação...');

  // Simulação de status
  useEffect(() => {
    if (chamadoAtivo) {
      setStatusChamado("Procurando unidade...");
      setTimeout(() => setStatusChamado("Ambulância a caminho!"), 3000);
    }
  }, [chamadoAtivo]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permissão de localização negada');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  return (
    <View style={styles.container}>
      {location ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.005, // Zoom bem próximo (estilo iFood)
            longitudeDelta: 0.005,
          }}
          showsUserLocation={true} // Mostra a bolinha azul do usuário
        >
          {/* Marcador da Ambulância (Só aparece se tiver chamado) */}
          {chamadoAtivo && (
            <Marker
              coordinate={{
                // Simulando a ambulância um pouco perto do usuário
                latitude: location.coords.latitude + 0.001,
                longitude: location.coords.longitude + 0.001,
              }}
              title="Ambulância"
              description="Unidade 192 a caminho"
            >
              {/* Ícone personalizado no mapa */}
              <View style={styles.markerContainer}>
                <IconSymbol size={30} name="staroflife.fill" color="#fff" />
              </View>
            </Marker>
          )}
        </MapView>
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#d32f2f" />
          <Text>{errorMsg || "Carregando Mapa..."}</Text>
        </View>
      )}

      {/* Card Flutuante estilo iFood */}
      <View style={styles.statusCard}>
        <View style={styles.handleBar} />
        <Text style={styles.statusTitle}>
          {chamadoAtivo ? "EMERGÊNCIA EM ANDAMENTO" : "VOCÊ ESTÁ SEGURO"}
        </Text>
        <Text style={styles.statusMain}>{statusChamado}</Text>
        
        {chamadoAtivo && (
          <View style={styles.driverInfo}>
            <IconSymbol size={40} name="staroflife.fill" color="#d32f2f" />
            <View style={{marginLeft: 15}}>
              <Text style={{fontWeight: 'bold', fontSize: 16}}>Unidade Avançada</Text>
              <Text style={{color: '#666'}}>Chegada em 4 min</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  map: { width: Dimensions.get('window').width, height: '100%' },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  
  // Marcador personalizado da ambulância
  markerContainer: {
    backgroundColor: '#d32f2f',
    padding: 5,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
    elevation: 5
  },

  // Card estilo BottomSheet do iFood
  statusCard: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    paddingBottom: 40, // Espaço extra para não colar na navbar
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.2,
    elevation: 15,
  },
  handleBar: {
    width: 40, height: 5, backgroundColor: '#ddd', borderRadius: 5, alignSelf: 'center', marginBottom: 15
  },
  statusTitle: { fontSize: 12, color: '#888', fontWeight: 'bold', letterSpacing: 1 },
  statusMain: { fontSize: 20, fontWeight: 'bold', color: '#333', marginVertical: 5 },
  driverInfo: { 
    flexDirection: 'row', alignItems: 'center', marginTop: 15, 
    padding: 15, backgroundColor: '#f9f9f9', borderRadius: 12 
  }
});
