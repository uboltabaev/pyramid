import React from 'react';
import { View, Text } from 'react-native';
import i18n from 'i18n-js';
import CssHelper from "../../helpers/css_helper";

const Loading = React.memo(() => {
    return (
        <View style={[CssHelper['flexRowCentered'], CssHelper['listLoading']]}>
            <Text style={CssHelper['listLoadingText']}>
                {i18n.t('loading', {defaultValue: 'Загрузка...'})}
            </Text>
        </View>
    )
})

export default Loading;