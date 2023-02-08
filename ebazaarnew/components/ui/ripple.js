import React from 'react';
import { StyleSheet, TouchableNativeFeedback, Platform, View } from 'react-native';
import PropTypes from 'prop-types';
import _ from 'underscore';

const LOLLIPOP = 21;

const Touchable = React.memo(({pressColor, pressOpacity, borderless, style, children, ...rest}) => {
    if (Platform.OS === 'android' && Platform.Version >= LOLLIPOP) {
        return (
            <TouchableNativeFeedback {...rest} background={TouchableNativeFeedback.Ripple(pressColor, borderless)}>
                <View style={style}>
                    {React.Children.only(children)}
                </View>
            </TouchableNativeFeedback>
        );
    } else {
        return (
            <TouchableOpacity {...rest} style={style} activeOpacity={pressOpacity}>
                {children}
            </TouchableOpacity>
        );
    }
})

Touchable.propTypes = {
    onPress: PropTypes.func,
    onLongPress: PropTypes.func,
    delayPressIn: PropTypes.number,
    borderless: PropTypes.bool,
    pressColor: PropTypes.string,
    pressOpacity: PropTypes.number,
    children: PropTypes.node,
    style: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array
    ])
};

Touchable.defaultProps = {
    pressColor: 'rgba(255, 255, 255, .4)',
};

const Ripple = React.memo(({onPress, onLongPress, pressColor, borderless, pressOpacity, children, style, setRef}) => {
    const _setRef = (ref) => {
        _.isFunction(setRef) && (setRef(ref));
    }
    
    return (
        <Touchable
            borderless={borderless}
            accessible={true}
            accessibilityTraits={'button'}
            accessibilityComponentType="button"
            accessibilityStates={[]}
            pressColor={pressColor}
            pressOpacity={pressOpacity}
            delayPressIn={0}
            onPress={onPress}
            onLongPress={onLongPress}
            style={style}
        >
            <View ref={_setRef} pointerEvents="none" style={[styles.item]}>
                {children}
            </View>
        </Touchable>
    );
})

const styles = StyleSheet.create({
    item: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

Ripple.propTypes = {
    onPress: PropTypes.func,
    onLongPress: PropTypes.func,
    pressColor: PropTypes.string,
    pressOpacity: PropTypes.number,
    children: PropTypes.node,
    ref: PropTypes.func,
    borderless: PropTypes.bool,
    style: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array
    ])
};

Ripple.defaultProps = {
    pressColor: 'rgba(1, 1, 1, 0.15)',
    borderless: true
};

export default Ripple;