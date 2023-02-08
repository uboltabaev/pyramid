import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import i18n from 'i18n-js';
import _ from 'underscore';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { APP_MAIN_COLOR } from "../../constants/app";

const ConnectButton = React.memo(({ cornerRadius, i18nKey, defaultText, style, onPress }) => {
    const _onPress = () => {
        _.isFunction(onPress) && (onPress());
    }

    return (
        <TouchableOpacity onPressIn={_onPress} activeOpacity={1} style={style}>
            <View style={[styles.button, {borderRadius: cornerRadius}]}>
                <View style={styles.inner}>
                    <SimpleLineIcons name="bubble" size={20} color={APP_MAIN_COLOR}/>
                    <Text style={[styles.text]}>
                        {i18n.t(i18nKey, {defaultValue: defaultText})}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )
})

const styles = StyleSheet.create({
    button: {
        width: 'auto',
        backgroundColor: "#fff",
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 4,
        paddingBottom: 3,
        borderWidth: 1,
        borderColor: APP_MAIN_COLOR,
    },
    inner: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    text: {
        color: APP_MAIN_COLOR,
        textAlign: "center",
        fontSize: 14,
        lineHeight: 17,
        paddingLeft: 5
    }
});

ConnectButton.propTypes = {
    cornerRadius: PropTypes.number,
    i18nKey: PropTypes.string.isRequired,
    defaultText: PropTypes.string.isRequired,
    onPress: PropTypes.func,
    style: PropTypes.object
}

ConnectButton.defaultProps = {
    cornerRadius: 20
}

export default ConnectButton;