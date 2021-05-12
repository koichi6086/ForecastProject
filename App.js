import React from 'react';
import { View, Text } from 'react-native';
import { Provider } from 'react-redux';
import store from './store';
import AppNavigator from './AppNavigator';
import { enableScreens } from 'react-native-screens';

const App = () => {

  enableScreens();

  return(
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  )
};

export default App;