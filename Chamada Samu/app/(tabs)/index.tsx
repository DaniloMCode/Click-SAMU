import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true); // Alternar entre Login e Cadastro
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleAuth = () => {
    // Simulação de autenticação
    if (email && senha) {
      // Se deu certo, vai para a área logada (as abas)
      router.replace('/(tabs)'); 
    } else {
      Alert.alert("Erro", "Preencha todos os campos");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <IconSymbol size={100} name="staroflife.fill" color="#d32f2f" />
        <Text style={styles.title}>Chamada SAMU</Text>
        <Text style={styles.subtitle}>Socorro Imediato</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.headerText}>{isLogin ? 'Login' : 'Criar Conta'}</Text>
        
        <TextInput 
          placeholder="Email / CPF" 
          style={styles.input} 
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        
        <TextInput 
          placeholder="Senha" 
          style={styles.input} 
          secureTextEntry 
          value={senha}
          onChangeText={setSenha}
        />

        <View style={styles.buttonWrapper}>
          <Button 
            title={isLogin ? "ENTRAR" : "CADASTRAR"} 
            color="#d32f2f" 
            onPress={handleAuth} 
          />
        </View>

        <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={styles.switchButton}>
          <Text style={styles.switchText}>
            {isLogin ? "Não tem conta? Cadastre-se" : "Já tem conta? Faça Login"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', padding: 20 },
  logoContainer: { alignItems: 'center', marginBottom: 50 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#d32f2f', marginTop: 10 },
  subtitle: { fontSize: 18, color: '#666' },
  formContainer: { backgroundColor: '#f9f9f9', padding: 20, borderRadius: 15, elevation: 5 },
  headerText: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 15, marginBottom: 15, fontSize: 16 },
  buttonWrapper: { marginTop: 10, borderRadius: 8, overflow: 'hidden' },
  switchButton: { marginTop: 20, alignItems: 'center' },
  switchText: { color: '#0a7ea4', fontWeight: '600' }
});
