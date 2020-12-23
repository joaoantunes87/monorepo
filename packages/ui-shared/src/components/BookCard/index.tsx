import React from 'react';
import { View, Text } from 'react-native';

export default function BookCard({ book }: { book: any }) {
  return (
    <View>
      <Text>{book.title}</Text>
      <Text>{book.author}</Text>
      <Text>{book.tag}</Text>
    </View>
  );
}
