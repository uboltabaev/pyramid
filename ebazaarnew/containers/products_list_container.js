import React, { useState, useReducer, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, View, Text, StatusBar, Image, Animated, ScrollView } from 'react-native';
import Ripple from 'react-native-material-ripple';
import Drawer from 'react-native-drawer';
import _ from 'underscore';
import i18n from 'i18n-js';
import { APP_MAIN_COLOR, SCREEN_WIDTH, VIEW_MODE_LIST, VIEW_MODE_GRID, FILTER_FREE_SHIPMENT, FILTER_RATING, FILTER_BRAND, FILTER_COLOR, FILTER_CELLULAR_STANDART, FILTER_OPERATING_SYSTEM, FILTER_PRODUCT_CONDITION, FILTER_SIM_CARDS_NUM, FILTER_INTERNAL_MEMORY, FILTER_RAM, FILTER_SCREEN_SIZE, FILTER_DISPLAY_RESOLUTION } from "../constants/app";
import CssHelper from "../helpers/css_helper";
import MiscHelper from '../helpers/misc_helper';
import BackIcon from '../components/icons/back_icon';
import SearchIcon from '../components/icons/search_icon';
import ListIcon from '../components/icons/list_icon';
import FourBoxesIcon from '../components/icons/four-boxes_icon';
import FilterIcon from '../components/icons/filter_icon';
import PopNav from '../components/popup_nav';
import GridPlaceholder from '../components/products-list/grid_placeholder';
import ListPlaceholder from '../components/products-list/list_placeholder';
import Product from '../components/products-list/product';
import Loading from '../components/products-list/loading';
import Card from '../components/products-list/card';
import FilterMenu from '../components/products-list/filter_menu';
import DropDownMenu from '../components/ui/dropdown_menu';
import FilterButton, { STATUS_DEFAULT_FILTER_BUTTON, STATUS_PRESSED_FILTER_BUTTON } from '../components/ui/filter_button';
import Sale from '../components/ui/sale';
import CouponIcon from '../components/icons/coupon_icon';
import MyRipple from '../components/ui/ripple';

const FILTER_AREA_HEIGHT = 80;
const LIST_PRODUCT_AREA_WIDTH = '42%';
const LIST_PRODUCT_LEFT_PADDING = 10;
const LIST_PRODUCT_RIGHT_PADDING = 10;
const LIST_PRODUCT_RIGHT_BOX_LEFT_PADDING = 10;

// View mode is saved in the db for all categories
const SORT_ITEMS = [
    {id: 1, i18n: 'sort:best_match', defaultText: 'Лучшее совпадение'},
    {id: 2, i18n: 'sort:order_asc', defaultText: 'Цена (по возрастанию)'},
    {id: 3, i18n: 'sort:order_desc', defaultText: 'Цена (по убыванию)'},
    {id: 4, i18n: 'sort:order_created_desc', defaultText: 'Дата добавления (от нового к старому)'},
];

const DEFAULT_SORT = 1;
const FILTER_SALE = 'filterSale';
const FILTER_SPECIAL_COUPON = 'specialCoupon';
const FILTER_FREE_SHIPPING = 'freeShipping';

