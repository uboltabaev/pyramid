import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import i18n from 'i18n-js';
import _ from 'underscore';
import Ripple from 'react-native-material-ripple';
import {LOREM_IPSUM} from '../../constants/app';
import CssHelper from "../../helpers/css_helper";
import QuestionBubble from '../ui/question_bubble';

const FAQS = [
    {question: LOREM_IPSUM, answers_num: 13},
    {question: LOREM_IPSUM, answers_num: 7}
];

const FAQ = React.memo(({ navigation }) => {
    return (
        <Ripple style={styles.content} rippleFades={false} rippleOpacity={0.08} onPress={() => navigation.navigate('ProductFaq')} rippleDuration={300}>
            <View style={styles.contentInner}>
                <Text style={[CssHelper['productSectionTitle']]}>
                    {i18n.t('Q&A', {defaultValue: 'Вопросы и ответы'})} (24)
                </Text>
                <View style={styles.faqContainer}>
                    { FAQS.map((faq, index) =>
                        <View key={index} style={[CssHelper['flexRowCentered'], styles.faqRow]}>
                            <QuestionBubble size={26}/>
                            <View style={styles.faqR}>
                                <Text numberOfLines={4}>{faq.question}</Text>
                                <Text style={styles.answersNum}>
                                    {i18n.t('answers', {defaultValue: faq.answers_num + " ответов", amount: faq.answers_num})}
                                </Text>
                            </View>
                        </View>
                    )}
                </View>
                <View style={{marginTop: -10}}>
                    <TouchableOpacity activeOpacity={1} onPress={() => navigation.navigate('ProductFaq')}>
                        <Text style={CssHelper['link2']}>
                            {i18n.t('view_all', {defaultValue: 'Посмотреть все'})}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Ripple>
    )
})

const styles = StyleSheet.create({
    content: {
        marginHorizontal: -10,
        paddingHorizontal: 10,
        marginBottom: -10,
        paddingBottom: 10
    },
    contentInner: {
        paddingTop: 10,
        borderTopColor: "#ebebeb",
        borderTopWidth: 1,
    },
    faqContainer: {
        paddingTop: 5
    },
    faqRow: {
        alignItems: "flex-start",
        paddingBottom: 15
    },
    faqR: {
        flex: 1,
        paddingLeft: 10
    },
    answersNum: {
        paddingTop: 7,
        color: "#999999"
    }
});

export default FAQ;