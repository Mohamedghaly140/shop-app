import React, { useState, useCallback, useEffect, useReducer } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';
import * as productsActions from '../../store/actions/products';
import Input from '../../components/UI/Input';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      inputValues: updatedValues,
      inputValidities: updatedValidities,
      formIsValid: updatedFormIsValid,
    };
  }
  return state;
};

const EditProductScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const prodId = props.navigation.getParam('productId');
  const editProduct = useSelector(state =>
    state.products.userProducts.find(prod => prod.id === prodId)
  );
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      title: editProduct ? editProduct.title : '',
      imageUrl: editProduct ? editProduct.imageUrl : '',
      description: editProduct ? editProduct.description : '',
      price: '',
    },
    inputValidities: {
      title: editProduct ? true : false,
      imageUrl: editProduct ? true : false,
      description: editProduct ? true : false,
      price: editProduct ? true : false,
    },
    formIsValid: editProduct ? true : false,
  });

  useEffect(() => {
    if (error) {
      Alert.alert('An error occurred', error, [
        { text: 'Dissmise', style: 'cancel' },
      ]);
    }
    return () => {
      cleanup;
    };
  }, [input]);

  const submitHandler = useCallback(async () => {
    if (!formState.formIsValid) {
      Alert.alert('Wrong Inputs!', 'Please check the fields in the form', [
        { text: 'Okay' },
      ]);
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      if (editProduct) {
        await dispatch(
          productsActions.updateProduct(
            prodId,
            formState.inputValues.title,
            formState.inputValues.description,
            formState.inputValues.imageUrl
          )
        );
      } else {
        await dispatch(
          productsActions.createProduct(
            formState.inputValues.title,
            formState.inputValues.description,
            formState.inputValues.imageUrl,
            +formState.inputValues.price
          )
        );
      }
      props.navigation.goBack();
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  }, [dispatch, prodId, formState]);

  useEffect(() => {
    props.navigation.setParams({ submit: submitHandler });
  }, [submitHandler]);

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier,
      });
    },
    [dispatchFormState]
  );

  if (isLoading) {
    return (
      <View style={styles.centred}>
        <ActivityIndicator size='large' color={Colors.primary} />
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <KeyboardAvoidingView
        behavior='padding'
        keyboardVerticalOffset={100}
        style={{ flex: 1 }}
      >
        <ScrollView style={styles.screen}>
          <View style={styles.form}>
            <Input
              id='title'
              label='Title'
              errorText='Please enter a valid title'
              keyboardType='default'
              autoCapitalize='sentences'
              autoCorrect
              returnKeyType='next'
              onInputChange={inputChangeHandler}
              initialValue={editProduct ? editProduct.title : ''}
              initiallyValid={!!editProduct}
              required
            />
            <Input
              id='imageUrl'
              label='Image URL'
              errorText='Please enter a valid image URL'
              keyboardType='default'
              returnKeyType='next'
              onInputChange={inputChangeHandler}
              initialValue={editProduct ? editProduct.imageUrl : ''}
              initiallyValid={!!editProduct}
              required
            />
            {editProduct ? null : (
              <Input
                id='price'
                label='Price'
                errorText='Please enter a valid price'
                keyboardType='decimal-pad'
                returnKeyType='next'
                onInputChange={inputChangeHandler}
                required
                min={0.1}
              />
            )}
            <Input
              id='description'
              label='Description'
              errorText='Please enter a valid description'
              keyboardType='default'
              returnKeyType='done'
              multiline
              numberOfLines={3}
              onInputChange={inputChangeHandler}
              initialValue={editProduct ? editProduct.description : ''}
              initiallyValid={!!editProduct}
              required
              minLength={10}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

EditProductScreen.navigationOptions = navData => {
  const submitFunc = navData.navigation.getParam('submit');
  return {
    headerTitle: navData.navigation.getParam('productId')
      ? 'Edit Product'
      : 'Add Product',
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title='Save'
          iconName={
            Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'
          }
          onPress={submitFunc}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  form: {
    margin: 20,
  },
  centred: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default EditProductScreen;
