import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import Ripple from 'react-native-material-ripple';
import i18n from 'i18n-js';
import { SCREEN_WIDTH } from '../../constants/app';
import MiscHelper from '../../helpers/misc_helper';
import ImageStorage from '../ui/image_storage';

const IMAGE_WIDTH = (SCREEN_WIDTH - 36) / 2;

const SpecialProduct = React.memo(({ product, even, navigation }) => {
    const gotoProduct = useCallback(() => {
        navigation.navigate('Product', {
            productId: product.getId()
        })
    })

    return (
        <Ripple style={[styles.container, {marginRight: !even ? 6 : 0}]} rippleContainerBorderRadius={10} onPress={gotoProduct}>
            <ImageStorage storageUri={product.getImage400x400()}
                imageStyle={styles.image}
                resizeMode="cover"
                fadeDuration={300}
            />
            <View style={styles.content}>
                <Text style={styles.title} numberOfLines={2}>
                    {product.getName()}
                </Text>
                <Text style={styles.price}>
                    {MiscHelper.price(product.getPrice())}
                </Text>
                <Text style={styles.sold}>
                    {product.getSoldQuantity()} {i18n.t('sold', {defaultValue: 'продано'})}
                </Text>
            </View>
        </Ripple>
    )
})

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff', 
        borderRadius: 10, 
        width: IMAGE_WIDTH,
        paddingBottom: 10
    },
    title: {
        fontSize: 11,
        lineHeight: 14,
        paddingTop: 4,
        color: '#333',
        paddingTop: 7,
    },
    image: {
        width: IMAGE_WIDTH,
        height: IMAGE_WIDTH,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10
    },
    content: {
        paddingHorizontal: 10
    },
    price: {
        paddingTop: 5,
        fontWeight: 'bold',
        fontSize: 13
    },
    sold: {
        paddingTop: 2,
        color: '#999',
        fontSize: 10
    }
});

SpecialProduct.propTypes = {
    product: PropTypes.object.isRequired,
    even: PropTypes.bool
}

SpecialProduct.defaultValue = {
    even: false
}

export default SpecialProduct;