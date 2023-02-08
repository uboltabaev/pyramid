import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import Ripple from 'react-native-material-ripple';
import i18n from 'i18n-js';
import LinearGradient from 'react-native-linear-gradient';
import { SCREEN_WIDTH } from '../../constants/app';
import CssHelper from '../../helpers/css_helper';
import MiscHelper from '../../helpers/misc_helper';
import ImageStorage from '../../components/ui/image_storage';

const DiscountCategories = React.memo(({ categories }) => {
    const [isLoaded, setIsLoaded] = useState(false)
    const locale = i18n.locale;

    useEffect(() => {
        if (categories.length > 0)
            setIsLoaded(true)
    }, [categories])

    return (
        <LinearGradient style={styles.container}
            colors={['#def0fc', '#def0fc', '#def0fc']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
        >
            <Text style={styles.title}>
                {i18n.t('discounts_by_categories', {defaultValue: 'Скидки по категориям'})}
            </Text>
            { isLoaded ? (
                <View style={styles.categories}>
                    { categories.map((category, i) => {
                        return (
                            <View key={i} style={[styles.categoryBox, {marginRight: (i + 1) % 4 === 0 ? 0 : 5}]}>
                                <Ripple rippleContainerBorderRadius={5}>
                                    <View style={styles.containerInner}>
                                        <View style={styles.imageBox}>
                                            <ImageStorage storageUri={category.image_storage_uri} imageStyle={styles.image} resizeMode="cover"/>
                                        </View>
                                        <View style={[styles.category]}>
                                            <View style={[styles.opacity]}/>
                                            <Text style={[styles.categoryText]} numberOfLines={2}>
                                                {category[locale]}
                                            </Text>
                                        </View>
                                    </View>
                                </Ripple>
                            </View>
                        )
                    })}
                </View>
            ) : (
                <View style={styles.empty}>
                    <View style={CssHelper['flexSingleCentered']}>
                        <ActivityIndicator color="#0099ff" size="large"/>
                    </View>
                </View>
            )}
        </LinearGradient>
    )
})

const styles = StyleSheet.create({
    container: {
        borderTopWidth: 5,
        borderTopColor: '#d5dbdb',
        borderBottomWidth: 5,
        borderBottomColor: '#d5dbdb',
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#def0fc'
    },
    containerInner: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: "#fff",
        borderRadius: 5
    },
    title: {
        fontWeight: 'bold',
        fontSize: 14,
        paddingBottom: 5,
        color: '#000'
    },
    categories: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    empty: {
        marginTop: -20,
        height: 220
    },
    imageBox: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        height: 75
    },
    categoryBox: {
        borderRadius: 5, 
        marginTop: 5,
        marginRight: 5, 
        width: (SCREEN_WIDTH - 30 - 15) / 4
    },
    image: {
        borderRadius: 5,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        width: '100%',
        height: '100%'
    },
    category: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        height: 30,
        paddingBottom: 2,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
    },
    categoryText: {
        fontWeight: "bold",
        fontSize: 9,
        lineHeight: 10,
        textAlign: "center",
        color: "#000"
    },
    opacity: {
        width: '100%', 
        height: 30, 
        opacity: 0.3, 
        position: 'absolute',
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5
    },
    discountContainer: {
        height: 20, 
        backgroundColor: '#fff'
    },
    discountBox: {
        height: 16, 
        width: 36, 
        backgroundColor: '#ff4747', 
        borderRadius: 10
    },
    discountText: {
        textAlign: 'center', 
        color: '#fff', 
        fontSize: 9.5, 
        fontWeight: 'bold', 
        fontStyle: 'italic'
    }
});

export default DiscountCategories;