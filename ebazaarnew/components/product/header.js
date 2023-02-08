import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Animated, View, Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ripple from '../ui/ripple';
import CssHelper from "../../helpers/css_helper";
import BackIcon from "../icons/back_icon";
import ShareIcon from '../icons/share2_icon';
import CartIcon from '../icons/cart_icon';
import PopNav, { MODE_PRODUCT } from "../popup_nav";

const Header = React.memo(({ title, height, headerShadowHeight, navigation }) => {
    const goBack = () => {
        setTimeout(() => {
            navigation.goBack();
        }, 50)
    }

    const cartItemsNum = 0 //this.props.store.cartStore.cartItemsNum;
    
    return (
        <Animated.View style={[styles.header, {height}]}>
            <LinearGradient colors={['rgba(0, 0, 0, 0.3)', 'rgba(255, 255, 255, 0)']} style={styles.headerGradient}>
                <Animated.View style={[styles.headerBg, {height: (height + 5)}]}>
                    <View style={[styles.headerBgUpper, {height}]}/>
                    <View style={{height: headerShadowHeight}}>
                        <LinearGradient colors={['rgba(0, 0, 0, 0.3)', 'rgba(255, 255, 255, 0)']} style={CssHelper['flex']}/>
                    </View>
                </Animated.View>
                <View style={[styles.headerInner, {height}, CssHelper['flexRowCentered']]}>
                    <Ripple pressColor="rgba(255, 255, 255, 0.40)" style={[styles.icon, styles.backIcon]} onPress={goBack}>
                        <View style={[CssHelper['flexSingleCentered']]}>
                            <BackIcon width={16} height={16} color="#fff"/>
                        </View>
                    </Ripple>
                    <Animated.View style={[styles.title]}>
                        <Text style={styles.titleText} numberOfLines={1}>
                            {title}
                        </Text>
                    </Animated.View>
                    <TouchableOpacity activeOpacity={0.6} style={styles.icon} onPress={() => navigation.navigate('CartInner')}>
                        <View style={[CssHelper['flexSingleCentered']]}>
                            { cartItemsNum > 0 &&
                                <View style={CssHelper['cartBadge']}>
                                    <Text style={CssHelper['cartBadgeText']}>
                                        {cartItemsNum}
                                    </Text>
                                </View>
                            }
                            <CartIcon width={23} height={23} color="#fff"/>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.iconDivider}/>
                    <TouchableOpacity activeOpacity={0.6} style={styles.icon}>
                        <View style={[CssHelper['flexSingleCentered']]}>
                            <ShareIcon width={18} height={18} color="#fff"/>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.iconDivider2}/>
                    <PopNav navigation={navigation} 
                        theme="dark" 
                        mode={MODE_PRODUCT} 
                        pressColor="rgba(255, 255, 255, 0.40)" 
                        style={{width: 40, height: 40}}
                    />
                </View>
            </LinearGradient>
        </Animated.View>
    )
})

const styles = StyleSheet.create({
    header: {
        position: 'absolute',
        zIndex: 99999,
        top: 0,
        left: 0,
        width: '100%',
        borderWidth: 0, 
        borderColor: 'transparent'
    },
    headerGradient: {
        flex: 1,
        paddingTop: 24
    },
    headerBg: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        opacity: 1,
        borderWidth: 0,
        zIndex: 0,
        borderColor: 'transparent'
    },
    headerBgUpper: {
        backgroundColor: '#000',
    },
    headerInner: {
        zIndex: 0, 
        position: 'absolute', 
        top: 0,
        left: 0,
        width: '100%',
        paddingTop: 24, 
        borderColor: 'transparent', 
        borderWidth: 0
    },
    title: {
        flex: 1,
        marginLeft: 10,
        marginTop: -2,
        marginRight: 15
    },
    titleText: {
        color: "#fff", 
        fontSize: 18
    },
    icon: {
        width: 30,
        height: 30
    },
    backIcon: {
        width: 60,
    },
    iconDivider: {
        width: 20
    },
    iconDivider2: {
        width: 15
    }
});

Header.propTypes = {
    title: PropTypes.string.isRequired,
    height: PropTypes.number.isRequired,
    headerShadowHeight: PropTypes.number
}

export default Header;