import {
    UPDATE_WEATHER,
    UPDATE_LOCATION
} from '../actions/types';

const INITIAL_STATE = {
    weather: null,
    location: { longitude: 0, latitude: 0 },
}

export default(state = INITIAL_STATE, action) => {
    switch(action.type){
        case UPDATE_WEATHER: 
        return {...state,
            weather: action.payload
        }
        case UPDATE_LOCATION:
        return {...state,
            location: action.payload
        }
        default: 
        return state;
    }
}