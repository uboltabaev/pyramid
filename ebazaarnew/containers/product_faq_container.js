import React from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator } from 'react-native';
import i18n from 'i18n-js';
import _ from 'underscore';
import { Surface } from 'react-native-paper';
import Ripple from 'react-native-material-ripple';
import CssHelper from "../helpers/css_helper";
import DarkPage, { ICON_CLOSE } from "../components/misc/dark_page";
import { LINK_COLOR, APP_MAIN_COLOR } from '../constants/app';
import QuestionBubble from '../components/ui/question_bubble';
import DateHelper from '../helpers/date_helper';
import PostBox from '../components/product-faq/post_box';

const QUESTIONS_LIST = [
    {
        question: 'Неча пулга харид килдингиз?',
        answer: '11 ноябрда купонлар билан 125000 сумга тушди',
        total_answers: 9,
        date: '2019-11-29'
    },
    {
        question: 'Ким Хоразмдан буюртма берган, неча кун кутдиларинг?',
        answer: 'Хоразмдан, 5 кунда келди',
        total_answers: 4,
        date: '2019-12-18'
    },
    {
        question: 'Неча пулга харид килдингиз?',
        answer: '11 ноябрда купонлар билан 125000 сумга тушди',
        total_answers: 9,
        date: '2019-11-29'
    },
    {
        question: 'Ким Хоразмдан буюртма берган, неча кун кутдиларинг?',
        answer: 'Хоразмдан, 5 кунда келди',
        total_answers: 4,
        date: '2019-12-18'
    },
    {
        question: 'Неча пулга харид килдингиз?',
        answer: '11 ноябрда купонлар билан 125000 сумга тушди',
        total_answers: 9,
        date: '2019-11-29'
    },
    {
        question: 'Ким Хоразмдан буюртма берган, неча кун кутдиларинг?',
        answer: 'Хоразмдан, 5 кунда келди',
        total_answers: 4,
        date: '2019-12-18'
    }
];

const Question = React.memo(({ q, navigation }) => {
    const dateHelper = new DateHelper(i18n.locale);

    return (
        <Surface elevation={2} style={styles.card}>
            <Ripple rippleFades={false} rippleOpacity={0.08} onPress={() => navigation.navigate('ProductFaqBuyers')}>
                <View style={styles.cardInner}>
                    <View style={[CssHelper['flexRowStart'], styles.faqRow]}>
                        <QuestionBubble size={24} textStyle={CssHelper['questionBubbleText']}/>
                        <View style={CssHelper['flex']}>
                            <Text style={styles.question}>{q.question}</Text>
                        </View>
                    </View>
                    <View style={[CssHelper['flexRowStart'], styles.faqRow]}>
                        <QuestionBubble size={24} text="..." textStyle={CssHelper['answerBubbleText']}/>
                        <View style={CssHelper['flex']}>
                            <Text style={styles.answer}>{q.answer}</Text>
                        </View>
                    </View>
                    <View style={[CssHelper['flexRowStart']]}>
                        <Text style={styles.totalAnswers}>
                            {i18n.t("answers", {defaultValue: q.total_answers + " ответов", amount: q.total_answers})}
                        </Text>
                        <Text style={styles.date}>{dateHelper.getDateShort(q.date)}</Text>
                    </View>
                </View>
            </Ripple>
        </Surface>
    )
})

function ProductFaqContainer({ navigation }) {
    return (
        <DarkPage i18nKey="questions_list" defaultText="Список вопросов" icon={ICON_CLOSE} extraText="(82)" navigation={navigation} displayShadow={true}>
            <View style={styles.container}>
                <FlatList data={QUESTIONS_LIST}
                    style={[styles.content, CssHelper['flex']]}
                    keyExtractor={item => item.id}
                    removeClippedSubviews={true}
                    onEndReachedThreshold={0.5}
                    renderItem={({ item, index }) =>
                        <Question key={index} q={item} navigation={navigation}/>
                    }
                    ListFooterComponent={
                        <View style={[styles.loadingContainer, CssHelper['flexSingleCentered']]}>
                            <ActivityIndicator size="large" color={APP_MAIN_COLOR}/>
                        </View>
                    }
                />
                <PostBox />
            </View>
        </DarkPage>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eaeaea'
    },
    content: {
        marginBottom: 50
    },
    card: {
        width: '100%',
        backgroundColor: '#fff',
        marginBottom: 12,
    },
    cardInner: {
        paddingVertical: 10,
        paddingHorizontal: 18
    },
    faqRow: {
        justifyContent: 'flex-start',
        marginBottom: 10
    },
    question: {
        fontWeight: 'bold',
        fontSize: 14,
        paddingLeft: 10
    },
    answer: {
        fontSize: 14,
        paddingLeft: 10
    },
    totalAnswers: {
        fontSize: 13,
        fontWeight: 'bold',
        color: LINK_COLOR
    },
    date: {
        fontSize: 13,
        color: '#b1b1b9'
    },
    loadingContainer: {
        paddingBottom: 15
    }
});

export default ProductFaqContainer;