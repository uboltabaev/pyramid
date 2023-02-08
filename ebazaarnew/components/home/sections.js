import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text } from 'react-native';
import FastImage from 'react-native-fast-image';
import _ from 'underscore';
import i18n from 'i18n-js';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import {SCREEN_WIDTH} from "../../constants/app";
import CssHelper from "../../helpers/css_helper";
import SmilingMouthIcon from '../icons/smiling_mouth_icon';

const IMAGE_WIDTH = (SCREEN_WIDTH - 30 - 42) / 4;
const FOCUS_WIDTH = (SCREEN_WIDTH / 2) - 15 - 14;

const PRODUCTS = {
    favorites: [
        {
            image_200x200: require('../../../assets/images/home-sections/fav1.jpg')
        },
        {
            image_200x200: require('../../../assets/images/home-sections/fav2.jpg')
        }
    ],
    new_items: [
        {
            image_200x200: require('../../../assets/images/home-sections/new1.jpg')
        },
        {
            image_200x200: require('../../../assets/images/home-sections/new2.jpg')
        }
    ],
    brand_focus: [
        {
            image: require('../../../assets/images/home-sections/iphone.gif')
        }
    ],
    shops: [
        {
            image_200x200: require('../../../assets/images/home-sections/shop1.jpg')
        },
        {
            image_200x200: require('../../../assets/images/home-sections/shop2.jpg')
        }
    ]
};

function Sections({style}) {
    return (
        <View style={[styles.container, style]}>
            <View style={[styles.section, styles.fav]}>
                <View style={[CssHelper['flexRowCentered'], styles.header]}>
                    <View style={[styles.iconBox, styles.favIconBox]}>
                        <View style={styles.favIcon}>
                            <SmilingMouthIcon width={13} height={13} color="#fff"/>
                        </View>
                    </View>
                    <Text style={styles.title} numberOfLines={1}>
                        {i18n.t('favorites', {defaultValue: 'Избранное'})}
                    </Text>
                </View>
                <View style={[CssHelper['flexRowCentered'], styles.imageContainer]}>
                    { PRODUCTS.favorites.map((fav, i) => 
                        <View key={i} style={styles.imageBox}>
                            <FastImage source={fav.image_200x200} resizeMode={FastImage.resizeMode.cover} style={[CssHelper['image'], styles.image]}/>
                        </View>
                    )}
                </View>
            </View>
            <View style={[styles.section, styles.newItems]}>
                <View style={[CssHelper['flexRowCentered'], styles.header]}>
                    <View style={[styles.iconBox, styles.newItemsBox]}>
                        <View style={CssHelper['flexSingleCentered']}>
                            <MaterialCommunityIcons name="flower-poppy" size={13} color="white"/>
                        </View>
                    </View>
                    <Text style={styles.title} numberOfLines={1}>
                        {i18n.t('new_items', {defaultValue: 'Новинки'})}
                    </Text>
                </View>
                <View style={[CssHelper['flexRowCentered'], styles.imageContainer]}>
                    { PRODUCTS.new_items.map((item, i) => 
                        <View key={i} style={styles.imageBox}>
                            <FastImage source={item.image_200x200} resizeMode={FastImage.resizeMode.cover} style={[CssHelper['image'], styles.image]}/>
                        </View>
                    )}
                </View>
            </View>
            <View style={[styles.section, styles.brandFocus]}>
                <View style={[CssHelper['flexRowCentered'], styles.header]}>
                    <View style={[styles.iconBox, styles.brandFocusBox]}>
                        <View style={CssHelper['flexSingleCentered']}>
                            <MaterialCommunityIcons name="diamond" size={13} color="white"/>
                        </View>
                    </View>
                    <Text style={styles.title} numberOfLines={1}>
                        {i18n.t('brand-focus', {defaultValue: 'Бренд-фокус'})}
                    </Text>
                </View>
                <View style={[CssHelper['flexRowCentered'], styles.imageContainer]}>
                    { PRODUCTS.brand_focus.map((brand, i) => 
                        <View key={i} style={styles.brandFocusImage}>
                            <FastImage source={brand.image} resizeMode={FastImage.resizeMode.cover} style={[CssHelper['image'], styles.image]}/>
                        </View>
                    )}
                </View>
            </View>
            <View style={[styles.section, styles.shops]}>
                <View style={[CssHelper['flexRowCentered'], styles.header]}>
                    <View style={[styles.iconBox, styles.shopsBox]}>
                        <View style={CssHelper['flexSingleCentered']}>
                            <Entypo name="shop" size={13} color="white"/>
                        </View>
                    </View>
                    <Text style={styles.title} numberOfLines={1}>
                        {i18n.t('shops-for-you', {defaultValue: 'Магазины для вас'})}
                    </Text>
                </View>
                <View style={[CssHelper['flexRowCentered'], styles.imageContainer]}>
                    { PRODUCTS.shops.map((shop, i) => 
                        <View key={i} style={styles.imageBox}>
                            <FastImage source={shop.image_200x200} resizeMode={FastImage.resizeMode.cover} style={[CssHelper['image'], styles.image]}/>
                        </View>                    
                    )}
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 5,
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    title: {
        color: '#333',
        fontWeight: 'bold',
        fontSize: 12.5,
        paddingLeft: 6
    },
    header: {
        padding: 7,
        justifyContent: 'flex-start'
    },
    section: {
        width: (SCREEN_WIDTH - 30) / 2
    },
    image: {
        borderRadius: 5
    },
    imageContainer: {
        marginHorizontal: 7,
        marginBottom: 7,
    },
    imageBox: {
        width: IMAGE_WIDTH,
        height: IMAGE_WIDTH
    },
    brandFocusImage: {
        width: FOCUS_WIDTH,
        height: FOCUS_WIDTH / 2,
        borderRadius: 5,
        overflow: 'hidden'
    },
    fav: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 5,
        borderRightWidth: 1.0,
        borderRightColor: '#f2f2f2'
    },
    iconBox: {
        width: 20,
        height: 20,
        borderRadius: 10
    },
    favIcon: {
        flex: 1, 
        alignItems: 'center', 
        marginTop: 6
    },
    favIconBox: {
        backgroundColor: '#3fa4f4'
    },
    newItems: {
        backgroundColor: '#fff',
        borderTopRightRadius: 5
    },
    newItemsBox: {
        backgroundColor: '#34c58e'
    },
    brandFocus: {
        backgroundColor: '#fff',
        borderBottomLeftRadius: 5,
        borderTopWidth: 1.0,
        borderTopColor: '#f2f2f2',
        borderRightWidth: 1.0,
        borderRightColor: '#f2f2f2'
    },
    brandFocusBox: {
        backgroundColor: '#0b0063'
    },
    shops: {
        borderBottomRightRadius: 5,
        backgroundColor: '#fff',
        borderTopWidth: 1.0,
        borderTopColor: '#f2f2f2',
    },
    shopsBox: {
        backgroundColor: '#fbbe2f'
    }
});

Sections.propTypes = {
    style: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object
    ]),
    language: PropTypes.string
}

export default Sections;