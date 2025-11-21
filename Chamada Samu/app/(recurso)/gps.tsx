import * as Location from 'expo-location';
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";

const router = useRouter();

export default function Gps() {

  const [location, setLocation] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      // 1. Solicitar Permissão
      let { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setErrorMsg('Permissão para acesso à localização negada.');
        return;
      }

      // 2. Obter a Localização
      let current_location = await Location.getCurrentPositionAsync({});
      
      // 3. Salvar no estado
      setLocation(current_location);
    })();
  },[])
  
  let textDisplay = 'Buscando localização...';

  if (errorMsg) {
    textDisplay = errorMsg;
  } else if (location) {
    // Exibição de dados formatados
    textDisplay = 
      `Latitude: ${location.coords.latitude}\n` + 
      `Longitude: ${location.coords.longitude}\n` +
      `Precisão (m): ${location.coords.accuracy}`;
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Teste GPS</Text>
      <View>
        <Text>{textDisplay}</Text>
      </View>
      <Button title="Foto" onPress={() => router.replace('/(recurso)/foto')} />
    </View>
  );
}
