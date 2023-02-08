import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useDispatch, useSelector } from "react-redux";
import NetInfo from '@react-native-community/netinfo';
import i18n from 'i18n-js';
import {TOAST_BG_COLOR} from "../../constants/app";
import CssHelper from '../../helpers/css_helper';
import Toasty from './toasty';
import { SET_IS_NET_CONNECTED } from '../../redux/constants/action-types';
import NoConnectionIcon from '../icons/no_connection2_icon';

function OfflineNotice() {
    const [isConnected, setIsConnected] = useState(true);

    const lastScreenUpdate = useSelector(state => state.main.lastScreenUpdate);
    const dispatch = useDispatch();

    const toastyRef = useRef();

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(handleConnectivityChange);
        return () => {
            unsubscribe();
        }
    }, [])

    useEffect(() => {
        NetInfo.fetch().then(state => {
            handleConnectivityChange(state);
        });
    }, [lastScreenUpdate])

    useEffect(() => {
        if (!isConnected)
            toastyRef.current.show()
    }, [isConnected])

    const handleConnectivityChange = (state) => {
        const {isConnected} = state;
        dispatch({
            type: SET_IS_NET_CONNECTED,
            payload: isConnected
        })
        setIsConnected(isConnected);
    }

    return (
        <Toasty backgroundColor={TOAST_BG_COLOR} ref={toastyRef}>
            <View style={[CssHelper['flexRowCentered']]}>
                <View style={styles.iconContainer}>
                    <NoConnectionIcon width={40} height={40} color="#f44236"/>
                </View>
                <View style={CssHelper['flex']}>
                    <Text style={styles.text}>
                        {i18n.t('connection_error', {defaultValue: 'Ошибка подключения, попробуйте позже.'})}
                    </Text>
                </View>
            </View>
        </Toasty>
    )
}

const styles = StyleSheet.create({
    text: {
        color: '#fff',
        fontSize: 16
    },
    link: {
        color: '#f44236',
        textTransform: 'uppercase'
    },
    iconContainer: {
        width: 40,
        height: 40,
        marginRight: 10
    }
});

export default OfflineNotice;