const PRODUCTS = [
    {
        id: '1',
        name: 'Смартфон Samsung Galaxy S10+ | S10 | S10e. Galaxy S10 От 68 990 ₽. Galaxy', 
        discountPrice: '3600000', 
        price: '4200000',
        discountPercentage: '20', 
        freeShipment: true, 
        rating: '4.7', 
        soldQuantity: 99,
        sale: false,
        imageSource: require("../../assets/images/smartphones/galaxys10.png")
    },
    {
        id: '2',
        name: 'Ulefone Note 7 — один из самых недорогих смартфонов на рынке с 6,1-дюймовым экраном и тройной камерой', 
        discountPrice: '246448', 
        price: '379201',
        discountPercentage: '35', 
        freeShipment: true, 
        rating: '4.9', 
        soldQuantity: 273,
        sale: true,
        imageSource: require("../../assets/images/smartphones/ulefone-note7.png")
    },
    {
        id: '3',
        name: 'Смартфон Samsung Galaxy J6 (2018) 32GB — купить сегодня c доставкой и гарантией по выгодной цене. 3 предложения в проверенных магазинах', 
        discountPrice: '1000000', 
        price: '1200000',
        discountPercentage: '20', 
        freeShipment: true, 
        rating: '4.2', 
        soldQuantity: 273,
        sale: false,
        imageSource: require("../../assets/images/smartphones/samsungj6.png")
    },
    {
        id: '4',
        name: 'Смартфон Samsung Galaxy S10+ | S10 | S10e. Galaxy S10 От 68 990 ₽. Galaxy', 
        discountPrice: '3600000', 
        price: '4200000',
        discountPercentage: '20', 
        freeShipment: true, 
        rating: '4.7', 
        soldQuantity: 99,
        sale: false,
        imageSource: require("../../assets/images/smartphones/galaxys10.png")
    },
    {
        id: '5',
        name: 'Ulefone Note 7 — один из самых недорогих смартфонов на рынке с 6,1-дюймовым экраном и тройной камерой', 
        discountPrice: '246448', 
        price: '379201',
        discountPercentage: '35', 
        freeShipment: true, 
        rating: '4.9', 
        soldQuantity: 273,
        sale: false,
        imageSource: require("../../assets/images/smartphones/ulefone-note7.png")
    },
    {
        id: '6',
        name: 'Смартфон Samsung Galaxy J6 (2018) 32GB — купить сегодня c доставкой и гарантией по выгодной цене. 3 предложения в проверенных магазинах', 
        discountPrice: '1000000', 
        price: '1200000',
        discountPercentage: '20', 
        freeShipment: true, 
        rating: '4.2', 
        soldQuantity: 273,
        sale: true,
        imageSource: require("../../assets/images/smartphones/samsungj6.png")
    }
];

const getListImageWidth = () => {
    const sW = Math.round(SCREEN_WIDTH),
        t = LIST_PRODUCT_LEFT_PADDING + LIST_PRODUCT_RIGHT_PADDING,
        d = sW - t;
    return (Math.round((d / 100) * parseInt(LIST_PRODUCT_AREA_WIDTH)));
}

const getListImageHeight = (imageSource, calculatedWidth) => {
    const image = Image.resolveAssetSource(imageSource);
    return (calculatedWidth * image.height / image.width);
}

