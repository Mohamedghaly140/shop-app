import React from 'react';
import { FlatList, Platform, Button } from 'react-native';
import { useSelector } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';
import ProductItem from '../../components/shop/ProductItem';
import Colors from '../../constants/Color';

const UserProductsScreen = props => {
  const userProducts = useSelector(state => state.products.userProducts);

  const editProductHandler = id => {
    props.navigation.navigate('EditProduct', { productId: id });
  };

  return (
    <FlatList
      data={userProducts}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <ProductItem
          image={item.imageUrl}
          title={item.title}
          price={item.price}
          onSelect={() => {}}
        >
          <Button
            title='Edit'
            color={Colors.primary}
            onPress={() => {
              editProductHandler(item.id);
            }}
          />
          <Button title='Delete' color={Colors.primary} onPress={() => {}} />
        </ProductItem>
      )}
    />
  );
};

UserProductsScreen.navigationOptions = navData => {
  return {
    headerTitle: 'Your Products',
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title='Menu'
          iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title='Menu'
          iconName={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
          onPress={() => {
            navData.navigation.navigate('EditProduct');
          }}
        />
      </HeaderButtons>
    ),
  };
};

export default UserProductsScreen;
