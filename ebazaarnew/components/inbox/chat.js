import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import i18n from 'i18n-js';
import _ from 'underscore';
import Fontisto from 'react-native-vector-icons/Fontisto';
import CssHelper from '../../helpers/css_helper';
import DateHelper from '../../helpers/date_helper';

const Chat = React.memo(({ navigation, obj, openModal }) => {
    const { time, unreadMessagesNum, yesterday } = useMemo(() => ({
        time: obj.getUpdateTime(),
        unreadMessagesNum: obj.getUserUnreadMessagesNum(),
        yesterday: i18n.t('time:yesterday', {defaultValue: 'Вчера'})
    }))    

    const gotoChat = () => {
        navigation.navigate('Chat', {
            id: obj.getId(),
            sellerId: obj.getSellerId(),
            sellerName: obj.getSellerName()
        })
    }
    
    const _openModal = () => {
        if (_.isFunction(openModal))
            openModal(obj.getId());
    }

    return (
        <TouchableOpacity style={[CssHelper['flexRowCentered'], styles.chatContainer]} activeOpacity={1} onPress={gotoChat} onLongPress={_openModal}>
            <View style={CssHelper['flexRowCentered']}>
                <View style={styles.avatar}>
                    { unreadMessagesNum > 0 &&
                        <View style={[CssHelper['badge'], styles.badge]}>
                            <Text style={CssHelper['badgeText']}>
                                {unreadMessagesNum}
                            </Text>
                        </View>
                    }
                    <View style={CssHelper['flexSingleCentered']}>
                        <Fontisto name="shopping-store" size={20} color={'#c8c8c8'} />
                    </View>
                </View>
                <View style={[CssHelper['flex'], styles.chatMiddle]}>
                    <Text style={styles.store}>
                        {obj.getSellerName()}
                    </Text>
                    <Text style={styles.message}>
                        Message
                    </Text>
                </View>
            </View>
            <View>
                <Text style={styles.time}>
                    {DateHelper.distance(time.toDate(), yesterday)}
                </Text>
            </View>
        </TouchableOpacity>
    )
})

const styles = StyleSheet.create({
    chatContainer: {
        paddingVertical: 14,
        paddingHorizontal: 15,
        borderBottomWidth: 0.5,
        borderBottomColor: '#eeeeee',
        alignItems: 'flex-start',
        backgroundColor: '#fff'
    },
    avatar: {
        width: 44, 
        height: 44, 
        borderRadius: 22, 
        backgroundColor: '#f6f6f6'
    },
    time: {
        color: '#62656a',
        fontSize: 12
    },
    chatMiddle: {
        marginHorizontal: 13
    },
    message: {
        color: '#5f666e',
        fontSize: 12
    },
    store: {
        fontSize: 15
    },
    badge: {
        top: -2,
        right: -2,
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 8.5,
        width: 17,
        height: 17
    }
});

Chat.propTypes = {
    obj: PropTypes.object.isRequired,
    navigation: PropTypes.object,
    openModal: PropTypes.func
}

export default Chat;