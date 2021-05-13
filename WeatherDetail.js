import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';
import moment from 'moment';

const App = (props) => {

    useEffect(()=>{
        props.navigation.setOptions({headerTitle: moment.unix(props.weather.dt).format("MMMM DD")})
    }, [])

    const [data, setData] = useState(null);

    const getData = () => {
        axios.get(`http://api.openweathermap.org/data/2.5/forecast?lat=60.99&lon=30.9&appid=181c98ab1c1b3dcc7bbea192a5605383`)
        .then((res)=>{
            let temp = [];
            for(let i = 0; i < res.data.list.length; i++)
            {
                if(moment.unix(res.data.list[i].dt).isBetween(moment.unix(props.weather.dt).hour(0).subtract(1, 'days'), moment.unix(props.weather.dt).hour(0).add(1, 'days'), 'day'))
                {
                    temp.push(res.data.list[i]);
                }
            }
            setData(temp);
        })
        .catch((err)=>{
            console.log("err", err)
        })
    }

    useEffect(()=>{
        getData();
    }, [])

    return (
        <View style={{padding: 20}}>
            <FlatList 
            data={data}
            keyExtractor={(item, index) => item + index}
            renderItem={({item, index})=>{
                return(
                    <View style={[styles.shadow, {backgroundColor: 'white', padding: 5, margin: 10}]}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Image source={{uri: `http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}} style={{height: 80, width: 80}} />
                            <View style={{marginHorizontal: 5}}>
                                <Text style={{fontWeight: 'bold'}}>{item.main.temp} °F</Text>
                                <Text>{item.weather[0].main}</Text>
                                <Text>{moment.unix(item.dt).format("h:mm A")}</Text>
                            </View>
                        </View>
                    </View>
                )
            }}
            />
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

function mapStateToProps(state){
    return{
        location: state.weather.location,
        weather: state.weather.weather
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({

    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(App);