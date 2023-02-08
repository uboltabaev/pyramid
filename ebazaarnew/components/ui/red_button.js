import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import i18n from 'i18n-js';
import _ from 'underscore';
import { APP_MAIN_COLOR, TEXT_SHADOW } from "../../constants/app";

const RedButton = React.memo(({ cornerRadius, i18nKey, defaultText, style, onPress }) => {
    const _onPress = () => {
        setTimeout(() => {
            _.isFunction(onPress) && (onPress());
        }, 100);
    }

    return (
        <TouchableOpacity onPress={_onPress} activeOpacity={1} style={style}>
            <View style={[styles.button, {borderRadius: cornerRadius}]}>
                <Text style={[styles.text, TEXT_SHADOW]}>
                    {i18n.t(i18nKey, {defaultValue: defaultText})}
                </Text>
            </View>
        </TouchableOpacity>
    )
})

const styles = StyleSheet.create({
    button: {
        width: 'auto',
        backgroundColor: APP_MAIN_COLOR,
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 6,
        paddingBottom: 7,
        borderLeftWidth: 1,
        borderLeftColor: 'rgba(0, 0, 0, 0.2)',
        borderRightWidth: 1,
        borderRightColor: 'rgba(0, 0, 0, 0.2)'
    },
    text: {
        color: "#fff",
        textAlign: "center",
        fontSize: 14
    }
});

RedButton.propTypes = {
    cornerRadius: PropTypes.number,
    i18nKey: PropTypes.string.isRequired,
    defaultText: PropTypes.string.isRequired,
    onPress: PropTypes.func,
    style: PropTypes.object
}

RedButton.defaultProps = {
    cornerRadius: 20
}

export default RedButton;