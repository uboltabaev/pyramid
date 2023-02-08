import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import Swiper from 'react-native-swiper';
import FastImage from 'react-native-fast-image'
import i18n from 'i18n-js';
import { APP_MAIN_COLOR } from "../../constants/app";
import ImageStorage from '../ui/image_storage';
import ImagePlaceholder from '../ui/image_placeholder';

const HomeCarousel = React.memo(({ slides }) => {
    const locale = i18n.locale
    
    if (slides.length) {
        return (
            <View style={styles.container}>
                <Swiper style={styles.wrapper} 
                    showsButtons={false} 
                    loop={true} 
                    autoplay={true} 
                    autoplayTimeout={5} 
                    dot={<View style={styles.dot}/>} 
                    activeDot={<View style={styles.activeDot}/>}
                    paginationStyle={styles.paginationStyle}
                    removeClippedSubviews={false}
                >
                    { slides.map((slide, index) => {
                        return (
                            <View style={[styles.slide, styles.c]} key={index}>
                                <ImageStorage storageUri={slide['slide_' + locale]} resizeMode={FastImage.resizeMode.cover}/>
                            </View>
                        );
                    })}
                </Swiper>
            </View>
        )    
    } else {
        return (
            <View style={[styles.container, styles.c]}>
                <ImagePlaceholder size="35%"/>
            </View>
        )
    }
});

const styles = StyleSheet.create({
    container: {
        height: 150,
        marginTop: 85
    },
    c: {
        marginLeft: 15,
        marginRight: 15,
        marginBottom: 5,
        backgroundColor: '#eef1f2',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
        borderRadius: 5
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',

    },
    paginationStyle: {
        backgroundColor: 'rgba(0, 0, 0, 0.10)',
        bottom: 15, 
        left: '35%', 
        right: '35%', 
        borderRadius: 10
    },
    dot: {
        backgroundColor:'rgba(255,255,255,1)', 
        width: 8, 
        height: 3,
        borderRadius: 2, 
        marginLeft: 3, 
        marginRight: 3, 
        marginTop: 3, 
        marginBottom: 3
    },
    activeDot: {
        backgroundColor: APP_MAIN_COLOR, 
        width: 8, 
        height: 3, 
        borderRadius: 2, 
        marginLeft: 3, 
        marginRight: 3, 
        marginTop: 3, 
        marginBottom: 3
    }
});

HomeCarousel.propTypes = {
    slides: PropTypes.array
}

export default HomeCarousel;