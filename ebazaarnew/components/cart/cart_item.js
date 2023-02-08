import React, { useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { observer, inject } from 'mobx-react';
import _ from 'underscore';
import i18n from 'i18n-js';
import Storage from '../../firebase/storage';
import { SCREEN_WIDTH, LINK_COLOR } from '../../constants/app';
import CssHelper from '../../helpers/css_helper';
import MiscHelper from '../../helpers/misc_helper';
import Checkbox, { STATUS_CHECKED, STATUS_UNCHECKED } from '../../components/ui/checkbox';
import AmountUpdater, { MODE } from '../ui/amount_updater';
import TouchableHighlight from '../ui/touchable_highlight';

const IMAGE_SIZE = parseInt((SCREEN_WIDTH / 100) * 28);

export const CartSellerHeader = inject('mobxStore')(observer(({ mobxStore, title }) => {

    const selectSeller = useCallback(() => {
        mobxStore.cartStore.selectSeller(title.sellerId)
    }, [])
    
    const isSelected = mobxStore.cartStore.isSellerSelected(title.sellerId)

    return (
        <View style={styles.header}>
            <View style={styles.headerInner}>
                <TouchableOpacity onPress={selectSeller} activeOpacity={1} style={CssHelper['standartLink']}>
                    <Checkbox status={isSelected ? STATUS_CHECKED : STATUS_UNCHECKED}/>
                </TouchableOpacity>
                <Text style={styles.headerText} numberOfLines={1}>
                    {title.sellerName}
                </Text>
            </View>
        </View>
    )
}))

const f = (item) => {
    const a = [];
    !_.isNull(item.getProductColor()) && (a.push(item.getProductColor()));
    !_.isNull(item.getProductModel()) && (a.push(item.getProductModel()));
    return a;
}

const CartItem = inject('mobxStore')(observer(({ mobxStore, item, navigation }) => {

    const selectItem = useCallback(() => {
        mobxStore.cartStore.selectItem(item)
    }, [])
    
    const gotoProduct = useCallback(() => {
        navigation.navigate('Product', {productId: item.getProductId()})
    }, [])
    
    const imageSource = Storage.makeStoragePublicUrl(item.getProductImage200x200()),
        attrs = f(item),
        isSelected = mobxStore.cartStore.isSelected(item)

    return (
        <View style={styles.item}>
            <View style={CssHelper['flexRowCentered']}>
                <TouchableOpacity onPress={selectItem} activeOpacity={1} style={CssHelper['standartLink']}>
                    <Checkbox status={isSelected ? STATUS_CHECKED : STATUS_UNCHECKED}/>
                </TouchableOpacity>
                <View style={[CssHelper['flex'], styles.content]}>
                    <TouchableHighlight onPress={gotoProduct}>
                        <View style={[CssHelper['flexRowCentered'], styles.innerContent]}>
                            <View style={styles.imageContainer}>
                                <Image source={{uri: imageSource}} style={[CssHelper['image']]} resizeMode="cover" fadeDuration={0}/>
                            </View>
                            <View style={CssHelper['flex']}>
                                <Text style={styles.name} numberOfLines={1}>
                                    {item.getProductName()}
                                </Text>
                                <Text style={styles.price}>
                                    {MiscHelper.price(item.getProductPrice())}
                                </Text>
                                <View style={styles.bottomFlex}>
                                    <View style={CssHelper['flex']}>
                                        { attrs.map((i, n) =>
                                            <Text key={n} style={styles.size} numberOfLines={1}>
                                                {i}
                                            </Text>
                                        )}
                                    </View>
                                    <View style={[CssHelper['flex']]}/>
                                </View>
                            </View>
                        </View>
                    </TouchableHighlight>
                    <View style={styles.amountUpdater}>
                        <AmountUpdater amount={item.getQuantity()} 
                            mode={MODE.SMALLER}
                            cartItem={item}
                        />
                    </View>
                </View>
            </View>
            <View style={styles.shipment}>
                { item.isFreeShipment() ? (
                    <Text style={styles.shipmentText}>
                        {i18n.t('free_shipping', {defaultValue: 'Бесплатная доставка'})}
                    </Text>
                ) : (
                    <Text style={styles.shipmentText}>
                        {i18n.t('shipment', {defaultValue: 'Доставка'})}: {MiscHelper.price(item.getShipmentPrice())}
                    </Text>
                )}
            </View>
        </View>
    );
}))

const styles = StyleSheet.create({
    item: {
        borderBottomColor: '#ebebeb',
        borderBottomWidth: 1,
        minHeight: 120,
        paddingVertical: 5,
        marginHorizontal: 15
    },
    imageContainer: {
        width: IMAGE_SIZE,
        height: IMAGE_SIZE,
        marginRight: 10
    },
    content: {
        paddingLeft: 12,
        marginRight: -15
    },
    innerContent: {
        marginVertical: 10,
        marginRight: 15
    },
    price: {
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 5
    },
    name: {
        fontSize: 14,
        marginBottom: 5
    },
    size: {
        color: '#999'
    },
    header: {
        borderTopWidth: 5,
        borderTopColor: '#f5f5f5',
        height: 50,
        paddingHorizontal: 15
    },
    headerInner: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderBottomColor: '#ebebeb',
        borderBottomWidth: 0.5,
    },
    headerText: {
        marginLeft: 12,
        fontSize: 15
    },
    bottomFlex: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
    },
    amountUpdater: {
        position: 'absolute', 
        right: 5, 
        bottom: 0,
        padding: 10
    },
    shipment: {
        paddingVertical: 13
    },
    shipmentText: {
        color: LINK_COLOR,
        marginLeft: 32
    }
});

export default CartItem;