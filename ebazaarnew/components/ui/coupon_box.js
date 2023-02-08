import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Image, ImageBackground } from 'react-native';
import _ from 'underscore';
import PropTypes from 'prop-types';
import { APP_MAIN_COLOR } from "../../constants/app";
import CssHelper from "../../helpers/css_helper";
import SimpleButton from "../ui/simply_button";
import CircleLine, { CutLine } from "../misc/graph_helper";

export const THEME_COUPON_BOX_SYSTEM = 'system';
export const THEME_COUPON_BOX_SELLER = 'seller';
export const COUPON_BOX_HEIGHT = 84;
export const SELLER_COUPON_BOX_HEIGHT = 94;

const STATUS_PENDING = 'pending';
const STATUS_PROCESSING = 'processing';
const STATUS_COMPLETED = 'completed';

const CouponBox = React.memo(({ theme, title, desc, date, onClick }) => {
    const [status, setStatus] = useState(STATUS_PENDING)

    useEffect(() => {
        if (_.isFunction(onClick)) {
            onClick();
        }
    }, [status])

    const getClick = () => {
        setStatus(STATUS_PROCESSING)
    }

    const backgroundColor = theme === THEME_COUPON_BOX_SYSTEM ? "#db4e57" : "#fbbe2f",
        height = theme === THEME_COUPON_BOX_SYSTEM ? COUPON_BOX_HEIGHT : SELLER_COUPON_BOX_HEIGHT,
        numberOfCircles = theme === THEME_COUPON_BOX_SYSTEM ? 8 : 9;

    return (
        <View style={CssHelper['flexRowCentered']}>
            <View style={[styles.L, {backgroundColor, height}]}>
                <CircleLine containerHeight={height} position="L" circleRadius={8.4} numberOfCircles={numberOfCircles}/>
                { theme === THEME_COUPON_BOX_SYSTEM &&
                    <View style={CssHelper['giftContainer']}>
                        <Image source={require("../../../assets/images/gift.png")} style={{width: '100%', height: '100%'}} resizeMode="contain" fadeDuration={0}/>
                    </View>
                }
                { theme === THEME_COUPON_BOX_SELLER &&
                    <View style={CssHelper['giftContainer']}>
                        <Image source={require("../../../assets/images/gift2.png")} style={{width: '100%', height: '100%'}} resizeMode="contain" fadeDuration={0}/>
                    </View>
                }
                <Text style={[styles.couponAmount, theme === THEME_COUPON_BOX_SELLER && (styles.color2)]}>
                    {title}
                </Text>
                <Text style={[styles.couponStartingAmount, theme === THEME_COUPON_BOX_SELLER && (styles.color2)]} numberOfLines={2}>
                    {desc}
                </Text>
                <Text style={[styles.couponDate, theme === THEME_COUPON_BOX_SELLER && (styles.color2)]}>
                    {date}
                </Text>
            </View>
            <View style={[styles.R, {backgroundColor, height}]}>
                <ImageBackground style={[CssHelper['flex'], styles.RInner]} source={require('../../../assets/images/pattern.png')} resizeMode="cover">
                    <CutLine containerHeight={height} width={2}/>
                    <CircleLine containerHeight={height} position="R" circleRadius={8.4} numberOfCircles={numberOfCircles}/>
                    <View style={styles.buttonContainer}>
                        { status === STATUS_PENDING &&
                            <SimpleButton i18nKey="get" 
                                defaultText="Получить" 
                                onPress={getClick}
                            />
                        }
                        { status === STATUS_PROCESSING &&
                            <ActivityIndicator size="small" color={'#fff'}/>
                        }
                    </View>
                </ImageBackground>
            </View>
        </View>
    )    
})

const styles = StyleSheet.create({
    L: {
        flex: 1,
        backgroundColor: APP_MAIN_COLOR,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        height: COUPON_BOX_HEIGHT,
        paddingLeft: 20,
        paddingTop: 10
    },
    R: {
        backgroundColor: APP_MAIN_COLOR,
        width: 120,
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        height: COUPON_BOX_HEIGHT,
    },
    RInner: {
        paddingRight: 5
    },
    buttonContainer: {
        flex: 1, 
        paddingLeft: 10, 
        paddingRight: 10, 
        justifyContent: 'center'
    },
    couponAmount: {
        color: "#fff",
        fontWeight: 'bold',
        fontSize: 20,
        lineHeight: 25
    },
    couponStartingAmount: {
        color: "#fff",
        fontSize: 10,
        paddingTop: 3
    },
    couponDate: {
        paddingTop: 5,
        color: "#fff",
        fontSize: 10
    },
    color2: {
        color: '#6e410f'
    }
});

CouponBox.propTypes = {
    theme: PropTypes.string,
    title: PropTypes.string,
    desc: PropTypes.string,
    date: PropTypes.string,
    onClick: PropTypes.func 
}

CouponBox.defaultProps = {
    theme: THEME_COUPON_BOX_SYSTEM,
    title: "",
    desc: "",
    date: ""
}

export default CouponBox;