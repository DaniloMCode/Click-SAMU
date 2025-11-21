import axios from 'axios'; // usado para requisições HTTP interagindo com a API
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native';
import { Produto } from '../../../.expo/types/produto';

// URL da API
const API_URL = 'https://prtctec.com.br/api/produto'; 

export default function ProdutoDelete() {
  // 🔑 Obtém o ID do produto da URL (Ex: /(produto)/edit/123)
  const params = useLocalSearchParams();
  const produtoId = params.id;

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

   const handleDelete = async () => {
    setResponseMessage('');

    try {
      // Requisito Delete para excluir o produto
      // ID do produto é passado na URL
      const response = await axios.delete(`${API_URL}/${produtoId}`);
      
      setResponseMessage('Produto excluído');
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
      // algum tratamento final se necessário
    }
  };

  if (initialLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1e90ff" />
        <Text style={styles.loadingText}>Carregando produto...</Text>
      </View>
    );
  }

  return (
      <View style={styles.container}>
        <Text style={styles.title}>Excluir Produto (ID: {produtoId})</Text>
        <Text style={styles.title}>{produto.nome}</Text>
        <Text style={styles.title}>Preço: {
          new Intl.NumberFormat('pt-BR', {
            style: 'currency',   // Define o estilo como moeda
            currency: 'BRL',     // Define a moeda como Real Brasileiro
          }).format(produto.preco)
        }
        </Text>
        
        <Button
          title={"Excluir Produto"}
          onPress={handleDelete}
          color="#ff2222"
        />
               
        <Text style={styles.message}>{responseMessage}</Text>
        
      </View>
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