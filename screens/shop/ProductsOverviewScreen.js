import React from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { useSelector } from 'react-redux';

const ProductsOverviewScreen = props => {
  const products = useSelector(state => state.products.availableProducts);
  return (
    <FlatList
      data={products}
      key={products.id}
      renderItem={itemData => <Text>{itemData.item.title}</Text>}
    />
  );
};

ProductsOverviewScreen.navigationOptions = {
  headerTitle: 'All Products',
};

const styles = StyleSheet.create({});

export default ProductsOverviewScreen;
