import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Rating } from 'react-native-ratings';
import i18n from 'i18n-js';
import _ from 'underscore';
import CssHelper from "../helpers/css_helper";
import DarkPage, { ICON_CLOSE } from "../components/misc/dark_page";
import { APP_MAIN_COLOR, RATING_BG_COLOR, LOREM_IPSUM } from '../constants/app';
import RatingInfo from '../components/feedbacks/rating';
import ChatIcon from '../components/icons/chat_icon';
import DropDownMenu from '../components/ui/dropdown_menu';
import Feedback from '../components/feedbacks/feedback';

const FILTER_ALL = 'all';
const FILTER_EXTRA_FEEDBACK = 'extra';
const FILTER_STAR_1 = 'star1';
const FILTER_STAR_2 = 'star2';
const FILTER_STAR_3 = 'star3';
const FILTER_STAR_4 = 'star4';
const FILTER_STAR_5 = 'star5';

const DEFAULT_SORT = 1;

const SORT_ITEMS = [
    {id: 1, i18n: 'sort:default', defaultText: 'Сортировка по умолчанию'},
    {id: 2, i18n: 'sort:date_desc', defaultText: 'Сортировка по времени'},
];

const FEEDBACKS = [
    {
        autorName: 'Boltabaev',
        authorImage: require('../../assets/images/me.jpg'),
        stars: 4, 
        date: '2020-01-05', 
        color: 'Кора', 
        comment: LOREM_IPSUM,
        thumbnails: [
            {source: require('../../assets/images/thumbs/1.jpg')},
            {source: require('../../assets/images/thumbs/1.jpg')},
            {source: require('../../assets/images/thumbs/1.jpg')},
            {source: require('../../assets/images/thumbs/1.jpg')},
            {source: require('../../assets/images/thumbs/1.jpg')},
        ],
        yes_count: 12,
        no_count: 7,
        completed_feedback: {
            comment: LOREM_IPSUM,
            date: '2020-01-20'
        },
        review_helpful: {
            yes: 1,
            no: 0,
            date: '2020-01-01'
        }
    },
    {
        autorName: 'Teyyldkd',
        authorImage: null,
        stars: 3, 
        date: '2020-01-06', 
        color: 'Кора', 
        comment: LOREM_IPSUM,
        thumbnails: [
            {source: require('../../assets/images/thumbs/1.jpg')},
            {source: require('../../assets/images/thumbs/1.jpg')},
            {source: require('../../assets/images/thumbs/1.jpg')},
        ],
        yes_count: 0,
        no_count: 0,
        completed_feedback: null,
        review_helpful: null
    }
];

