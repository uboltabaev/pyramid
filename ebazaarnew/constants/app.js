import { Dimensions } from 'react-native';
import { Constants } from 'react-native-unimodules';
import _ from 'underscore';
import ColorHelper from '../helpers/color_helper';

export const LANGS = Object.freeze({
    RU: 'ru',
    UZ: 'uz',
    UZ_LATN: 'uz-latn'
});
export const COUTRY_ISO2_CODE = 'uz';
export const COUTRY_ISO3_CODE = 'uzb';

const CURRENT_COLOR_NAME = 'red';
const API_MAIN_COLORS = [
    {name: 'red', color: '#ff4747', darkColor: '#f06b02', formColor: '#f44236'},
    {name: 'blue', color: '#207cf7'},
    {name: 'pink', color: '#e7509d'},
    {name: 'purple', color: '#b534aa'},
    {name: 'green', color: '#34b550'}
];
const PICK_COLOR = (color, property = 'color') => {
    return _.chain(API_MAIN_COLORS)
        .where({name: color})
        .map(property)
        .first()
        .value();
}
const CURRENT_COLOR = PICK_COLOR(CURRENT_COLOR_NAME);
export const GET_GREEN_COLOR = () => {
    return PICK_COLOR('green');
}
export const GET_RED_COLOR = () => {
    return PICK_COLOR('red');
}
export const GET_BLUE_COLOR = () => {
    return PICK_COLOR('blue');
}
export const GREEN_COLOR_OPACITY_10 = () => {
    const color = PICK_COLOR('green');
    return RGBA_OPACITY(color, 0.10);
}
export const GREEN_COLOR_OPACITY_20 = () => {
    const color = PICK_COLOR('green');
    return RGBA_OPACITY(color, 0.20);
}
const RGBA_OPACITY = (hexColor, opacity) => {
    let rgb = ColorHelper.hexToRgb(hexColor);
    rgb.push(opacity);
    return "rgba(" + rgb.join(", ") + ")";
}
export const APP_MAIN_COLOR = CURRENT_COLOR;
export const APP_FORM_COLOR = PICK_COLOR(CURRENT_COLOR_NAME, 'formColor')
export const APP_MAIN_COLOR_OPACITY_10 = () => {
    return RGBA_OPACITY(CURRENT_COLOR, 0.10);
}
export const APP_MAIN_COLOR_OPACITY_30 = () => {
    return RGBA_OPACITY(CURRENT_COLOR, 0.30);
}
export const APP_MAIN_COLOR_OPACITY_50 = () => {
    return RGBA_OPACITY(CURRENT_COLOR, 0.50);
}
export const APP_MAIN_COLOR_OPACITY_70 = () => {
    return RGBA_OPACITY(CURRENT_COLOR, 0.70);
}
export const APP_MAIN_COLOR_RGBA = () => {
    return RGBA_OPACITY(CURRENT_COLOR, 1.0);
}
export const APP_MAIN_COLOR_RGBA_FADEOUT = () => {
    return RGBA_OPACITY(CURRENT_COLOR, 0);
}
export const NAV_DEFAULT_COLOR = "#333";
export const RATING_BG_COLOR = "#e6e6e6";
export const NATIONAL_CURRENCY = 'UZS';
export const COUNTRY_CALLING_CODE = '+998';
export const SPINNER_COLOR = '#ebebeb';
export const SPINNER_COLORS = ['#63a6d0', '#68c195', '#d7ab62'];
export const TEXT_SHADOW = {
    textShadowColor: "rgba(0, 0, 0, 0.15)",
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 1
}
export const LINK_COLOR = "#3a99b9";
export const ERROR_TEXT_COLOR = '#f0782a';
export const TOAST_BG_COLOR = '#323232';
export const STATUS_BAR_HEIGHT = Constants.statusBarHeight;
export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Dimensions.get('window').height;
export const COUPON_BACKGROUND_COLOR = "#fe9900";
export const LOREM_IPSUM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
export const VIEW_MODE_LIST = 'list';
export const VIEW_MODE_GRID = 'grid';
export const CHAT_VIEW_MODE = Object.freeze({
    ID_BASED: 'idBased',
    PRODUCT_BASED: 'productBased'
});
export const CHAT_ATTACHMENT_MODE = Object.freeze({
    FILES: 'files',
    EMOJI: 'emoji'
});
export const CHAT_EMOJI_ACTION = Object.freeze({
    ADD: 'add',
    REMOVE_CHAR: 'remove_char',
    REMOVE_EMOJI: 'remove_emoji'
});
export const FIREBASE_ERRORS = Object.freeze({
    ERR_FIREBASE_RECAPTCHA_CANCEL: 'ERR_FIREBASE_RECAPTCHA_CANCEL'
});
export const PHONE_AUTH_MODE = {
    SIGN_UP: 'signUp',
    SIGN_IN: 'signIn'
};
export const HOME_TAB_DISTANCE = 531 + 195;
export const FILTER_FREE_SHIPMENT = 'freeShipment';
export const FILTER_RATING = 'rating';
export const FILTER_BRAND = 'brand';
export const FILTER_COLOR = 'color';
export const FILTER_CELLULAR_STANDART = 'cellularStandart';
export const FILTER_OPERATING_SYSTEM = 'operatingSystem';
export const FILTER_PRODUCT_CONDITION = 'productCondition'
export const FILTER_SIM_CARDS_NUM = 'simCardsNum';
export const FILTER_INTERNAL_MEMORY = 'internalMemory';
export const FILTER_RAM = 'RAM';
export const FILTER_SCREEN_SIZE = 'screenSize';
export const FILTER_DISPLAY_RESOLUTION = 'displayResolution';