function ProductsListContainer({ navigation }) {
    const [scrollAnim] = useState(new Animated.Value(0))
    const [clampedScroll] = useState(
        Animated.diffClamp(
            Animated.add(
                scrollAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1],
                    extrapolateLeft: 'clamp',
                }),
                new Animated.Value(0),
            ),
            0,
            FILTER_AREA_HEIGHT,
        )
    )
    
    // Filters statement
    const f = {};
    f[FILTER_FREE_SHIPMENT] = false;
    f[FILTER_RATING] = false;
    f[FILTER_BRAND] = false;
    f[FILTER_COLOR] = false;
    f[FILTER_CELLULAR_STANDART] = false;
    f[FILTER_OPERATING_SYSTEM] = false;
    f[FILTER_PRODUCT_CONDITION] = false;
    f[FILTER_SIM_CARDS_NUM] = false;
    f[FILTER_INTERNAL_MEMORY] = false;
    f[FILTER_RAM] = false;
    f[FILTER_SCREEN_SIZE] = false;
    f[FILTER_DISPLAY_RESOLUTION] = false;
    ////////////////////

    const [state, setState] = useReducer(
        (state, newState) => ({...state, ...newState}),
        {
            isLoading: true,
            viewMode: VIEW_MODE_LIST,
            filters: f,
            filterSale: false,
            specialCoupon: false,
            freeShipping: false
        }
    )

    const { isLoading, viewMode, filters, filterSale, specialCoupon, freeShipping } = state
    const drawerRef = useRef(null)
    let timeout = null

    useEffect(() => {
        clearTimeout(timeout)
        setTimeout(() => {
            setState({
                isLoading: false
            })
        }, 500)    
    }, [])

    useEffect(() => {
        setTimeout(() => {
            setState({
                isLoading: false
            })
        }, 500)
    }, [viewMode])

    const ItemSeparatorComponent = useCallback(() => {
        return (
            <View style={styles.rowSeparator}/>
        )
    }, [])

    const goBack = () => {
        timeout = setTimeout(() => {
            navigation.goBack();
        }, 50)
    }

    const changeViewMode = () => {
        const mode = viewMode === VIEW_MODE_LIST ? VIEW_MODE_GRID : VIEW_MODE_LIST;
        setState({
            viewMode: mode, 
            isLoading: true
        })
    }

    const cancelFilter = () => {
        _.each(filters, (v, k) => {
            filters[k] = false;
        });
        setState({
            filters
        })
    }

    const openDrawer = () => {
        drawerRef.current.open()
    }

    const closeDrawer = () => {
        drawerRef.current.close()
    }

    const toggleFilter = (name, value) => {
        if (_.isUndefined(value))
            filters[name] = !filters[name];
        else {
            const v = filters[name];
            filters[name] = value === v ? false : value;
        }
        setState({
            filters
        })
    }

    const filter = (option) => {
        const a = {}
        a[option] = !state[option];
        setState(a)
    }

    const navbarTranslate = clampedScroll.interpolate({
        inputRange: [0, FILTER_AREA_HEIGHT],
        outputRange: [0, -FILTER_AREA_HEIGHT],
        extrapolate: 'clamp'
    })

    return (
        <Drawer ref={drawerRef}
            onClose={closeDrawer}
            content={
                !isLoading ?
                    <FilterMenu filters={filters} toggleFilter={toggleFilter} cancelFilter={cancelFilter} onFilterMenuClose={''}/>
                :
                    <View></View>
            } 
            type="overlay"
            tapToClose={true}
            openDrawerOffset={0.15}
            panOpenMask={0.80}
            panCloseMask={0.2}
            styles={{mainOverlay: {backgroundColor: 'rgba(0, 0, 0, 0.5)', opacity: 0}}}
            side="right"
            tweenHandler={(ratio) => ({
                mainOverlay: { opacity: ( ratio / 2 )}
            })}
        >
            <View style={CssHelper['flex']}>
                <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true}/>
                <View style={CssHelper['darkPage.container']}>
                    <View style={[CssHelper['darkPage.header'], {position: 'relative', zIndex: 50}]}>
                        <View style={[CssHelper['darkPage.innerHeader'], styles['darkPage.innerHeader']]}>
                            <MyRipple pressColor={'rgba(255, 255, 255, 0.20)'} onPress={goBack}>
                                <View style={{marginHorizontal: 10}}>
                                    <BackIcon width={18} height={18} color="#fff"/>
                                </View>
                            </MyRipple>
                            <Text style={CssHelper['darkPage.title']} numberOfLines={1}>
                                {i18n.t('category:smartphones&accessories:mobile_phones', {defaultValue: 'Мобильные телефоны'})}
                            </Text>
                            <View style={styles.searchContainer}>
                                <SearchIcon width={22} height={22} color="#fff"/>
                            </View>
                            <PopNav navigation={navigation} theme="dark" triggerIconSize={18}/>
                        </View>
                    </View>
                    <>
                        <View>
                            <Animated.View style={[styles.filterArea, {transform: [{translateY: navbarTranslate}], position: 'absolute'}]}>
                                <View style={[styles.filterAreaInner, styles.filterAreaTop]}>
                                    <DropDownMenu sort={DEFAULT_SORT} sortItems={SORT_ITEMS} textStyle={{color: APP_MAIN_COLOR}} iconColor={APP_MAIN_COLOR} display="flex"/>
                                    <Ripple style={styles.listView} rippleCentered={true} rippleSequential={true} rippleFades={false} rippleOpacity={0.08} rippleDuration={150} onPress={changeViewMode}>
                                        <View style={CssHelper['flexRowCentered']}>
                                            { viewMode === VIEW_MODE_LIST ? (
                                                <ListIcon width={20} height={20} color="#333333"/>
                                            ) : (
                                                <FourBoxesIcon width={20} height={20} color="#333333"/>
                                            )}
                                        </View>
                                    </Ripple>
                                    <View style={styles.divider}></View>
                                    <Ripple style={styles.filterMenu} rippleCentered={true} rippleSequential={true} rippleFades={false} rippleOpacity={0.08} rippleDuration={150} onPress={openDrawer}>
                                        <View style={styles.filterMenuInner}>
                                            <FilterIcon width={22} height={22} color={APP_MAIN_COLOR}/>
                                            <Text style={styles.filterText}>
                                                {i18n.t('filter', {defaultValue: 'Фильтр'})}
                                            </Text>
                                        </View>
                                    </Ripple>
                                </View>
                                <View style={[styles.filterAreaBottom]}>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                        <FilterButton status={filterSale ? STATUS_PRESSED_FILTER_BUTTON : STATUS_DEFAULT_FILTER_BUTTON} style={[styles.filterButton, styles.filterButtonFirst]} onPress={() => filter(FILTER_SALE)}>
                                            <Sale />
                                        </FilterButton>
                                        <FilterButton status={specialCoupon ? STATUS_PRESSED_FILTER_BUTTON : STATUS_DEFAULT_FILTER_BUTTON} style={styles.filterButton} onPress={() => filter(FILTER_SPECIAL_COUPON)}>
                                            <CouponIcon width={24} height={24} color={APP_MAIN_COLOR}/>
                                            <Text style={styles.filterButtonTextPadding}>
                                                {i18n.t('special_coupon', {defaultValue: 'Спецкупон'})}
                                            </Text>
                                        </FilterButton>
                                        <FilterButton status={freeShipping ? STATUS_PRESSED_FILTER_BUTTON : STATUS_DEFAULT_FILTER_BUTTON} style={[styles.filterButton, styles.filterButtonLast]} onPress={() => filter(FILTER_FREE_SHIPPING)}>
                                            <Text style={styles.filterButtonText}>
                                                {i18n.t('free_shipping', {defaultValue: 'Бесплатная доставка'})}
                                            </Text>
                                        </FilterButton>
                                    </ScrollView>
                                </View>
                            </Animated.View>
                        </View>
                        { viewMode === VIEW_MODE_LIST ? (
                            isLoading ? (
                                <ListPlaceholder marginTop={FILTER_AREA_HEIGHT} itemsNum={6} imageWidth={getListImageWidth()} listAreaWidth={LIST_PRODUCT_AREA_WIDTH}/>
                            ) : (
                                <Animated.FlatList data={PRODUCTS}
                                    contentContainerStyle={[styles.content]}
                                    renderItem={({ item, index }) => {
                                        return(
                                            <Ripple key={index} rippleFades={false} rippleOpacity={0.08} onPress={() => navigation.navigate('Product')}>
                                                <View style={[styles.productBox, {backgroundColor: index % 2 === 0 ? '#fff' : '#f5f5f5'},{paddingTop: index === 0 ? 0 : 5}]}>
                                                    <View style={[styles.productBoxL, {height: getListImageHeight(item.imageSource, getListImageWidth())}]}>
                                                        <Image style={[styles.productImage]} source={item.imageSource} resizeMode="cover" fadeDuration={100}/>
                                                    </View>
                                                    <View style={styles.productBoxR}>
                                                        <Product product={item} mode={viewMode}/>
                                                    </View>
                                                </View>
                                            </Ripple>
                                        )
                                    }}
                                    showsVerticalScrollIndicator={false}
                                    keyExtractor={item => item.id}
                                    numColumns={1}
                                    removeClippedSubviews={true}        
                                    onEndReachedThreshold={0.5}
                                    ItemSeparatorComponent={ItemSeparatorComponent}
                                    removeClippedSubviews={true}
                                    onScroll={Animated.event(
                                        [{ nativeEvent: { contentOffset: { y: scrollAnim }}}],
                                        {useNativeDriver: true}
                                    )}
                                    ListFooterComponent={
                                        <Loading />
                                    }
                                />
                            )
                        ) : (
                            isLoading ? (
                                <View style={styles.content}>
                                    <GridPlaceholder itemsNum={4}/>
                                </View>
                            ) : (
                                <Animated.FlatList data={PRODUCTS}
                                    contentContainerStyle={[styles.content, {paddingTop: 85, backgroundColor: '#f5f5f5'}]}
                                    renderItem={({ item, index }) => {
                                        return(
                                            <Card product={item}
                                                even={(index + 1) % 2 === 0} 
                                                viewMode={viewMode} 
                                                navigation={navigation}
                                                key={index}
                                            />
                                        )
                                    }}
                                    showsVerticalScrollIndicator={false}
                                    keyExtractor={item => item.id}
                                    numColumns={2}
                                    removeClippedSubviews={true}        
                                    onEndReachedThreshold={0.5}
                                    ItemSeparatorComponent={ItemSeparatorComponent}
                                    removeClippedSubviews={true}
                                    columnWrapperStyle={{paddingHorizontal: 10}}
                                    onScroll={Animated.event(
                                        [{ nativeEvent: { contentOffset: { y: scrollAnim }}}],
                                        {useNativeDriver: true}
                                    )}
                                    ListFooterComponent={
                                        <Loading />
                                    }
                                />
                            )
                        )}
                    </>
                </View>
            </View>
        </Drawer>
    )
}

