import * as Location from 'expo-location';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Image, Platform, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

// --- CORREÇÃO DO ERRO DE TYPESCRIPT (React 19 vs Maps) ---
// Transformamos os componentes em "any" para ignorar a validação estrita de tipos
const MapViewIg = MapView as any;
const MarkerIg = Marker as any;
const PolylineIg = Polyline as any;
// ---------------------------------------------------------

// ⚠️ COLOQUE SUA CHAVE DO OPENROUTESERVICE AQUI
const ORS_API_KEY = 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImI1MmQxZDgwZmM5YzRkZDRiMjNiMmJhMWEzOTIxOGFmIiwiaCI6Im11cm11cjY0In0='; 

const HOSPITAL_COORDS = {
  latitude: -24.005618,
  longitude: -46.4241265,
};

export default function RastreioScreen() {
  const params = useLocalSearchParams();
  const chamadoAtivo = params.ativo === 'true';
  
  const [userLocation, setUserLocation] = useState<any>(null);
  const [ambulanceCoords, setAmbulanceCoords] = useState(HOSPITAL_COORDS);
  const [statusChamado, setStatusChamado] = useState('Aguardando solicitação...');
  const [routeCoords, setRouteCoords] = useState<any[]>([]);
  const [showAmbulance, setShowAmbulance] = useState(false);

  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location);
    })();
  }, []);

  useEffect(() => {
    if (chamadoAtivo && userLocation) {
      setStatusChamado("Contatando a central...");
      setTimeout(() => {
        Alert.alert("Central SAMU", "SAMU a caminho! A unidade saiu.", [
          { text: "OK", onPress: () => buscarRotaETrajeto() }
        ]);
      }, 2000);
    }
  }, [chamadoAtivo, userLocation]);

  const buscarRotaETrajeto = async () => {
    if (!userLocation) return;
    setStatusChamado("Calculando rota...");
    setShowAmbulance(true);

    try {
      const start = `${HOSPITAL_COORDS.longitude},${HOSPITAL_COORDS.latitude}`;
      const end = `${userLocation.coords.longitude},${userLocation.coords.latitude}`;
      
      if (ORS_API_KEY === 'SUA_CHAVE_AQUI') {
         iniciarAnimacaoNaRota([]);
         return;
      }

      const response = await fetch(
        `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${ORS_API_KEY}&start=${start}&end=${end}`
      );
      
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const points = data.features[0].geometry.coordinates.map((p: any) => ({
          latitude: p[1],
          longitude: p[0]
        }));
        setRouteCoords(points);
        iniciarAnimacaoNaRota(points);
      } else {
        iniciarAnimacaoNaRota([]);
      }
    } catch (error) {
      iniciarAnimacaoNaRota([]);
    }
  };

  const iniciarAnimacaoNaRota = (coordenadasRota: any[]) => {
    setStatusChamado("Motorista a caminho");
    
    const rotaFinal = coordenadasRota.length > 0 ? coordenadasRota : [
        HOSPITAL_COORDS, 
        {latitude: userLocation.coords.latitude, longitude: userLocation.coords.longitude}
    ];

    mapRef.current?.fitToCoordinates(rotaFinal, {
      edgePadding: { top: 50, right: 50, bottom: 200, left: 50 },
      animated: true,
    });

    let index = 0;
    const step = Math.max(1, Math.ceil(rotaFinal.length / 100)); 
    
    const interval = setInterval(() => {
      if (index >= rotaFinal.length) {
        clearInterval(interval);
        setStatusChamado("A unidade chegou ao local.");
        Alert.alert("SAMU", "O SAMU chegou!");
        return;
      }
      setAmbulanceCoords(rotaFinal[index]);
      index += step;
    }, 100);
  };

  if (!userLocation) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#d32f2f" />
        <Text style={{marginTop: 10}}>Localizando GPS...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Trocamos MapView por MapViewIg */}
      <MapViewIg
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.015,
        }}
        showsUserLocation={true}
      >
        <MarkerIg coordinate={HOSPITAL_COORDS} title="PS Central">
          <View style={styles.hospitalMarker}><Text style={{fontSize: 20}}>🏥</Text></View>
        </MarkerIg>

        {showAmbulance && (
          <>
            <PolylineIg coordinates={routeCoords.length > 0 ? routeCoords : [HOSPITAL_COORDS, {latitude: userLocation.coords.latitude, longitude: userLocation.coords.longitude}]} strokeColor="#00b0ff" strokeWidth={4} />
            
            <MarkerIg 
              coordinate={ambulanceCoords} 
              title="Viatura 01" 
              anchor={{ x: 0.5, y: 0.5 }}
            >
              <Image 
                source={require('@/assets/images/ambulancia.png')} 
                style={{ width: 50, height: 50, resizeMode: 'contain' }} 
                onError={(e) => console.log("ERRO IMAGEM:", e.nativeEvent.error)}
              />
            </MarkerIg>
          </>
        )}
      </MapViewIg>

      <View style={styles.statusCard}>
        <View style={styles.handleBar} />
        <Text style={styles.statusTitle}>{chamadoAtivo ? "EMERGÊNCIA ATIVA" : "VOCÊ ESTÁ AQUI"}</Text>
        <Text style={styles.statusMain}>{statusChamado}</Text>
        
        {showAmbulance && (
          <View style={styles.driverInfo}>
            <Image source={require('@/assets/images/ambulancia.png')} style={{ width: 40, height: 40, resizeMode: 'contain' }} />
            <View style={{marginLeft: 15}}>
              <Text style={{fontWeight: 'bold', fontSize: 16}}>Unidade Avançada</Text>
              <Text style={{color: '#666'}}>Prioridade Máxima</Text>
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
  hospitalMarker: { backgroundColor: '#fff', padding: 5, borderRadius: 20, elevation: 5, borderWidth: 1, borderColor: '#ddd' },
  statusCard: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#fff', borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 20, paddingBottom: Platform.OS === 'ios' ? 90 : 70, shadowColor: '#000', shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.2, elevation: 15 },
  handleBar: { width: 40, height: 5, backgroundColor: '#ddd', borderRadius: 5, alignSelf: 'center', marginBottom: 15 },
  statusTitle: { fontSize: 12, color: '#888', fontWeight: 'bold', letterSpacing: 1, textTransform: 'uppercase' },
  statusMain: { fontSize: 20, fontWeight: 'bold', color: '#333', marginVertical: 5 },
  driverInfo: { flexDirection: 'row', alignItems: 'center', marginTop: 15, padding: 15, backgroundColor: '#f9f9f9', borderRadius: 12 },
});