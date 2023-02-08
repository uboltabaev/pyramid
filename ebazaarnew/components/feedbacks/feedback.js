import React, { useReducer } from 'react';
import { StyleSheet, View, Text, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { Rating } from 'react-native-ratings';
import i18n from 'i18n-js';
import { APP_MAIN_COLOR, RATING_BG_COLOR, LOREM_IPSUM, SCREEN_WIDTH } from '../../constants/app';
import CssHelper from "../../helpers/css_helper";
import UserIcon from '../icons/user2_icon';
import Button, { STATUS_ACTIVE, STATUS_PRESSED, STATUS_DISABLED } from '../ui/button2';
import DateHelper from '../../helpers/date_helper';
import MiscHelper from '../../helpers/misc_helper';

const THUMBS_PER_ROW = 3;
const THUMBNAIL_SIZE = Math.floor(((SCREEN_WIDTH - 58 - 30) - (10)) / THUMBS_PER_ROW);

const REVIEW_HELPFUL_ACTION_YES = 'yes';
const REVIEW_HELPFUL_ACTION_NO = 'no';

const Feedback = React.memo(({ data, navigation }) => {
    const [state, setState] = useReducer(
        (state, newState) => ({...state, ...newState}),
        {
            dataS: data,
            isProcessing: false
        }
    )

    const { dataS, isProcessing } = state;

    const save = (action) => {
        if (isProcessing)
            return;
        setState({
            isProcessing: true
        })
        setTimeout(() => {
            let review_helpful = {};
            switch(action) {
                case REVIEW_HELPFUL_ACTION_YES:
                    review_helpful.yes = 1;
                    review_helpful.no = 0;
                    break;
                case REVIEW_HELPFUL_ACTION_NO:
                    review_helpful.yes = 0;
                    review_helpful.no = 1;
                    break;
            }
            dataS.review_helpful = review_helpful;
            setState({
                dataS,
                isProcessing: false
            })
        }, 1000)
    }

    const daysAfter = (a, b) => {
        return DateHelper.daysBetween(new Date(a), new Date(b))
    }

    const yesNoButton = (i18nKey, defaultText, action, amount) => {
        let status = STATUS_ACTIVE,
            extraText = amount > 0 ? "(" + amount + ")" : "";
        if (dataS.review_helpful !== null) {
            switch (action) {
                case REVIEW_HELPFUL_ACTION_YES:
                    if (dataS.review_helpful.yes)
                        status = STATUS_PRESSED;
                    else
                        status = STATUS_DISABLED;
                    break;
                case REVIEW_HELPFUL_ACTION_NO:
                    if (dataS.review_helpful.no)
                        status = STATUS_PRESSED;
                    else
                        status = STATUS_DISABLED;
                    break;
            }
        }
        return (
            <Button i18nKey={i18nKey} defaultText={defaultText} style={styles.button} status={status} onPress={() => save(action)} extraText={extraText}/>
        );
    }

    const dateHelper = new DateHelper(i18n.locale)
    
    return (
        <View>
            <View style={[CssHelper['flexRowCentered'], styles.container]}>
                <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                        { dataS.authorImage ? (
                            <Image source={dataS.authorImage} style={styles.authorImage}/>
                        ):(
                            <UserIcon width={48} height={48} color="#f7f7f7"/>
                        )}
                    </View>
                </View>
                <View style={CssHelper['flex']}>
                    <View style={CssHelper['flexRowStart']}>
                        <View style={CssHelper['flex']}>
                            <Text style={styles.author}>
                                {MiscHelper.anonymizeName(dataS.autorName)}
                            </Text>
                        </View>
                        <View>
                            <Rating readonly={true} imageSize={12} ratingCount={5} startingValue={dataS.stars} type="custom" ratingColor={APP_MAIN_COLOR} ratingBackgroundColor={RATING_BG_COLOR}/>
                        </View>
                    </View>
                    <Text style={styles.date}>
                        {dateHelper.getDateShort(dataS.date)}
                    </Text>
                    <Text style={styles.color}>
                        {i18n.t('color', {defaultValue: 'Цвет'})}: {dataS.color}
                    </Text>
                    <Text style={styles.comment}>
                        {LOREM_IPSUM}
                    </Text>
                    <View style={[CssHelper['flexRowCentered'], styles.thumbnails]}>
                        { dataS.thumbnails.map((thumbnail, index) =>
                            <View key={index} style={[styles.thumbnailContainer, (index + 1) % THUMBS_PER_ROW === 0 && ({marginRight: 0})]}>
                                <TouchableOpacity style={CssHelper['flex']} activeOpacity={1} onPress={() => navigation.navigate('FeedbacksImages')}>
                                    <Image source={thumbnail.source} style={styles.thumbnail}/>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                    { dataS.completed_feedback !== null &&
                        <View style={styles.completedFeedackContainer}>
                            <Text style={styles.completedFeedackTitle}>
                                {i18n.t('feedback_completed', {defaultValue: "Дополнено спустя " + daysAfter(dataS.date, dataS.completed_feedback.date) + " дн", day: daysAfter(dataS.date, dataS.completed_feedback.date)})}
                            </Text>
                            <Text style={styles.completedFeedackText}>{dataS.completed_feedback.comment}</Text>
                        </View>
                    }
                </View>
            </View>
            <View style={[CssHelper['flexRowCentered'], styles.actions]}>
                <Text style={{fontSize: 13}}>
                    {i18n.t('was_review_helpful', {defaultValue: "Вам помог этот отзыв?"})}
                </Text>
                {yesNoButton("yes", "Да", REVIEW_HELPFUL_ACTION_YES, dataS.yes_count)}
                {yesNoButton("no", "Нет", REVIEW_HELPFUL_ACTION_NO, dataS.no_count)}
                { isProcessing && 
                    <View style={styles.indicator}>
                        <ActivityIndicator size="small" color={APP_MAIN_COLOR}/>
                    </View>
                }
            </View>
        </View>
    )
})

const styles = StyleSheet.create({
    container: {
        paddingTop: 12,
        justifyContent: "flex-start",
        alignItems: 'flex-start'
    },
    avatar: {
        backgroundColor: "#ebebeb",
        borderRadius: 24
    },
    avatarContainer: {
        width: 48,
        height: 48,
        marginRight: 10
    },
    authorImage: {
        width: '100%',
        height: '100%',
        borderRadius: 24
    },
    content: {
        flex: 1,
        justifyContent: 'flex-start'
    },
    author: {
        color: '#333'
    },
    date: {
        color: "#b1b2b7",
        marginTop: 10,
        fontSize: 13
    },
    color: {
        color: "#b1b2b7",
        marginTop: 2,
        fontSize: 13
    },
    comment: {
        marginTop: 10,
        fontSize: 15,
        paddingBottom: 10,
        color: '#333'
    },
    thumbnails: {
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        paddingBottom: 5
    },
    thumbnailContainer: {
        width: THUMBNAIL_SIZE,
        height: THUMBNAIL_SIZE,
        marginBottom: 5,
        marginRight: 5
    },
    thumbnail: {
        width: '100%',
        height: '100%'
    },
    completedFeedackContainer: {
        paddingTop: 10
    },
    completedFeedackTitle: {
        color: '#e29d36',
        fontSize: 12,
        paddingBottom: 3
    },
    completedFeedackText: {
        fontSize: 12,
        color: '#333'
    },
    actions: {
        paddingTop: 10,
        paddingBottom: 10,
        justifyContent: 'flex-start'
    },
    button: {
        marginLeft: 5
    },
    indicator: {
        paddingLeft: 5
    }
});

Feedback.propTypes = {
    data: PropTypes.object.isRequired,
}

export default Feedback;