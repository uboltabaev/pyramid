import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { Surface } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import i18n from 'i18n-js';
import LinearGradient from 'react-native-linear-gradient';
import CssHelper from '../../helpers/css_helper';
import FullscreenIcon from '../../components/icons/fullscreen_icon';
import CouponIcon from '../../components/icons/coupon2_icon';
import BadgeIcon from '../../components/icons/badge_icon';

const colors = [
    ['#fc5e39', '#fc5e39', '#fa4607', '#fa4607'],
    ['#3f98ff', '#3f98ff', '#0786f1', '#0786f1'],
    ['#fd50bd', '#fd50bd', '#fe31b2', '#fe31b2'],
    ['#fbd336', '#fbd336', '#f9c82d', '#f9c82d'],
    ['#5bccc6', '#5bccc6', '#4cc2b4', '#4cc2b4'],
    ['#bc48b2', '#bc48b2', '#b534aa', '#b534aa'],
    ['#3f98ff', '#3f98ff', '#0786f1', '#0786f1']
]

const TopLink = React.memo(({screen, index, i18Key, defaultText, navigation}) => {
    let icon = null;
    switch (screen) {
        case 'Categories':
            icon = <Ionicons name="ios-list" size={28} color="#fff"/>;
            break;
        case 'Under10':
            icon = <FullscreenIcon width={24} height={24} color="#fff"/>;
            break;
        case 'Top100':
            icon = <MaterialCommunityIcons name="fire" size={29} color="#fff"/>;
            break;
        case 'Coupons':
            icon = <CouponIcon width={27} height={27} color="#fff"/>;
            break;
        case 'New':
            icon = <SimpleLineIcons name="star" size={25} color="#fff"/>;
            break;
        case 'NewSellers':
            icon = <AntDesign name="adduser" size={25} color="#fff"/>;
            break;
        case 'Discounts':
            icon = <BadgeIcon width={27} height={27} color="#fff"/>;
            break;
    }
    return (
        <View style={[styles.topButtonOuter, index === 0 && (styles.noMarginLeft)]}>
            <TouchableOpacity activeOpacity={0.82} onPress={() => navigation.navigate(screen)}>
                <View style={CssHelper['flexSingleCentered']}>
                    <Surface style={styles.topLinkButton}>
                        <LinearGradient style={[CssHelper['flexRowCentered'], styles.topLinkButton]}
                            colors={colors[index]}
                            locations={[0, 0.49, 0.50, 1.0]}>
                            <View style={CssHelper['flexSingleCentered']}>
                                {icon}
                            </View>
                        </LinearGradient>
                    </Surface>
                    <Text style={styles.topLinkButtonText} numberOfLines={2} textBreakStrategy='simple'>
                        {i18n.t(i18Key, {defaultValue: defaultText})}
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
    );
});

const styles = StyleSheet.create({
    topButtonOuter: {
        width: 56,
        marginBottom: 5,
        marginLeft: 18
    },
    noMarginLeft: {
        marginLeft: 0
    },
    topLinkButton: {
        width: 44, 
        height: 44, 
        borderRadius: 25, 
        backgroundColor: '#fd6220',
        elevation: 1
    },
    topLinkButtonText: {
        color: '#000',
        fontSize: 11,
        marginTop: 4,
        textAlign: 'center',
    }
});

TopLink.propTypes = {
    screen: PropTypes.string.isRequired,
    index: PropTypes.number,
    i18Key: PropTypes.string.isRequired,
    defaultText: PropTypes.string.isRequired,
    navigation: PropTypes.object
}

TopLink.defaultProps = {
    index: -1
}

export default TopLink;