import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { Alert, Button, Text, View } from 'react-native';
import { Container, Input } from '../components/ui';

export default function LoginScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');

  const login = async () => {
    const data = await AsyncStorage.getItem('usuarios');
    const usuarios = data ? JSON.parse(data) : [];
    const user = usuarios.find((u) => u.nome === nome && u.senha === senha);

    if (user) {
      await AsyncStorage.setItem('userAtivo', nome);
      navigation.replace('Home');
    } else {
      Alert.alert('Erro', 'Usuário ou senha incorretos');
    }
  };

  return (
    <Container>
      <Text style={{ color: '#fff', fontSize: 24, marginBottom: 20 }}>Login</Text>
      <Input placeholder="Nome" placeholderTextColor="#888" value={nome} onChangeText={setNome} />
      <Input placeholder="Senha" placeholderTextColor="#888" secureTextEntry value={senha} onChangeText={setSenha} />
      <View style={{ marginBottom: 10 }}>
        <Button title="Entrar" onPress={login} />
      </View>
      <Button title="Criar nova conta" onPress={() => navigation.replace('Cadastro')} />
    </Container>
  );
}
