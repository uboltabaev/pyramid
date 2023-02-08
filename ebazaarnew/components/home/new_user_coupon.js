import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import _ from 'underscore';
import i18n from 'i18n-js';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image';
import {TEXT_SHADOW, SCREEN_WIDTH} from "../../constants/app";
import CssHelper from "../../helpers/css_helper";
import MiscHelper from '../../helpers/misc_helper';

const BOX_WIDTH = (SCREEN_WIDTH - 58) / 3;

const PRODUCTS = [
    {
        id: '1ce79dc7-fc80-4de3-9d0b-23abcbb8c544',
        image_200x200: require('../../../assets/images/new-user-coupons/pic1.jpg'),
        price: 25400,
        discount: 15
    },
    {
        id: '02523339-7077-437a-9ff6-3742bfd11b90',
        image_200x200: require('../../../assets/images/new-user-coupons/pic2.jpg'),
        price: 48700,
        discount: 20
    }
];

const Product = React.memo(({product}) => {
    return (
        <View style={styles.productBox}>
            <View style={styles.productInner}>
                <FastImage source={product.image_200x200} style={[CssHelper['image'], styles.image]} resizeMode={FastImage.resizeMode.contain}/>
                <View style={styles.discountBox}>
                    <View style={styles.discountBoxInner}>
                        <Text style={[styles.discountText, TEXT_SHADOW]}>
                            {MiscHelper.discount(product.discount)}
                        </Text>
                    </View>
                </View>
                <Text style={styles.price}>
                    {MiscHelper.price(product.price)}
                </Text>
            </View>
        </View>
    );
});

Product.propTypes = {
    product: PropTypes.object.isRequired
}

const NewUserCoupon = React.memo(({language}) => {
    return (
        <View style={[styles.container]}>
            <TouchableOpacity activeOpacity={1}>
                <LinearGradient style={[CssHelper['flexRowCentered'], styles.header]}
                    colors={['#ff6972', '#ff2f45', '#ff2f45', '#ff6972']}
                    locations={[0, 0.15, 0.85, 1.0]}>
                    <View style={styles.starsBox}>
                        <View style={styles.inner}>
                            <FastImage source={require("../../../assets/images/stars.png")} style={CssHelper['image']} resizeMode={FastImage.resizeMode.contain}/>
                        </View>
                    </View>
                    <View style={[styles.iconBox]}>
                        <View style={[CssHelper['flexSingleCentered'], styles.giftIcon]}>
                            <AntDesign name="gift" size={15} color="#ff2f45"/>
                        </View>
                    </View>
                    <View style={CssHelper['flex']}>
                        <Text style={[styles.titleText, TEXT_SHADOW]} numberOfLines={1}>
                            {i18n.t('new_user_only', {defaultValue: "Только новый пользователь"})}
                        </Text>
                    </View>
                    <View style={styles.arrowButton}>
                        <View style={CssHelper['flexSingleCentered']}>
                            <Ionicons name="ios-arrow-forward" size={18} color="#fff"/>
                        </View>
                    </View>
                </LinearGradient>
                <View style={[CssHelper['flexRowCentered']]}>
                    <View style={[CssHelper['flex'], styles.containerInner]}>
                        { PRODUCTS.map((product, i) =>
                            <Product key={i} product={product} language={language}/> 
                        )}
                        <LinearGradient style={styles.giftBox}
                            colors={['#504c9b', '#403a85']}
                            start={{x: 0, y: 0}}
                            end={{x: 1, y: 0}}
                        >
                            <LinearGradient style={styles.bottomGradient} 
                                colors={['#47428f', '#38307a']} 
                                start={{x: 0, y: 0}} 
                                end={{x: 1, y: 0}}
                            />
                            <View style={[CssHelper['flexSingleCentered'], {justifyContent: 'space-between'}]}>
                                <FastImage source={require('../../../assets/images/gift-animation.gif')} style={styles.giftImage} resizeMode={FastImage.resizeMode.contain}/>
                                <Text style={[styles.newbieText, TEXT_SHADOW]}>
                                    {i18n.t('beginner_coupon', {defaultValue: "Купон\n новичка"})}
                                </Text>
                                <View style={styles.button}>
                                    <View style={CssHelper['flexSingleCentered']}>
                                        <Text style={styles.buttonText}>
                                            {i18n.t('get', {defaultValue: "Получить"})}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </LinearGradient>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        minHeight: 90,
        borderRadius: 5,
        overflow: 'hidden'
    },
    containerInner: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: 7,
        backgroundColor: '#fff',
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5
    },
    header: {
        borderWidth: 0.5,
        borderColor: '#cb848a',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        paddingHorizontal: 7,
        paddingVertical: 8,
        justifyContent: 'flex-start'
    },
    image :{
        borderRadius: 5,
        width: BOX_WIDTH,
        height: BOX_WIDTH
    },
    iconBox: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: '#fff',
        borderWidth: 0.5,
        borderColor: 'rgba(189, 79, 90, 0.5)'
    },
    arrowButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)', 
        width: 26, 
        height: 26, 
        borderRadius: 13
    },
    bottomGradient: {
        position: 'absolute', 
        width: '100%', 
        height: '50%', 
        borderRadius: 5, 
        left: 0, 
        bottom: 0
    },
    price: {
        fontSize: 12,
        fontWeight: 'bold',
        paddingTop: 2,
        color: '#000'
    },
    discountBox: {
        backgroundColor: '#ff4747',
        borderRadius: 15,
        width: '60%',
        height: 28,
        borderWidth: 2,
        borderColor: '#fff',
        marginTop: -14
    },
    discountBoxInner: {
        paddingVertical: 3,
        flex: 1,
        borderRadius: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e43838',
        borderTopWidth: 1,
        borderTopColor: '#e43838'
    },
    discountText: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
        fontStyle: 'italic'
    },
    giftBox: {
        width: BOX_WIDTH,
        height: BOX_WIDTH + 33,
        borderRadius: 5,
        backgroundColor: '#3e3883',
        paddingVertical: 7,
        paddingBottom: 8
    },
    giftIcon: {
        marginTop: -1
    },
    giftImage: {
        width: '100%', 
        height: '100%', 
        position: 'absolute', 
        bottom: -5
    },
    productBox: {
        width: BOX_WIDTH
    },
    productInner: {
        borderRadius: 5,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    titleText: {
        fontWeight: 'bold',
        fontSize: 13.5,
        lineHeight: 15,
        paddingLeft: 6,
        color: '#fff'
    },
    starsBox: {
        position: 'absolute', 
        right: 0, 
        top: 0, 
        width: '35%', 
        height: 40
    },
    starsInner: {
        flex: 1, 
        justifyContent: 'flex-end', 
        alignItems: 'flex-end'
    },
    button: {
        backgroundColor: '#acccf3',
        borderRadius: 10,
        minHeight: 20,
        width: '80%',
    },
    buttonText: {
        color: '#35467c',
        fontSize: 11,
        lineHeight: 14,
        fontWeight: 'bold'
    },
    newbieText: {
        fontSize: 12,
        color: '#fff',
        textAlign: 'center',
    }
});

NewUserCoupon.propTypes = {
    languaga: PropTypes.string
}

export default NewUserCoupon;