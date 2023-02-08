import React, { useState, useEffect } from 'react';
import {StyleSheet, View, Text} from 'react-native';
import i18n from 'i18n-js';
import { observer, inject } from 'mobx-react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import HomeContainer from '../containers/main/home_container';
import FeedsContainer from '../containers/main/feeds_container';
//import InboxContainer from '../containers/main/inbox_container';
import CartContainer from '../containers/main/cart_container';
import MyProfileContainer from '../containers/main/profile_container';
import { APP_MAIN_COLOR, NAV_DEFAULT_COLOR } from '../constants/app';
import CartIcon from '../components/icons/cart_icon';
import CssHelper from '../helpers/css_helper';
import Ripple from '../components/ui/ripple';

const Icon = React.memo(({ name, badgeCount, color }) => {
    switch(name) {
        case 'Home':
            return(
                <View style={[CssHelper['flexSingleCentered'], {width: 27}]}>
                    <AntDesign name="home" size={27} color={color}/>
                </View>
            );
        case 'Feeds': 
            return(
                <View style={[CssHelper['flexSingleCentered'], {width: 27}]}>
                    <Feather name="rss" size={27} color={color}/>
                </View>
            );
        case 'Inbox': 
            return(
                <View style={[CssHelper['flexSingleCentered'], {width: 27}]}>
                    <SimpleLineIcons name="bubbles" size={27} color={color}/>
                    {badgeCount > 0 && (
                        <View style={CssHelper['badge']}>
                            <Text style={CssHelper['badgeText']}>{badgeCount}</Text>
                        </View>
                    )}
                </View>
            );
        case 'Cart': 
            return(
                <View style={[CssHelper['flexSingleCentered'], {width: 27}]}>
                    <CartIcon width={25} height={25} color={color}/>
                </View>
            );
        case 'MyProfile':
            return(
                <View style={[CssHelper['flexSingleCentered'], {width: 27}]}>
                    <Feather name="user" size={26} color={color}/>
                </View>
            );
        default:
            return null;
    }    
});

const MyTabBar = React.memo(({ state, descriptors, navigation }) => {
    const focusedOptions = descriptors[state.routes[state.index].key].options;
    if (focusedOptions.tabBarVisible === false) {
        return null;
    }
    return (
        <View style={styles.menu}>
            <View style={CssHelper['flexRowCentered']}>
                { state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const label =
                        options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                        ? options.title
                        : route.name;
                    const isFocused = state.index === index;
                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });
            
                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };
                    const onLongPress = () => {
                        navigation.emit({
                            type: 'tabLongPress',
                            target: route.key,
                        });
                    };
                    return (
                        <Ripple accessibilityRole="button"
                            accessibilityStates={isFocused ? ['selected'] : []}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            testID={options.tabBarTestID}
                            onPress={onPress}
                            onLongPress={onLongPress}
                            style={styles.tabStyle}
                            pressColor='rgba(0, 0, 0, 0.1)'
                            key={index}
                        >
                            <Icon name={route['name']} color={isFocused ? APP_MAIN_COLOR : NAV_DEFAULT_COLOR} badgeCount={17}/>
                            <View style={CssHelper['flex']}>
                                <Text style={[styles.labelStyle, {color: isFocused ? APP_MAIN_COLOR : NAV_DEFAULT_COLOR}]}>
                                    {label}
                                </Text>
                            </View>
                        </Ripple>
                    );
                })}
            </View>
        </View>
    );
}); 

const Tab = createBottomTabNavigator();

const styles = StyleSheet.create({
    menu: {
        backgroundColor: '#f9f9f9',
        paddingRight: 5,
        width: '100%',
        height: 58,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
    },
    tabStyle: {
        paddingTop: 8,
        paddingHorizontal: 0,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    labelStyle: {
        textTransform: 'capitalize',
        fontSize: 9.5,
        paddingTop: 5
    }
});

const BottomTabs = inject('mobxStore')(observer(({ mobxStore }) => {
    const [lang, setLanguage] = useState(i18n.locale)
    const { language } = mobxStore.userStore

    useEffect(() => {
        setLanguage(language)
    }, [language])

    return (
        <Tab.Navigator initialRouteName="Home" tabBar={props => <MyTabBar {...props} />} lazy={false}>
            <Tab.Screen name="Home" component={HomeContainer} options={{title: i18n.t('navigation:home', {defaultValue: 'Главная'})}}/>
            <Tab.Screen name="Feeds" component={FeedsContainer} options={{title: i18n.t('navigation:interesting', {defaultValue: 'Интересное'})}}/>
            <Tab.Screen name="Inbox" component={FeedsContainer} options={{title: i18n.t('navigation:inbox', {defaultValue: 'Сообщения'})}}/>
            <Tab.Screen name="Cart" component={CartContainer} options={{title: i18n.t('navigation:cart', {defaultValue: 'Корзина'})}}/>
            <Tab.Screen name="MyProfile" component={MyProfileContainer} options={{title: i18n.t('navigation:my_profile', {defaultValue: 'Мой профиль'})}}/>
        </Tab.Navigator>
    )
}))

export default BottomTabs;