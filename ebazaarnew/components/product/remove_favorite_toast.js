import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import i18n from 'i18n-js';
import _ from 'underscore';
import CssHelper from "../../helpers/css_helper";
import Toasty from '../ui/toasty';

const RemoveFavoriteToast = React.memo(({ isVisible, backgroundColor, navigation }) => {
    const toastyRef = useRef();

    useEffect(() => {
        if (isVisible) {
            toastyRef.current.show();
        }
    }, [isVisible])

    const linkPress = () => {
        navigation.navigate('Favorites');
        setTimeout(() => {
            toastyRef.current.hide();
        }, 300);
    }

    return (
        <Toasty backgroundColor={backgroundColor} duration={5000} ref={toastyRef}>
            <View style={CssHelper['flexRowCentered']}>
                <Text style={styles.removeFavoriteToastText}>
                    {i18n.t('messages:removed_from_favourites', {defaultValue: "Удалено из списка желаний"})}
                </Text>
                <TouchableOpacity activeOpacity={1} onPress={linkPress}>
                    <Text style={styles.removeFavoriteToastLink}>
                        {i18n.t('view', {defaultValue: "Смотреть"})}
                    </Text>
                </TouchableOpacity>
            </View>
        </Toasty>
    )
})

const styles = StyleSheet.create({
    removeFavoriteToastText: {
        color: "#fff"
    },
    removeFavoriteToastLink: {
        textTransform: 'uppercase', 
        color: '#f44236',
        padding: 5,
        margin: -5
    }
});

RemoveFavoriteToast.propTypes = {
    isVisible: PropTypes.bool,
    backgroundColor: PropTypes.string,
    duration: PropTypes.number
}

RemoveFavoriteToast.defaultProps = {
    isVisible: false,
    backgroundColor: '#fff',
    duration: 5000
}

export default RemoveFavoriteToast;