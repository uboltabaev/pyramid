import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import i18n from 'i18n-js';
import _ from 'underscore';
import { APP_MAIN_COLOR } from '../../constants/app';

export const STATUS_ACTIVE = 'active';
export const STATUS_PRESSED = 'pressed';
export const STATUS_DISABLED = 'disabled';
export const STATUS_DEFAULT = 'default'

export const BUTTON_MODE_DEFAULT = 'default';
export const BUTTON_MODE_FLEX = 'flex';

const Button2 = React.memo(({ status, cornerRadius, i18nKey, defaultText, icon, extraText, textFontSize, style, mode, onPress }) => {
    const _onPress = () => {
        if (status === STATUS_ACTIVE || status === STATUS_DEFAULT) {
            setTimeout(() => {
                _.isFunction(onPress) && (onPress());
            }, 100);
        }
    }
    
    let bClass = {}, bText = {};
    if (status === STATUS_PRESSED || status === STATUS_DEFAULT) {
        bClass = styles.buttonPressed;
        bText = styles.textPressed;
    } else if (status === STATUS_DISABLED) {
        bClass = styles.buttonDisabled;
        bText = styles.textDisabled;
    }
    return (
        <TouchableOpacity onPress={_onPress} activeOpacity={1} style={[styles.button, mode === BUTTON_MODE_FLEX && (styles.buttonFlexy), {borderRadius: cornerRadius}, style, bClass]}>
            {icon && 
                <View style={styles.iconLeft}>{icon}</View>
            }
            <Text style={[styles.text, bText, {fontSize: textFontSize}]}>
                {i18n.t(i18nKey, {defaultValue: defaultText})}{extraText}
            </Text>
        </TouchableOpacity>
    )
})

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#999999',
        paddingHorizontal: 8,
        paddingVertical: 3,
    },
    buttonFlexy: {
        flex: 1,
        flexDirection: 'row', 
        alignSelf: 'flex-start',
        alignItems: 'center'
    },
    buttonPressed: {
        borderColor: APP_MAIN_COLOR
    },
    buttonDisabled: {
        borderColor: '#cccccc'
    },
    text: {
        textAlign: "center"
    },
    textPressed: {
        color: APP_MAIN_COLOR
    },
    textDisabled: {
        color: '#cccccc'
    },
    iconLeft: {
        marginRight: 8
    }
});

Button2.propTypes = {
    status: PropTypes.string,
    cornerRadius: PropTypes.number,
    i18nKey: PropTypes.string.isRequired,
    defaultText: PropTypes.string.isRequired,
    extraText: PropTypes.string,
    onPress: PropTypes.func,
    style: PropTypes.object,
    textFontSize: PropTypes.number,
    icon: PropTypes.node,
    mode: PropTypes.string
}

Button2.defaultProps = {
    status: STATUS_ACTIVE,
    cornerRadius: 3,
    extraText: "",
    textFontSize: 13,
    mode: BUTTON_MODE_DEFAULT
}

export default Button2;