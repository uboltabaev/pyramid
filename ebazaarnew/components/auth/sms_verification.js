import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import PropTypes from 'prop-types';
import i18n from 'i18n-js';
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';
import { observer, inject } from 'mobx-react';
import _ from 'underscore';
import AuthHelper, { AUTH_SUCCESS } from '../../helpers/auth_helper';
import UserProfileHelper from '../../firebase/helpers/user_profile';
import CssHelper from '../../helpers/css_helper';
import { APP_MAIN_COLOR } from '../../constants/app';
import ShadowButton from '../ui/shadow_button';

const CELL_COUNT = 6;

const SmsVerificationInput = ({value, onChangeText}) => {
    const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue: onChangeText
    });
    return (
        <CodeField ref={ref}
            {...props}
            value={value}
            onChangeText={onChangeText}
            cellCount={CELL_COUNT}
            rootStyle={styles.codeFiledRoot}
            keyboardType="number-pad"
            renderCell={({index, symbol, isFocused}) => (
                <Text key={index}
                    style={[styles.cell, isFocused && styles.focusCell]}
                    onLayout={getCellOnLayoutHandler(index)}>
                        {symbol || (isFocused ? <Cursor /> : null)}
                </Text>
            )}
      />        
    );
}

const SmsVerification = inject('mobxStore')(observer(({ mobxStore, navigation, verificationId, blockPage, unBlockPage }) => {
    const [code, setCode] = useState('')
    let timeout = null

    useEffect(() => {
        return () => {
            clearTimeout(timeout)
        }
    }, [])

    useEffect(() => {
        if (code.length === CELL_COUNT)
            confirm()
    }, [code])

    const onChangeText = (code) => {
        setCode(code)
    }

    const confirm = () => {
        if (code.length === 0) {
            Alert.alert(
                "",
                i18n.t('errors:enterVerificationCode', {defaultValue: 'Пожалуйста, введите код подтверждения'})
            );
        } else if (code.length > 0 && code.length < CELL_COUNT) {
            Alert.alert(
                "",
                i18n.t('errors:verification:6Symbols', {defaultValue: 'Пожалуйста, введите 6 символов'})
            );
        } else {
            // It is ok. We can start verification
            if (_.isFunction(blockPage))
                blockPage()
            
            AuthHelper.firebasePhoneAuth(verificationId, code).then((res) => {
                if (res === AUTH_SUCCESS) {
                    // Store user data into store
                    UserProfileHelper.getUserProfile().then((data) => {
                        mobxStore.userStore.setIsSignedIn(true)
                        mobxStore.userStore.setValues(data)

                        // Unblock page and redirect
                        if (_.isFunction(unBlockPage))
                            unBlockPage()

                        // Redirect user to My Profile page
                        timeout = setTimeout(() => {
                            navigation.navigate('MyProfile');
                        }, 300)
                    });    
                }
            }, (error) => {
                // Unblock page and display error message
                if (_.isFunction(unBlockPage))
                    unBlockPage()
                let errorMessage = ''
                if (error.code === 'auth/invalid-verification-code')
                    errorMessage = i18n.t('errors:smsCodeInvalid', {defaultValue: 'Код подтверждения SMS недействителен'})
                else
                    errorMessage = i18n.t('errors:errorOccured', {defaultValue: 'Произошла ошибка, попробуйте позже'})
                Alert.alert(
                    "",
                    errorMessage
                )
            })
        }
    }

    return (
        <View style={[styles.container, CssHelper['flexSingleCentered']]}>
            <Text style={styles.text2}>
                {i18n.t('messages:sms_verification_sent', {defaultValue: 'Мы отправили код подтверждения на номер вашего мобильного телефона. Пожалуйста, введите этот код ниже:'})}
            </Text>
            <View>
                <SmsVerificationInput value={code} onChangeText={onChangeText}/>
            </View>
            <View style={styles.buttonContainer}>
                <ShadowButton i18nKey="sign_up:confirmCode" 
                    defaultText="Подтвердить" 
                    onPress={confirm} 
                    style={styles.button}
                />
            </View>
        </View>
    )
})) 

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ebebeb',
        paddingHorizontal: 50
    },
    text2: {
        color: '#888b92',
        marginTop: 10,
        textAlign: 'center',
        lineHeight: 20
    },
    buttonContainer: {
        marginTop: 30,
        marginBottom: 100
    },
    button: {
        width: '100%',
    },
    root: {
        flex: 1, padding: 20
    },
    title: {
        textAlign: 'center', fontSize: 30
    },
    codeFiledRoot: {
        marginTop: 20
    },
    cell: {
        width: 40,
        height: 40,
        lineHeight: 38,
        fontSize: 24,
        borderBottomWidth: 2,
        borderBottomColor: '#00000030',
        textAlign: 'center',
        marginLeft: 10
    },
    focusCell: {
        borderBottomColor: APP_MAIN_COLOR,
    },    
});

SmsVerification.propTypes = {
    verificationId: PropTypes.string.isRequired,
    blockPage: PropTypes.func,
    unBlockPage: PropTypes.func
}

export default SmsVerification;