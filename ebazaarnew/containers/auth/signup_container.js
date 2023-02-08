import React, { useReducer, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert, Keyboard } from 'react-native';
import i18n from 'i18n-js';
import { TextField } from '@softmedialab/react-native-material-textfield';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as EmailValidator from 'email-validator';
import _ from 'underscore';
import CssHelper from "../../helpers/css_helper";
import DarkPage from "../../components/misc/dark_page";
import CONFIG from '../../config/config';
import { APP_FORM_COLOR, LINK_COLOR, LANGS, SCREEN_WIDTH, SCREEN_HEIGHT, PHONE_AUTH_MODE } from '../../constants/app';
import AuthHelper, { AUTH_SUCCESS } from '../../helpers/auth_helper';
import RegistrationSuccess from '../../components/auth/registration_success';
import MiscHelper from '../../helpers/misc_helper';
import ShadowButton, {THEME_DARK_BUTTON, STATUS_DEFAULT, STATUS_SENDING} from '../../components/ui/shadow_button';
import SocialLogin from '../../components/auth/social_login';
import ClearInput from '../../components/ui/clear_input';
import TouchableHighlight from '../../components/ui/touchable_highlight';

const MODE_DEFAULT = 'default'
const MODE_REGISTRATION_SUCCESS = 'success'

