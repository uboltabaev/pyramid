import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import i18n from 'i18n-js';
import _ from 'underscore';
import PopupMenu from 'react-native-popup-menu-android';
import CssHelper from "../helpers/css_helper";
import MoreIcon from './icons/more_icon';
import MyRipple from './ui/ripple';

export const THEME_DARK = 'dark';
export const THEME_LIGHT = 'light';

export const MODE_DEFAULT = 'default';
export const MODE_PRODUCT = 'product';

const PopupNav = React.memo(({ style, theme, mode, triggerIconSize, pressColor, navigation }) => {

    let menuRef = null

    const setMenuRef = (ref) => {
        menuRef = ref;
    }

    const handleItemSelect = useCallback((item) => {
        navigation.navigate(item.id)
    })

    const showMenu = useCallback(() => {
        const navs = [
            {id: 'Home', label: i18n.t('navigation:home', {defaultValue: 'Главная'})},
            {id: 'MyProfile', label: i18n.t('navigation:my_profile', {defaultValue: 'Мой профиль'})},
            {id: 'Favorites', label: i18n.t('favorites', {defaultValue: 'Избранное'})},
            {id: 'Inbox', label: i18n.t('navigation:inbox', {defaultValue: 'Сообщение'})},
            {id: 'Settings', label: i18n.t('settings', {defaultValue: 'Настройки'})}
        ]
        const navsProduct = [
            {id: 'Inbox', label: i18n.t('navigation:inbox', {defaultValue: 'Сообщение'})},
            {id: 'Home', label: i18n.t('navigation:home', {defaultValue: 'Главная'})},
            {id: 'Favorites', label: i18n.t('favorites', {defaultValue: 'Избранное'})},
            {id: 'MyProfile', label: i18n.t('navigation:my_profile', {defaultValue: 'Мой профиль'})},
            {id: 'ContactUs', label: i18n.t('feedback', {defaultValue: 'Обратная связь'})}
        ]
        let links = navs
        mode === MODE_PRODUCT && (links = navsProduct)
        PopupMenu(links, handleItemSelect, menuRef)
    })

    const getPressColor = useCallback(() => {
        let p = theme === THEME_LIGHT ? "rgba(1, 1, 1, 0.15)" : "rgba(255, 255, 255, 0.20)";
        return _.isUndefined(pressColor) ? p : pressColor;
    })
    
    return (
        <View style={[styles.container, style]}>
            <MyRipple style={CssHelper['flex']} pressColor={getPressColor()} onPress={showMenu} setRef={setMenuRef}>
                <View style={styles.moreContainer}>
                    <MoreIcon width={triggerIconSize} height={triggerIconSize} color={theme === THEME_LIGHT ? '#000' : '#fff'}/>
                </View>
            </MyRipple>
        </View>
    );
})

const styles = StyleSheet.create({
    container: {
        width: 35,
        height: 35,
        marginRight: 10
    },
    moreContainer: {
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
    icon: {
        marginLeft: -15,
        marginRight: 10
    },
    button: {
        paddingTop: 10,
        paddingBottom: 10
    }
});

PopupNav.propTypes = {
    style: PropTypes.object, 
    theme: PropTypes.string,
    mode: PropTypes.string,
    triggerIconSize: PropTypes.number,
    pressColor: PropTypes.string
}

PopupNav.defaultProps = {
    theme: THEME_LIGHT,
    mode: MODE_DEFAULT,
    triggerIconSize: 18
}

export default PopupNav;