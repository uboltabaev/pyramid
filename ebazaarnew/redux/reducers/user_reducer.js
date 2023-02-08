import { SET_IS_SIGNED_IN, SET_ESPECIALLY_PRODUCTS, SET_HISTORY_SELECTED_DATE } from '../constants/action-types';

const initialState = {
    isSignedIn: false,
    uid: null,
    fullName: '',
    profileImage: null,
    profileImageBase64: null,
    userProfile: null,
    language: null,
    updateTime: null,
    especiallyProducts: [],
    isShippingAddressesLoaded: false,
    shippingAddresses: [],
    isHistoryLoaded: false,
    historyList: [],
    historySelectedDate: null
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_IS_SIGNED_IN:
            return {...state, isSignedIn: action.payload}

        case SET_ESPECIALLY_PRODUCTS:
            return {...state, especiallyProducts: action.payload}

        case SET_HISTORY_SELECTED_DATE:
            return {...state, historySelectedDate: action.payload}
    }
    return state
}

export default userReducer;