import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { observer, inject } from 'mobx-react';
import i18n from 'i18n-js';
import CssHelper from "../../helpers/css_helper";
import FrontendPage from '../../components/misc/frontend_page';
import UnderConstructionIcon from '../../components/icons/under_construction_icon';

const FeedsContainer = inject('mobxStore')(observer(({ mobxStore, navigation }) => {
    const [lang, setLanguage] = useState(i18n.locale)
    const language = mobxStore.userStore.language

    useEffect(() => {
        setLanguage(language)
    }, [language])

    return (
        <FrontendPage screenName="Feeds" i18nKey="navigation:interesting" defaultText="Интересное" navigation={navigation}>
            <View style={CssHelper['empty.content']}>
                <UnderConstructionIcon width={76} height={76} color="#d3d3d3"/>
                <Text style={CssHelper['empty.content.text']}>
                    {i18n.t('under_construction', {defaultValue: 'В разработке'})}
                </Text>
            </View>
            {/*
            <ScrollView style={[CssHelper['frontend.content'], styles.content]}>
                <Text>This is feeds screen...</Text>
            </ScrollView>
            */}
        </FrontendPage>
    )
}))

const styles = StyleSheet.create({
    content: {
        backgroundColor: '#f5f5f5'
    }
});

export default FeedsContainer;