function FeedbacksContainer({ navigation }) {
    const [filter, setFilterS] = useState(FILTER_ALL)

    const setFilter = (filter) => {
        setFilterS(filter)
    }

    return (
        <DarkPage i18nKey="feedbacks" defaultText="Отзывы" icon={ICON_CLOSE} navigation={navigation}>
            <FlatList data={FEEDBACKS}
                style={styles.content}
                keyExtractor={item => item.id}
                removeClippedSubviews={true}
                onEndReachedThreshold={0.5}
                renderItem={({ item, index }) => 
                    <View key={index} style={styles.section}>
                        <Feedback data={item} navigation={navigation}/>
                    </View>
                }
                ListFooterComponent={
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={APP_MAIN_COLOR} style={{marginTop: 7}}/>
                    </View>
                }
                ListHeaderComponent={
                    <>
                        <View style={[CssHelper['flexRowCentered'], styles.section, styles.feedbacksInfo]}>
                            <View style={styles.infoL}>
                                <View style={styles.infoLInner}>
                                    <Text style={styles.infoLRating}>
                                        4.9<Text style={styles.infoLRating2}>/5</Text>
                                    </Text>
                                    <View style={styles.infoLStars}>
                                        <Rating readonly={true} imageSize={18} ratingCount={5} startingValue={4.9} type="custom" ratingColor={APP_MAIN_COLOR} ratingBackgroundColor={RATING_BG_COLOR}/>
                                    </View>
                                    <Text style={styles.infoLText} numberOfLines={1}>
                                        {i18n.t("rating", {defaultValue: 12224 + ' оценки', amount: 12224})}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.infoR}>
                                <RatingInfo rating={5} totalRating={12224} ratingNumber={10200}/>
                                <RatingInfo rating={4} totalRating={12224} ratingNumber={1200}/>
                                <RatingInfo rating={3} totalRating={12224} ratingNumber={350}/>
                                <RatingInfo rating={2} totalRating={12224} ratingNumber={150}/>
                                <RatingInfo rating={1} totalRating={12224} ratingNumber={20}/>
                            </View>
                        </View>
                        <View style={[CssHelper['flexRowCentered'], styles.section, styles.filterContainer]}>
                            <TouchableOpacity style={[styles.filterBox, filter === FILTER_ALL && (styles.filterBoxActive)]} activeOpacity={1} onPress={() => setFilter(FILTER_ALL)}>
                                <View style={CssHelper['flexRowCentered']}>
                                    <Text style={[styles.filterText, filter === FILTER_ALL && (styles.filterTextActive)]}>
                                        {i18n.t("all", {defaultValue: 'Все ('+12224+')', amount: 12224})}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.filterBox, filter === FILTER_EXTRA_FEEDBACK && (styles.filterBoxActive)]} activeOpacity={1} onPress={() => setFilter(FILTER_EXTRA_FEEDBACK)}>
                                <View style={CssHelper['flexRowCentered']}>
                                    <ChatIcon width={28} height={28} color={APP_MAIN_COLOR}/>
                                    <Text style={[styles.filterText, {paddingLeft: 7}, filter === FILTER_EXTRA_FEEDBACK && (styles.filterTextActive)]}>(1229)</Text>
                                </View>
                            </TouchableOpacity>
                            { _.times((5), (n) => {
                                const a = (n + 1),
                                    key = `FILTER_STAR_${n}`;
                                return (
                                    <TouchableOpacity key={n} style={[styles.filterBox, styles.filterBoxStars, filter === key && (styles.filterBoxStarsActive)]} activeOpacity={1} onPress={() => setFilter(key)}>
                                        <View style={CssHelper['flexRowCentered']}>
                                            <Rating readonly={true} imageSize={12} ratingCount={a} startingValue={a} type="custom" ratingColor={APP_MAIN_COLOR} ratingBackgroundColor={RATING_BG_COLOR}/>
                                        </View>
                                    </TouchableOpacity>    
                                );
                            })}
                        </View>
                        <View style={[styles.section, styles.sortContainer]}>
                            <DropDownMenu sort={DEFAULT_SORT} sortItems={SORT_ITEMS} popupWidth={240}/>
                        </View>
                    </>
                }
            />
        </DarkPage>
    )
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        paddingTop: 12
    },
    section: {
        borderBottomWidth: 1,
        borderBottomColor: '#ebebeb',
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 12
    },
    infoL: {
        width: 110
    },
    infoLInner: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingRight: 7
    },
    infoLRating: {
        fontSize: 32,
        color: "#3a3e4a"
    },
    infoLRating2: {
        fontSize: 18,
        color: "#8a8b8f"
    },
    infoLText: {
        color: "#888b90",
        fontSize: 14
    },
    infoLStars: {
        paddingTop: 7,
        paddingBottom: 5
    },
    infoR: {
        flex: 1,
        paddingLeft: 10,
        borderLeftWidth: 1,
        borderLeftColor: '#ebebeb'
    },
    filterContainer: {
        backgroundColor: "#fbfbfb",
        paddingTop: 10,
        justifyContent: "flex-start",
        flexWrap: 'wrap'
    },
    filterBox: {
        height: 40,
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#b2b1b6',
        backgroundColor: '#fff',
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 4,
        marginRight: 10
    },
    filterBoxActive: {
        borderWidth: 2,
        borderColor: APP_MAIN_COLOR,
        paddingLeft: 9,
        paddingRight: 9,
    },
    filterBoxStars: {
        paddingLeft: 15,
        paddingRight: 15
    },
    filterBoxStarsActive: {
        borderWidth: 2,
        borderColor: APP_MAIN_COLOR,
        paddingLeft: 14,
        paddingRight: 14
    },
    filterText: {
        fontSize: 14,
        color: '#000'
    },
    filterTextActive: {
        color: APP_MAIN_COLOR
    },
    sortContainer: {
        borderBottomWidth: 0,
        paddingLeft: 0,
        paddingBottom: 0,
        backgroundColor: '#fbfbfb',
        flexDirection:'row', flexWrap:'wrap'
    },
    loadingContainer: {
        backgroundColor: "#ebebeb",
        height: 60,
    }
});

export default FeedbacksContainer;