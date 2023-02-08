import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import _ from 'underscore';
import CssHelper from '../../helpers/css_helper';
import XIcon from '../icons/x2_icon';

const ClearInput = React.memo(({ style, color, onPress }) => {
    const clearInput = () => {
        if (_.isFunction(onPress))
            onPress()
    }

    return (
        <View style={[styles.container, {backgroundColor: color}, style]}>
            <TouchableOpacity style={[CssHelper['flexSingleCentered'], styles.touchable]} activeOpacity={1} onPress={clearInput}>
                <XIcon width={9} height={9} color={"#fff"}/>
            </TouchableOpacity>
        </View>
    )
})

const styles = StyleSheet.create({
    container: {
        width: 22,
        height: 22,
        borderRadius: 11
    },
    touchable: {
        padding: 5, 
        margin: -5
    }
});

ClearInput.propTypes = {
    style: PropTypes.object,
    onPress: PropTypes.func,
    color: PropTypes.string
}

ClearInput.defaultProps = {
    color: '#8a8a92'
}

export default ClearInput;