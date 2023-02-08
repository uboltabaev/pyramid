import React, { useEffect } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import CssHelper from "../../helpers/css_helper";
import PopNav from "../popup_nav";
import BackIcon from '../icons/back_icon';
import CartIcon from '../icons/cart_icon';
import Searchbar from '../home/searchbar';
import Ripple from '../ui/ripple';

const LightHeader = React.memo(({ navigation }) => {

    let timeout = null

    useEffect(() => {
        return () => {
            clearTimeout(timeout)
        }
    }, [])

    const goBack = () => {
        timeout = setTimeout(() => {
            navigation.goBack()
        }, 50)
    }

    return (
        <View style={CssHelper['lightPage.header']}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true}/>
            <View style={CssHelper['lightPage.innerHeader']}>
                <Ripple style={[CssHelper['backRipple'], styles.backRipple]} onPress={goBack}>
                    <View style={[CssHelper['backIcon'], styles.backIcon]}>
                        <BackIcon width={18} height={18}/>
                    </View>
                </Ripple>
                <View style={styles.searchbarContainer}>
                    <Searchbar backgroundColor="#f2f2f2" navigation={navigation}/>
                </View>
                <View style={styles.divider}/>
                <Ripple onPress={() => navigation.navigate('Cart')}>
                    <View style={styles.cartContainer}>
                        <View style={CssHelper['flexSingleCentered']}>
                            <CartIcon width={23} height={23}/>
                        </View>
                    </View>
                </Ripple>
                <View style={styles.divider}/>
                <PopNav navigation={navigation}/>
            </View>
        </View>
    )
    
})

const styles = StyleSheet.create({
    searchbarContainer: {
        flex: 1, 
        paddingTop: 6, 
        paddingBottom: 6,
        marginRight: 16
    },
    cartContainer: {
        width: 15,
        height: 35,
    },
    divider: {
        width: 12
    },
    backIcon: {
        margin: 0,
        padding: 10,
        paddingLeft: 0
    },
    backRipple: {
        padding: 0,
        margin: 0,
        marginLeft: 7,
        marginRight: 12
    }
});

export default LightHeader;