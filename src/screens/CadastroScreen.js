import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { Alert, Button, Text, View } from 'react-native';
import { Container, Input } from '../components/ui';

export default function CadastroScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');

  const cadastrar = async () => {
    if (!nome || !senha) return Alert.alert('Erro', 'Preencha nome e senha');

    const data = await AsyncStorage.getItem('usuarios');
    const usuarios = data ? JSON.parse(data) : [];

    if (usuarios.find((u) => u.nome === nome)) {
      return Alert.alert('Erro', 'Nome de usuário já existe');
    }

    usuarios.push({ nome, senha });
    await AsyncStorage.setItem('usuarios', JSON.stringify(usuarios));
    Alert.alert('Sucesso', 'Usuário cadastrado!');
    navigation.replace('Login');
  };

  return (
    <Container>
      <Text style={{ color: '#fff', fontSize: 24, marginBottom: 20 }}>Cadastro</Text>
      <Input placeholder="Nome" placeholderTextColor="#888" value={nome} onChangeText={setNome} />
      <Input placeholder="Senha" placeholderTextColor="#888" secureTextEntry value={senha} onChangeText={setSenha} />
      <View style={{ marginBottom: 10 }}>
        <Button title="Cadastrar" onPress={cadastrar} />
      </View>
      <Button title="Ir para Login" onPress={() => navigation.replace('Login')} />
    </Container>
  );
}
