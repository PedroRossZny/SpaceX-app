import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { FlatList, Text } from 'react-native';
import { Card, CardTitle, Container } from '../components/ui';
import { fromStorage } from '../services/spacex';

export default function FavoritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadFavorites);
    return unsubscribe;
  }, [navigation]);

  const loadFavorites = async () => {
    const user = await AsyncStorage.getItem('userAtivo');
    const stored = await AsyncStorage.getItem(`favoritos_${user}`);
    const parsed = stored ? JSON.parse(stored) : [];
    setFavorites(parsed.map(fromStorage));
  };

  return (
    <Container>
      <Text style={{ color: '#fff', fontSize: 24, marginBottom: 10 }}>Favoritos</Text>

      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card onPress={() => navigation.navigate('Detalhes', { launch: item })}>
            <CardTitle>{item.name}</CardTitle>
            <Text style={{ color: '#ccc' }}>
              {item.date ? new Date(item.date).toLocaleString() : 'Data indisponível'}
            </Text>
          </Card>
        )}
        ListEmptyComponent={
          <Text style={{ color: '#777', marginTop: 10 }}>Sem favoritos por enquanto.</Text>
        }
      />
    </Container>
  );
}
