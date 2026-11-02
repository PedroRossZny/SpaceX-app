import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, Image, ScrollView, Text, View } from 'react-native';
import { Container } from '../components/ui';
import { getLaunchpad, getRocket } from '../services/spacex';

export default function DetailsScreen({ route }) {
  const { launch } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);
  const [rocket, setRocket] = useState(null);
  const [launchpad, setLaunchpad] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const user = await AsyncStorage.getItem('userAtivo');
      const stored = await AsyncStorage.getItem(`favoritos_${user}`);
      const parsed = stored ? JSON.parse(stored) : [];
      setIsFavorite(parsed.some((item) => item.id === launch.id));
    })();
    (async () => {
      try {
        const [r, p] = await Promise.all([
          getRocket(launch.rocket),
          getLaunchpad(launch.launchpad),
        ]);
        setRocket(r);
        setLaunchpad(p);
      } catch (e) {
        console.error('Erro ao carregar detalhes:', e);
        Alert.alert('Erro', 'Não foi possível carregar detalhes agora.');
      } finally {
        setLoading(false);
      }
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
        {launch.links?.patch?.small ? (
          <Image
            source={{ uri: launch.links.patch.small }}
            style={{ width: 150, height: 150, alignSelf: 'center', marginBottom: 20 }}
            resizeMode="contain"
          />
        ) : null}

        <Text style={{ color: '#fff', fontSize: 24 }}>{launch.name}</Text>
        <Text style={{ color: '#ccc' }}>
          Data: {launch.date_utc ? new Date(launch.date_utc).toLocaleString() : '—'}
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />
        ) : (
          <>
            {rocket && <Text style={{ color: '#ccc' }}>Foguete: {rocket.name}</Text>}
            {launchpad && <Text style={{ color: '#ccc' }}>Local: {launchpad.name}</Text>}
          </>
        )}

        <Text style={{ color: '#ccc', marginTop: 10 }}>
          {launch.details || 'Sem detalhes fornecidos pela SpaceX.'}
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
