import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Button, FlatList, Image, Text, View } from 'react-native';
import { Card, CardTitle, Container, Input } from '../components/ui';
import { getLaunches } from '../services/spacex';
import { colors } from '../styles/colors';

export default function HomeScreen({ navigation }) {
  const [launches, setLaunches] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await getLaunches();
        setLaunches(data);
      } catch (e) {
        console.error(e);
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const logout = async () => {
    await AsyncStorage.removeItem('userAtivo');
    navigation.replace('Login');
  };

  const filtered = launches.filter((item) =>
    item.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container>
      <Input placeholder="Buscar missão" placeholderTextColor="#888" value={search} onChangeText={setSearch} />
      <View style={{ marginBottom: 10 }}>
        <Button title="Ver Favoritos" onPress={() => navigation.navigate('Favoritos')} />
      </View>
      <View style={{ marginBottom: 10 }}>
        <Button title="Sair" color={colors.danger} onPress={logout} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card onPress={() => navigation.navigate('Detalhes', { launch: item })}>
              {item.image ? (
                <Image
                  source={{ uri: item.image }}
                  style={{ width: '100%', height: 140, borderRadius: 8, marginBottom: 10 }}
                  resizeMode="cover"
                />
              ) : null}
              <CardTitle>{item.name}</CardTitle>
              <Text style={{ color: '#ccc' }}>
                {item.date ? new Date(item.date).toLocaleString() : 'Data indisponível'}
              </Text>
            </Card>
          )}
          ListEmptyComponent={
            <Text style={{ color: '#777', marginTop: 10 }}>
              {error
                ? 'Não foi possível carregar os lançamentos agora. Tente de novo em alguns minutos.'
                : 'Nenhuma missão encontrada.'}
            </Text>
          }
        />
      )}
    </Container>
  );
}
