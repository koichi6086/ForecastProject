import store from './store'
import React, {Component} from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';
import WeatherMenu from './WeatherMenu';
import WeatherDetail from './WeatherDetail';

const Stack = createStackNavigator();

function TopLevelNavigator() {
    return(
        <Stack.Navigator initialRouteName="WeatherMenu" screenOptions={{cardStyle: { backgroundColor: 'white' }}}>
            <Stack.Screen name="WeatherMenu" component={WeatherMenu} />
            <Stack.Screen name="WeatherDetail" component={WeatherDetail} />
        </Stack.Navigator>
    )
}

export default class App extends Component {
    render(){
        return(
            <NavigationContainer><TopLevelNavigator /></NavigationContainer>
        )
    }
}