const styles = StyleSheet.create({
    content: {
        paddingTop: 82
    },
    searchContainer: {
        marginRight: 10
    },
    "darkPage.innerHeader": {
        paddingRight: 0, 
        paddingLeft: 5
    },
    filterArea: {
        backgroundColor: '#fff',
        width: SCREEN_WIDTH,
        height: FILTER_AREA_HEIGHT,
        position: 'relative',
        zIndex: 49,
    },
    filterAreaInner: {
        flex: 1,
        flexDirection: "row",
        alignItems: 'center',
    },
    filterAreaTop: {
        borderBottomWidth: 1,
        borderColor: '#ebebeb'        
    },
    filterAreaBottom: {
        paddingTop: 5,
        paddingBottom: 5,
        height: 40,
    },
    filterButton: {
        minHeight: 30,
        marginRight: 5,
        paddingLeft: 10,
        paddingRight: 10
    },
    filterButtonFirst: {
        marginLeft: 10
    },
    filterButtonLast: {
        marginRight: 15
    },
    filterButtonText: {
        fontSize: 12
    },
    filterButtonTextPadding: {
        fontSize: 12,
        paddingLeft: 7
    },
    divider: {
        borderRightWidth: 1,
        borderColor: '#979797',
        height: 25
    },
    listView: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 15,
        paddingBottom: 15
    },
    filterMenu: {
        paddingLeft: 10,
        paddingRight: 15,
        paddingTop: 15,
        paddingBottom: 15
    },
    filterMenuInner: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center"
    },
    filterText: {
        paddingLeft: 10,
        textTransform: "uppercase",
        color: APP_MAIN_COLOR,
        fontSize: 13,
        lineHeight: 20,
        height: 20,
    },
    productBox: {
        flex: 1,
        flexDirection: 'row',
        minHeight: 130,
        maxHeight: 160,
        paddingLeft: LIST_PRODUCT_LEFT_PADDING,
        paddingRight: LIST_PRODUCT_RIGHT_PADDING,
        paddingTop: 5,
        paddingBottom: 5,
    },
    productBoxL: {
        width: LIST_PRODUCT_AREA_WIDTH,
    },
    productBoxR: {
        flex: 1,
        paddingLeft: LIST_PRODUCT_RIGHT_BOX_LEFT_PADDING
    },
    productImage: {
        flex: 1, 
        width: '100%', 
        height: '100%',
        borderRadius: 8
    },
    rowSeparator: {
        height: 6
    }
});

export default ProductsListContainer;