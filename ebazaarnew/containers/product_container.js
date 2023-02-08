import React, { useReducer, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, StatusBar, Animated, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { observer, inject } from 'mobx-react';
import i18n from 'i18n-js';
import { Surface } from 'react-native-paper';
import Swiper from 'react-native-swiper';
import _ from 'underscore';
import { Rating } from 'react-native-ratings';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import ProductsDb from '../firebase/products';
import UserHistoryDb, { UserHistory } from '../firebase/user_history';
import { APP_MAIN_COLOR, RATING_BG_COLOR, SCREEN_WIDTH, LOREM_IPSUM, TOAST_BG_COLOR } from "../constants/app";
import CssHelper from "../helpers/css_helper";
import MiscHelper from '../helpers/misc_helper';
import Button, { THEME_DARK_BUTTON, THEME_LIGHT_BUTTON } from '../components/ui/button';
import FavoriteButton from "../components/ui/favorite_button";
import Sale, { THEME_DARK_SALE } from "../components/ui/sale";
import NewUserCoupon from '../components/product/new_user_coupon';
import SellerCoupon from "../components/product/seller_coupon";
import Features from "../components/product/features";
import Feedbacks from "../components/product/feedbacks";
import FAQ from "../components/product/faq";
import SetColors from "../components/product/set_colors";
import SellerInfo from "../components/product/seller_info";
import Header from '../components/product/header';
import SpecialProduct from '../components/home/special_product';
import RefreshPage from '../components/ui/refresh_page';
import AddFavoriteToast from '../components/product/add_favorite_toast';
import RemoveFavoriteToast from '../components/product/remove_favorite_toast';
import ImageStorage from '../components/ui/image_storage';
import Placeholder from '../components/product/placeholder';

const SLIDER_HEIGHT = SCREEN_WIDTH;
const HEADER_HEIGHT = 80;
const HEADER_SHADOW_HEIGHT = 5;

const ProductContainer = inject('mobxStore')(observer(({ mobxStore, navigation, route }) => {
    const [state, setState] = useReducer(
        (state, newState) => ({...state, ...newState}),
        {
            isLoaded: false,
            errorLoading: false,
            product: null,
            isFavourited: false,
            showRemoveFavoriteToast: false,
            showAddFavoriteToast: false,
            scrollEnabled: true,
            scrollY: new Animated.Value(0),
            offsetAnim: new Animated.Value(0),
            goUpY: new Animated.Value(0)
        }
    )

    const { isLoaded, errorLoading, product, showRemoveFavoriteToast, showAddFavoriteToast, scrollEnabled, scrollY, offsetAnim, goUpY } = state;
    const especiallyProducts = mobxStore.userStore.especiallyProducts;
    
    let amount = 1,
        color = null,
        timeout = null
    
    const flatList = useRef(null);
    
    useEffect(() => {
        loadProduct()
        const listenerData = {
            processing: false,
            visible: false
        };
        scrollY.addListener((obj) => {
            const { value } = obj;
            if (value >= 500 && !listenerData.processing && !listenerData.visible) {
                listenerData.processing = true;
                Animated.timing(goUpY, {
                    toValue: -55,
                    duration: 300,
                    useNativeDriver: true
                }).start(() => {
                    listenerData.processing = false;
                    listenerData.visible = true;
                });
            } else if (value < 500 && !listenerData.processing && listenerData.visible) {
                Animated.timing(goUpY, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true
                }).start(() => {
                    listenerData.processing = false;
                    listenerData.visible = false;
                });
            }
        })
        return () => {
            clearTimeout(timeout)
        }
    }, [])

    useEffect(() => {
        flatList.current.scrollToOffset({
            x: 0, 
            y: 0, 
            animated: false
        })
        setState({
            scrollEnabled: true
        })
    }, [scrollEnabled])

    const loadProduct = () => {
        // Get product id from route
        const { productId } = route.params;
        ProductsDb.getProductById(productId).then((product) => {
            setState({
                product,
                isLoaded: true
            })
            console.log(product)
            // Save user history
            const userHistory = new UserHistory({
                user_id: mobxStore.userStore.uid,
                seller_id: product.getSellerId(),
                product_id: product.getId(),
                name: product.getName(),
                image_200x200: product.getImage200x200(),
                price: product.getPrice()
            });
            UserHistoryDb.saveHistory(userHistory).then((saved) => {
                if (!_.isNull(saved))
                    mobxStore.userStore.addHistory(saved);
            }, (error) => {
                console.log(error);
            });
        }, (error) => {
            setState({
                errorLoading: true
            });
        });
    }

    const refreshPage = () => {
        setState({
            errorLoading: false,
            isLoaded: false
        });
        timeout = setTimeout(() => {
            loadProduct();
        }, 800);
    }

    const changeFavorite = (isLiked) => {
        let values = {
            isFavourited: isLiked
        }
        if (isLiked) {
            values.showAddFavoriteToast = true;
            values.showRemoveFavoriteToast = false;
        } else {
            values.showRemoveFavoriteToast = true;
            values.showAddFavoriteToast = false;
        }
        setState(values)
    }

    const changeAmount = (a) => {
        amount = a;
    }

    const selectColor = (c) => {
        color = c;
    }

    const pagination = (index, total, context, pos) => {
        return (
            <Animated.View style={[styles.sliderPagination, {transform: [{translateY: pos}]}]}>
                <Text style={styles.sliderPaginationText}>
                    <Text style={styles.paginationText}>{index + 1}</Text>/{total}
                </Text>
            </Animated.View>
        )
    }    

    const goChat = () => {
        const params = {
            productId: product.getId(),
            sellerId: product.getSellerId(),
            sellerName: product.getSellerName(),
            image: product.getImage200x200(),
            title: product.getName(),
            price: product.getPrice()
        };
        navigation.navigate('Chat', params);
    }

    const goShop = () => {
        const params = {
            sellerId: product.getSellerId()
        };
        navigation.navigate('Shop', params);
    }

    const goUp = () => {
        setState({
            scrollEnabled: false
        })
    }

    const itemSeparatorComponent = () => {
        return (
            <View style={styles.rowSeparator}/>
        );
    }
    
    if (errorLoading) {
        return (
            <RefreshPage refreshHandler={refreshPage}/>
        );
    }

    const sliderPagination = scrollY.interpolate({
        inputRange: [0, SLIDER_HEIGHT],
        outputRange: [0, -(SLIDER_HEIGHT / 2)],
        extrapolate: 'clamp'
    })
    const sliderHeight = scrollY.interpolate({
        inputRange: [0, SLIDER_HEIGHT],
        outputRange: [0, (SLIDER_HEIGHT / 2)],
        extrapolate: 'clamp'
    })

    return (
        <View style={CssHelper['flex']}>
            <StatusBar barStyle={"light-content"} 
                animated={true} 
                backgroundColor={'transparent'} 
                translucent={true}
            />
                <Animated.View style={[CssHelper['flex']]}>
                    <View style={styles.content}>
                        <Header title={!_.isNull(product) ? product.name : ''}
                            height={HEADER_HEIGHT} 
                            headerShadowHeight={HEADER_SHADOW_HEIGHT} 
                            navigation={navigation}
                        />
                        <View style={styles.scrollContent}>
                            <Animated.FlatList data={isLoaded ? especiallyProducts : []}
                                ref={flatList}
                                contentContainerStyle={[styles.flatList, {paddingBottom: isLoaded ? 8 : 0}]}
                                onScroll={Animated.event(
                                    [{nativeEvent: {contentOffset: {y: scrollY}}}],
                                    {useNativeDriver: true},
                                )}
                                renderItem={({ item, index }) => 
                                    <SpecialProduct product={item} 
                                        even={(index + 1) % 2 === 0} 
                                        navigation={navigation}
                                    />
                                }
                                showsVerticalScrollIndicator={false}
                                keyExtractor={item => item.id}
                                numColumns={2}
                                onEndReachedThreshold={0.5}
                                ItemSeparatorComponent={itemSeparatorComponent}
                                removeClippedSubviews={false}
                                columnWrapperStyle={{paddingHorizontal: 15}}
                                extraData={false}
                                scrollEnabled={isLoaded && scrollEnabled ? true : false}
                                ListHeaderComponent={
                                    <View style={[CssHelper['flex']]}>
                                        { isLoaded ? (
                                            <Animated.View style={[styles.slider, {transform: [{translateY: sliderHeight}]}]}>
                                                { product.slider_images.length > 0 ? (
                                                    <Swiper containerStyle={{ width: SLIDER_HEIGHT, height: SLIDER_HEIGHT }}
                                                        renderPagination={(a, b, c) => pagination(a, b, c, sliderPagination)}
                                                        autoplay={false}
                                                        loop={false}
                                                        height={SLIDER_HEIGHT}
                                                        index={0}
                                                    >
                                                        { product.slider_images.map((image, index) => 
                                                            <ImageStorage key={index} 
                                                                storageUri={image.image_800x800}
                                                                imageStyle={CssHelper['image']}
                                                            />
                                                        )}
                                                    </Swiper>
                                                ) : (
                                                    <View style={{ width: SLIDER_HEIGHT, height: SLIDER_HEIGHT }}>
                                                        <ImageStorage storageUri={product.image_800x800}
                                                            imageStyle={CssHelper['image']}
                                                        />
                                                    </View>
                                                )}
                                            </Animated.View>
                                        ) : (
                                            <View style={styles.slider}/>
                                        )}
                                        { isLoaded ? (
                                            <View style={styles.innerContent}>
                                                <Surface elevation={1} cornerRadius={0} style={[styles.card]}>
                                                    <View style={styles.cardTop}/>
                                                    <View style={[CssHelper['flexRowCentered'], {alignItems: 'flex-start'}]}>
                                                        <View>
                                                            <View style={[CssHelper['flexRowCentered'], styles.sales]}>
                                                                <Sale theme={THEME_DARK_SALE}/>
                                                            </View>
                                                            <Text style={[CssHelper['productPrice'], styles.productPrice]}>
                                                                {MiscHelper.price(product.price)}
                                                            </Text>
                                                            <View style={[[CssHelper['flexRowCentered'], CssHelper['productDiscountBox']]]}>
                                                                <Text style={[CssHelper['productDiscountPrice'], styles.productDiscountPrice]}>
                                                                    {MiscHelper.price(product.price)}
                                                                </Text>
                                                                <Text style={[CssHelper['productDiscountPercent'], styles.productDiscountPercent]}>
                                                                    -{product.discountPercentage}%
                                                                </Text>
                                                            </View>
                                                        </View>
                                                        <View>
                                                            <FavoriteButton scale={0.13} 
                                                                style={{marginTop: -6}} 
                                                                onPress={changeFavorite}
                                                            />
                                                        </View>
                                                    </View>
                                                    <View>
                                                        <Text style={[CssHelper['productTitle'], styles.productTitle]}>
                                                            {product.name}
                                                        </Text>
                                                    </View>
                                                    <View style={[CssHelper['flexRowCentered'], styles.ratingWrapper, {justifyContent: "flex-start"}]}>
                                                        <Text style={[CssHelper['ratingText'], styles.ratingText, styles.ratingTextLeft]}>
                                                            {product.rating}
                                                        </Text>
                                                        <Rating readonly={true} 
                                                            imageSize={15} 
                                                            ratingCount={5} 
                                                            startingValue={product.rating} 
                                                            type="custom" 
                                                            ratingColor={APP_MAIN_COLOR} 
                                                            ratingBackgroundColor={RATING_BG_COLOR}
                                                        />
                                                        <Text style={[CssHelper['ratingText'], styles.ratingText]}>
                                                            { product.sold_quantity > 0 &&
                                                                product.sold_quantity + " " + i18n.t("order (s)", {defaultValue: "заказа (ов)"})
                                                            }
                                                        </Text>
                                                    </View>
                                                </Surface>
                                                <Surface elevation={1} cornerRadius={0} style={[styles.card, {paddingTop: 0, paddingLeft: 0, paddingRight: 0}]}>
                                                    <NewUserCoupon />
                                                    <SellerCoupon />
                                                    <View style={styles.shipmentContainer}>
                                                        <Text style={[CssHelper['productSectionTitle'], {paddingBottom: 2}]}>
                                                            {i18n.t("shipment", {defaultValue: "Доставка"})}
                                                        </Text>
                                                        <Text style={CssHelper['shipmentDesc']}>
                                                            Внутри г. Коканда, бесплатная доставка.
                                                        </Text>
                                                    </View>
                                                </Surface>
                                                <Surface elevation={1} cornerRadius={0} style={[styles.card, {paddingBottom: 14}]}>
                                                    <SetColors changeAmount={changeAmount} 
                                                        selectColor={selectColor}
                                                        navigation={navigation}
                                                    />
                                                    <Features />
                                                </Surface>
                                                <Surface elevation={1} cornerRadius={0} style={[styles.card]}>
                                                    <Feedbacks navigation={navigation}/>
                                                    <FAQ navigation={navigation}/>
                                                </Surface>
                                                <Surface elevation={1} cornerRadius={0} style={[styles.card, {paddingBottom: 12}]}>
                                                    <SellerInfo product={product} navigation={navigation}/>
                                                </Surface>
                                                <Surface elevation={1} cornerRadius={0} style={[styles.card, {paddingBottom: 15}]}>
                                                    <Text style={[CssHelper['productSectionTitle']]}>
                                                        {i18n.t("description", {defaultValue: "Описание"})}
                                                    </Text>
                                                    <Text style={styles.desc}>
                                                        {LOREM_IPSUM}
                                                    </Text>
                                                </Surface>
                                                <View style={styles.sellerHeader}>
                                                    <Text style={styles.sellerHeaderText}>
                                                        {i18n.t("seller_recommends", {defaultValue: "Продавец рекомендует"})}
                                                    </Text>
                                                </View>
                                            </View>
                                        ) : (
                                            <View style={styles.placeholderContent}>
                                                <Placeholder/>
                                            </View>
                                        )}
                                    </View>
                                }
                            />
                        </View>
                        { isLoaded &&
                            <View style={styles.helpButtons}>
                                <TouchableWithoutFeedback onPress={goUp}>
                                    <Animated.View style={[styles.helpButton, styles.goUp, {transform: [{translateY: goUpY}]}]}>
                                        <View style={CssHelper['flexSingleCentered']}>
                                            <Ionicons name="ios-arrow-up" size={22} color={'#333'} />
                                        </View>
                                    </Animated.View>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={goChat}>
                                    <View style={styles.helpButton}>
                                        <View style={CssHelper['flexSingleCentered']}>
                                            <SimpleLineIcons name="bubble" size={22} color={'#333'}/>
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        }
                    </View>
                    <View style={CssHelper['footer.buttons']}>
                        <View style={CssHelper['footer.buttons.inner']}>
                            { isLoaded ? (
                                <TouchableOpacity style={styles.shop} activeOpacity={1} onPress={goShop}>
                                    <View style={CssHelper['flexSingleCentered']}>
                                        <Fontisto name="shopping-store" size={21} color={APP_MAIN_COLOR} />
                                        <Text style={styles.shopText}>
                                            {i18n.t("shop", {defaultValue: "Магазин"})}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ) : (
                                <View style={styles.shop}/>
                            )}
                            <Button theme={THEME_LIGHT_BUTTON} 
                                i18nKey="add_to_cart" 
                                defaultText="В корзину"
                                disabled={isLoaded ? false : true}
                                hideText={isLoaded ? false : true}
                            />
                            <Button theme={THEME_DARK_BUTTON} 
                                i18nKey="buy" 
                                defaultText="Купить"
                                disabled={isLoaded ? false : true}
                                hideText={isLoaded ? false : true}
                            />
                        </View>
                    </View>
                    <AddFavoriteToast isVisible={showAddFavoriteToast} 
                        backgroundColor="#f6f6f6" 
                        navigation={navigation}
                    />
                    <RemoveFavoriteToast isVisible={showRemoveFavoriteToast} 
                        backgroundColor={TOAST_BG_COLOR} 
                        duration={5000} 
                        navigation={navigation}
                    />
                </Animated.View>
        </View>
    );
}))

