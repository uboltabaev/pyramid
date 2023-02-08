import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import _ from 'underscore';
import CssHelper from "../../helpers/css_helper";
import { APP_MAIN_COLOR } from "../../constants/app";
import XIcon from "../icons/x_icon";

export const STATUS_DEFAULT_FILTER_BUTTON = 'default'
export const STATUS_PRESSED_FILTER_BUTTON = 'pressed'
export const STATUS_DISABLED_FILTER_BUTTON = 'disabled'

const GREY_COLOR = '#f2f2f2';
const GREY_DARK_COLOR = '#d3d3d3';

const FilterButton = React.memo(({ status, children, style, onPress }) => {
    const _onPress = () => {
        _.isFunction(onPress) && (onPress())
    }

    let eClass = styles.buttonDefault;
    if (status === STATUS_PRESSED_FILTER_BUTTON)
        eClass = styles.buttonPressed;
    else if (status === STATUS_DISABLED_FILTER_BUTTON)
        eClass = styles.buttonDisabled;

    return (
        <TouchableOpacity style={[CssHelper['flexRowCentered'], styles.button, style, eClass]} onPress={_onPress} activeOpacity={1.0}>
            { (status === STATUS_PRESSED_FILTER_BUTTON || status === STATUS_DISABLED_FILTER_BUTTON) && 
                <View style={[styles.triangleCorner, status === STATUS_DISABLED_FILTER_BUTTON && ({borderTopColor: GREY_DARK_COLOR})]}>
                    <View style={styles.icon}>
                        <XIcon width={5} height={5} color="#fff"/>
                    </View>
                </View>
            }
            {children}
        </TouchableOpacity>
    );
})

const styles = StyleSheet.create({
    button: {
        justifyContent: "center",
        padding: 5,
        borderRadius: 3,
        minHeight: 36,
        borderWidth: 1,
        borderColor: GREY_COLOR
    },
    buttonDefault: {
        backgroundColor: GREY_COLOR
    },
    buttonPressed: {
        backgroundColor: "#fff",
        borderColor: APP_MAIN_COLOR,
        borderWidth: 1
    },
    buttonDisabled: {
        backgroundColor: "#fff",
        borderColor: GREY_DARK_COLOR,
        borderWidth: 1
    },
    triangleCorner: {
        borderTopLeftRadius: 2,
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderRightWidth: 16,
        borderTopWidth: 16,
        borderRightColor: 'transparent',
        borderTopColor: APP_MAIN_COLOR,
        transform: [
            {rotate: '180deg'}
        ],
        position: "absolute",
        right: 0,
        bottom: 0
    },
    icon: {
        position: "absolute",
        bottom: 9, // left here
        left: 2 // top here
    }
});

FilterButton.propTypes = {
    children: PropTypes.node.isRequired,
    status: PropTypes.string.isRequired,
    style: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array
    ]),
    onPress: PropTypes.func
}

export default FilterButton;