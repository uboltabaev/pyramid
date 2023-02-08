import React, { useEffect, useReducer } from 'react';
import { StyleSheet, StatusBar, View, Text, ActivityIndicator, Animated, Alert } from 'react-native';
import PropTypes from 'prop-types';
import { useSelector } from "react-redux";
import _ from 'underscore';
import i18n from 'i18n-js';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { Surface } from 'react-native-paper';
import { APP_MAIN_COLOR, GET_BLUE_COLOR, SCREEN_WIDTH } from "../../constants/app";
import CssHelper from "../../helpers/css_helper";
import NoConnection from '../ui/no_connection';
import BorderShadow from '../misc/border_shadow';
import Ripple from '../ui/ripple';
import PopNav, { THEME_DARK } from "../popup_nav";
import BackIcon from '../icons/back_icon';
import XIcon from '../icons/x2_icon';
import RefreshPage from '../../components/ui/refresh_page';

export const ICON_BACK = 'back';
export const ICON_CLOSE = 'close'
export const DARK_PAGE_MODE = Object.freeze({
    DEFAULT: 'default',
    EDIT: 'edit'
});

const DarkPage = React.memo(({ mode, navigation, i18nKey, defaultText, i18nProps, text, extraText, icon, displayNoConnection, displayShadow, displayMoreIcon, displayEditIcon, displayCartIcon, displayShopIcon, fontSize, activityIndicator, headerChildren, loadingText, fadeOut, refreshPage, refreshHandler, backgroundColor, isBlocked, closeHandler, cancelHandler, editHandler, cartDeleteHandler, children }) => { 
    const [state, setState] = useReducer(
        (state, newState) => ({...state, ...newState}),
        {
            innerBlock: false,
            opacity: new Animated.Value(0),
            fadeOutAV: new Animated.Value(0)
        }
    )

    const { innerBlock, opacity, fadeOutAV } = state
    const isNetConnected = useSelector(state => state.main.isNetConnected)

    useEffect(() => {
        if (isBlocked && !innerBlock) {
            setState({
                innerBlock: true
            })
        }

        Animated.timing(opacity, {
            useNativeDriver: true,
            duration: 250,
            toValue: isBlocked ? 1 : 0
        }).start(() => {
            if (!isBlocked && innerBlock) {
                setState({
                    innerBlock: false
                })    
            }
        });
    }, [isBlocked])

    useEffect(() => {
        if (fadeOut) {
            Animated.timing(fadeOutAV, {
                useNativeDriver: true,
                duration: 250,
                toValue: 1
            }).start(() => {
                setState({
                    fadeOutAV: new Animated.Value(1)
                })
            });
        }
    }, [fadeOut])

    const goBack = () => {
        switch(mode) {
            case DARK_PAGE_MODE.DEFAULT:
                if (innerBlock) {
                    Alert.alert(
                        "",
                        i18n.t('warning:cancel', {defaultValue: 'Вы уверены, что хотите отменить изменения?'}),
                        [
                            {
                                text: i18n.t('no', {defaultValue: 'Нет'}),
                            },
                            {
                                text: i18n.t('yes', {defaultValue: 'Да'}),
                                onPress: () => {
                                    if (_.isFunction(cancelHandler))
                                        cancelHandler();
                                }
                            }
                        ]
                    );
                } else if (activityIndicator && isNetConnected) {
                    Alert.alert(
                        "",
                        i18n.t('messages:pleaseWait', {defaultValue: 'Пожалуйста, подождите'}),
                        [
                            {
                                text: i18n.t('yes', {defaultValue: 'Да'})
                            }
                        ]
                    );
                } else {
                    if (_.isFunction(closeHandler)) {
                        closeHandler();
                    } else {
                        setTimeout(() => {
                            navigation.goBack();
                        }, 100);
                    }    
                }        
                break;
            case DARK_PAGE_MODE.EDIT:
                if (_.isFunction(editHandler))
                    editHandler();        
                break;
        }
    }
    
    const edit = () => {
        if (_.isFunction(editHandler))
            editHandler();
    }

    const cartDelete = () => {
        if (_.isFunction(cartDeleteHandler))
            cartDeleteHandler();
    }

    const _isBlocked = () => {
        if (!isBlocked && innerBlock)
            return true;
        else
            return isBlocked;
    }

    return (
        <View style={CssHelper['flex']}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true}/>
            <View style={[CssHelper['darkPage.container'], {backgroundColor}]}>
                <BorderShadow style={CssHelper['darkPage.header']} color={displayShadow ? undefined : 'rgba(255, 255, 255, 0)'}>
                    <View style={[CssHelper['darkPage.innerHeader'], displayMoreIcon && ({paddingRight: 0})]}>
                        <Ripple pressColor="rgba(255, 255, 255, 0.20)" onPress={goBack}>
                            <View style={icon === ICON_CLOSE ? CssHelper['xIcon'] : CssHelper['backIcon']}>
                                { icon === ICON_BACK &&
                                    <BackIcon width={18} height={18} color="#fff"/>
                                }
                                { icon === ICON_CLOSE &&
                                    <XIcon width={14} height={14} color="#fff"/>
                                }
                            </View>
                        </Ripple>
                        { mode === DARK_PAGE_MODE.DEFAULT &&
                            !_.isUndefined(i18nKey) ? (
                                <Text style={[CssHelper['darkPage.title'], {fontSize}]} numberOfLines={1}>
                                    {i18n.t(i18nKey, {defaultValue: defaultText, ...i18nProps})} {extraText}
                                </Text>
                            ) : (
                                <Text style={[CssHelper['darkPage.title'], {fontSize}]} numberOfLines={1}>
                                    {text}
                                </Text>
                            )
                        }
                        <View>
                            {isNetConnected && (headerChildren)}
                        </View>
                        { displayMoreIcon &&
                            <PopNav theme={THEME_DARK} navigation={navigation}/>
                        }
                        { displayEditIcon &&
                            <View style={styles.empty}/>
                        }
                        { (displayEditIcon && mode === DARK_PAGE_MODE.DEFAULT) &&
                            <Ripple pressColor="rgba(255, 255, 255, 0.20)" onPress={edit}>
                                <MaterialIcons name="edit" size={24} color="#fff"/>
                            </Ripple>
                        }
                        { displayCartIcon &&
                            <Ripple pressColor="rgba(255, 255, 255, 0.20)" onPress={cartDelete}>
                                <FontAwesome5 name="trash" size={18} color="#fff" />
                            </Ripple>
                        }
                        { displayShopIcon &&
                            <Ripple pressColor="rgba(255, 255, 255, 0.20)">
                                <Fontisto name="shopping-store" size={21} color="#fff"/>
                            </Ripple>
                        }
                    </View>
                </BorderShadow>
                { (!isNetConnected && displayNoConnection) ? (
                    <NoConnection/>
                ) : (
                    <Animated.View style={[CssHelper['flex'], fadeOut && ({opacity: fadeOutAV})]}>
                        { refreshPage ? (
                            <RefreshPage refreshHandler={refreshHandler} backgroundColor={backgroundColor}/>
                        ) : (
                            activityIndicator ? (
                                <View style={CssHelper['flexSingleCentered']}>
                                    <ActivityIndicator size="large" color={APP_MAIN_COLOR}/>
                                </View>
                            ) : (
                                children
                            )
                        )}
                        { _isBlocked() &&
                            <Animated.View style={[styles.blocked, loadingText === '' && (styles.blockedWhite), {opacity: opacity}]}>
                                <View style={CssHelper['flexSingleCentered']}>
                                    { loadingText === '' ? (
                                        <View style={{marginTop: -50}}>
                                            <ActivityIndicator size="large" color={APP_MAIN_COLOR}/>
                                        </View>
                                    ) : (
                                        <Surface style={styles.loading} elevation={0}>
                                            <View style={styles.loadingInner}>
                                                <ActivityIndicator size="small" color={GET_BLUE_COLOR()}/>
                                                <Text style={styles.loadingText}>
                                                    {loadingText === '' ? i18n.t('loading', {defaultValue: 'Загрузка...'}) : loadingText}
                                                </Text>
                                            </View>
                                        </Surface>
                                    )}
                                </View>
                            </Animated.View>
                        }
                    </Animated.View>
                )}
            </View>
        </View>
    );

})

