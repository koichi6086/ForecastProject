import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, PermissionsAndroid, Image, TouchableOpacity, FlatList, Alert } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import _ from 'lodash';
import moment from 'moment';
import { updateWeather, updateLocation } from './actions';

function DailyItem({item, index, props}){
    
    return(
        <View style={{margin: 10}}>
            <Text style={{marginVertical: 5}}>Day {index}</Text>
            <TouchableOpacity style={[styles.shadow, {padding: 10, backgroundColor: 'white'}]} onPress={(index > 4) ? ()=>{alert("Only 5 days were allowed on the api call.")} : ()=>{props.navigation.navigate("WeatherDetail"); props.updateWeather(item)}}>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Image source={{uri: `http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}} style={{height: 80, width: 80}} />
                        <View style={{marginHorizontal: 5}}>
                            <Text style={{fontWeight: 'bold'}}>{item.temp.max} °F</Text>
                            <Text>{item.weather[0].main}</Text>
                            <Text>{moment.unix(item.dt).format("MMMM DD")}</Text>
                        </View>
                    </View>
                    <Icon name="caret-forward" size={20} style={{marginRight: 10}} />
                </View>
            </TouchableOpacity>
        </View>

    )
}

const App = (props) => {

    const [longitude, setLongitude] = useState(0);
    const [latitude, setLatitude] = useState(0);
    const [permissions, setPermissions] = useState(false);
    const [weatherData, setWeatherData] = useState(null);

    const requestLocationPermissions = async() => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: "Forecast App Location Permission",
                    message: "Forecast App needs access to your location" + "to tell you the forecast in your current location.",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                setPermissions(true);
                console.log("you can use the gps");
            } else {
                console.log("Location Permissions denied");
            }
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(()=>{
        requestLocationPermissions();
    }, [])

    useEffect(()=>{
        if(permissions === true)
        {
            Geolocation.getCurrentPosition(info => {setLatitude(info.coords.latitude); setLongitude(info.coords.longitude); props.updateLocation({latitude: info.coords.latitude, longitude: info.coords.longitude})})
        }
    }, [permissions])

    const getData = () => {
        axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=181c98ab1c1b3dcc7bbea192a5605383`)
        .then((res)=>{
            return setWeatherData(res.data);
        })
        .catch((err)=>{
            return err;
        })
    }

    useEffect(()=>{
        if(longitude !== 0 && latitude !== 0)
        {
            getData();
        }
    }, [longitude])

    useEffect(()=>{
        if(weatherData !== null)
        {
            console.log("awefasd", weatherData.current)
        }
    }, [weatherData])
    


    return(
        <View style={{padding: 20, height: '100%'}}>
            {
                weatherData !== null ?
                <>
                    <Text style={{fontWeight: 'bold', fontSize: 16, margin: 10}}>Current Weather</Text>
                    <View style={[styles.shadow, {padding: 10, marginHorizontal: 50, backgroundColor: 'white'}]}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Image source={{uri: `http://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@2x.png`}} style={{height: 80, width: 80}} />
                            <View style={{marginHorizontal: 5}}>
                                <Text style={{fontWeight: 'bold'}}>{weatherData.current.temp} °F</Text>
                                <Text>{weatherData.current.weather[0].main}</Text>
                                <Text>{moment.unix(weatherData.current.dt).format("MMMM DD")}</Text>
                            </View>
                        </View>
                    </View>
                    <Text style={{fontWeight: 'bold', margin: 10}}>Weekly Weather</Text>
                    <FlatList 
                    data={weatherData.daily}
                    keyExtractor={(item, index) => item + index}
                    scrollEnabled={true}
                    renderItem={({item, index})=>{
                        if(index > 0)
                        {
                            return(
                                <DailyItem item={item} index={index} props={props} />
                            )
                        }
                        return null
                    }}
                    />
                </>
                :
                <>
                    <View style={[styles.shadow, {padding: 10, marginHorizontal: 50, backgroundColor: 'white'}]}>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{height: 50, width: 50, backgroundColor: 'grey'}} />
                            <View style={{marginHorizontal: 5}}>
                                <Text style={{fontWeight: 'bold'}}>Temperature</Text>
                                <Text>Weather</Text>
                                <Text>Date</Text>
                            </View>
                        </View>
                    </View>
                </>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        
        elevation: 5,
    }
});

function mapStateToProps(state) {
    return {
        weather: state.weather.weather,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        updateWeather,
        updateLocation
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(App);