const styles = StyleSheet.create({
    content: {
        flex: 1,
    },
    slider: {
        width: SLIDER_HEIGHT,
        height: SLIDER_HEIGHT,
    },
    scrollContent: {
        flex: 1,
        position: 'relative', 
        zIndex: 998,
        paddingTop: 80
    },
    innerContent: {
        flex: 1,
        backgroundColor: '#eaeaea'
    },
    placeholderContent: {
        flex: 1,
        backgroundColor: '#fff',
        minHeight: 500
    },
    card: {
        width: '100%',
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 10,
        paddingBottom: 10,
        marginBottom: 10
    },
    cardTop: {
        backgroundColor: '#fff', 
        marginTop: -11, 
        marginLeft: -10, 
        marginRight: -10, 
        marginBottom: 7, 
        height: 1
    },
    productTitle: {
        fontSize: 13,
        lineHeight: 20,
        paddingTop: 10
    },
    productPrice: {
        fontSize: 19,
        paddingTop: 2
    },
    productDiscountPrice: {
        fontSize: 13
    },
    productDiscountPercent: {
        fontSize: 12,
        fontWeight: 'bold'
    },
    sliderPagination: {
        position: 'absolute', 
        bottom: 10, 
        right: 15, 
        backgroundColor: 'rgba(0, 0, 0, 0.3)', 
        paddingLeft: 5, 
        paddingRight: 5, 
        borderRadius: 10
    },
    sliderPaginationText: {
        color: '#fff', 
        fontSize: 12
    },
    ratingWrapper: {
        paddingTop: 10,
        paddingBottom: 2
    },
    ratingText: {
        fontSize: 12
    },
    ratingTextLeft: {
        paddingLeft: 0,
        paddingRight: 5
    },
    sales: {
        paddingTop: 8,
        paddingBottom: 4
    },
    shipmentContainer: {
        paddingTop: 10,
        paddingLeft: 12,
        paddingRight: 12,
        paddingBottom: 3
    },
    helpButtons: {
        position: 'absolute', 
        right: 20, 
        bottom: 40,
        width: 42, 
        height: 42
    },
    helpButton: {
        position: 'absolute',
        width: 42, 
        height: 42, 
        borderRadius: 21, 
        borderWidth: 1, 
        borderColor: '#d5d5d5', 
        backgroundColor: '#fff', 
        zIndex: 9999
    },
    goUp: {
        zIndex: 9998
    },
    shop: {
        borderWidth: 1, 
        borderColor: '#ebebeb', 
        backgroundColor: '#fff', 
        width: 70, 
        height: 50
    },
    shopText: {
        color: '#333', 
        fontSize: 10, 
        textTransform: 'uppercase', 
        fontWeight: 'bold',
        paddingTop: 3
    },
    rowSeparator: {
        height: 6
    },
    flatList: {
        paddingBottom: 8,
        backgroundColor: '#eaeaea'
    },
    sellerHeader: {
        paddingHorizontal: 15,
        paddingTop: 3,
        paddingBottom: 14
    },
    sellerHeaderText: {
        fontSize: 15,
        fontWeight: 'bold'
    },
    desc: {
        fontSize: 14,
        lineHeight: 18
    }
});

export default ProductContainer;