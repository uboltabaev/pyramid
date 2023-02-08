import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import PropTypes from 'prop-types';
import i18n from 'i18n-js';
import Ripple from 'react-native-material-ripple';
import _ from 'underscore';
import { APP_MAIN_COLOR, APP_MAIN_COLOR_OPACITY_10, APP_MAIN_COLOR_OPACITY_50 } from "../../constants/app";

export const THEME_DARK_BUTTON = 'dark';
export const THEME_LIGHT_BUTTON = 'light';

const Button = React.memo(({ theme, i18nKey, defaultText, disabled, hideText, onPress }) => {

    let timeout = null

    useEffect(() => {
        return () => {
            clearTimeout(timeout)
        }
    }, [])

    const _onPress = () => {
        timeout = setTimeout(() => {
            if (_.isFunction(onPress) && !disabled)
                onPress();
        }, 100);
    }

    return (
        <Ripple rippleColor={theme === THEME_DARK_BUTTON ? "#fff" : APP_MAIN_COLOR_OPACITY_50()} 
            style={[styles.button, theme === THEME_DARK_BUTTON ? styles.buttonDark : styles.buttonLight]} 
            rippleCentered={true} 
            rippleSequential={true} 
            rippleFades={false} 
            rippleOpacity={0.2} 
            rippleDuration={300} 
            onPress={_onPress}
            disabled={disabled}>
            <View style={styles.inner}>
                { !hideText &&
                    <Text style={[styles.text, theme === THEME_DARK_BUTTON ? styles.textDark : styles.textLight]}>
                        {i18n.t(i18nKey, {defaultValue: defaultText})}
                    </Text>
                }
            </View>
        </Ripple>
    )
})

const styles = StyleSheet.create({
    button: {
        flex: 1
    },
    buttonDark: {
        backgroundColor: APP_MAIN_COLOR
    },
    buttonLight: {
        backgroundColor: APP_MAIN_COLOR_OPACITY_10()
    },
    inner: {
        flex: 1,
        justifyContent: "center",
        alignItems: 'center'
    },
    text: {
        textTransform: "uppercase",
        color: '#fff',
        fontWeight: "bold",
        fontSize: 14
    },
    textDark: {
        color: '#fff'
    },
    textLight: {
        color: APP_MAIN_COLOR
    }
});

Button.propTypes = {
    theme: PropTypes.string.isRequired,
    i18nKey: PropTypes.string.isRequired,
    defaultText: PropTypes.string.isRequired,
    onPress: PropTypes.func,
    disabled: PropTypes.bool,
    hideText: PropTypes.bool
}

Button.defaultProps = {
    disabled: false,
    hideText: false
}

export default Button;