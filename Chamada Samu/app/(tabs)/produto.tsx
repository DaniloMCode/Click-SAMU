import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function PerfilScreen() {
  const router = useRouter();
  
  // Estados para edição
  const [nome, setNome] = useState('Usuário Exemplo');
  const [telefone, setTelefone] = useState('(11) 99999-9999');
  const [email, setEmail] = useState('usuario@email.com');
  const [emergencia, setEmergencia] = useState('Mãe - (11) 88888-8888');

  const handleLogout = () => {
    Alert.alert("Sair", "Deseja deslogar?", [
      { text: "Não", style: "cancel" },
      { text: "Sim", onPress: () => router.replace('/') } // Volta para tela de Login
    ]);
  };

  const trocarFoto = () => {
    Alert.alert("Câmera", "Abrindo câmera para atualizar foto de perfil...");
    // Aqui você integraria o código da câmera se quisesse
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={trocarFoto} style={styles.avatarContainer}>
           {/* Placeholder de foto - Círculo cinza com ícone */}
           <View style={styles.avatarPlaceholder}>
             <IconSymbol size={50} name="camera.fill" color="#fff" />
           </View>
           <Text style={styles.editPhotoText}>Alterar Foto</Text>
        </TouchableOpacity>
        <Text style={styles.nameTitle}>{nome}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dados Pessoais</Text>
        
        <Text style={styles.label}>Nome Completo</Text>
        <TextInput style={styles.input} value={nome} onChangeText={setNome} />

        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />

        <Text style={styles.label}>Telefone</Text>
        <TextInput style={styles.input} value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Segurança & Emergência</Text>
        
        <Text style={styles.label}>Contato de Emergência</Text>
        <TextInput style={[styles.input, {borderColor: '#d32f2f'}]} value={emergencia} onChangeText={setEmergencia} />

        <TouchableOpacity style={styles.optionButton} onPress={() => Alert.alert("Senha", "Email de redefinição enviado.")}>
          <IconSymbol size={20} name="lock.fill" color="#555" />
          <Text style={styles.optionText}>Alterar Senha</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Button title="Salvar Alterações" color="#0a7ea4" onPress={() => Alert.alert("Sucesso", "Perfil atualizado!")} />
        <View style={{height: 15}} />
        <Button title="SAIR DO APP" color="#d32f2f" onPress={handleLogout} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { alignItems: 'center', padding: 30, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#eee' },
  avatarContainer: { alignItems: 'center', marginBottom: 10 },
  avatarPlaceholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center' },
  editPhotoText: { color: '#0a7ea4', marginTop: 5, fontSize: 14 },
  nameTitle: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  section: { padding: 20, backgroundColor: '#fff', marginTop: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#d32f2f' },
  label: { fontSize: 14, color: '#666', marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginBottom: 15, fontSize: 16 },
  optionButton: { flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: '#f0f0f0', borderRadius: 8, marginTop: 5 },
  optionText: { marginLeft: 10, fontSize: 16, color: '#333' },
  footer: { padding: 20, paddingBottom: 50 }
});
