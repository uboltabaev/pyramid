import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import PropTypes from 'prop-types';
import i18n from 'i18n-js';
import { APP_MAIN_COLOR } from "../../constants/app";

export const THEME_DARK_SALE = 'dark';
export const THEME_LIGHT_SALE = 'light';

const Sale = React.memo(({ theme }) => {
    return (
        <View style={[styles.button, theme === THEME_DARK_SALE ? styles.buttonDark : styles.buttonLight]}>
            <Text style={[styles.text, theme === THEME_DARK_SALE ? styles.textDark : styles.textLight]}>
                {i18n.t('sale', {defaultValue: 'Распродажа'})}
            </Text>
        </View>
    )
})

const styles = StyleSheet.create({
    button: {
        paddingLeft: 6,
        paddingRight: 6,
        borderRadius: 3,
        borderWidth: 1,
        borderColor: APP_MAIN_COLOR
    },
    buttonDark: {
        backgroundColor: APP_MAIN_COLOR
    },
    buttonLight: {
        backgroundColor: "#fff"
    },
    text: {
        textTransform: 'uppercase',
        fontSize: 10,
        fontWeight: "bold"
    },
    textDark: {
        color: "#fff"
    },
    textLight: {
        color: APP_MAIN_COLOR
    }
});

Sale.propTypes = {
    theme: PropTypes.string
}

Sale.defaultProps = {
    theme: THEME_DARK_SALE
}

export default Sale;