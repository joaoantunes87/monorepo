import React from 'react';
import {SafeAreaView, ScrollView, StatusBar} from 'react-native';

import {allBooks} from '@mr/utils';
import {IBook} from '@mr/types';
import {BookCard} from '@mr/ui-mobile';

const App = () => {
  const books = allBooks();
  console.log('Books: ', books);
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          {allBooks().map(function renderBook(book: IBook): JSX.Element {
            return <BookCard key={book.id} book={book} />;
          })}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default App;
