import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Button, Image, ScrollView, Text, View } from 'react-native';
import { Container } from '../components/ui';

export default function DetailsScreen({ route }) {
  const { launch } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    (async () => {
      const user = await AsyncStorage.getItem('userAtivo');
      const stored = await AsyncStorage.getItem(`favoritos_${user}`);
      const parsed = stored ? JSON.parse(stored) : [];
      setIsFavorite(parsed.some((item) => item.id === launch.id));
    })();
  }, [launch]);

  const toggleFavorite = async () => {
    const user = await AsyncStorage.getItem('userAtivo');
    const stored = await AsyncStorage.getItem(`favoritos_${user}`);
    let parsed = stored ? JSON.parse(stored) : [];

    if (isFavorite) {
      parsed = parsed.filter((item) => item.id !== launch.id);
    } else {
      parsed.push(launch);
    }

    await AsyncStorage.setItem(`favoritos_${user}`, JSON.stringify(parsed));
    setIsFavorite(!isFavorite);
  };

  return (
    <ScrollView style={{ backgroundColor: '#000' }}>
      <Container>
        {launch.image ? (
          <Image
            source={{ uri: launch.image }}
            style={{ width: '100%', height: 220, borderRadius: 10, marginBottom: 20 }}
            resizeMode="cover"
          />
        ) : null}

        <Text style={{ color: '#fff', fontSize: 24 }}>{launch.name}</Text>
        <Text style={{ color: '#ccc' }}>
          Data: {launch.date ? new Date(launch.date).toLocaleString() : 'indisponível'}
        </Text>
        {launch.rocket ? <Text style={{ color: '#ccc' }}>Foguete: {launch.rocket}</Text> : null}
        {launch.launchpad ? <Text style={{ color: '#ccc' }}>Local: {launch.launchpad}</Text> : null}

        <Text style={{ color: '#ccc', marginTop: 10 }}>
          {launch.details || 'Sem descrição da missão.'}
        </Text>

        <View style={{ marginTop: 20 }}>
          <Button
            title={isFavorite ? 'Remover dos Favoritos' : 'Salvar como Favorito'}
            onPress={toggleFavorite}
          />
        </View>
      </Container>
    </ScrollView>
  );
}
