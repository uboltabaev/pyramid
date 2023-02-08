import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import i18n from 'i18n-js';
import CssHelper from '../../helpers/css_helper';
import NoConnectionIcon from '../icons/no_connection2_icon';

const NoConnection = React.memo(() => {
    return (
        <View style={styles.container}>
            <View style={[CssHelper['flexSingleCentered'], styles.containerInner]}>
                <NoConnectionIcon width={90} height={90} color="#d0d0d0" multiColor={true}/>
                <Text style={styles.text}>
                    {i18n.t('connection_error', {defaultValue: 'Ошибка подключения, попробуйте позже.'})}
                </Text>
            </View>
        </View>
    )
}) 

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    containerInner: {
        marginTop: -40
    },
    text: {
        textAlign: 'center',
        marginTop: 20,
        color: '#999',
        fontSize: 16,
        width: '70%'
    }
});

export default NoConnection;