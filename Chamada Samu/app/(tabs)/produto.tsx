import axios, { AxiosError, isAxiosError } from 'axios'; // Importa a biblioteca Axios
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { Produto } from '../../.expo/types/produto';

// URL da API pública de exemplo
const API_URL = 'https://prtctec.com.br/api/produto';

export default function ProdutoTab() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
    async function consulta ()  {
      try {
        // 1. Faz a requisição GET usando axios.get()
        const resposta = await axios.get(API_URL);

        // 2. O Axios já trata a resposta e o JSON; os dados estão em 'response.data'
        setProdutos(resposta.data);
      } catch (e : AxiosError | any) {
        // 3. Captura erros (de rede, 4xx, 5xx)
        console.error('Erro ao buscar usuários:', e);
        
        if (isAxiosError(e)) {
          if (e.response) {
              // Erro de resposta (status code fora de 2xx)
              setError(`Erro: ${e.response.status} - ${e.response.statusText}`);
          } else {
              // Outros erros (rede, timeout, etc.)
              setError(e.message);
          }
        }
      } finally {
        // 4. Finaliza o estado de carregamento
        setLoading(false);
      }
    };

    consulta();
  }, []));

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Carregando produtos ...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Falha na Requisição</Text>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Button title="Criar Novo Produto" onPress={() => router.push('/(produto)/create')} />
      <Text style={styles.header}>Produtos</Text>
      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.produtoItem}>
            <Text style={styles.name}>{item.nome}</Text>
            <Text>Preço: {
              new Intl.NumberFormat('pt-BR', {
                style: 'currency',   // Define o estilo como moeda
                currency: 'BRL',     // Define a moeda como Real Brasileiro
              }).format(item.preco)
            }
            </Text>
            <Button
              title="Editar"
              onPress={() => router.push(`/(produto)/edit/${item.id}`)}
              color="#1e90ff"
            />
            <Button
              title="Excluir"
              onPress={() => router.push(`/(produto)/delete/${item.id}`)}
              color="#ff2222"
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 15,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 10,
    textAlign: 'center',
  },
  produtoItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  }
});