import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CartItem = props => {
  const { quantity, title, amount, onRemove } = props;

  return (
    <View style={styles.cardItem}>
      <View style={styles.itemData}>
        <Text style={styles.quantity}>{quantity}</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.itemData}>
        <Text style={styles.amount}>{amount.toFixed(2)}</Text>
        <TouchableOpacity
          style={styles.deleteBtn}
          activeOpacity={0.7}
          onPress={onRemove}
        >
          <Ionicons
            name={Platform.OS === 'android' ? 'md-trash' : 'ios-trash'}
            size={23}
            color='red'
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardItem: {
    padding: 10,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemData: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantity: {
    fontFamily: 'open-sans',
    color: '#888',
    fontSize: 16,
  },
  title: {
    fontFamily: 'open-sans-bold',
    fontSize: 16,
    marginLeft: 5,
  },
  amount: {
    fontFamily: 'open-sans-bold',
    fontSize: 16,
  },
  deleteBtn: {
    marginLeft: 20,
  },
});

export default CartItem;
