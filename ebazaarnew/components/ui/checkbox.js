import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Animated, Easing } from 'react-native';
import PropTypes from 'prop-types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { APP_MAIN_COLOR } from "../../constants/app";
import CssHelper from '../../helpers/css_helper';
import CheckIcon from '../icons/check_icon';

export const STATUS_UNCHECKED = 'unchecked';
export const STATUS_CHECKED = 'checked';

export const CHECKBOX_MODE_DEFAULT = 'default';
export const CHECKBOX_MODE_SVG = 'svg';

const Checkbox = React.memo(({ status, backgroundColor, borderColor, mode, animation, rippleRadius }) => {

    const { maxOpacity, width } = {
        maxOpacity: 0.15,
        width: 20
    };
    const [height, setHeight] = useState(20)
    const [scale] = useState(new Animated.Value(0.01))
    const [opacity] = useState(new Animated.Value(maxOpacity))

    useEffect(() => {
        if (animation) {
            scale.setValue(0.01);
            opacity.setValue(maxOpacity);
            Animated.parallel([
                Animated.timing(scale, {
                    toValue: 1,
                    duration: 225,
                    easing: Easing.bezier(0.0, 0.0, 0.2, 1),
                    useNativeDriver: true
                }),
                Animated.timing(opacity, {
                    toValue: 0,
                    useNativeDriver: true
                })    
            ]).start();
        }
    }, [status])

    const onLayout = (e) => {
        const { height } = e.nativeEvent.layout;
        if (animation) {
            setHeight(height)
        }
    }

    const rippleSize = width + (rippleRadius * 2);
    const top = (height / 2) - (rippleSize / 2);

    if (status === STATUS_CHECKED) {
        if (mode === CHECKBOX_MODE_SVG) {
            return (
                <View style={styles.svgContainer}>
                    <Ionicons name="md-checkbox" size={26} color={APP_MAIN_COLOR}/>
                </View>
            )
        } else {
            return (
                <View style={[CssHelper['flexSingleCentered'], animation && ({width: rippleSize})]}>
                    { animation &&
                        <Animated.View style={[styles.ripple, {top, width: rippleSize, height: rippleSize, borderRadius: rippleSize / 2, transform: [{scale}], opacity}]}/>
                    }
                    <View style={[styles.container, styles.checked]}>
                        <View style={CssHelper['flexSingleCentered']}>
                            <CheckIcon width={14} height={14} color="#fff"/>
                        </View>
                    </View>
                </View>
            )
        }
    }

    return (
        <View style={[CssHelper['flexSingleCentered'], animation && ({width: rippleSize})]} onLayout={onLayout}>
            { animation &&
                <Animated.View style={[styles.ripple, {top, backgroundColor: APP_MAIN_COLOR, width: rippleSize, height: rippleSize, borderRadius: rippleSize / 2, transform: [{scale}], opacity}]}/>
            }
            <View style={[styles.container, {backgroundColor, borderColor}]}/>
        </View>
    )
})

const styles = StyleSheet.create({
    container: {
        borderRadius: 3,
        borderWidth: 2,
        width: 20,
        height: 20
    },
    svgContainer: {
        marginTop: -3,
        opacity: 0.9
    },
    checked: {
        borderColor: APP_MAIN_COLOR,
        backgroundColor: APP_MAIN_COLOR
    },
    ripple: {
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: 'black'
    }
});

Checkbox.propTypes = {
    status: PropTypes.string,
    backgroundColor: PropTypes.string,
    borderColor: PropTypes.string,
    mode: PropTypes.string,
    animation: PropTypes.bool,
    rippleRadius: PropTypes.number
}

Checkbox.defaultProps = {
    status: STATUS_UNCHECKED,
    backgroundColor: '#fff',
    borderColor: '#d5d6da',
    mode: CHECKBOX_MODE_DEFAULT,
    animation: false,
    rippleRadius: 10
}

export default Checkbox;