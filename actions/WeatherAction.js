import {
    UPDATE_WEATHER,
    UPDATE_LOCATION
} from './types';

export const updateWeather = (payload) => {
    return (dispatch) => {
        dispatch({ type: UPDATE_WEATHER, payload })
    }
}

export const updateLocation = (payload) => {
    return (dispatch) => {
        dispatch({ type: UPDATE_LOCATION, payload })
    }
}