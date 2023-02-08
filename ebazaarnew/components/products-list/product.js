import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text } from 'react-native';
import _ from 'underscore';
import Numeral from 'numeral';
import i18n from 'i18n-js';
import CssHelper from "../../helpers/css_helper";
import { APP_MAIN_COLOR, NATIONAL_CURRENCY, VIEW_MODE_LIST, VIEW_MODE_GRID } from '../../constants/app';
import Star from '../icons/star2_icon';
import Sale from '../ui/sale';

const Product = React.memo(({ product, mode }) => {
    const style = mode === VIEW_MODE_LIST ? [{}] :  [{paddingTop: 8, paddingRight: 8, paddingBottom: 10, paddingLeft: 8}];

    return (
        <View style={[style, {flex: 1}]}>
            <Text style={[CssHelper['productTitle'], styles.productTitle, mode === VIEW_MODE_GRID ? {marginTop: 0, fontSize: 11} : {}]} numberOfLines={2}>
                {product.name}
            </Text>
            { product.sale &&
                <View style={[CssHelper['inline'], styles.sale]}>
                    <Sale />
                </View>
            }
            <Text style={[CssHelper['productPrice'], styles.productPrice]}>
                {NATIONAL_CURRENCY} {Numeral(product.discountPrice).format('0,0')}
            </Text>
            <View style={styles.discountContainer}>
                <View style={[[CssHelper['flexRowCentered'], CssHelper['productDiscountBox']]]}>
                    <Text style={CssHelper['productDiscountPrice']}>
                        {NATIONAL_CURRENCY} {Numeral(product.price).format('0,0')}
                        </Text>
                    <Text style={CssHelper['productDiscountPercent']}>
                        -{product.discountPercentage}%
                    </Text>
                </View>
            </View>
            { product.freeShipment &&
                <Text style={[styles.productShipment, mode === VIEW_MODE_GRID ? {paddingTop: 10} : {}]}>
                    {i18n.t('free_shipping', {defaultValue: 'Бесплатная доставка'})}
                </Text>
            }
            <View style={{paddingTop: product.freeShipment ? mode === VIEW_MODE_GRID ? 1 : 8 : 20}}>
                <View style={[CssHelper['flexRowCentered'], {justifyContent: "flex-start"}]}>
                    <Text style={styles.productRating}>
                        4.9
                    </Text>
                    <Star width={10} height={10} color={APP_MAIN_COLOR}/>
                    <Text style={styles.productSoldQuantity}>
                        {product.soldQuantity} {} {i18n.t('sold', {defaultValue: 'продано'})}
                    </Text>
                </View>
            </View>
        </View>
    )
})

const styles = StyleSheet.create({
    productTitle: {
        marginTop: 0,
        lineHeight: 14
    },
    productPrice: {
        paddingTop: 8
    },
    productShipment: {
        color: '#9a9a9a', 
        paddingTop: 15, 
        fontSize: 11
    },
    productRating: {
        color: '#9a9a9a', 
        fontSize: 11, 
        paddingRight: 3,
        height: 16
    },
    productSoldQuantity: {
        color: '#9a9a9a', 
        fontSize: 11, 
        paddingLeft: 7,
        height: 16
    },
    sale: {
        marginTop: 10,
        marginBottom: -7
    },
    discountContainer: {
        height: 26
    }
});

Product.propTypes = {
    product: PropTypes.object.isRequired,
    mode: PropTypes.string.isRequired,
}

export default Product;