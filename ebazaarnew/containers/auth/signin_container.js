import React, { useReducer, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import i18n from 'i18n-js';
import { TextField } from '@softmedialab/react-native-material-textfield';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { observer, inject } from 'mobx-react';
import * as EmailValidator from 'email-validator';
import _ from 'underscore';
import { SCREEN_WIDTH, SCREEN_HEIGHT, LINK_COLOR, APP_FORM_COLOR, PHONE_AUTH_MODE } from '../../constants/app';
import CssHelper from "../../helpers/css_helper";
import AuthHelper, { AUTH_SUCCESS } from '../../helpers/auth_helper';
import UserProfileHelper from '../../firebase/helpers/user_profile';
import DarkPage from "../../components/misc/dark_page";
import TouchableHighlight from '../../components/ui/touchable_highlight';
import ShadowButton, { THEME_DARK_BUTTON, STATUS_DEFAULT, STATUS_SENDING } from '../../components/ui/shadow_button';
import ClearInput from '../../components/ui/clear_input';
import SocialLogin from '../../components/auth/social_login';

const LAYOUT_MODE = Object.freeze({
    SMS_LAYOUT: 'smsLayout',
    FORGOT_LAYOUT: 'forgotLayout'
})

const SigninContainer = inject('mobxStore')(observer(({ mobxStore, navigation }) => {
    const [state, setState] = useReducer(
        (state, newState) => ({...state, ...newState}),
        {
            email: '',
            emailFocused: false,
            emailError: '',
            password: '',
            passwordError: '',
            secureTextEntry: true,
            submitStatus: STATUS_DEFAULT,
            noAccountError: false,
            forgotTextWidth: 0,
            SMSTextWidth: 0,
            isLoading: false
        }
    )
    
    const { email, emailFocused, emailError, password, passwordError, secureTextEntry, submitStatus, noAccountError, forgotTextWidth, SMSTextWidth, isLoading } = state
    let timeout = null

    const emailRef = useRef(null)
    const passwordRef = useRef(null)
    
    useEffect(() => {
        clearTimeout(timeout)
    }, [])

    const onBlockPage = () => {
        setState({
            isLoading: true
        })
    }

    const onUnBlockPage = () => {
        setState({
            isLoading: false
        })
    }

    const cancelHandler = () => {
        timeout = setTimeout(() => {
            setState({
                isLoading: false
            })    
        }, 500)
    }

    const onEmailFocus = () => {
        setState({
            emailFocused: true
        })
    }

    const onChangeText = (name, text) => {
        switch(name) {
            case 'email':
                setState({
                    email: text
                })
                break;
            case 'password':
                setState({
                    password: text,
                    passwordError: ''
                })
                break;
        }
    }

    const validateEmail = () => {
        const filtered = email.trim()
        let emailError = ''
        if (filtered.length > 0 && !EmailValidator.validate(filtered))
            emailError = i18n.t('errors:invalidEmail', {defaultValue: 'Недействительная электронная почта'})
        setState({
            emailError,
            emailFocused: false,
            noAccountError: false
        })
    }

    const clearEmail = () => {
        setState({
            email: ''
        })
        emailRef.current.setValue('')
        emailRef.current.focus()
    }

    const changeSecureTextEntry = () => {
        setState({
            secureTextEntry: !secureTextEntry
        })
    }

    const login = () => {
        const filtered = email.trim()
        let emailError = ''

        // Check email
        if (filtered.length === 0)
            emailError = i18n.t('sign_up:enterEmail', {defaultValue: 'Ваш адрес эл. почты'});
        else if (filtered.length > 0 && !EmailValidator.validate(filtered))
            emailError = i18n.t('errors:invalidEmail', {defaultValue: 'Недействительная электронная почта'})
        if (emailError.length > 0) {
            setState({
                emailError,
                noAccountError: false
            })
            Alert.alert(
                "",
                emailError
            )
            emailRef.current.focus()
        }

        // Check password
        if (emailError.length === 0 && password.length === 0 && filtered.length > 0) {
            Alert.alert(
                "",
                i18n.t('errors:enterPassword', {defaultValue: 'Ваш пароль'})
            )
            passwordRef.current.focus()
        }

        // There is no error, can be start login
        if (emailError.length === 0 && password.length > 0) {
            setState({
                submitStatus: STATUS_SENDING
            })
            AuthHelper.emailLogin(filtered, password).then((res) => {
                if (res === AUTH_SUCCESS) {
                    UserProfileHelper.getUserProfile().then((data) => {
                        mobxStore.userStore.setIsSignedIn(true)
                        mobxStore.userStore.setValues(data)

                        // Redirect user to My Profile page
                        navigation.navigate('MyProfile')
                    })
                }
            }, (error) => {
                const data = {
                    submitStatus: STATUS_DEFAULT
                }
                switch (error.code) {
                    case 'auth/wrong-password':
                        data['passwordError'] = i18n.t('errors:incorrectPassword', {defaultValue: 'Пароль неверный'})
                        break
                    case 'auth/network-request-failed':
                        Alert.alert(
                            "",
                            i18n.t('errors:networkError', {defaultValue: 'Ошибка сети'})
                        )
                        break
                    default:
                        data['emailError'] = i18n.t('errors:accountDoesNotExist', {defaultValue: 'Аккаунт не существует'})
                        data['noAccountError'] = true
                }
                setState(data)
            })
        }
    }

    const onLayout = (e, mode) => {
        const { lines } = e.nativeEvent
        if (_.isArray(lines)) {
            const { width } = lines[0]
            if (mode === LAYOUT_MODE.FORGOT_LAYOUT) {
                if (forgotTextWidth === 0) {
                    setState({
                        forgotTextWidth: width + 10
                    })
                }    
            } else if (mode === LAYOUT_MODE.SMS_LAYOUT) {
                if (SMSTextWidth === 0) {
                    setState({
                        SMSTextWidth: width + 10
                    })
                }    
            }
        }
    }

    return (
        <DarkPage i18nKey="login" 
            defaultText="Войти"
            displayShadow={true} 
            navigation={navigation}
            isBlocked={isLoading}
            loadingText={i18n.t('loading', {defaultValue: 'Загрузка...'})}
            cancelHandler={cancelHandler}
        >
            <View style={[CssHelper['flex']]}>
                <View style={styles.container}>
                    <ScrollView keyboardShouldPersistTaps="handled">
                        <View style={CssHelper['flex']}>
                            <View style={CssHelper['SMSLinkContainer']}>
                                <View style={[{width: SMSTextWidth > 0 ? SMSTextWidth : 'auto'}]}>
                                    <TouchableHighlight onPress={() => navigation.navigate('PhoneAuth', {mode: PHONE_AUTH_MODE.SIGN_IN})}>
                                        <Text style={CssHelper['SMSText']} onTextLayout={(e) => onLayout(e, LAYOUT_MODE.SMS_LAYOUT)}>
                                            {i18n.t('sign_in:loginSMS', {defaultValue: 'Войти по SMS'})}
                                        </Text>
                                    </TouchableHighlight>
                                </View>
                            </View>
                            <View style={[CssHelper['flexRowCentered'], styles.row]}>
                                <View style={styles.iconContainer}>
                                    <View style={[CssHelper['flexSingleCentered'], styles.iconInner]}>
                                        <MaterialIcons name="email" size={20} color="#878c92"/>
                                    </View>
                                </View>
                                <View style={CssHelper['flex']}>
                                    <TextField animationDuration={150}
                                        disabled={submitStatus === STATUS_SENDING ? true : false }
                                        ref={emailRef}
                                        label={i18n.t('sign_up:email', {defaultValue: 'Адрес эл. почты'})}
                                        fontSize={14}
                                        activeLineWidth={1.5}
                                        containerStyle={styles.textInput}
                                        errorColor={APP_FORM_COLOR}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        onChangeText={(e) => onChangeText('email', e)}
                                        onBlur={validateEmail}
                                        onFocus={onEmailFocus}
                                        value={email}
                                        error={emailError}
                                        blurOnSubmit={false}
                                        returnKeyType='next'
                                        enablesReturnKeyAutomatically={true}
                                        onSubmitEditing={() => passwordRef.current.focus()}
                                    />
                                    { (emailFocused && email.length > 0) &&
                                         <ClearInput style={styles.clearInput} onPress={clearEmail}/>
                                    }
                                    { noAccountError &&
                                        <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={styles.loginLink} activeOpacity={1}>
                                            <Text style={styles.loginLinkText}>
                                                {i18n.t('sign_up', {defaultValue: 'Зарегистрироваться'})} {">"}
                                            </Text>
                                        </TouchableOpacity>
                                    }
                                </View>
                            </View>
                            <View style={[CssHelper['flexRowCentered'], styles.row]}>
                                <View style={styles.iconContainer}>
                                    <View style={[CssHelper['flexSingleCentered'], styles.iconInner]}>
                                        <Ionicons name="lock-closed" size={20} color="#878c92"/>
                                    </View>
                                </View>
                                <View style={CssHelper['flex']}>
                                    <TextField animationDuration={150}
                                        disabled={submitStatus === STATUS_SENDING ? true : false }
                                        ref={passwordRef}
                                        label={i18n.t('sign_up:password', {defaultValue: 'Пароль'})}
                                        fontSize={14}
                                        activeLineWidth={1.5}
                                        containerStyle={styles.textInput}
                                        errorColor={APP_FORM_COLOR}
                                        autoCapitalize="none"
                                        secureTextEntry={secureTextEntry}
                                        onChangeText={(e) => onChangeText('password', e)}
                                        value={password}
                                        error={passwordError}
                                        blurOnSubmit={false}
                                        enablesReturnKeyAutomatically={true}
                                    />
                                    <TouchableOpacity style={styles.eyeoff} onPress={changeSecureTextEntry} activeOpacity={1}>
                                        { secureTextEntry ? (
                                            <MaterialCommunityIcons name="eye-off" size={20} color="#878c92"/>
                                        ) : (
                                            <MaterialCommunityIcons name="eye" size={20} color="#878c92"/>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <ShadowButton style={styles.buttonContainer} 
                                theme={THEME_DARK_BUTTON}
                                status={submitStatus} 
                                i18nKey="login" 
                                defaultText="Войти" 
                                elevation={1}
                                onPress={login}
                            />
                            <View style={[styles.forgotPasswordLink, {width: forgotTextWidth > 0 ? forgotTextWidth : 'auto'}]}>
                                <TouchableHighlight onPress={() => navigation.navigate('PasswordRecovery')}>
                                    <Text style={styles.forgotPasswordText} onTextLayout={(e) => onLayout(e, LAYOUT_MODE.FORGOT_LAYOUT)}>
                                        {i18n.t('sign_in:forgot_password', {defaultValue: 'Забыли пароль?'})}
                                    </Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </ScrollView>
                </View>
                <View style={styles.socialContainer}>
                    <SocialLogin navigation={navigation}
                        onBlockPage={onBlockPage}
                        onUnBlockPage={onUnBlockPage}
                        onCancel={cancelHandler}
                    />
                    <View style={styles.bottomLinkBox}>
                        <TouchableHighlight onPress={() => navigation.navigate('Signup')}>
                            <Text style={styles.txt}>
                                {i18n.t('sign_in:no_profile', {defaultValue: 'Нет профиля?'})} <Text style={styles.link}>{i18n.t('sign_up:title', {defaultValue: 'Бесплатная регистрация'})}</Text>
                            </Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </View>
        </DarkPage>
    )
}))

const styles = StyleSheet.create({
    container: {
        height: SCREEN_HEIGHT - 205,
        paddingHorizontal: 15,
        paddingVertical: 15,
        paddingTop: 15,
        backgroundColor: '#fff'
    },
    socialContainer: {
        paddingBottom: 25
    },
    iconContainer: {
        width: 20,
        marginTop: 30
    },
    buttonContainer: {
        marginTop: 20
    },
    txt: {
        textAlign: 'center',
        marginTop: 13,
        marginBottom: 13,
        color: '#3c3c3c',
        fontSize: 13
    },
    eyeoff: {
        position: 'absolute', 
        right: 0, 
        top: 30
    },
    textInput: {
        marginLeft: 10
    },
    loginLink: {
        marginLeft: 10,
        marginBottom: 5
    },
    loginLinkText: {
        color: LINK_COLOR,
        fontSize: 12
    },
    forgotPasswordLink: {
        marginTop: 15
    },
    forgotPasswordText: {
        color: LINK_COLOR,
        paddingVertical: 10,
        paddingHorizontal: 5
    },
    row: {
        marginTop: -10,
        alignItems: 'flex-start'
    },
    iconInner: {
        justifyContent: 'flex-start'
    },
    link: {
        color: LINK_COLOR
    },
    clearInput: {
        position: 'absolute', 
        top: 28, 
        right: 0
    },
    bottomLinkBox: {
        height: 44,
        marginTop: 15,
        width: SCREEN_WIDTH - 70,
        marginLeft: (SCREEN_WIDTH - (SCREEN_WIDTH - 70)) / 2
    }
});

export default SigninContainer;