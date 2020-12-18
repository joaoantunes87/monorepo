import React from 'react';
import {SafeAreaView, ScrollView, View, Text, StatusBar} from 'react-native';

import {allBooks} from '@mr/utils';
import {IBook} from '@mr/types';

const App = () => {
  const books = allBooks();
  console.log('Books: ', books);
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          {allBooks().map(function renderBook(book: IBook): JSX.Element {
            return (
              <View key={book.id}>
                <Text>{book.title}</Text>
                <Text>{book.author}</Text>
                <Text>{book.tag}</Text>
              </View>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default App;
