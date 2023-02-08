import React, { useEffect, useReducer, useState, useCallback, useRef } from 'react';
import { StatusBar, View, StyleSheet, Text, Animated } from 'react-native';
import { observer, inject } from 'mobx-react';
import { Surface } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image';
import i18n from 'i18n-js';
import _ from 'underscore';
import AsyncStorage, { ASYNC_STORAGE_KEYS } from '../../library/async_storage';
import { SCREEN_WIDTH } from '../../constants/app';
import CssHelper from '../../helpers/css_helper';
import HomeDb from '../../firebase/home';
import ProductsDb from '../../firebase/products';
import UserCartDb from '../../firebase/user_cart';
import UserProfileHelper from '../../firebase/helpers/user_profile';
import Searchbar, { SEARCH_BAR_MODE } from '../../components/home/searchbar';
import Ripple from '../../components/ui/ripple';
import HomeCarousel from '../../components/home/carousel';
import ScrollViewI from '../../components/ui/scrollviewi';
import TopLink from '../../components/home/toplink';
import NewUserCoupon from '../../components/home/new_user_coupon';
import StartPoint from '../../components/home/start_point';
import SuperDeals from '../../components/home/super_deals';
import Ratings from '../../components/home/ratings';
import Sections from '../../components/home/sections';
import DiscountCategories from '../../components/home/discount_categories';
import SpecialProduct from "../../components/home/special_product";

const TOP_LINKS = [
    {screen: 'Categories', i18Key: 'categories', defaultText: 'Категории'},
    {screen: 'Under10', i18Key: 'under10', defaultText: 'До 10K'},
    {screen: 'Top100', i18Key: 'hot', defaultText: 'Горящие товары'},
    {screen: 'Coupons', i18Key: 'coupons', defaultText: 'Купоны'},
    {screen: 'New', i18Key: 'new', defaultText: 'Новые'},
    {screen: 'NewSellers', i18Key: 'new_sellers', defaultText: 'Новые продавцы'},
    {screen: 'Discounts', i18Key: 'discounts', defaultText: 'Скидки'}
];

