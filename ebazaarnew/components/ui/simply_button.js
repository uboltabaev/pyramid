import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import i18n from 'i18n-js';
import _ from 'underscore';

const SimpleButton = React.memo(({ bgColor, textColor, cornerRadius, i18nKey, defaultText, onPress }) => {
    const _onPress = () => {
        _.isFunction(onPress) && (onPress());
    }
    return (
        <TouchableOpacity onPress={_onPress} activeOpacity={1}>
            <View style={[styles.button, {backgroundColor: bgColor, borderRadius: cornerRadius}]}>
                <Text style={[styles.text, {color: textColor}]}>
                    {i18n.t(i18nKey, {defaultValue: defaultText})}
                </Text>
            </View>
        </TouchableOpacity>
    )
})

const styles = StyleSheet.create({
    button: {
        paddingTop: 5,
        paddingBottom: 6,
        borderLeftWidth: 1,
        borderLeftColor: 'rgba(0, 0, 0, 0.2)',
        borderRightWidth: 1,
        borderRightColor: 'rgba(0, 0, 0, 0.2)'
    },
    text: {
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 12
    }
});

SimpleButton.propTypes = {
    bgColor: PropTypes.string,
    textColor: PropTypes.string,
    cornerRadius: PropTypes.number,
    i18nKey: PropTypes.string.isRequired,
    defaultText: PropTypes.string.isRequired,
    onPress: PropTypes.func
}

SimpleButton.defaultProps = {
    bgColor: "#fff",
    textColor: "#000",
    cornerRadius: 20
}

export default SimpleButton;