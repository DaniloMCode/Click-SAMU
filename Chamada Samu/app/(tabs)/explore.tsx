import { useRouter } from 'expo-router';
import { Accelerometer } from 'expo-sensors';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

const router = useRouter();

interface Coordenada{
  x: number,
  y: number,
  z: number
}

export default function TabTwoScreen() {
  const [data, setData] = useState<Coordenada>({ x: 0, y: 0, z: 0 });
  const [subscription, setSubscription] = useState<any>(null);

  const _subscribe = () => {
    // Define o intervalo de atualização em milissegundos (ex: 100ms)
    Accelerometer.setUpdateInterval(100); 

    // Adiciona o 'Listener' que será chamado a cada nova leitura
    const sub = Accelerometer.addListener(accelerometerData => {
      setData(accelerometerData);
    });

    setSubscription(sub);
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  useEffect(() => {
    _subscribe(); // Inicia o 'Listener' ao montar o componente
    return () => _unsubscribe();  // Limpa o 'Listener' quando o componente for desmontado
  }, []);

  return (
    <View style={styles.container}>
      <Text >Teste Acelerômetro</Text>
      <View>
        <Text>
          Eixo X: {data.x}
        </Text>
        <Text>
          Eixo Y: {data.y}
        </Text>
        <Text>
          Eixo Z: {data.z}
        </Text>
      </View>
      <Button title='GPS' onPress={()=>router.replace("/(recurso)/gps")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
