import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import i18n from 'i18n-js';
import {Rating} from 'react-native-ratings';
import Ripple from 'react-native-material-ripple';
import { APP_MAIN_COLOR, RATING_BG_COLOR, LOREM_IPSUM } from "../../constants/app";
import CssHelper from "../../helpers/css_helper";
import DateHelper from "../../helpers/date_helper";
import MoreIcon from "../icons/more_vertical_icon";
import MiscHelper from '../../helpers/misc_helper';

const THUMBNAILS = [
    {source: require('../../../assets/images/thumbs/1.jpg')},
    {source: require('../../../assets/images/thumbs/1.jpg')},
    {source: require('../../../assets/images/thumbs/1.jpg')},
    {source: require('../../../assets/images/thumbs/1.jpg')},
    {source: require('../../../assets/images/thumbs/1.jpg')}
];

const FEEDBACK_DATA = {
    text: LOREM_IPSUM,
    score: 4,
    author: 'Boltabaev',
    created_date: '2019-12-26'
};

const Feedbacks = React.memo(({ navigation }) => {
    const dateHelper = new DateHelper(i18n.locale)

    return (
        <View style={styles.content}>
            <Ripple rippleFades={false} rippleOpacity={0.08} onPress={() => navigation.navigate('Feedbacks')} style={styles.ripple}>
                <Text style={[CssHelper['productSectionTitle'], {paddingBottom: 0}]}>
                    {i18n.t('feedbacks', {defaultValue: 'Отзывы'})} (252)
                </Text>
            </Ripple>
            <View style={{height: 10}}></View>
            <Ripple rippleFades={false} rippleOpacity={0.08} onPress={() => navigation.navigate('Feedbacks')} style={styles.ripple}>
                <View style={[CssHelper['flexRowCentered'], {justifyContent: "flex-start"}]}>
                    <Text style={styles.productRating}>{4.7}</Text>
                    <Text style={styles.productRatingDivider}>/</Text>
                    <Text style={styles.productRating2}>5</Text>
                    <Rating readonly={true} 
                        imageSize={17} 
                        ratingCount={5} 
                        startingValue={4.7} 
                        type="custom" 
                        ratingColor={APP_MAIN_COLOR} 
                        ratingBackgroundColor={RATING_BG_COLOR}
                    />
                </View>
            </Ripple>
            <View style={[CssHelper['flexRowCentered'], styles.thumbnailsContainer]}>
                { THUMBNAILS.map((thumbnail, index) =>
                    <View key={index} style={styles.thumbnail}>
                        <Image source={thumbnail.source} style={styles.t}/>
                    </View>
                )}
                <TouchableOpacity activeOpacity={1} style={styles.moreThumbnails} onPress={() => navigation.navigate('Feedbacks')}>
                    <MoreIcon width={20} height={20}/>
                </TouchableOpacity>
            </View>
            <Ripple style={styles.feedback} rippleFades={false} rippleOpacity={0.08} onPress={() => navigation.navigate('Feedbacks')} rippleDuration={250}>
                <View style={CssHelper['flexRowCentered']}>
                    <Text style={styles.author}>{MiscHelper.anonymizeName(FEEDBACK_DATA['author'])}</Text>
                    <Text style={styles.date}>
                        {dateHelper.getDateShort(FEEDBACK_DATA['created_date'])}
                    </Text>
                </View>
                <View style={[CssHelper['flexRowCentered'], styles.feed_rating]}>
                    <Rating readonly={true} 
                        imageSize={14} 
                        ratingCount={5} 
                        startingValue={FEEDBACK_DATA['score']} 
                        type="custom" 
                        ratingColor={APP_MAIN_COLOR} 
                        ratingBackgroundColor={RATING_BG_COLOR}
                    />
                </View>
                <View style={styles.text}>
                    <Text numberOfLines={3}>
                        {FEEDBACK_DATA['text']}
                    </Text>
                </View>
                <View>
                    <TouchableOpacity activeOpacity={1} onPress={() => navigation.navigate('Feedbacks')}>
                        <Text style={CssHelper['link2']}>
                            {i18n.t('view_all', {defaultValue: 'Посмотреть все'})}
                        </Text>
                    </TouchableOpacity>
                </View>
            </Ripple>
        </View>
    )
})

const styles = StyleSheet.create({
    content: {
        
    },
    productRating: {
        fontWeight: "bold",
        fontSize: 16
    },
    productRating2: {
        color: "#666666",
        fontSize: 13,
        paddingRight: 10
    },
    productRatingDivider: {
        color: "#666666",
        fontSize: 14,
        paddingLeft: 2,
        paddingRight: 2
    },
    thumbnailsContainer: {
        paddingTop: 10,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#ebebeb"
    },
    thumbnail: {
        width: 55,
        height: 55,
        marginRight: 5,
    },
    t: {
        width: '100%',
        height: '100%',
        borderRadius: 5,
    },
    moreThumbnails: {
        borderColor: "#000",
        borderWidth: 1,
        height: 55,
        flex: 1,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    feedback: {
        paddingTop: 10,
        paddingBottom: 10,
        marginHorizontal: -10,
        paddingHorizontal: 10,
    },
    date: {
        color: "#999",
        fontSize: 12
    },
    author: {
        color: "#999"
    },
    feed_rating: {
        marginTop: 5
    },
    text: {
        paddingTop: 8,
        paddingBottom: 3
    }, 
    ripple: {
        marginLeft: -10, 
        paddingLeft: 10,
        marginRight: -10,
        paddingRight: 10
    }
});

export default Feedbacks;