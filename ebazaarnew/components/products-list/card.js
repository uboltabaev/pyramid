import React from 'react';
import PropTypes from 'prop-types';
import { View, Image, StyleSheet } from 'react-native';
import Ripple from 'react-native-material-ripple';
import { Surface } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import Product from './product';
import { SCREEN_WIDTH } from '../../constants/app';

const getGridImageHeight = (imageSource) => {
    const image = Image.resolveAssetSource(imageSource),
        boxWidth = (Math.round(SCREEN_WIDTH) / 2) - 4;
    const height = boxWidth * image.height / image.width;
    return height;
}

const ProductCard = React.memo(({ product, even, viewMode, elevation, navigation }) => {
    return (
        <Surface style={[styles.cardStyle, elevation, {marginRight: !even ? 6 : 0}]}>
            <Ripple rippleDuration={200} 
                style={styles.cardInner} 
                rippleFades={false} 
                rippleOpacity={0.10} 
                rippleContainerBorderRadius={5} 
                onPress={() => navigation.navigate('Product')}
            >
                <View style={[styles.topRadius, {width: '100%', height: getGridImageHeight(product.imageSource)}]}>
                    <FastImage style={[styles.productImage]} 
                        source={product.imageSource} 
                        resizeMode={FastImage.resizeMode.cover} 
                        fadeDuration={0}
                    />
                </View>
                <Product product={product} mode={viewMode}/>
            </Ripple>
        </Surface>
    )
})

const styles = StyleSheet.create({
    cardStyle: {
        flex: 1,
        borderRadius: 5
    },
    cardInner: {
        flex: 1
    },
    topRadius: {
        borderTopLeftRadius: 5, 
        borderTopRightRadius: 5
    },
    productImage: {
        flex: 1, 
        width: '100%', 
        height: '100%',
        borderTopLeftRadius: 5, 
        borderTopRightRadius: 5
    }
});

ProductCard.propTypes = {
    product: PropTypes.object.isRequired,
    viewMode: PropTypes.string,
    index: PropTypes.number,
    elevation: PropTypes.number
}

ProductCard.defaultProps = {
    elevation: 1
}

export default ProductCard;