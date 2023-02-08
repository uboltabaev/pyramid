import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import PropTypes from 'prop-types';
import { Rating } from 'react-native-ratings';
import Numeral from 'numeral';
import CssHelper from "../../helpers/css_helper";

const RATING_COLOR = '#b1b2b7';
const RATING_BG_COLOR = '#e2e2e4';

const RatingInfo = React.memo(({ rating, totalRating, ratingNumber }) => {
    const percent = Math.floor((ratingNumber / totalRating) * 100);
    return (
        <View style={[CssHelper['flexRowCentered'], styles.container]}>
            <Rating readonly={true} imageSize={12} ratingCount={5} startingValue={rating} type="custom" ratingColor={RATING_COLOR} ratingBackgroundColor={RATING_BG_COLOR}/>
            <View style={styles.progressBar}>
                <View style={[styles.progressBarInner, {width: percent + '%'}]}/>
            </View>
            <Text style={styles.text}>
                {Numeral(ratingNumber).format('0a')}
            </Text>
        </View>
    )
})

const styles = StyleSheet.create({
    container: {
        paddingTop: 6,
        paddingBottom: 6,
        justifyContent: "flex-start"
    },
    text: {
        color: "#b1b2b7",
        width: 40
    },
    progressBar: {
        flex: 1,
        backgroundColor: "#e2e2e4",
        height: 5,
        marginLeft: 7,
        marginRight: 7,
        borderRadius: 2,
        overflow: 'hidden'
    },
    progressBarInner: {
        backgroundColor: "#b1b2b7",
        height: 5,
        width: '0%'
    }
});

RatingInfo.propTypes = {
    rating: PropTypes.number,
    totalRating: PropTypes.number,
    ratingNumber: PropTypes.number,
}

RatingInfo.defaultProps = {
    rating: 1,
    totalRating: 0,
    ratingNumber: 0
}

export default RatingInfo;