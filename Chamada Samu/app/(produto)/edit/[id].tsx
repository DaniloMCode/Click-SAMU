import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, Keyboard, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import { Produto } from '../../../.expo/types/produto';

// URL da API
const API_URL = 'https://prtctec.com.br/api/produto'; 

export default function ProdutoEdit() {
  // 🔑 Obtém o ID do produto da URL (Ex: /(produto)/edit/123)
  const params = useLocalSearchParams();
  const produtoId = params.id;

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [responseMessage, setResponseMessage] = useState('');
  
  const [produto, setProduto] = useState<Produto>({
    id: 0,
    nome: '',
    preco: 0,
  });

  // Função para carregar os dados do produto existente
  useEffect(() => {
    if (!produtoId) {
      setInitialLoading(false);
      setResponseMessage('Erro: ID do produto não fornecido.');
      return;
    }

    const consulta = async () => {
      try {
        setInitialLoading(true);
        // Obter os dados atuais do produto
        const response = await axios.get(`${API_URL}/${produtoId}`); 
        
        // 🔑 Preenche o estado com os dados da API
        setProduto(response.data); 
      } catch (error) {
        setResponseMessage('Erro ao carregar dados do produto.');
      } finally {
        setInitialLoading(false);
      }
    };

    consulta();
  }, [produtoId]); // executa a função quando o produtoId mudar

  // Função para atualizar os campos do formulário
  const handleChange = (name: keyof Produto, value: string | number) => {
    setProduto(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    Keyboard.dismiss(); 
    setLoading(true);
    setResponseMessage('');

    // Validação básica
    if (produto.nome === '' || produto.preco <= 0) {
      setResponseMessage('Erro: Nome e preço são obrigatórios!');
      setLoading(false);
      return;
    }

    try {
      // Requisito PUT para atualizar o produto
      // ID do produto é passado na URL
      const response = await axios.put(`${API_URL}/${produtoId}`, produto);
      
      setResponseMessage('Produto atualizado com sucesso!');
    } catch (error: any) {
      let errorMessage = '';
      
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = `Falha! Status: ${error.response.status}. Detalhe: ${error.response.data?.message || 'Tente novamente.'}`;
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

  if (initialLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1e90ff" />
        <Text style={styles.loadingText}>Carregando dados...</Text>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>Editar Produto (ID: {produtoId})</Text>

        <TextInput
          style={styles.input}
          placeholder="Nome do Produto"
          value={produto.nome}
          onChangeText={(text) => handleChange('nome', text)}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Preço do Produto"
          // Converte o número do estado para string para o TextInput
          value={produto.preco !== null ? String(produto.preco) : ''}
          onChangeText={(text) => handleChange('preco', parseFloat(text) || 0)}
          keyboardType="numeric"
        />
        
        <Button
          title={loading ? "Alterando..." : "Salvar Alterações"}
          onPress={handleUpdate}
          disabled={loading}
          color="#1e90ff"
        />
        
        {loading && <ActivityIndicator size="small" color="#1e90ff" style={styles.loading} />}
        
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
  loadingText: {
    textAlign: 'center',
    marginTop: 10,
  },
  message: {
      marginTop: 20,
      textAlign: 'center',
      color: 'red',
  }
});