const HomeContainer = inject('mobxStore')(observer(({ mobxStore, navigation }) => {
    const [state, setState] = useReducer(
        (state, newState) => ({...state, ...newState}),
        {
            isReady: false,
            slides: [],
            discountCategories: [],
            lang: i18n.locale
        }
    )
    const [scrollY] = useState(new Animated.Value(0))
    const [elevation, setElevation] = useState(false)
    const { isReady, slides, discountCategories, lang } = state
    
    const flatListRef = useRef(null);

    //const storeLanguage = useSelector(state => state.user.language);
    /*const { storeLanguage, uid, isSignedIn, especiallyProducts } = useSelector(state => ({
        storeLanguage: state.user.language,
        uid: state.user.uid,
        isSignedIn: state.user.isSignedIn,
        especiallyProducts: state.user.especiallyProducts
    }));*/
    const { language, uid, isSignedIn, especiallyProducts } = mobxStore.userStore

    useEffect(() => {
        async function fetch() {
            const storageLang = await AsyncStorage.getData(ASYNC_STORAGE_KEYS.LANGUAGE)
            if (storageLang) {
                i18n.locale = storageLang
                setState({
                    lang: storageLang
                })
                mobxStore.userStore.setLanguage(storageLang)
            }
            const homeData = await HomeDb.getHome()
            if (homeData) {
                setState({
                    slides: homeData.getSlides(),
                    discountCategories: homeData.getDiscountCategories()
                })
            }
            const profile = await UserProfileHelper.getUserProfile()
            if (profile) {
                mobxStore.userStore.setIsSignedIn(true)
                mobxStore.userStore.setValues(profile)
            }
        }
        fetch()
    }, [])

    useEffect(() => {
        async function fetch() {
            const especially = await ProductsDb.getEspeciallyProducts()
            if (especially) {
                mobxStore.userStore.setValues({
                    especiallyProducts: especially
                })
            }
            const items = await UserCartDb.getUserCart(uid)
            if (items.length > 0) {
                mobxStore.cartStore.setValues({
                    cartItems: items
                })
            }
        }
        fetch()
    }, [isSignedIn])

    useEffect(() => {
        setState({
            lang: language
        })
    }, [language])

    useEffect(() => {
        if (_.isObject(flatListRef.current)) {
            flatListRef.current.scrollToOffset({
                x: 0, 
                y: 0, 
                animated: false
            });
        }
    }, [isSignedIn])

    const ItemSeparatorComponent = useCallback(() => {
        return (
            <View style={styles.rowSeparator}/>
        )
    }, [])

    scrollY.addListener((obj) => {
        const { value } = obj,
            elevationVal = value > 50 ? true : false;
        if (elevationVal !== elevation) {
            setElevation(elevationVal)
        }
    })

    const opacity = scrollY.interpolate({
        inputRange: [0, 50],
        outputRange: [0, 1]
    });
    const headerBgOpacity = scrollY.interpolate({
        inputRange: [45, 45],
        outputRange: [0, 1]
    });

    return(
        <>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true}/>
            <View style={[CssHelper['frontend.container'], styles.container]}>
                <Animated.View style={[styles.headerBackground, {opacity}]}>
                    <Surface style={[styles.surface, {elevation: elevation ? 10: 0}]}/>
                </Animated.View>
                <View style={styles.header}>
                    <View style={CssHelper['flexRowCentered']}>
                        <Searchbar navigation={navigation} scrollY={scrollY} mode={SEARCH_BAR_MODE.HOME}/>
                        <View style={styles.divider}/>
                        <Ripple>
                            <Ionicons name="md-camera" color="white" size={28}/>
                            <Animated.View style={[styles.cameraIcon, {opacity: headerBgOpacity}]}>
                                <Ionicons name="md-camera" size={28} iconStyle={{color: '#0e1e47'}}/>
                            </Animated.View>
                        </Ripple>
                    </View>
                </View>
                <View style={styles.scrollContainer}>
                    <Animated.FlatList data={especiallyProducts} 
                        contentContainerStyle={styles.flatList}
                        ref={flatListRef}
                        keyExtractor={item => item.id}
                        numColumns={2}
                        showsVerticalScrollIndicator={false}
                        removeClippedSubviews={true}
                        onEndReachedThreshold={0.5}
                        extraData={lang}
                        columnWrapperStyle={{paddingHorizontal: 15}}
                        ItemSeparatorComponent={ItemSeparatorComponent}
                        onScroll={
                            Animated.event(
                                [{nativeEvent: {contentOffset: {y: scrollY}}}], 
                                { useNativeDriver: true }
                            )
                        }
                        renderItem={({ item, index }) => 
                            <SpecialProduct product={item} 
                                even={(index + 1) % 2 === 0} 
                                navigation={navigation} 
                                language={lang}
                            />
                        }
                        ListHeaderComponent={
                            <View style={CssHelper['flex']}>
                                <View style={styles.top}>
                                    <View style={styles.topInner}>
                                        <HomeCarousel slides={slides}/>
                                    </View>
                                </View>
                                <ScrollViewI style={styles.scrollableLinks}>
                                    <View style={styles.scrollableLinksInner}>
                                        { TOP_LINKS.map((link, i) => 
                                            <TopLink key={i} screen={link.screen} index={i} i18Key={link.i18Key} defaultText={link.defaultText} navigation={navigation} language={lang}/>
                                        )}
                                    </View>
                                </ScrollViewI>
                                <View style={styles.newUserCoupon}>
                                    <NewUserCoupon language={lang}/>
                                </View>
                                <View style={[styles.rootContents]}>
                                    <View style={styles.jumping}>
                                        <FastImage source={require('../../../assets/images/room.jpg')} resizeMode={FastImage.resizeMode.cover} style={CssHelper['image']}/>
                                    </View>
                                    <View style={styles.sph}>
                                        <View style={styles.sphInner}>
                                            <Text style={styles.sphText} numberOfLines={1}>
                                                {i18n.t('super_discount_home', {defaultValue: 'Супер скидки для дома'})}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.startPoint}>
                                        <StartPoint language={lang}/>
                                    </View>
                                </View>
                                <View style={styles.otherContents}>
                                    <Ratings style={styles.blocks}/>
                                    {/*
                                    <Sections style={styles.blocks} language={lang}/>
                                    */}
                                </View>
                                <View style={styles.discountCategories}>
                                    <DiscountCategories categories={discountCategories} language={lang}/>
                                </View>
                                { especiallyProducts.length > 0 &&
                                    <Text style={styles.title}>
                                        {i18n.t('especially_for_you', {defaultValue: 'Специально для вас'})}
                                    </Text>
                                }
                            </View>
                        }
                    />
                </View>
            </View>
        </>
    );
}))

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#e9eced'
    },
    top: {
        height: 225,
        marginTop: 0
    },
    topInner: {
        backgroundColor: '#c8d0d3', 
        height: 200
    },
    headerBackground: {
        position: 'absolute', 
        height: 85, 
        top: 0, 
        width: '100%', 
        zIndex: 999998
    },
    surface: {
        flex: 1,
        backgroundColor: '#c8d0d3',
        width: '100%',
        elevation: 0
    },
    header: {
        flex: 1,
        alignItems: "center",
        paddingTop: 35,
        paddingBottom: 10,
        paddingLeft: 15,
        paddingRight: 15,
        zIndex: 999999,
        maxHeight: 85,
        borderWidth: 0,
        borderColor: 'transparent'
    },
    divider: {
        width: 12.5
    },
    cameraIcon: {
        position: 'absolute', 
        width: 28, 
        height: 28, 
        left: 0, 
        top: 5.5
    },
    flatList: {
        paddingBottom: 8
    },
    scrollContainer: {
        flex: 1, 
        marginTop: -85
    },
    scrollableLinks: {
        marginTop: 22,
        paddingBottom: 5
    },
    scrollableLinksInner: {
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 15
    },
    newUserCoupon: {
        marginHorizontal: 15,
        marginBottom: 10
    },
    rootContents: {
        paddingTop: 15,
    },
    jumping: {
        position: 'absolute', 
        right: 0, 
        left: 0, 
        top: 0, 
        height: 190,
        width: SCREEN_WIDTH,
        borderWidth: 0
    },
    startPoint: {
        marginTop: 5,
        marginHorizontal: 15
    },
    otherContents: {
        paddingHorizontal: 15,
        paddingTop: 2,
        paddingBottom: 10
    },
    blocks: {
        marginTop: 10
    },
    sph: {
        height: 20, 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginBottom: 2
    },
    sphInner: {
        backgroundColor: '#fff', 
        width: '45%', 
        borderRadius: 10, 
        paddingVertical: 2,
        paddingHorizontal: 5
    },
    sphText: {
        textAlign: 'center', 
        fontSize: 11.5, 
        lineHeight: 13, 
        fontWeight: 'bold'
    },
    discountCategories: {
        paddingHorizontal: 0
    },
    title: {
        fontWeight: 'bold',
        fontSize: 14,
        marginVertical: 10,
        marginHorizontal: 15
    },
    rowSeparator: {
        height: 6
    }
});

export default HomeContainer;