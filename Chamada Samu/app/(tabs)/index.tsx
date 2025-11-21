import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();

  const chamarSamu = () => {
    // Simula o envio do chamado e redireciona para o rastreio
    Alert.alert(
      "CHAMANDO SAMU",
      "Sua localização e ficha médica foram enviadas! Acompanhe o status.",
      [
        { 
          text: "OK", 
          onPress: () => router.push('/(tabs)/explore') 
        }
      ]
    );
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#ffcccc', dark: '#330000' }}
      headerImage={
        <View style={styles.headerContainer}>
           <IconSymbol size={100} name="staroflife.fill" color="#d32f2f" />
        </View>
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Emergência Médica</ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.stepContainer}>
        <ThemedText>
          Pressione o botão abaixo em caso de emergência. Seus dados e localização serão enviados imediatamente.
        </ThemedText>
      </ThemedView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.panicButton} 
          onPress={chamarSamu}
          activeOpacity={0.7}
        >
          <Text style={styles.panicButtonText}>CHAMAR SAMU</Text>
          <Text style={styles.panicButtonSubtext}>192</Text>
        </TouchableOpacity>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 50 },
  titleContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'center' },
  stepContainer: { gap: 8, marginBottom: 8, alignItems: 'center', paddingHorizontal: 20, marginTop: 10 },
  buttonContainer: { alignItems: 'center', marginTop: 40, marginBottom: 40 },
  panicButton: {
    backgroundColor: '#d32f2f',
    width: 250,
    height: 250,
    borderRadius: 125,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    borderWidth: 8,
    borderColor: '#ff6666',
  },
  panicButtonText: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  panicButtonSubtext: { color: '#fff', fontSize: 18 }
});