function SignupContainer({ navigation }) {
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
            mode: MODE_DEFAULT,
            SMSTextWidth: 0,
            isLoading: false
        }
    )
    
    const { email, emailFocused, emailError, password, passwordError, secureTextEntry, submitStatus, mode, SMSTextWidth, isLoading } = state
    let timeout = null

    const emailRef = useRef(null)
    const passwordRef = useRef(null)

    useEffect(() => {
        return () => {
            clearTimeout(timeout)
        }
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

    const terms = () => {
        console.log('terms...')
    }

    const privacy = () => {
        console.log('privacy...')
    }

    const getNoteText = () => {
        const locale = i18n.locale
        switch(locale) {
            case LANGS.UZ:
                return (
                    <Text style={styles.note}>
                        {CONFIG.APP_NAME} аккаунтини яратиш билан сиз <Text style={styles.link} onPress={terms}>{CONFIG.APP_NAME} да бепул рўйхатдан ўтиш тўғрисидаги шартнома</Text> ва <Text style={styles.link} onPress={privacy}>махфийлик сиёсати</Text> билан танишиб чиққанингизни тасдиқлайсиз ва уларда кўрсатилган шартларни қабул қиласиз.
                    </Text>
                )
            case LANGS.RU:
                return (
                    <Text style={styles.note}>
                        Создавая аккаунт {CONFIG.APP_NAME}, вы подтверждаете, что ознакомлены <Text style={styles.link} onPress={terms}>с соглашением о бесплатной регистрации на {CONFIG.APP_NAME}</Text> и <Text style={styles.link} onPress={privacy}>политикой конфедициальности</Text>, и принамаете обозначенные в них условия.
                    </Text>
                )
        }
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
                    password: text
                })
                break;
        }
    }

    const validateField = (name) => {
        switch(name) {
            case 'email':
                const filtered = email.trim()
                let emailError = ''
                if (filtered.length > 0 && !EmailValidator.validate(filtered))
                    emailError = i18n.t('errors:invalidEmail', {defaultValue: 'Недействительная электронная почта'})
                setState({
                    emailError,
                    emailFocused: false
                })
                break

            case 'password':
                let passwordError = '';
                if (password.length > 0)
                    if (!MiscHelper.isAlphanumeric(password) || !MiscHelper.checkStrLength(password.trim()))
                        passwordError = i18n.t('sign_up:password:note', {defaultValue: 'Пароль должен быть 6 от 20 символов (только буквы и цифры)'});
                setState({
                    passwordError
                })
                break;
        }
    }

    const onEmailFocus = () => {
        setState({
            emailFocused: true
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

    const save = () => {
        const filtered = email.trim()
        let emailError = '',
            passwordError = ''

        // Check email
        if (filtered.length === 0)
            emailError = i18n.t('sign_up:enterEmail', {defaultValue: 'Ваш адрес эл. почты'});
        else if (!EmailValidator.validate(filtered))
            emailError = i18n.t('errors:invalidEmail', {defaultValue: 'Недействительная электронная почта'})
        if (emailError.length > 0) {
            Alert.alert(
                "",
                emailError
            )
        }

        // Check password
        if (password.length === 0) {
            passwordError = i18n.t('errors:enterPassword', {defaultValue: 'Ваш пароль'})
        } else if (!MiscHelper.isAlphanumeric(password) || !MiscHelper.checkStrLength(password.trim()))
            passwordError = i18n.t('sign_up:password:note', {defaultValue: 'Пароль должен быть 6 от 20 символов (только буквы и цифры)'})
        if (passwordError.length > 0 && emailError.length === 0) {
            Alert.alert(
                "",
                passwordError
            )
        }

        // There is no error, can be submitted
        if (emailError.length === 0 && passwordError.length === 0) {
            // Create a new user account
            Keyboard.dismiss()
            setState({
                submitStatus: STATUS_SENDING
            })
            AuthHelper.emailRegistration(email, password).then((res) => {
                if (res) {
                    // Registration is success. Send email verification
                    const user = res.user
                    if (user.emailVerified === false)
                        AuthHelper.sendEmailVerification(user)
                    setState({
                        email: '',
                        password: '',
                        emailError: '',
                        passwordError: '',
                        submitStatus: STATUS_DEFAULT,
                        mode: MODE_REGISTRATION_SUCCESS
                    })
                }
            }, (error) => {
                // An error occured while registration
                let errorMessage = error.code + ': ' + error.message,
                    emailError = ''
                if (error.code === 'auth/email-already-in-use') {
                    const emailInUse = i18n.t('errors:emailInUse', {defaultValue: 'The email address is already in use by another account'})
                    errorMessage = emailInUse
                    emailError = emailInUse
                }
                Alert.alert(
                    "",
                    errorMessage
                )
                setState({
                    submitStatus: STATUS_DEFAULT,
                    emailError
                })
            })
        } else {
            if (emailError.length > 0)
                emailRef.current.focus()
            else if (passwordError.length > 0)
                passwordRef.current.focus()
        }
    }

    const onSMSLayout = (e) => {
        const { lines } = e.nativeEvent;
        if (_.isArray(lines)) {
            const { width } = lines[0];
            if (SMSTextWidth === 0) {
                setState({
                    SMSTextWidth: width + 10
                })
            }
        }
    }

    return (
        <DarkPage i18nKey="sign_up:title" 
            defaultText="Бесплатная регистрация"
            displayShadow={true} 
            navigation={navigation}
            isBlocked={isLoading}
            loadingText={i18n.t('loading', {defaultValue: 'Загрузка...'})}
            cancelHandler={cancelHandler}
        >
            {((m) => {
                switch(m) {
                    case MODE_DEFAULT:
                        return(
                            <View style={[CssHelper['flex']]}>
                                <View style={styles.container}>
                                    <ScrollView keyboardShouldPersistTaps="handled">
                                        <View style={CssHelper['flex']}>
                                            <View style={CssHelper['SMSLinkContainer']}>
                                                <View style={[{width: SMSTextWidth > 0 ? SMSTextWidth : 'auto'}]}>
                                                    <TouchableHighlight onPress={() => navigation.navigate('PhoneAuth', {mode: PHONE_AUTH_MODE.SIGN_UP})}>
                                                        <Text style={CssHelper['SMSText']} onTextLayout={onSMSLayout}>
                                                            {i18n.t('sign_up:registerSMS', {defaultValue: 'Зарегистрироваться по SMS'})}
                                                        </Text>
                                                    </TouchableHighlight>
                                                </View>
                                            </View>
                                            <View style={[CssHelper['flexRowCentered'], styles.row, {marginTop: -15}]}>
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
                                                        onBlur={() => validateField('email')}
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
                                                        onBlur={() => validateField('password')}
                                                        value={password}
                                                        error={passwordError}
                                                        blurOnSubmit={false}
                                                        enablesReturnKeyAutomatically={true}
                                                    />
                                                    { passwordError.length === 0 &&
                                                        <Text style={styles.passwordNote}>
                                                            {i18n.t('sign_up:password:note', {defaultValue: 'Пароль должен быть 6 от 20 символов (только буквы и цифры)'})}
                                                        </Text>
                                                    }
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
                                                i18nKey="sign_up:confirm" 
                                                defaultText="Подтвердить и создать" 
                                                elevation={1}
                                                onPress={save}
                                            />
                                            {getNoteText()}
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
                                        <TouchableHighlight onPress={() => navigation.navigate('Signin')}>
                                            <Text style={styles.txt}>
                                                {i18n.t('sign_up:got_account', {defaultValue: 'Есть учётная запись?'})} <Text style={styles.link}>{i18n.t('login', {defaultValue: 'Войти'})}</Text>
                                            </Text>
                                        </TouchableHighlight>
                                    </View>
                                </View>
                            </View>
                        );
                    case MODE_REGISTRATION_SUCCESS:
                        return (
                            <RegistrationSuccess navigation={navigation}/>
                        );
                }
            })(mode)}
        </DarkPage>
    )
}

const styles = StyleSheet.create({
    container: {
        height: SCREEN_HEIGHT - 205,
        paddingHorizontal: 15,
        paddingVertical: 15,
        paddingTop: 10,
        backgroundColor: '#fff'
    },
    socialContainer: {
        paddingBottom: 25
    },
    buttonContainer: {
        marginTop: 20
    },
    iconContainer: {
        width: 20,
        marginTop: 30
    },
    iconInner: {
        justifyContent: 'flex-start'
    },
    eyeoff: {
        position: 'absolute', 
        right: 0, 
        top: 30
    },
    row: {
        marginTop: -10,
        alignItems: 'flex-start'
    },
    textInput: {
        marginLeft: 10
    },
    note: {
        marginTop: 15,
        lineHeight: 20,
        color: '#b2b2b2',
        paddingHorizontal: 5
    },
    passwordNote: {
        marginLeft: 10,
        marginTop: -6,
        fontSize: 12,
        lineHeight: 16,
        color: '#b2b2b2'
    },
    link: {
        color: LINK_COLOR
    },
    txt: {
        textAlign: 'center',
        marginTop: 12,
        marginBottom: 12,
        color: '#3c3c3c',
        fontSize: 15
    },
    clearInput: {
        position: 'absolute', 
        top: 28, 
        right: 0
    },
    bottomLinkBox: {
        height: 44,
        marginTop: 15,
        width: SCREEN_WIDTH - 100,
        marginLeft: (SCREEN_WIDTH - (SCREEN_WIDTH - 100)) / 2
    }
});

export default SignupContainer;