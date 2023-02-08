import React, { useState, useEffect } from 'react';
import { Animated, View, StyleSheet, StatusBar } from 'react-native';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from "react-redux";
import i18n from 'i18n-js';
import _ from 'underscore';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { Surface } from 'react-native-paper';
import CssHelper from "../../helpers/css_helper";
import { SET_LAST_SCREEN_UPDATE } from "../../redux/constants/action-types";
import Ripple from '../ui/ripple';

export const FRONTEND_HEADER_SCREEN_PROFILE = 'profile';

const FrontendPage = React.memo(({screenName, i18nKey, defaultText, i18nProps, isSignedIn, screen, userFullname, scrollY, displayCart, animateHeaderText, deleteHandler, navigation, children}) => {
    const [isNotified, setIsNotified] = useState(false);

    const opacity = scrollY ? scrollY.interpolate({
        inputRange: [45, 50],
        outputRange: [0, 1]
    }) : null;

    const fontSize = scrollY ? scrollY.interpolate({
        inputRange: [50, 100],
        outputRange: [24, 18],
        extrapolate: 'clamp',
    }) : 24;

    const shadowOpacity = scrollY ? 
    screen === FRONTEND_HEADER_SCREEN_PROFILE ?
    scrollY.interpolate({
        inputRange: [45, 50],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    })
    : 
    scrollY.interpolate({
        inputRange: [1, 6],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    })
    : new Animated.Value(0);

    const dispatch = useDispatch();
    const isNetConnected = useSelector(state => state.main.isNetConnected);

    const onDelete = () => {
        deleteHandler();
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            if (!isNetConnected && !isNotified) {
                dispatch({
                    type: SET_LAST_SCREEN_UPDATE,
                    payload: {
                        screenName,
                        status: 'focused'    
                    }
                });
                setIsNotified(true);
            }            
        });
        return () => {
            unsubscribe();
        }
    }, []);
    
    return (
        <View style={CssHelper['flex']}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true}/>
            <View style={CssHelper['frontend.container']}>
                <Animated.View style={[screen === FRONTEND_HEADER_SCREEN_PROFILE && ({opacity}), CssHelper['frontend.header'], screen === FRONTEND_HEADER_SCREEN_PROFILE && (styles.profileHeader)]}>
                    <View style={[CssHelper['flexRowCentered'], CssHelper['frontend.headerInner']]}>
                        <Animated.Text style={[CssHelper[screen === FRONTEND_HEADER_SCREEN_PROFILE ? 'frontend.titleSmall' : 'frontend.title'], animateHeaderText && ({fontSize})]}>
                            { screen === FRONTEND_HEADER_SCREEN_PROFILE && isSignedIn ? (
                                userFullname
                            ) : (
                                i18n.t(i18nKey, {defaultValue: defaultText, ...i18nProps})
                            )}
                        </Animated.Text>
                        { displayCart &&
                            <Ripple onPress={onDelete}>
                                <EvilIcons name="trash" size={34} color="#333" />
                            </Ripple>
                        }
                    </View>
                </Animated.View>
                <Animated.View style={[styles.shadowContainer, {opacity: shadowOpacity}]}>
                    <Surface style={styles.shadowContainerInner}/>
                </Animated.View>
                {children}
            </View>
        </View>
    )
})

const styles = StyleSheet.create({
    profileHeader: {
        zIndex: 99999999,
        width: '100%',
        position: 'absolute',
        left: 0,
        top: 0,
    },
    shadowContainer: {
        overflow: 'hidden', 
        height: 13, 
        width: '100%', 
        position: 'absolute', 
        top: 67, 
        zIndex: 999998
    },
    shadowContainerInner: {
        marginTop: -5, 
        backgroundColor: '#fff', 
        height: 10, 
        width: '100%',
        elevation: 8
    }
});

FrontendPage.propTypes = {
    children: PropTypes.node,
    screenName: PropTypes.string.isRequired,
    i18nKey: PropTypes.string.isRequired,
    defaultText: PropTypes.string.isRequired,
    i18nProps: PropTypes.object,
    screen: PropTypes.string,
    scrollY: PropTypes.object,
    isSignedIn: PropTypes.bool,
    userFullname: PropTypes.string,
    language: PropTypes.string,
    displayCart: PropTypes.bool,
    animateHeaderText: PropTypes.bool,
    deleteHandler: PropTypes.func
}

FrontendPage.defaultProps = {
    isSignedIn: false,
    displayCart: false,
    animateHeaderText: false
}

export default FrontendPage;