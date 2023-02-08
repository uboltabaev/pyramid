import React, { useRef, useState, useReducer, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, SectionList, Animated, ActivityIndicator } from 'react-native';
import { observer, inject } from 'mobx-react';
import i18n from 'i18n-js';
import _ from 'underscore';
import CssHelper from "../../helpers/css_helper";
import { APP_MAIN_COLOR } from '../../constants/app';
import FrontendPage from '../../components/misc/frontend_page';
import Cart2Icon from '../../components/icons/cart2_icon';
import SpecialProduct from '../../components/home/special_product';
import CartItem, { CartSellerHeader } from '../../components/cart/cart_item';
import CartTotalBox from '../../components/cart/cart_totalbox';
import MiscHelper from '../../helpers/misc_helper';

const CartContainer = inject('mobxStore')(observer(({ mobxStore, navigation }) => {

    const [lang, setLanguage] = useState(i18n.locale)
    const [isMounted, setIsMounted] = useState(false)
    const [scrollY] = useState(new Animated.Value(0))

    const { language, isSignedIn, especiallyProducts } = mobxStore.userStore
    const cartItemsNum = mobxStore.cartStore.cartItemsNum

    const cartTotalBoxRef = useRef()
    let timeout = null
    const [, forceUpdate] = useReducer(x => x + 1, 0)

    useEffect(() => {
        if (isSignedIn) {
            timeout = setTimeout(() => {
                setIsMounted(true)
            }, 0);    
        } else {
            setIsMounted(true)
        }
        return () => {
            clearTimeout(timeout)
        }
    }, [])

    useEffect(() => {
        setLanguage(language)
    }, [language])

    useEffect(() => {
        scrollY.setValue(0)
    }, [isSignedIn])

    useEffect(() => {
        forceUpdate()
    }, [mobxStore.cartStore.updateTime])

    const getTitle = useCallback(() => {
        return MiscHelper.getCartTitle(isMounted ? cartItemsNum : 0)
    }, [isMounted, lang])

    const itemSeparatorComponent = () => {
        return (
            <View style={styles.rowSeparator}/>
        )
    }

    const closeTotalBox = () => {
        cartTotalBoxRef.current.closeTotalBox()
    }

    const deleteItem = () => {
        cartTotalBoxRef.current.deleteItem()
    }
    
    const title = getTitle()
    const cartItemsList = mobxStore.cartStore.cartItemsList

    return (
        <FrontendPage screenName="Cart" 
            i18nKey={title.i18nKey} 
            defaultText={title.defaultText} 
            navigation={navigation}
            i18nProps={title.amount}
            displayCart={cartItemsNum > 0 && isMounted}
            scrollY={scrollY}
            animateHeaderText={true}
            deleteHandler={deleteItem}
            language={lang}
        >
            { !isMounted ? (
                <View style={CssHelper['flexSingleCentered']}>
                    <ActivityIndicator size="large" color={APP_MAIN_COLOR}/>
                </View>
            ) : (
                cartItemsNum > 0 ? (
                    <View style={styles.content}>
                        <View style={CssHelper['flex']} onTouchStart={closeTotalBox}>
                            <Animated.FlatList data={especiallyProducts}
                                contentContainerStyle={styles.flatList}
                                renderItem={({ item, index }) => {
                                    return(
                                        <SpecialProduct product={item} 
                                            even={(index + 1) % 2 === 0} 
                                            navigation={navigation}
                                            language={lang}
                                        />
                                    )
                                }}    
                                showsVerticalScrollIndicator={false}
                                keyExtractor={item => item.id}
                                numColumns={2}
                                onEndReachedThreshold={0.5}
                                ItemSeparatorComponent={itemSeparatorComponent}
                                removeClippedSubviews={true}
                                columnWrapperStyle={{paddingHorizontal: 15}}
                                extraData={lang}
                                onScroll={
                                    Animated.event(
                                        [{nativeEvent: {contentOffset: {y: scrollY}}}],
                                        {
                                            useNativeDriver: false
                                        }
                                    )
                                }    
                                ListHeaderComponent={
                                    <View style={CssHelper['flex']}>
                                        <View style={styles.sectionListContainer}>
                                            <SectionList sections={cartItemsList}
                                                keyExtractor={(item, index) => item + index}
                                                extraData={lang}
                                                removeClippedSubviews={true}
                                                renderItem={({ item }) => <CartItem item={item} navigation={navigation} language={lang}/>}
                                                renderSectionHeader={({ section: { title } }) => (
                                                    <CartSellerHeader title={title}/>
                                                )}
                                            />
                                        </View>
                                        <Text style={styles.title}>
                                            {i18n.t('we_recommend_you', {defaultValue: 'Рекомендуем вам'})}
                                        </Text>
                                    </View>
                                }
                            />
                        </View>
                        <CartTotalBox language={lang} ref={cartTotalBoxRef}/>
                    </View>
                ) : (
                    <View style={CssHelper['empty.content']}>
                        <Cart2Icon width={72} height={72} color="#d3d3d3"/>
                        <Text style={CssHelper['empty.content.text']}>
                            {i18n.t('cart:empty', {defaultValue: 'У Вас нет товаров в Корзине'})}
                        </Text>
                    </View>
                )
            )}
        </FrontendPage>
    )
}))

const styles = StyleSheet.create({
    content: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
    rowSeparator: {
        height: 6
    },
    title: {
        fontWeight: 'bold',
        fontSize: 14,
        marginVertical: 10,
        marginHorizontal: 15
    },
    sectionListContainer: {
        backgroundColor: '#fff',
        marginTop: -10
    },
    flatList: {
        paddingBottom: 8
    }
});

export default CartContainer;