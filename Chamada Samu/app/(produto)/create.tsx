import axios from 'axios';
import React, { useState } from 'react';
import { ActivityIndicator, Button, Keyboard, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import { Produto } from '../../.expo/types/produto';

// URL de exemplo: JSONPlaceholder (simula a criação de um post)
const API_URL = 'https://prtctec.com.br/api/produto'; 

export default function ProdutoCreate() {
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  
  // 1. Estado para armazenar os dados do formulário
  const [produto, setProduto] = useState<Produto>({
    id: 0,
    nome: '',
    preco: 0,
  });

  // Função para atualizar os campos do formulário
  const handleChange = (name: keyof Produto, value: string | number) => {
    setProduto(prev => ({ ...prev, [name]: value }));
  };

  const handlePost = async () => {
    Keyboard.dismiss(); // Fecha o teclado ao enviar
    setLoading(true);
    setResponseMessage('');

    // Validação básica
    if (produto.nome ==='' || produto.preco <= 0) {
      setResponseMessage('Erro: Nome e preço são obrigatórios!');
      setLoading(false);
      return;
    }

    try {
      // 2. Envio do POST com os dados do estado
      const response = await axios.post(API_URL, produto);

      const jsonResponse = response.data;

      setResponseMessage('Produto criado');
       
      // Opcional: Limpar o formulário após o sucesso
      setProduto({ id: 0,    nome: '',    preco: 0, });

    } catch (error: any) {
      let errorMessage = '';
      
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = `Falha! Status: ${error.response.status}. Tente novamente.`;
      } else if (axios.isAxiosError(error) && error.request) {
        errorMessage = 'Falha de Rede: Verifique sua conexão.';
      } else {
        errorMessage = `Erro: ${error.message}`;
      }

      setResponseMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Permite tocar fora do TextInput para fechar o teclado
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>Novo Produto</Text>

        <TextInput
          style={styles.input}
          placeholder="Nome do Produto"
          value={produto.nome}
          onChangeText={(text) => handleChange('nome', text)}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Preço do Produto"
          value={produto.preco !== null ? String(produto.preco) : ''}
          onChangeText={(text) => handleChange('preco', parseFloat(text) || 0)}
          keyboardType="numeric"
        />
        
        <Button
          title={loading ? "Enviando..." : "Criar novo Produto"}
          onPress={handlePost}
          disabled={loading}
          color="#1e90ff"
        />
        
        {loading && <ActivityIndicator size="large" color="#1e90ff" style={styles.loading} />}
        
        <Text style={styles.message}>{responseMessage}</Text>
        
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  loading: {
    marginTop: 20,
  },
  message: {
      marginTop: 20,
      textAlign: 'center',
      color: 'red',
  },
});