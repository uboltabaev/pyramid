import React, { useEffect, useReducer } from 'react';
import { StyleSheet, View, Text, Animated, RefreshControl, TouchableWithoutFeedback } from 'react-native';
import { useDispatch } from "react-redux";
import { observer, inject } from 'mobx-react';
import i18n from 'i18n-js';
import Ripple from 'react-native-material-ripple';
import { Surface } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import FrontendPage, { FRONTEND_HEADER_SCREEN_PROFILE } from '../../components/misc/frontend_page';
import { SPINNER_COLORS } from '../../constants/app';
import { SET_LAST_SCREEN_UPDATE } from "../../redux/constants/action-types";
import CssHelper from "../../helpers/css_helper";
import MiscHelper from '../../helpers/misc_helper';
import OrdersIcon from '../../components/icons/orders_icon';
import CouponIcon from '../../components/icons/coupon3_icon';
import PinIcon from '../../components/icons/pin_icon';
import UserAvatar, { USER_AVATAR_SIZE } from '../../components/ui/user_avatar';

const A = 15;

const HORIZONTAL_LINKS = [
    {navigateScreen: 'Favorites', i18nKey: 'favorites', defaultText: 'Избранное'},
    {navigateScreen: 'Subscriptions', i18nKey: 'subscriptions', defaultText: 'Подписки'},
    {navigateScreen: 'History', i18nKey: 'history', defaultText: 'История'},
    {navigateScreen: 'Coupons', i18nKey: 'coupons', defaultText: 'Купоны'},
];

const HorizontalItem = React.memo(({ navigateScreen, i18nKey, defaultText, navigation }) => {
    return (
        <Ripple style={CssHelper['flex']} rippleCentered={true} rippleSequential={true} onPress={() => navigation.navigate(navigateScreen)}>
            <View style={CssHelper['tab.item']}>
                <View style={CssHelper['tab.icon']}>
                    {(() => {
                        switch (navigateScreen) {
                            case 'Favorites':
                                return <MaterialIcons name="favorite-border" size={26}/>
                            case 'Subscriptions':
                                return <AntDesign name="staro" size={26}/>
                            case 'History':
                                return <MaterialCommunityIcons name="clock-outline" size={26}/>
                            case 'Coupons':
                                return <CouponIcon width={27} height={27}/>
                        }
                    })()}
                </View>
                <Text style={CssHelper['tab.item.text']} numberOfLines={1}>
                    {i18n.t(i18nKey, {defaultValue: defaultText})}
                </Text>
            </View>
        </Ripple>
    )
})

const MENU_ITEMS = [
    {navigateScreen: 'WaitingShipment', i18nKey: 'waiting_shipment', defaultText: 'Ожидается отправка'},
    {navigateScreen: 'Sent', i18nKey: 'sent', defaultText: 'Отправлено'}
];

const MENU_ITEMS2 = [
    {navigateScreen: 'SettingsShippingAddresses', i18nKey: 'settings:delivery_addresses', defaultText: 'Адреса доставки'},
    {navigateScreen: 'InviteFriends', i18nKey: 'invite_friends', defaultText: 'Пригласить друзей'},
    {navigateScreen: 'Faq', i18nKey: 'questions&answers', defaultText: 'Вопросы и ответы'}
]

const MENU_ITEMS3 = [
    {navigateScreen: 'Settings', i18nKey: 'settings', defaultText: 'Настройки'},
    {navigateScreen: 'ContactUs', i18nKey: 'feedback', defaultText: 'Обратная связь'}
]

const MenuItem = React.memo(({ navigateScreen, i18nKey, defaultText, hasTextClass = false, navigation }) => {
    return (
        <Ripple style={CssHelper['flex']} rippleCentered={false} rippleSequential={true} rippleFades={false} rippleOpacity={0.08} rippleDuration={300} onPress={() => navigation.navigate(navigateScreen)}>
            <View style={[CssHelper["menu.button"], styles['menu.button']]}>
                {(() => {
                    switch (navigateScreen) {
                        case 'SettingsShippingAddresses':
                            return <PinIcon width={22} height={22}/>
                        case 'InviteFriends':
                            return <Feather name="share-2" size={21} color="#333"/>
                        case 'Faq':
                            return <AntDesign name="questioncircleo" size={21}/>
                        case 'Settings':
                            return <AntDesign name="setting" size={24}/>
                        case 'ContactUs':
                            return <AntDesign name="edit" size={24}/>
                    }
                })()}
                <Text style={hasTextClass ? CssHelper["menu.icon_text"] : {}}>
                    {i18n.t(i18nKey, {defaultValue: defaultText})}
                </Text>
            </View>
        </Ripple>
    )
})

