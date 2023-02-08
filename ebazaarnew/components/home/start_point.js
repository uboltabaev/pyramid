import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text } from 'react-native';
import _ from 'underscore';
import Ripple from 'react-native-material-ripple';
import FastImage from 'react-native-fast-image';
import i18n from 'i18n-js';
import posed from 'react-native-pose';
import CssHelper from "../../helpers/css_helper";
import Countdown, {THEME_DARK_COUNTDOWN} from '../ui/countdown';
import TextCarousel from '../ui/text-carousel';
import ArrowRightIcon from '../icons/arrow_right_icon';
import { SCREEN_WIDTH } from '../../constants/app';

const PRODUCTS = {
    left: {
        image_200x200: require( '../../../assets/images/start-point/smartphone-accessory.jpg'),
        name: 'Mobile phones',
        ru: 'Мобильные телефоны',
        uz: 'Мобил телефонлар',
        uz_latin: ''
    },
    middle_left: [
        {image_200x200: require('../../../assets/images/start-point/laptop.jpg')},
        {image_200x200: require('../../../assets/images/start-point/baby-outfits.jpg')},
        {image_200x200: require('../../../assets/images/start-point/coffee-maker.jpg')}
    ],
    middle_right: [
        {image_200x200: require('../../../assets/images/start-point/thermometer.jpg')},
        {image_200x200: require('../../../assets/images/start-point/shoes.jpg')},
        {image_200x200: require('../../../assets/images/start-point/pillow.jpg')}        
    ],
    right: {
        image_200x200: require('../../../assets/images/start-point/aravacha.jpg'),
        name: 'Baby stroller',
        ru: 'Детская коляска',
        uz: 'Болалар аравачаси',
        uz_latin: ''
    }
};

FadeScale = posed.View({
    show: {
        scale: 1.0,
        opacity: 1.0,
        transition: {
            duration: 400
        }
    },
    hide: {
        scale: 0.5,
        opacity: 0,
        transition: {
            duration: 400
        }
    }
});

const FadeScaleAnimation = React.memo(() => {
    const [index, setIndex] = useState(1);
    
    const changeIndex = () => {
        const i = index === 3 ? 1 : index + 1;
        setIndex(i);
    }

    useEffect(() => {
        let interval = null;
        const timeout = setTimeout(() => {
            interval = setInterval(() => {
                changeIndex();
            }, 4000);
        }, 1000);
        return () => {
            clearInterval(interval);
            clearTimeout(timeout);    
        }
    }, [index]);

    return (
        <View style={CssHelper['flexRowCentered']}>
            <View style={[styles.flipInner]}>
                { PRODUCTS.middle_left.map((product, i) => 
                    <FadeScale key={i} style={[styles.flipInner, StyleSheet.absoluteFill]} pose={index === (i + 1) ? "show" : "hide"}>
                        <FastImage source={product.image_200x200} resizeMode={FastImage.resizeMode.cover} style={styles.image}/>
                    </FadeScale>                
                )}
            </View>
            <View style={[styles.flipInner]}>
                { PRODUCTS.middle_right.map((product, i) => 
                    <FadeScale key={i} style={[styles.flipInner, StyleSheet.absoluteFill]} pose={index === (i + 1) ? "show" : "hide"}>
                        <FastImage source={product.image_200x200} resizeMode={FastImage.resizeMode.cover} style={styles.image}/>
                    </FadeScale>                
                )}
            </View>
        </View>
    );
});

const Arrow = posed.View({
    normal: {
        x: 0,
        transition: {
            duration: 250
        }    
    },
    move: {
        x: 5,
        transition: {
            duration: 250
        }    
    }
});

const ArrowAnimation = React.memo(() => {
    const [moved, setMoved] = useState(false);

    const toggleMoved = () => {
        setMoved(moved => !moved);
    }

    useEffect(() => {
        const interval = setInterval(() => {
            toggleMoved();
        }, 250);
        return () => {
            clearInterval(interval);
        }
    }, []);

    return (
        <Arrow pose={moved ? "normal" : "move"}>
            <ArrowRightIcon width={16} height={16} color="#fff"/>
        </Arrow>
    );
});

const IMAGE_WIDTH = ((SCREEN_WIDTH - 30) - 10 - 14 - 15) / 4;

