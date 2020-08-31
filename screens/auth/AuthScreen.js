import React, { useState, useEffect, useCallback, useReducer } from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Button,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch } from 'react-redux';

import Card from '../../components/UI/Card';
import Input from '../../components/UI/Input';
import Colors from '../../constants/Color';
import * as authActions from '../../store/actions/auth';

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

const AuthScreen = props => {
  const [isSignup, setIsSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: '',
      password: '',
    },
    inputValidities: {
      email: false,
      password: false,
    },
    formIsValid: false,
  });

  useEffect(() => {
    if (error) {
      Alert.alert('An Error Occurred!', error, [
        { text: 'Okay', style: 'destructive' },
      ]);
    }
  }, [error]);

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

  const authHandler = async () => {
    let action;
    if (isSignup) {
      action = authActions.signup(
        formState.inputValues.email,
        formState.inputValues.password
      );
    } else {
      action = authActions.login(
        formState.inputValues.email,
        formState.inputValues.password
      );
    }
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(action);
      props.navigation.navigate('Shop');
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <KeyboardAvoidingView
        style={styles.screen}
        keyboardVerticalOffset={50}
        behavior='padding'
      >
        <LinearGradient colors={['#ffedff', '#ffe3dd']} style={styles.gradient}>
          <Card style={styles.authContainer}>
            <ScrollView>
              <Input
                id='email'
                label='E-Mail'
                placeholder='Email Address'
                keyboardType='email-address'
                required
                email
                autoCapitalize='none'
                errorText='Please enter a valid email address.'
                onInputChange={inputChangeHandler}
                initialValue=''
              />
              <Input
                id='password'
                label='Password'
                placeholder='Password'
                keyboardType='default'
                secureTextEntry
                required
                minLength={6}
                autoCapitalize='none'
                errorText='Please enter a valid password.'
                onInputChange={inputChangeHandler}
                initialValue=''
              />
              <View style={styles.btnContainer}>
                {isLoading ? (
                  <ActivityIndicator size='small' color={Colors.primary} />
                ) : (
                  <Button
                    title={isSignup ? 'Sign Up' : 'Login'}
                    color={Colors.primary}
                    onPress={authHandler}
                  />
                )}
              </View>
              <View style={styles.btnContainer}>
                <Button
                  title={`Switch to ${isSignup ? 'Login' : 'Sign Up'}`}
                  color={Colors.accent}
                  onPress={() => {
                    setIsSignup(prevState => !prevState);
                  }}
                />
              </View>
            </ScrollView>
          </Card>
        </LinearGradient>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

AuthScreen.navigationOptions = {
  headerTitle: 'Authenticate',
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  authContainer: {
    width: '85%',
    paddingVertical: '8%',
    paddingHorizontal: '5%',
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnContainer: {
    marginTop: 10,
  },
});

export default AuthScreen;
