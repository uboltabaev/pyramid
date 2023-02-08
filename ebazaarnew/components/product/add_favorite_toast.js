import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import i18n from 'i18n-js';
import _ from 'underscore';
import CssHelper from "../../helpers/css_helper";
import {LINK_COLOR} from '../../constants/app';
import Toasty, { MODE_STICKY } from '../ui/toasty';
import CheckIcon from '../icons/check_icon';

const AddFavoriteToast = React.memo(({ isVisible, backgroundColor, navigation }) => {
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
        <Toasty backgroundColor={backgroundColor} mode={MODE_STICKY} ref={toastyRef}>
            <View style={[CssHelper['flexRowCentered'], {alignItems: 'flex-start'}]}>
                <View style={styles.iconContainer}>
                    <CheckIcon width={15} height={15} />
                </View>
                <View style={CssHelper['flex']}>
                    <Text style={styles.addFavoriteToastText} numberOfLines={2}>
                        {i18n.t('messages:added_to_favourites', {defaultValue: 'Добавлено в Мои желания'})}
                    </Text>
                </View>
                <TouchableOpacity activeOpacity={1} onPress={linkPress}>
                    <Text style={styles.addAddFavoriteToast}>
                        {i18n.t('view', {defaultValue: 'Смотреть'})}
                    </Text>
                </TouchableOpacity>
            </View>
        </Toasty>
    )
})


const styles = StyleSheet.create({
    addFavoriteToastText: {
        color: "#000",
        fontSize: 16
    },
    addAddFavoriteToast: {
        color: LINK_COLOR,
        fontSize: 16,
        padding: 5,
        margin: -5,
        marginLeft: 20
    },
    iconContainer: {
        width: 21,
        marginTop: 4
    }
});

AddFavoriteToast.propTypes = {
    isVisible: PropTypes.bool,
    backgroundColor: PropTypes.string
}

AddFavoriteToast.defaultProps = {
    isVisible: false,
    backgroundColor: '#fff'
}

export default AddFavoriteToast;