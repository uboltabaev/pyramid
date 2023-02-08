import { SET_LAST_SCREEN_UPDATE, SET_IS_NET_CONNECTED, SET_FLASH_MESSAGE, HIDE_FLASH_MESSAGE } from '../constants/action-types';
import { Position } from '../../components/ui/flash_message';

const initialState = {
    isNetConnected: false,
    lastScreenUpdate: {
        screenName: null,
        status: null
    },
    flashMessage: {
        text: null,
        position: Position.BOTTOM,
        action: 'display',
        dateTime: null
    }
};

const mainReducer = (state = initialState, action) => {
    const dateTime = new Date();
    switch (action.type) {
        case SET_LAST_SCREEN_UPDATE:
            return {...state, lastScreenUpdate: action.payload}

        case SET_IS_NET_CONNECTED:
            return {...state, isNetConnected: action.payload}

        case SET_FLASH_MESSAGE:
            const { text, position } = action.payload
            return {...state, flashMessage: {
                text, 
                position, 
                action: 'display',
                dateTime: dateTime.valueOf()
            }}

        case HIDE_FLASH_MESSAGE:
            return {...state, flashMessage: {
                action: 'hide',
                dateTime: dateTime.valueOf()
            }}
    }
    return state
}

export default mainReducer;