import React, { useReducer, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import i18n from 'i18n-js';
import _ from 'underscore';
import { APP_MAIN_COLOR, SCREEN_WIDTH } from '../constants/app';
import CssHelper from "../helpers/css_helper";
import MiscHelper from '../helpers/misc_helper';
import DarkPage from "../components/misc/dark_page";
import AmountUpdater from '../components/ui/amount_updater';
import Sale from '../components/ui/sale';
import Button, { THEME_DARK_BUTTON, THEME_LIGHT_BUTTON } from '../components/ui/button';
import ButtonDisabled, { BUTTON_DISABLED_MODE } from '../components/ui/button_disabled';

const BOX_SIZE = (SCREEN_WIDTH - 60) / 4;

const IMAGES = [
    {source: require('../../assets/images/thumbs/2.png'), color: 'black'},
];

const PRODUCT = {
    title: 'DOOGEE N20 мобильный телефон, отпечаток пальца, 6,3 дюмов, FHD + дисплей, 16 МП, тройная задняя', 
    discountPrice: '3600000', 
    price: '4200000',
    images: [
        {imageSource: require("../../assets/images/smartphones/galaxys10.png"), color: 'black', amount: 120},
        {imageSource: require("../../assets/images/smartphones/galaxys10.png"), color: 'white', amount: 120},
        {imageSource: require("../../assets/images/smartphones/galaxys10.png"), color: 'red', amount: 0},
        {imageSource: require("../../assets/images/smartphones/galaxys10.png"), color: 'blue', amount: 120},
        {imageSource: require("../../assets/images/smartphones/galaxys10.png"), color: 'green', amount: 120}
    ],
    sizes: [
        {size: 6, amount: 0},
        {size: 6.5, amount: 0},
        {size: 7, amount: 120},
        {size: 7.5, amount: 120},
        {size: 8, amount: 120},
        {size: 8.5, amount: 120},
        {size: 9, amount: 120},
        {size: 9.5, amount: 120},
        {size: 10, amount: 120},
        {size: 10.5, amount: 120}, 
    ]
};

function AddCartContainer({ selectColor, selectSize, changeAmount, navigation }) {
    const [state, setState] = useReducer(
        (state, newState) => ({...state, ...newState}),
        {
            color: null,
            size: null,
            amount: 1
        }
    )

    const { color, size, amount } = state

    useEffect(() => {
        if (_.isFunction(selectColor))
            selectColor(color);
    }, [color])

    useEffect(() => {
        if (_.isFunction(selectSize))
            selectSize(size);
    }, [size])

    const _selectColor = (c) => {
        color === c && (c = null);
        setState({
            color: c
        });
    }

    const _selectSize = (s) => {
        size === s && (s = null);
        setState({
            size: s
        });
    }

    return (
        <DarkPage i18nKey="features" defaultText="Характеристики" navigation={navigation}>
            <View style={styles.container}>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <View style={styles.mImageContainer}>
                            <Image source={IMAGES[0].source} style={[styles.image, CssHelper['image']]}/>
                        </View>
                        <View style={styles.mDesc}>
                            <View>
                                <Text numberOfLines={2}>{PRODUCT.title}</Text>
                            </View>
                            <View style={[CssHelper['flexRowCentered'], styles.mA]}>
                                <Sale />
                                <View>
                                    <Text style={styles.mPrice}>
                                        {MiscHelper.price(PRODUCT.discountPrice)}
                                        <Text style={styles.mNormal}> / {i18n.t('piece', {defaultValue: "шт."})}</Text>
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
                        <View style={[CssHelper['flexRowCentered'], styles.mContainer]}>
                            <Text style={styles.mColor}>
                                {i18n.t('color', {defaultValue: "Цвет"})}: <Text style={{textTransform: 'capitalize'}}>{color ? color : i18n.t('select', {defaultValue: "Выберите"})}</Text>
                            </Text>
                            <View style={[CssHelper['flexRowCentered'], styles.itemsContainer]}>
                                { PRODUCT.images.map((image, index) =>
                                    image.amount === 0 ? (
                                        <View style={[styles.mImagesContainerDisabled, (index + 1) % 4 === 0 && {marginRight: 0}]}>
                                            <ButtonDisabled width={BOX_SIZE} height={BOX_SIZE} mode={BUTTON_DISABLED_MODE.IMAGE} imageSource={image.imageSource}/>
                                        </View>
                                    ) : (
                                    <View key={index} style={[styles.mImagesContainer, color === image.color && (styles.mImagesContainerSelected), (index + 1) % 4 === 0 && {marginRight: 0}]}>
                                        <TouchableOpacity style={[CssHelper['flexRowCentered']]} activeOpacity={1} onPress={() => _selectColor(image.color)}>
                                            <Image source={image.imageSource} style={CssHelper['image']} fadeDuration={0}/>
                                        </TouchableOpacity>
                                    </View>
                                    )
                                )}
                            </View>
                        </View>
                        <View style={[CssHelper['flexRowCentered'], styles.mContainer]}>
                            <Text style={styles.mColor}>
                                {i18n.t('size', {defaultValue: "Размер"})}: <Text style={{textTransform: 'capitalize'}}>{size ? size : i18n.t('select', {defaultValue: "Выберите"})}</Text>
                            </Text>
                            <View style={[CssHelper['flexRowCentered'], styles.itemsContainer]}>
                                { PRODUCT.sizes.map((s, index) =>
                                    s.amount === 0 ? (
                                        <View style={[styles.mImagesContainerDisabled, (index + 1) % 4 === 0 && {marginRight: 0}]}>
                                            <ButtonDisabled width={BOX_SIZE} height={BOX_SIZE / 2} text={s.size}/>
                                        </View>
                                    ) : (
                                        <View key={index} style={[styles.mImagesContainer, styles.mSizesContainer, size === s.size && (styles.mImagesContainerSelected), (index + 1) % 4 === 0 && {marginRight: 0}]}>
                                            <TouchableOpacity style={[CssHelper['flexRowCentered']]} activeOpacity={1} onPress={() => _selectSize(s.size)}>
                                                <Text style={styles.sizeText}>
                                                    {s.size}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    )
                                )}
                            </View>
                        </View>
                        <View style={[CssHelper['flexRowCentered'], styles.mContainer, {paddingTop: 12, paddingBottom: 15}]}>
                            <Text style={styles.mColor}>
                                {i18n.t('amount', {defaultValue: "Количество"})}
                            </Text>
                            <View style={[CssHelper['flexRowCentered'], styles.mAmountContainer]}>
                                <View>
                                    <AmountUpdater changeAmount={changeAmount} style={{alignItems: 'flex-start'}}/>
                                </View>
                                <View style={styles.mComment}>
                                    <Text>
                                        {i18n.t('in_stock', {defaultValue: amount + " в наличии", amount: 3252})}
                                    </Text>
                                    <Text numberOfLines={2}>
                                        {i18n.t('add_discount', {defaultValue: "Доп. скидка "+2+"% при заказе от "+3+" шт.", percent: 2, amount: 3})}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.shipmentContainer}>
                            <Text style={[CssHelper['productSectionTitle'], {fontWeight: 'normal', paddingBottom: 2}]}>
                                {i18n.t("shipment", {defaultValue: "Доставка"})}
                            </Text>
                            <Text style={CssHelper['shipmentDesc']}>
                                Внутри г. Коканда, бесплатная доставка.
                            </Text>
                        </View>
                    </ScrollView>
                </View>
                <View style={CssHelper['footer.buttons']}>
                    <View style={CssHelper['footer.buttons.inner']}>
                        <Button theme={THEME_LIGHT_BUTTON} 
                            i18nKey="add_to_cart" 
                            defaultText="В корзину"
                        />
                        <Button theme={THEME_DARK_BUTTON} 
                            i18nKey="buy" 
                            defaultText="Купить"
                        />
                    </View>
                </View>
            </View>
        </DarkPage>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    content: {
        flex: 1,
        marginTop: 15,
        paddingHorizontal: 15
    },
    header: {
        marginBottom: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'flex-start'
    },
    scrollContainer: {
        paddingBottom: 15
    },
    itemsContainer: {
        flexWrap: 'wrap', 
        justifyContent: 'flex-start'
    },
    image: {
        borderRadius: 2
    },
    sizeText: {
        flex: 1,
        textAlign: 'center',
    },
    mColor: {
        fontSize: 15,
        paddingBottom: 7
    },
    mAmountContainer: {
        alignItems: "flex-start",
        paddingTop: 10
    },
    mContainer: {
        paddingTop: 15,
        paddingBottom: 10,
        borderBottomColor: '#eeeeee',
        borderBottomWidth: 1,
        flexDirection: 'column',
        alignItems: "flex-start"
    },
    mImageContainer: {
        width: 100,
        height: 100,
        borderRadius: 4
    },
    mA: {
        flexDirection: 'column',
        justifyContent: 'flex-start', 
        alignItems: 'flex-start',
        marginTop: 10
    },
    mDesc: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        marginLeft: 10
    },
    mPrice: {
        fontWeight: 'bold',
        paddingTop: 10,
        fontSize: 16
    },
    mNormal: {
        fontWeight: 'normal'
    },
    mImagesContainer: {
        borderRadius: 3,
        borderWidth: 1,
        borderColor: "#cccccc",
        width: BOX_SIZE,
        height: BOX_SIZE,
        marginRight: 10,
        marginTop: 10,
        padding: 1
    },
    mSizesContainer: {
        height: BOX_SIZE / 2
    },
    mImagesContainerSelected: {
        borderColor: APP_MAIN_COLOR,
        borderWidth: 2,
        padding: 0
    },
    mImagesContainerDisabled: {
        marginRight: 10,
        marginTop: 10
    },
    mComment: {
        paddingLeft: 20,
        flex: 1
    },
    shipmentContainer: {
        paddingTop: 15
    }
});

export default AddCartContainer;