import React, { Component } from 'react';
import { StyleSheet, Text, ScrollView } from 'react-native';
import CssHelper from "../../helpers/css_helper";
import DarkPage from "../../components/misc/dark_page";

function FaqContainer({ navigation }) {
    return (
        <DarkPage i18nKey="questions&answers" defaultText="Вопросы и ответы" navigation={navigation}>
            <ScrollView style={[CssHelper['frontend.content'], styles.content]}>
                <Text>This is faq screen...</Text>
            </ScrollView>
        </DarkPage>
    )
}

const styles = StyleSheet.create({
    content: {
        backgroundColor: '#f5f5f5'
    }
});

export default FaqContainer;