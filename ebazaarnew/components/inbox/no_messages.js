import React from 'react';
import { View, Text } from 'react-native';
import i18n from 'i18n-js';
import CssHelper from '../../helpers/css_helper';
import MessagesIcon from '../icons/messages_icon';

const NoMessages = React.memo(({ style }) => {
    return (
        <View style={[CssHelper['empty.content'], style]}>
            <MessagesIcon width={72} height={72} color="#d3d3d3"/>
            <Text style={CssHelper['empty.content.text']}>
                {i18n.t('messages:empty', {defaultValue: 'Нет сообщений'})}
            </Text>
        </View>
    )
})

export default NoMessages;