const MyProfileContainer = inject('mobxStore')(observer(({ mobxStore, navigation }) => {
    const [state, setState] = useReducer(
        (state, newState) => ({...state, ...newState}),
        {
            lang: i18n.locale,
            cardHeight: 0,
            refreshing: false,
            scrollY: new Animated.Value(0)
        }
    )
    
    const { lang, refreshing, scrollY } = state
    const { language, fullName, isSignedIn } = mobxStore.userStore

    const dispatch = useDispatch()

    useEffect(() => {
        setState({
            lang: language
        })
    }, [language])

    useEffect(() => {
        if (refreshing) {
            MiscHelper.wait(2000).then(() => {
                dispatch({
                    type: SET_LAST_SCREEN_UPDATE,
                    payload: {
                        screenName: 'MyProfile',
                        status: 'refresh'
                    }
                });
                setState({
                    refreshing: false
                })        
            });
        }
    }, [refreshing])

    const onRefresh = () => {
        setState({
            refreshing: true
        })
    }

    const getViewHeight = (event) => {
        const { height } = event.nativeEvent.layout;
        setState({
            cardHeight: height
        })
    }

    const cardHeight = state.cardHeight > 0 ? Math.floor(parseInt(state.cardHeight) / 2) : 0;

    return (
        <FrontendPage i18nKey="profile:title" 
            defaultText="Мой профиль" 
            screenName="MyProfile"
            screen={FRONTEND_HEADER_SCREEN_PROFILE}
            scrollY={scrollY}
            isSignedIn={isSignedIn}
            userFullname={fullName}
            navigation={navigation}
        >
            <Animated.ScrollView style={[CssHelper['frontend.content'], styles.content]}
                scrollEventThrottle={16}
                refreshControl={<RefreshControl colors={SPINNER_COLORS} refreshing={refreshing} onRefresh={onRefresh} />}
                onScroll={
                    Animated.event(
                        [{nativeEvent: {contentOffset: {y: scrollY}}}], 
                        { useNativeDriver: true }
                    )
                }
            >
                <LinearGradient colors={['rgba(255, 255, 255, 1.0)', 'rgba(255, 255, 255, 1.0)', 'rgba(255, 255, 255, 1.0)', 'rgba(255, 255, 255, 0)']} style={styles.topGradient}/>
                <TouchableWithoutFeedback onPress={() => isSignedIn ? navigation.navigate('SettingsProfile') : navigation.navigate('AuthIndex')}>
                    <View style={styles.userBox}>
                        <View style={CssHelper['flex']}>
                            { isSignedIn ? (
                                <Text style={CssHelper['frontend.title']} numberOfLines={1}>
                                    {fullName ? fullName : i18n.t('navigation:my_profile', {defaultValue: 'Мой профиль'})}
                                </Text>
                            ) : (
                                <Text style={CssHelper['frontend.title']} numberOfLines={1}>
                                    {i18n.t('login', {defaultValue: 'Войти'})}
                                </Text>
                            )}
                        </View>
                        <View style={styles.avatar}>
                            <UserAvatar size={USER_AVATAR_SIZE.BIG}/>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
                <Surface style={styles.card}>
                    <View style={CssHelper['tab']} onLayout={getViewHeight}>
                        { HORIZONTAL_LINKS.map((link, i) =>
                            <HorizontalItem key={i} navigateScreen={link.navigateScreen} i18nKey={link.i18nKey} defaultText={link.defaultText} navigation={navigation} language={lang}/> 
                        )}
                    </View>
                </Surface>
                <View style={[styles.orders, {marginTop: cardHeight !== 0 ? Math.abs(cardHeight) * -1 : 0, paddingTop: Math.abs(cardHeight) + A}]}>
                    <View style={styles.ordersTitleBox}>
                        <OrdersIcon width={24} height={24}/>
                        <Text style={CssHelper['orders.title']}>
                            {i18n.t('orders', {defaultValue: 'Заказы'})}
                        </Text>
                    </View>
                    { MENU_ITEMS.map((link, i) =>
                        <MenuItem key={i} navigateScreen={link.navigateScreen} i18nKey={link.i18nKey} defaultText={link.defaultText} hasTextClass={false} navigation={navigation} language={lang}/>
                    )}
                </View>
                <View style={styles.box}>
                    { MENU_ITEMS2.map((link, i) =>
                        <MenuItem key={i} navigateScreen={link.navigateScreen} i18nKey={link.i18nKey} defaultText={link.defaultText} hasTextClass={true} navigation={navigation} language={lang}/>
                    )}
                </View>
                <View style={styles.box}>
                    { MENU_ITEMS3.map((link, i) =>
                        <MenuItem key={i} navigateScreen={link.navigateScreen} i18nKey={link.i18nKey} defaultText={link.defaultText} hasTextClass={true} navigation={navigation} language={lang}/>
                    )}
                </View>
            </Animated.ScrollView>
        </FrontendPage>
    )
}))

const styles = StyleSheet.create({
    content: {
        paddingTop: 0,
        paddingLeft: 0,
        paddingRight: 0,
        backgroundColor: '#f5f5f5',
        zIndex: 1
    },
    topGradient: {
        zIndex: 2, 
        height: 100, 
        width: '100%', 
        position: 'absolute',
    },
    userBox: {
        paddingTop: 72,
        zIndex: 3,
        position: 'relative',
        marginHorizontal: 15,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
    },
    card: {
        flex: 1, 
        marginTop: 3, 
        marginBottom: 3, 
        marginLeft: 15, 
        marginRight: 15,
        position: "relative",
        zIndex: 99999,
        width: 'auto',
        elevation: 5,
        borderRadius: 8
    },
    orders: {
        flex: 1,
        backgroundColor: "#fff",
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        paddingTop: 15,
        position: "relative",
        zIndex: 998,
        marginTop: -50
    },
    ordersTitleBox: {
        flex: 1,
        flexDirection: "row",
        paddingLeft: 17,
        paddingRight: 17,
        marginBottom: 7
    },
    box: {
        backgroundColor: "#fff",
        marginTop: 15
    },
    avatar: {
        marginLeft: 15
    },
    "menu.button": {
        paddingLeft: 17,
        paddingRight: 17,
        paddingTop: 12,
        paddingBottom: 12
    }
});

export default MyProfileContainer;