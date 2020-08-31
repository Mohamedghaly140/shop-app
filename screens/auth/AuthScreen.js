import React from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Button,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import Card from '../../components/UI/Card';
import Input from '../../components/UI/Input';
import Colors from '../../constants/Color';

const AuthScreen = props => {
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
                errorMessage='Please enter a valid email address.'
                onInputChange={() => {}}
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
                errorMessage='Please enter a valid password.'
                onInputChange={() => {}}
                initialValue=''
              />
              <View style={styles.btnContainer}>
                <Button
                  title='Login'
                  color={Colors.primary}
                  onPress={() => {}}
                />
              </View>
              <View style={styles.btnContainer}>
                <Button
                  title='Switch to Sign Up'
                  color={Colors.accent}
                  onPress={() => {}}
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
