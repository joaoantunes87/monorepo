import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View,
  Pressable,
} from 'react-native';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {allBooks} from '@mr/utils';
import {IBook} from '@mr/types';
import {BookCard} from '@mr/ui-shared';

function HomeScreen() {
  const {navigate} = useNavigation();

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Pressable
        onPress={() => {
          navigate('Books');
        }}>
        <Text>Go to Books</Text>
      </Pressable>
    </View>
  );
}

const Books = () => {
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      {allBooks().map(function renderBook(book: IBook): JSX.Element {
        return <BookCard key={book.id} book={book} />;
      })}
    </ScrollView>
  );
};

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Books" component={Books} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
