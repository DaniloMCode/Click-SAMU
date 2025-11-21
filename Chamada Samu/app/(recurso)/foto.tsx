import { CameraCapturedPicture, CameraPictureOptions, CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Alert, Button, Image, StyleSheet, Text, View } from 'react-native';

// Importe o tipo correto para a referência do componente CameraView
type CameraViewRef = React.ComponentRef<typeof CameraView>;

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  
  // Referência para o componente CameraView
  const cameraRef = useRef<CameraViewRef>(null); 
    
  // Estado para armazenar o URI da foto
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [photoBase64,setPhotoBase64] = useState<string | null>(null);

  async function tirarFoto() {
    if (cameraRef.current) {
      try {
          const options: CameraPictureOptions = {
              quality: 0.9, // Qualidade da imagem
              base64: true, // Gerar foto convertida para string base64
          };
          
          // Chamada do método nativo de captura
          const photo: CameraCapturedPicture = await cameraRef.current.takePictureAsync(options);
          
          // Armazena o URI da foto
          setPhotoUri(photo.uri);
          // Armazena base64 da foto
          if(photo.base64) {
            setPhotoBase64(photo.base64);
          } else {
            setPhotoBase64("Não gerado");
          }
          
          // Mostra um alerta simples com o URI (para debug)
          Alert.alert("Foto Capturada!", photo.uri);

      } catch (error) {
          Alert.alert("Erro", "Não foi possível tirar a foto.");
      }
    } else {
      Alert.alert("Erro", "Câmera não está pronta.");
    }
  }

  if (!permission) {
      // Carregando status da permissão
      return (
          <View style={styles.containerCenter}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.text}>Verificando permissões...</Text>
          </View>
      );
  }

  if (!permission.granted) {
      // Permissão negada ou não solicitada
      return (
          <View style={styles.containerCenter}>
              <Text style={styles.textPermissionDenied}>Acesso à câmera é necessário!</Text>
              <Button onPress={requestPermission} title="Conceder Permissão" color="#FF9800"/>
          </View>
      );
  }
  
  return (
    <View style={{flex:1}}>
      <View style={{minHeight:'50%'}}>     
        <Button title="Voltar" onPress={() => router.replace('/(tabs)/explore')} />
        <CameraView
            style={{flex:1}}
            facing="back" // ou "front" para a câmera frontal
            ref={cameraRef}
        ></CameraView>
        <Button
            onPress={tirarFoto} 
            title="Tirar Foto"
            color="#007AFF"
        />
      </View>
      
      {/* Opcional: Mostrar o URI da foto capturada */}
      {photoUri && photoBase64 && (
          <View style={{minHeight:'45%'}}>
              <Text style={{textAlign:'center'}}>Foto URI: {photoUri.substring(0, 40)}...</Text>
              <Text style={{textAlign:'center'}}>Base64: {photoBase64.substring(0, 40)}...</Text>
              <Image source={{ uri: photoUri }} style={{flex:1}} />
              <Button
                  title="Nova Foto" 
                  onPress={() => setPhotoUri(null)}
                  color="#FF6347"
              />
          </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
    containerCenter: {
        flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f5f5f5',
    },
    text: { fontSize: 16, marginBottom: 10, textAlign: 'center', color: '#333' },
    textPermissionDenied: { 
        fontSize: 18, 
        color: 'red', 
        marginBottom: 15, 
        fontWeight: 'bold' 
    },
});
