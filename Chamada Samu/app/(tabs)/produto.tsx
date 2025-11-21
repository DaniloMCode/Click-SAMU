import axios from 'axios';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button, ScrollView,
  StyleSheet, Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const API_URL = 'https://prtctec.com.br/api/usuario'; 

export default function PerfilCrudScreen() {
  const [id, setId] = useState(''); 
  const [nome, setNome] = useState('');
  const [tipoSanguineo, setTipoSanguineo] = useState('');
  const [alergias, setAlergias] = useState('');
  const [medicamentos, setMedicamentos] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); 

  // --- 1. READ (Consultar) ---
  const buscarUsuario = async () => {
    if (!id) { Alert.alert("Erro", "Digite um ID para buscar."); return; }
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      const dados = response.data;
      setNome(dados.nome || '');
      setTipoSanguineo(dados.tipoSanguineo || ''); 
      setAlergias(dados.alergias || '');
      setMedicamentos(dados.medicamentos || '');
      setIsEditMode(true); 
      Alert.alert("Encontrado", "Dados carregados.");
    } catch (error) {
      Alert.alert("Erro", "Usuário não encontrado.");
      limparFormulario(false); 
    } finally { setLoading(false); }
  };

  // --- 2. CREATE (Cadastrar) ---
  const cadastrarUsuario = async () => {
    if (!nome || !tipoSanguineo) { Alert.alert("Atenção", "Nome e Tipo Sanguíneo obrigatórios."); return; }
    setLoading(true);
    try {
      const novoUsuario = { nome, tipoSanguineo, alergias, medicamentos };
      const response = await axios.post(API_URL, novoUsuario);
      Alert.alert("Sucesso", `Usuário cadastrado! ID: ${response.data.id}`);
      setId(String(response.data.id)); 
      setIsEditMode(true);
    } catch (error) {
      Alert.alert("Erro", "Falha ao cadastrar.");
    } finally { setLoading(false); }
  };

  // --- 3. UPDATE (Atualizar) ---
  const atualizarUsuario = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const usuarioAtualizado = { nome, tipoSanguineo, alergias, medicamentos };
      await axios.put(`${API_URL}/${id}`, usuarioAtualizado);
      Alert.alert("Sucesso", "Dados atualizados.");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar.");
    } finally { setLoading(false); }
  };

  // --- 4. DELETE (Excluir) ---
  const excluirUsuario = async () => {
    if (!id) return;
    Alert.alert("Confirmar", "Deseja apagar sua ficha?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir", style: "destructive", onPress: async () => {
          setLoading(true);
          try {
            await axios.delete(`${API_URL}/${id}`);
            Alert.alert("Excluído", "Usuário removido.");
            limparFormulario(true);
          } catch (error) { Alert.alert("Erro", "Falha ao excluir."); } 
          finally { setLoading(false); }
        }
      }
    ]);
  };

  const limparFormulario = (limparId = true) => {
    if(limparId) setId('');
    setNome(''); setTipoSanguineo(''); setAlergias(''); setMedicamentos('');
    setIsEditMode(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cadastro SAMU (CRUD)</Text>
      </View>
      <View style={styles.form}>
        <View style={styles.searchContainer}>
          <TextInput style={[styles.input, styles.inputSearch]} placeholder="ID do Usuário" value={id} onChangeText={setId} keyboardType="numeric"/>
          <TouchableOpacity style={styles.btnSearch} onPress={buscarUsuario}><Text style={styles.btnText}>BUSCAR</Text></TouchableOpacity>
        </View>
        <Text style={styles.label}>Nome</Text>
        <TextInput style={styles.input} value={nome} onChangeText={setNome}/>
        <Text style={styles.label}>Tipo Sanguíneo</Text>
        <TextInput style={styles.input} value={tipoSanguineo} onChangeText={setTipoSanguineo}/>
        <Text style={styles.label}>Alergias</Text>
        <TextInput style={styles.input} value={alergias} onChangeText={setAlergias}/>
        <Text style={styles.label}>Medicamentos</Text>
        <TextInput style={[styles.input, {height: 60}]} multiline value={medicamentos} onChangeText={setMedicamentos}/>
        
        {loading && <ActivityIndicator size="large" color="#d32f2f" />}
        
        <View style={styles.actionButtons}>
          {!isEditMode ? (
            <Button title="CADASTRAR (CREATE)" onPress={cadastrarUsuario} color="#2e7d32" />
          ) : (
            <>
              <View style={{marginBottom: 10}}><Button title="ATUALIZAR (UPDATE)" onPress={atualizarUsuario} color="#0288d1" /></View>
              <Button title="EXCLUIR CONTA (DELETE)" onPress={excluirUsuario} color="#d32f2f" />
              <TouchableOpacity onPress={() => limparFormulario(true)} style={{marginTop: 15}}><Text style={{textAlign: 'center', color: '#666'}}>Limpar / Novo</Text></TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee', paddingTop: 50 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#d32f2f' },
  form: { padding: 20 },
  searchContainer: { flexDirection: 'row', marginBottom: 20, alignItems: 'center' },
  inputSearch: { flex: 1, marginBottom: 0, borderTopRightRadius: 0, borderBottomRightRadius: 0 },
  btnSearch: { backgroundColor: '#333', padding: 15, borderTopRightRadius: 8, borderBottomRightRadius: 8, height: 50, justifyContent: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 5, color: '#333' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 15, fontSize: 16 },
  actionButtons: { marginTop: 10 }
});