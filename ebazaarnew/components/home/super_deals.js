import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text, ImageBackground } from 'react-native';
import FastImage from 'react-native-fast-image';
import _ from 'underscore';
import i18n from 'i18n-js';
import Ripple from 'react-native-material-ripple';
import {SCREEN_WIDTH} from "../../constants/app";
import CssHelper from "../../helpers/css_helper";
import MiscHelper from '../../helpers/misc_helper';
import Countdown, {THEME_DARK_COUNTDOWN} from '../ui/countdown';

const PRODUCTS = [
    {
        id: 1,
        image_200x200: require('../../../assets/images/super-deals/airpods.jpg'),
        discount: 25,
        price: 2600000
    },
    {
        id: 2,
        image_200x200: require('../../../assets/images/super-deals/redmi.jpg'),
        discount: 45,
        price: 770000
    },
    {
        id: 3,
        image_200x200: require('../../../assets/images/super-deals/jacket.jpg'),
        discount: 33,
        price: 340000
    },
    {
        id: 4,
        image_200x200: require('../../../assets/images/super-deals/shoes.jpg'),
        discount: 25,
        price: 180000
    }
];

function SuperDeals({style}) {
    return (            
        <View style={[styles.container, style]}>
            <View style={styles.balloons}>
                <FastImage source={require('../../../assets/images/sale.png')} style={styles.balloonsImage}/>
            </View>
            <View style={styles.header}>
                <View style={[CssHelper['flexRowCentered'], styles.headerInner]}>
                    <View style={[CssHelper['flex']]}>
                        <Text style={styles.title}>
                            {i18n.t('super_deals', {defaultValue: 'Супер предложения'})}
                        </Text>
                    </View>
                    <View style={[styles.timeContainer]}>
                        <Countdown theme={THEME_DARK_COUNTDOWN}/>
                    </View>
                </View>
            </View>
            <View style={[CssHelper['flexRowCentered'], styles.imageContainer]}>
                { PRODUCTS.map((product, i) => 
                    <Ripple key={i} style={styles.imageBox}>
                        <ImageBackground source={product.image_200x200} style={styles.image} imageStyle={{borderTopLeftRadius: 10, borderTopRightRadius: 10}} resizeMode="contain">
                            <View style={styles.discountBox}>
                                <Text style={styles.discountText}>-{product.discount}%</Text>
                            </View>
                        </ImageBackground>
                        <View style={styles.priceBox}>
                            <Text style={styles.price} numberOfLines={1}>
                                {MiscHelper.price(product.price)}
                            </Text>
                        </View>
                    </Ripple>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        height: 140,
        borderRadius: 5,
        padding: 10,
        paddingTop: 12
    },
    balloons: {
        position: 'absolute',
        top: 0,
        left: 8,
        height: 27.5,
        width: 48.5
    },
    balloonsImage: {
        width: '100%',
        height: '100%'
    },
    header: {
        height: 20,
    },
    headerInner: {
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingLeft: 58,
    },
    title: {
        color: '#333',
        fontWeight: 'bold',
        fontSize: 14,
        lineHeight: 14
    },
    imageContainer: {
        marginTop: 15
    },
    imageBox: {
        width: (SCREEN_WIDTH - 80) / 4
    },
    image: {
        width: (SCREEN_WIDTH - 80) / 4,
        height: (SCREEN_WIDTH - 80) / 4
    },
    priceBox: {
        width: (SCREEN_WIDTH - 80) / 4,
        backgroundColor: '#f2f2f2',
        paddingBottom: 5,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5
    },
    discountBox: {
        backgroundColor: '#f99300', 
        position: 'absolute', 
        borderTopLeftRadius: 5, 
        borderBottomRightRadius: 5,
        left: 0,
        top: 0
    },
    discountText: {
        paddingHorizontal: 4, 
        color: '#fff', 
        fontSize: 10
    },
    price: {
        marginTop: 5,
        textAlign: 'center',
        fontSize: 10,
        color: '#333',
        fontWeight: 'bold'
    },
    timeContainer: {
        marginLeft: 10,
    }
});

SuperDeals.propTypes = {
    style: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object
    ]),
    language: PropTypes.string
}

export default SuperDeals;