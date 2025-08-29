import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CadastroScreen from '../screens/CadastroScreen';
import DetailsScreen from '../screens/DetailsScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';

const Stack = createNativeStackNavigator();

export default function Navigation() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Cadastro" component={CadastroScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Lançamentos SpaceX', headerStyle: { backgroundColor: '#000' }, headerTintColor: '#fff' }}
      />
      <Stack.Screen
        name="Detalhes"
        component={DetailsScreen}
        options={{ title: 'Detalhes da Missão', headerStyle: { backgroundColor: '#000' }, headerTintColor: '#fff' }}
      />
      <Stack.Screen
        name="Favoritos"
        component={FavoritesScreen}
        options={{ title: 'Favoritos', headerStyle: { backgroundColor: '#000' }, headerTintColor: '#fff' }}
      />
    </Stack.Navigator>
  );
}
