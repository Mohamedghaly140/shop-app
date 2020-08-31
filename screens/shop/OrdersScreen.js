import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Platform,
  ActivityIndicator,
  Button,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';
import OrderItem from '../../components/shop/OrderItem';
import Colors from '../../constants/Color';
import * as orderActions from '../../store/actions/orders';

const OrdersScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const orders = useSelector(state => state.orders.orders);
  const dispatch = useDispatch();

  const fetchOrders = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(orderActions.fetchOrders());
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    fetchOrders();
  }, [dispatch]);

  useEffect(() => {
    const willFocusSub = props.navigation.addListener('willFocus', fetchOrders);

    return () => {
      willFocusSub.remove();
    };
  }, [fetchOrders]);

  if (isLoading) {
    return (
      <View style={styles.centred}>
        <ActivityIndicator size='large' color={Colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centred}>
        <Text>An error ocurred!</Text>
        <Button
          title='try again'
          color={Colors.primary}
          onPress={fetchOrders}
        />
      </View>
    );
  }

  return (
    <FlatList
      data={orders}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <OrderItem
          amount={item.totalAmount}
          date={item.readableDate}
          items={item.items}
        />
      )}
    />
  );
};

OrdersScreen.navigationOptions = navData => {
  return {
    headerTitle: 'Your Orders',
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
  };
};

const styles = StyleSheet.create({
  centred: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default OrdersScreen;
