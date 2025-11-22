import { IconSymbol } from '@/components/ui/icon-symbol';
import { addContact, deleteContact, getContacts, getUserData, setLoggedUser, updateUserData } from '@/services/db';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function PerfilScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Dados Pessoais e Médicos (Baseado no README)
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '',
    bloodType: '', age: '', weight: '', height: '',
    allergies: '', medications: ''
  });

  // Contatos
  const [contacts, setContacts] = useState<any[]>([]);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');

  // Carregar dados ao abrir
  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = () => {
    const user: any = getUserData();
    if (user) {
      setForm(user);
      setContacts(getContacts());
    }
    setLoading(false);
  };

  const handleUpdate = () => {
    const sucesso = updateUserData(form);
    if (sucesso) Alert.alert("Sucesso", "Dados atualizados!");
    else Alert.alert("Erro", "Falha ao atualizar.");
  };

  const handleAddContact = () => {
    if (!newContactName || !newContactPhone) {
      Alert.alert("Atenção", "Preencha nome e telefone do contato.");
      return;
    }
    addContact(newContactName, newContactPhone);
    setNewContactName('');
    setNewContactPhone('');
    setContacts(getContacts()); // Recarrega a lista
  };

  const handleDeleteContact = (id: number) => {
    deleteContact(id);
    setContacts(getContacts());
  };

  const handleLogout = () => {
    Alert.alert("Sair", "Deseja deslogar?", [
      { text: "Não", style: "cancel" },
      { 
        text: "Sim", onPress: () => {
          setLoggedUser(null); // Limpa sessão
          router.replace('/'); // Volta pro Login
        } 
      }
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <IconSymbol size={50} name="person.fill" color="#fff" />
        </View>
        <Text style={styles.nameTitle}>{form.name || "Usuário"}</Text>
        <Text style={styles.subTitle}>Perfil do Paciente</Text>
      </View>

      {/* Seção 1: Dados Pessoais e Acesso */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dados Pessoais & Acesso</Text>
        
        <Text style={styles.label}>Nome Completo</Text>
        <TextInput style={styles.input} value={form.name} onChangeText={(t) => setForm({...form, name: t})} />

        <Text style={styles.label}>Email (Login)</Text>
        <TextInput style={styles.input} value={form.email} onChangeText={(t) => setForm({...form, email: t})} />

        <Text style={styles.label}>Senha</Text>
        <TextInput style={styles.input} value={form.password} onChangeText={(t) => setForm({...form, password: t})} secureTextEntry />

        <Text style={styles.label}>Celular</Text>
        <TextInput style={styles.input} value={form.phone} onChangeText={(t) => setForm({...form, phone: t})} keyboardType="phone-pad" placeholder="(XX) 9XXXX-XXXX" />
      </View>

      {/* Seção 2: Ficha Médica (Requisitos do README) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ficha Médica (Essencial p/ SAMU)</Text>
        
        <View style={styles.row}>
          <View style={{flex: 1, marginRight: 5}}>
            <Text style={styles.label}>Tipo Sangue</Text>
            <TextInput style={styles.input} value={form.bloodType} onChangeText={(t) => setForm({...form, bloodType: t})} placeholder="Ex: O+" />
          </View>
          <View style={{flex: 1, marginLeft: 5}}>
            <Text style={styles.label}>Idade</Text>
            <TextInput style={styles.input} value={form.age} onChangeText={(t) => setForm({...form, age: t})} keyboardType="numeric" />
          </View>
        </View>

        <View style={styles.row}>
          <View style={{flex: 1, marginRight: 5}}>
            <Text style={styles.label}>Peso (kg)</Text>
            <TextInput style={styles.input} value={form.weight} onChangeText={(t) => setForm({...form, weight: t})} keyboardType="numeric" />
          </View>
          <View style={{flex: 1, marginLeft: 5}}>
            <Text style={styles.label}>Altura (m)</Text>
            <TextInput style={styles.input} value={form.height} onChangeText={(t) => setForm({...form, height: t})} keyboardType="numeric" />
          </View>
        </View>

        <Text style={styles.label}>Alergias</Text>
        <TextInput style={styles.input} value={form.allergies} onChangeText={(t) => setForm({...form, allergies: t})} placeholder="Ex: Dipirona, Frutos do mar..." />

        <Text style={styles.label}>Uso contínuo de remédios</Text>
        <TextInput style={[styles.input, {height: 60}]} value={form.medications} onChangeText={(t) => setForm({...form, medications: t})} multiline placeholder="Liste seus medicamentos..." />
      
        <Button title="SALVAR DADOS" color="#0a7ea4" onPress={handleUpdate} />
      </View>

      {/* Seção 3: Segurança e Emergência (Lista de Contatos) */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, {color: '#d32f2f'}]}>Contatos de Emergência</Text>
        
        {/* Adicionar Novo Contato */}
        <View style={styles.addContactBox}>
          <TextInput style={[styles.input, {marginBottom: 5}]} placeholder="Nome do Contato (ex: Mãe)" value={newContactName} onChangeText={setNewContactName} />
          <TextInput style={styles.input} placeholder="Telefone" value={newContactPhone} onChangeText={setNewContactPhone} keyboardType="phone-pad" />
          <Button title="Adicionar Contato" color="#d32f2f" onPress={handleAddContact} />
        </View>

        {/* Lista de Contatos */}
        {contacts.map((c) => (
          <View key={c.id} style={styles.contactItem}>
            <View>
              <Text style={styles.contactName}>{c.contactName}</Text>
              <Text style={styles.contactPhone}>{c.contactPhone}</Text>
            </View>
            <TouchableOpacity onPress={() => handleDeleteContact(c.id)}>
              <IconSymbol size={24} name="trash.fill" color="#666" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Botão Sair */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>SAIR DO APLICATIVO</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2' },
  header: { alignItems: 'center', padding: 30, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#eee' },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  nameTitle: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  subTitle: { color: '#666' },
  section: { padding: 20, backgroundColor: '#fff', marginTop: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#333', borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 5 },
  label: { fontSize: 14, color: '#666', marginBottom: 5, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginBottom: 15, fontSize: 16, backgroundColor: '#fff' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  addContactBox: { backgroundColor: '#ffebeb', padding: 10, borderRadius: 8, marginBottom: 15 },
  contactItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  contactName: { fontWeight: 'bold', fontSize: 16 },
  contactPhone: { color: '#555' },
  footer: { padding: 20, paddingBottom: 120 }, // Espaço extra por causa da navbar
  logoutButton: { backgroundColor: '#333', padding: 15, borderRadius: 8, alignItems: 'center' },
  logoutText: { color: '#fff', fontWeight: 'bold' }
});