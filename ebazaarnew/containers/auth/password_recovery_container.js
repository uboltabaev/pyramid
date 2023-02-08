import React, { useReducer, useRef } from 'react';
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import i18n from 'i18n-js';
import { TextField } from '@softmedialab/react-native-material-textfield';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as EmailValidator from 'email-validator';
import { APP_FORM_COLOR } from '../../constants/app';
import CssHelper from "../../helpers/css_helper";
import AuthHelper, { AUTH_SUCCESS } from '../../helpers/auth_helper';
import DarkPage from "../../components/misc/dark_page";
import SwipeButton from '../../components/ui/swipe_button';
import ClearInput from '../../components/ui/clear_input';

const STATUS_DEFAULT = 'default'; 
const STATUS_SENDING = 'sending';

function ForgotPasswordContainer({ navigation }) {
    const [state, setState] = useReducer(
        (state, newState) => ({...state, ...newState}),
        {
            email: '',
            emailFocused: false,
            emailError: '',
            status: STATUS_DEFAULT
        }
    )

    const { email, emailFocused, emailError, status } = state
    const _email = useRef('')
    const emailRef = useRef(null)
    const swipeButton = useRef(null)
    
    const onChangeText = (text) => {
        _email.current = text
        setState({
            email: text
        })
    }

    const onEmailFocus = () => {
        setState({
            emailFocused: true
        })
    }

    const clearEmail = () => {
        _email.current = ''
        setState({
            email: ''
        })
        emailRef.current.setValue('')
        emailRef.current.focus()
    }
    
    const validateEmail = () => {
        const filtered = email.trim()
        let emailError = ''
        if (filtered.length > 0 && !EmailValidator.validate(filtered))
            emailError = i18n.t('errors:invalidEmail', {defaultValue: 'Недействительная электронная почта'})

        setState({
            emailError,
            emailFocused: false
        })
    }

    const resetForm = (emailError) => {
        swipeButton.current.reset()
        emailRef.current.focus()
        if (emailError) {
            Alert.alert(
                "",
                emailError
            )    
        }
        setState({
            emailError, 
            status: STATUS_DEFAULT
        })
    }

    const submit = () => {
        const filtered = _email.current.trim()
        let emailError = ''
        if (_email.current.length === 0)
            emailError = i18n.t('sign_up:enterEmail', {defaultValue: 'Ваш адрес эл. почты'})
        else if (filtered.length > 0 && !EmailValidator.validate(filtered))
            emailError = i18n.t('errors:invalidEmail', {defaultValue: 'Недействительная электронная почта'})

        // Check if thee is an error in the form
        if (emailError.length > 0) {
            resetForm(emailError)
        } else {
            setState({
                status: STATUS_SENDING
            })
            swipeButton.current.startLoading()

            // Send password resset email
            AuthHelper.sendPasswordResetEmail(filtered).then((res) => {
                if (res === AUTH_SUCCESS) {
                    resetForm(emailError)
                    setTimeout(() => {
                        // Redirect user to login page
                        navigation.navigate('Signin')
                    }, 1)
                }
            }, (error) => {
                emailError = i18n.t('errors:accountDoesNotExist', {defaultValue: 'Аккаунт не существует'})
                resetForm(emailError)
            });
        }
    }

    return (
        <DarkPage i18nKey="password_recovery" 
            defaultText="Восстановление пароля"
            displayShadow={true} 
            navigation={navigation}
        >
            <View style={styles.container}>
                <ScrollView keyboardShouldPersistTaps="handled">
                    <View style={CssHelper['flex']}>
                        <View style={[CssHelper['flexRowCentered'], styles.row]}>
                            <View style={styles.iconContainer}>
                                <View style={[CssHelper['flexSingleCentered'], styles.iconInner]}>
                                    <MaterialIcons name="email" size={20} color="#878c92"/>
                                </View>
                            </View>
                            <View style={CssHelper['flex']}>
                                <TextField animationDuration={150}
                                    disabled={status === STATUS_SENDING ? true : false }
                                    ref={emailRef}
                                    label={i18n.t('sign_up:email', {defaultValue: 'Адрес эл. почты'})}
                                    fontSize={14}
                                    activeLineWidth={1.5}
                                    containerStyle={styles.textInput}
                                    errorColor={APP_FORM_COLOR}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    onChangeText={onChangeText}
                                    onBlur={validateEmail}
                                    onFocus={onEmailFocus}
                                    value={email}
                                    error={emailError}
                                />
                                { (emailFocused && email.length > 0) &&
                                    <ClearInput style={styles.clearInput} onPress={clearEmail}/>
                                }
                            </View>
                        </View>
                        <View style={styles.buttonContainer}>
                            <SwipeButton onSwipeSuccess={submit} ref={swipeButton}/>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </DarkPage>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1,
        paddingHorizontal: 15,
        paddingVertical: 15
    },
    row: {
        marginTop: -10,
        alignItems: 'flex-start'
    },
    iconContainer: {
        width: 20,
        marginTop: 30
    },
    iconInner: {
        justifyContent: 'flex-start'
    },
    textInput: {
        marginLeft: 10
    },
    buttonContainer: {
        marginTop: 20
    },
    clearInput: {
        position: 'absolute', 
        top: 28, 
        right: 0
    },
});

export default ForgotPasswordContainer;