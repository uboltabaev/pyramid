import React, { useState } from 'react';
import { StyleSheet, Text, Animated, ActivityIndicator, View } from 'react-native';
import PropTypes from 'prop-types';
import i18n from 'i18n-js';
import Ripple from 'react-native-material-ripple';
import _ from 'underscore';
import { Surface } from 'react-native-paper';
import { APP_MAIN_COLOR, APP_MAIN_COLOR_OPACITY_50 } from "../../constants/app";

export const THEME_DARK_BUTTON = 'dark';
export const THEME_LIGHT_BUTTON = 'light';

export const STATUS_DEFAULT = 'default';
export const STATUS_SENDING = 'sending';

const ShadowButton = React.memo(({ theme, i18nKey, defaultText, i18nProps, style, textStyle, status, elevation, onPress }) => {
    const [animatedValue] = useState(new Animated.Value(1))

    const _onPress = () => {
        if (status === STATUS_DEFAULT) {
            setTimeout(() => {
                _.isFunction(onPress) && (onPress());
            }, 100);    
        }
    }
    
    const handlePressIn = () => {
        Animated.spring(animatedValue, {
            toValue: 1.05,
            useNativeDriver: true
        }).start();
    }

    const handlePressOut = () => {
        Animated.spring(animatedValue, {
            toValue: 1,
            useNativeDriver: true
        }).start();
    }

    const animatedStyle = {
        transform: [{scale: animatedValue}]
    };

    return (
        <Animated.View style={[styles.outer, animatedStyle]}>
        <Surface style={[styles.surface, { elevation }, theme === THEME_DARK_BUTTON ? styles.buttonDark : styles.buttonLight, style, status === STATUS_SENDING && (styles.buttonSending)]}>
                <Ripple rippleColor={theme === THEME_DARK_BUTTON ? "rgb(0, 0, 0)" : APP_MAIN_COLOR_OPACITY_50()} 
                    style={[styles.button, styles.inner, theme === THEME_LIGHT_BUTTON && (styles.innerLight)]} 
                    disabled={status === STATUS_SENDING ? true : false}
                    rippleCentered={false} 
                    rippleSequential={true} 
                    rippleFades={false} 
                    rippleOpacity={0.1} 
                    rippleDuration={200}
                    onPressIn={handlePressIn} 
                    onPressOut={handlePressOut}
                    onPress={_onPress}
                >
                    <View style={status === STATUS_SENDING && styles.s}>
                        { status === STATUS_SENDING &&
                            <View style={styles.indicatorContainer}>
                                <ActivityIndicator size="small" color="#fff"/>
                            </View>
                        }
                        <Text style={[styles.text, textStyle, theme === THEME_DARK_BUTTON ? styles.textDark : styles.textLight]} numberOfLines={1}>
                            {i18n.t(i18nKey, {defaultValue: defaultText, ...i18nProps})}
                        </Text>
                    </View>
                </Ripple>
            </Surface>
        </Animated.View>
    )
})

const styles = StyleSheet.create({
    surface: {
        borderRadius: 2,
        backgroundColor: 'transparent'
    },
    button: {
        borderRadius: 2
    },
    s: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    buttonDark: {
        backgroundColor: APP_MAIN_COLOR,
    },
    buttonLight: {
        backgroundColor: '#ffecec',
    },
    buttonSending: {
        backgroundColor: '#8a8a8a'
    },
    outer: {
        padding: 3,
    },
    inner: {
        paddingVertical: 12,
        paddingHorizontal: 5,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0, 0, 0, 0.1)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.1)',
        borderRadius: 2,
    },
    innerLight: {
        borderTopColor: 'rgba(0, 0, 0, 0.03)',
        borderBottomColor: 'rgba(0, 0, 0, 0.03)',
    },
    text: {
        textTransform: "uppercase",
        color: '#fff',
        fontWeight: "bold",
        fontSize: 15,
        textAlign: 'center'
    },
    textDark: {
        color: '#fff'
    },
    textLight: {
        color: APP_MAIN_COLOR
    },
    indicatorContainer: {
        marginLeft: -28, 
        marginRight: 8
    }
});

ShadowButton.propTypes = {
    theme: PropTypes.string,
    status: PropTypes.string,
    i18nKey: PropTypes.string.isRequired,
    defaultText: PropTypes.string.isRequired,
    i18nProps: PropTypes.object,
    onPress: PropTypes.func,
    style: PropTypes.object,
    textStyle: PropTypes.object,
    elevation: PropTypes.number
}

ShadowButton.defaultProps = {
    theme: THEME_DARK_BUTTON,
    status: STATUS_DEFAULT,
    elevation: 3
}

export default ShadowButton;