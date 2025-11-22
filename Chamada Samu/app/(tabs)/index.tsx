import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ChamadaScreen() {
  const router = useRouter();

  const realizarChamada = () => {
    Alert.alert(
      "CONFIRMAR CHAMADO",
      "Deseja solicitar uma ambulância para sua localização atual?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "CHAMAR AGORA", 
          onPress: () => {
            // Vai para a tela de rastreio ativando o modo ambulância
            router.push('/(tabs)/explore?ativo=true');
          } 
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Emergência</Text>
      <Text style={styles.subtitle}>Toque para acionar o socorro</Text>

      <TouchableOpacity 
        style={styles.panicButton} 
        onPress={realizarChamada}
        activeOpacity={0.7}
      >
        <IconSymbol size={120} name="phone.fill" color="#fff" />
        <Text style={styles.panicText}>192</Text>
      </TouchableOpacity>

      <View style={styles.infoBox}>
        <IconSymbol size={24} name="info.circle" color="#666" />
        <Text style={{marginLeft: 10, color: '#666'}}>
          Mantenha a calma. O GPS enviará sua posição.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#d32f2f', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 40 },
  panicButton: {
    width: 280, height: 280, borderRadius: 140, backgroundColor: '#d32f2f',
    justifyContent: 'center', alignItems: 'center', elevation: 10,
    shadowColor: '#d32f2f', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.5, shadowRadius: 10,
    borderWidth: 10, borderColor: '#ff6666'
  },
  panicText: { color: '#fff', fontSize: 40, fontWeight: 'bold', marginTop: 10 },
  infoBox: { flexDirection: 'row', marginTop: 50, padding: 20, backgroundColor: '#f5f5f5', borderRadius: 10 }
});