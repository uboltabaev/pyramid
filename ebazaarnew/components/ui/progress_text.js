import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import PropTypes from 'prop-types';

const ProgressText = React.memo(({text, backgroundColor, progressColor}) => {
    return (
        <View style={[styles.container, {backgroundColor}]}>
            <Text style={[styles.text, {color: progressColor}]} numberOfLines={1} ellipsizeMode="clip">
                {text}
            </Text>
            <View style={[styles.progress, {backgroundColor: progressColor, width: '40%'}]}>
                <Text style={[styles.text, {color: '#fff', paddingRight: 0}]} numberOfLines={1} ellipsizeMode="clip">
                    {text}
                </Text>
            </View>
        </View>
    )
});

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 2,
        borderRadius: 10
    },
    progress: {
        position: 'absolute',
        borderRadius: 10,
        overflow: 'hidden',
        width: '100%'
    },
    text: {
        fontSize: 11,
        paddingHorizontal: 7,
        paddingVertical: 2
    }
});

ProgressText.propTypes = {
    text: PropTypes.string,
    backgroundColor: PropTypes.string,
    progressColor: PropTypes.string
}

ProgressText.defaultProps = {
    text: '',
    backgroundColor: '#f2f2f2',
    progressColor: '#c79b50'
}

export default ProgressText;