function StartPoint({style}) {
    const locale = i18n.locale;

    return (
        <>
            <View style={[CssHelper['flexRowCentered'], styles.container, style]}>
                <View style={styles.smallPart}>
                    { _.isObject(PRODUCTS.left) &&
                        <Ripple rippleContainerBorderRadius={10}>
                            <View style={styles.smallImageBox}>
                                <FastImage source={PRODUCTS.left.image_200x200} resizeMode={FastImage.resizeMode.cover} style={styles.image}/>
                            </View>
                            <Text style={[styles.smallText]} numberOfLines={2}>
                                {PRODUCTS.left[locale]}
                            </Text>
                        </Ripple>
                    }
                </View>
                <View style={styles.divider}/>
                <View style={styles.largePart}>
                    <Ripple rippleContainerBorderRadius={10} rippleCentered={true} rippleSize={170}>
                        <View style={styles.largeImageBox}>
                            <FadeScaleAnimation />
                        </View>
                        <View style={styles.largeImageS}>
                            <View style={styles.swiperWrapper}>
                                <View style={{position: "absolute", right: 7, bottom: 2}}>
                                    <ArrowAnimation />
                                </View>
                                <TextCarousel height={25} interval={4000}>
                                    <TextCarousel.Item>
                                        <View style={CssHelper['flexSingleCentered']}>
                                            <Text style={[styles.largeText]} numberOfLines={1}>
                                                {i18n.t('start_point:50%_discount', {defaultValue: "Скидки до 50%"})}
                                            </Text>
                                        </View>
                                    </TextCarousel.Item>
                                    <TextCarousel.Item>
                                        <View style={CssHelper['flexSingleCentered']}>
                                            <Text style={[styles.largeText]} numberOfLines={1}>
                                                {i18n.t('start_point:ready_save', {defaultValue: "Готовы экономить?"})}
                                            </Text>
                                        </View>
                                    </TextCarousel.Item>
                                </TextCarousel>
                            </View>
                        </View>
                    </Ripple>
                </View>
                <View style={styles.divider}/>
                <View style={styles.smallPart}>
                    { _.isObject(PRODUCTS.right) &&
                        <Ripple rippleContainerBorderRadius={10}>
                            <View style={styles.smallImageBox}>
                                <FastImage source={PRODUCTS.right.image_200x200} resizeMode={FastImage.resizeMode.cover} style={styles.image}/>
                            </View>
                            <Text style={[styles.smallText]} numberOfLines={2}>
                                {PRODUCTS.right[locale]}
                            </Text>
                        </Ripple>
                    }
                </View>
            </View>
            <View style={[CssHelper['flexRowCentered'], styles.completeBox]}>
                <Text style={styles.completeTime}>
                    {i18n.t('start_point:until_graduation', {defaultValue: "До окончания"})}: 
                </Text>
                <Countdown theme={THEME_DARK_COUNTDOWN}/>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 112,
        alignItems: 'flex-end'
    },
    smallPart: {
        width: IMAGE_WIDTH,
        backgroundColor: '#efb144',
        borderRadius: 10
    },
    smallText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 9,
        padding: 3,
        paddingTop: 2,
        lineHeight: 10
    },
    smallImageBox: {
        height: IMAGE_WIDTH,
        borderRadius: 10,
        backgroundColor: '#fff',
        borderWidth: 0.5,
        borderColor: 'rgba(0, 0, 0, 0.10)'
    },
    largePart: {
        width: (IMAGE_WIDTH * 2) + 15 + 14
    },
    largeText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
        paddingTop: 3,
        fontSize: 13
    },
    swiperWrapper: {
        marginTop: 30
    },
    largeImageBox: {
        backgroundColor: '#fff',
        height: IMAGE_WIDTH + 10,
        borderRadius: 10,
        marginHorizontal: 7,
        paddingHorizontal: 5,
        paddingTop: 0,
        borderWidth: 0.5,
        borderColor: 'rgba(0, 0, 0, 0.10)',
        marginBottom: 30
    },
    largeImageS: {
        position: 'absolute', 
        borderRadius: 10,
        zIndex: -1, 
        backgroundColor: '#efb144',
        width: '100%', 
        height: 60, 
        bottom: 0
    },
    flipInner: {
        height: IMAGE_WIDTH,
        width: IMAGE_WIDTH
    },
    divider: {
        width: 5
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 10
    },
    completeBox: {
        marginTop: 10,
        marginBottom: 5,
        justifyContent: 'center'
    },
    completeTime: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 12,
        paddingRight: 2
    }
});

StartPoint.propTypes = {
    style: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object
    ]),
    language: PropTypes.string
}


export default StartPoint;