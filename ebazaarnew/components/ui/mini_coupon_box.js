import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import PropTypes from 'prop-types';
import CircleLine from '../misc/graph_helper';

const HEIGHT = 32;

const MiniCouponBox = React.memo(({ text }) => {
    return (
        <View style={styles.container}>
            <CircleLine containerHeight={HEIGHT} position="R" circleRadius={6} numberOfCircles={4}/>
            <CircleLine containerHeight={HEIGHT} position="L" circleRadius={6} numberOfCircles={4}/>
            <Text style={[styles.text]} numberOfLines={1}>
                {text}
            </Text>
        </View>
    )
})

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        height: HEIGHT,
        paddingLeft: 10,
        paddingRight: 5,
        backgroundColor: '#fbbe2f',
    },
    text: {
        fontSize: 12,
        color: "#6e410f"
    }
});

MiniCouponBox.propTypes = {
    text: PropTypes.string.isRequired
}

MiniCouponBox.defaultProps = {
    text: ""
}

export default MiniCouponBox;