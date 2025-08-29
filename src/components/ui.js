import styled from 'styled-components/native';

export const Container = styled.SafeAreaView`
  flex: 1;
  padding: 20px;
  background-color: #000;
`;

export const Input = styled.TextInput`
  background-color: #222;
  color: #fff;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 8px;
`;

export const Card = styled.TouchableOpacity`
  background-color: #111;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 10px;
`;

export const CardTitle = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;
