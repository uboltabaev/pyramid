import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import i18n from 'i18n-js';
import _ from 'underscore';
import { APP_MAIN_COLOR } from "../../constants/app";
import CssHelper from "../../helpers/css_helper";

const IMAGES = [
    {source: require('../../../assets/images/thumbs/2.png'), color: 'black'},
    {source: require('../../../assets/images/thumbs/2.png'), color: 'white'},
    {source: require('../../../assets/images/thumbs/2.png'), color: 'red'},
    {source: require('../../../assets/images/thumbs/2.png'), color: 'blue'},
    {source: require('../../../assets/images/thumbs/2.png'), color: 'green'},
    {source: require('../../../assets/images/thumbs/2.png'), color: 'gold'}
];

const SetColors = React.memo(({ changeAmount, selectColor, navigation }) => {
    const [color, setColor] = useState(null)

    const addCart = () => {
        navigation.navigate('AddCart')
    }

    return (
        <TouchableOpacity onPress={addCart} activeOpacity={1}>
            <View style={styles['set&colors']}>
                <View style={CssHelper['flexRowCentered']}>
                    <Text style={[CssHelper['productSectionTitle'], {paddingBottom: 0}]}>
                        {i18n.t('set&color', {defaultValue: "Комплект, цвет"})}
                    </Text>                        
                    <Text style={CssHelper['link3']}>
                        {i18n.t('select', {defaultValue: "Выберите"})}
                    </Text>
                </View>
                { color !== null &&
                    <View>
                        <Text style={styles.color}>{color}</Text>
                    </View>
                }
                <View style={styles.imagesContainer}>
                    { IMAGES.map((image, index) =>
                        <View key={index} style={[styles.imageContainer, image.color === color && (styles.imageContainerSelected)]}>
                            <Image source={image.source} style={styles.image}/>
                        </View>
                    )}
                    <View style={[styles.imageContainer, styles.moreImage]}>
                        <View style={styles.moreImageInner}>
                            <Text style={styles.moreText}>+4</Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
})

const styles = StyleSheet.create({
    "set&colors": {
        borderBottomColor: "#ebebeb",
        borderBottomWidth: 1
    },
    color: {
        fontSize: 12,
        color: "#989898",
        textTransform: 'capitalize'
    },
    imagesContainer: {
        paddingTop: 10,
        paddingBottom: 2,
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    imageContainer: {
        width: 34,
        height: 34,
        padding: 2,
        borderWidth: 1,
        borderColor: '#cccccc',
        borderRadius: 2,
        marginRight: 8,
        marginBottom: 8
    },
    imageContainerSelected: {
        borderColor: APP_MAIN_COLOR
    },
    image: {
        width: '100%',
        height: '100%'
    },
    moreImage: {
        borderColor: "#000"
    },
    moreImageInner: {
        flex: 1,
        justifyContent: "center"
    },
    moreText: {
        textAlign: 'center'
    }
});

SetColors.propTypes = {
    changeAmount: PropTypes.func,
    selectColor: PropTypes.func
}

export default SetColors;