const styles = StyleSheet.create({
    blocked: {
        flex: 1,
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        left: 0,
        top: 0, 
        bottom: 0,
        right: 0
    },
    blockedWhite: {
        backgroundColor: 'rgba(255, 255, 255, 0.0)',
    },
    loading: {
        marginTop: -50,
        width: (SCREEN_WIDTH / 2), 
        height: 44,
        backgroundColor: 'rgba(255, 255, 255, 1.0)',

    },
    loadingInner: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    loadingText: {
        color: '#333',
        paddingLeft: 10
    },
    empty: {
        marginLeft: 20
    }
});

DarkPage.propTypes = {
    children: PropTypes.node,
    headerChildren: PropTypes.node,
    mode: PropTypes.string,
    i18nKey: PropTypes.string,
    defaultText: PropTypes.string,
    i18nProps: PropTypes.object,
    text: PropTypes.string,
    icon: PropTypes.string,
    extraText: PropTypes.string,
    displayNoConnection: PropTypes.bool,
    displayShadow: PropTypes.bool,
    displayMoreIcon: PropTypes.bool,
    displayEditIcon: PropTypes.bool,
    displayCartIcon: PropTypes.bool,
    displayShopIcon: PropTypes.bool,
    fontSize: PropTypes.number,
    closeHandler: PropTypes.func,
    cancelHandler: PropTypes.func,
    editHandler: PropTypes.func,
    cartDeleteHandler: PropTypes.func,
    activityIndicator: PropTypes.bool,
    isBlocked: PropTypes.bool,
    loadingText: PropTypes.string,
    fadeOut: PropTypes.bool,
    refreshPage: PropTypes.bool,
    refreshHandler: PropTypes.func,
    backgroundColor: PropTypes.string
}

DarkPage.defaultProps = {
    mode: DARK_PAGE_MODE.DEFAULT,
    text: '',
    icon: ICON_BACK,
    extraText: '',
    displayNoConnection: true,
    displayShadow: false,
    displayMoreIcon: false,
    displayEditIcon: false,
    displayCartIcon: false,
    displayShopIcon: false,
    fontSize: 20,
    activityIndicator: false,
    isBlocked: false,
    loadingText: '',
    fadeOut: false,
    refreshPage: false,
    backgroundColor: '#fff'
}

export default DarkPage;