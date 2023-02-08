import React, { useReducer, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, ScrollView, Alert, Keyboard } from 'react-native';
import Auth from '@react-native-firebase/auth';
import i18n from 'i18n-js';
import { TextField } from '@softmedialab/react-native-material-textfield';
import MaskHelper, { MASK_TYPES, CUSTOM_MASKS } from '../../helpers/mask_helper';
import _ from 'underscore';
import CssHelper from "../../helpers/css_helper";
import MiscHelper from '../../helpers/misc_helper';
import DarkPage from "../../components/misc/dark_page";
import { APP_FORM_COLOR, LINK_COLOR, SCREEN_WIDTH, SCREEN_HEIGHT, COUNTRY_CALLING_CODE, FIREBASE_ERRORS, PHONE_AUTH_MODE } from '../../constants/app';
import SMSVerification from '../../components/auth/sms_verification';
import ShadowButton, { THEME_DARK_BUTTON, STATUS_DEFAULT, STATUS_SENDING } from '../../components/ui/shadow_button';
import SocialLogin from '../../components/auth/social_login';
import ClearInput from '../../components/ui/clear_input';
import TouchableHighlight from '../../components/ui/touchable_highlight';

const MODE_DEFAULT = 'default'
const MODE_SMS_VERIFICATION = 'smsVerification'

function SignupContainer({ navigation, route }) {
    const [state, setState] = useReducer(
        (state, newState) => ({...state, ...newState}),
        {
            phoneNumber: '',
            phoneNumberFocused: false,
            phoneNumberError: '',
            verificationId: null,
            submitStatus: STATUS_DEFAULT,
            mode: MODE_DEFAULT,
            isBlocked: false,
            isSendFormBlocked: false
        }
    )
    
    const { phoneNumber, phoneNumberFocused, phoneNumberError, verificationId, submitStatus, mode, isBlocked, isSendFormBlocked } = state
    const maskHelper = new MaskHelper(MASK_TYPES.CUSTOM, CUSTOM_MASKS.USER_CELL_PHONE)
    const phoneNumberRef = useRef(null)

    let timeout = null

    useEffect(() => {
        clearTimeout(timeout)
    }, [])

    const getTitle = () => {
        const { mode } = route.params
        if (mode === PHONE_AUTH_MODE.SIGN_IN) {
            return {
                i18nKey: "sign_in:loginSMS",
                defaultText: "Войти по SMS"
            }
        } else if (mode === PHONE_AUTH_MODE.SIGN_UP) {
            return {
                i18nKey: "sign_up:registerSMS",
                defaultText: "Зарегистрироваться по SMS"
            }
        }
    }

    const blockPage = () => {
        setState({
            isBlocked: true
        })
    }

    const unBlockPage = () => {
        setState({
            isBlocked: false
        })
    }

    const cancelHandler = () => {
        timeout = setTimeout(() => {
            setState({
                isBlocked: false
            })
        }, 500)
    }

    const onBlur = () => {
        let s = {
            phoneNumberFocused: false
        }
        phoneNumber.length === 0 && (s.phoneNumberError = '')
        setState(s)
    }

    const onChange = (text) => {
        let phoneNumberError = validatePhoneNumber(text)
        setState({
            phoneNumber: text,
            phoneNumberError
        })
    }

    const onFocus = () => {
        setState({
            phoneNumberFocused: true
        })
    }

    const clear = () => {
        setState({
            phoneNumber: '',
            phoneNumberError: ''
        })
        phoneNumberRef.current.setValue('')
        phoneNumberRef.current.focus()
    }

    const reset = () => {
        setState({
            phoneNumber: '',
            phoneNumberError: '',
            submitStatus: STATUS_DEFAULT,
            isSendFormBlocked: false
        })
        phoneNumberRef.current.setValue('')
    }

    const nextStep = (verificationId) => {
        phoneNumberRef.current.setValue('')
        setState({
            phoneNumber: '',
            phoneNumberError: '',
            submitStatus: STATUS_DEFAULT,
            isSendFormBlocked: false,
            verificationId,
            mode: MODE_SMS_VERIFICATION
        })
    }

    const validatePhoneNumber = (phoneNumber) => {
        let phoneNumberError = '';
        if (phoneNumber.length === 0)
            phoneNumberError = i18n.t('errors:mobile:error', {defaultValue: 'Пожалуйста, введите номер мобильного'})
        else
            if (!maskHelper.validate(phoneNumber))
                phoneNumberError = i18n.t('errors:mobile:9Symbols', {defaultValue: 'Пожалуйста, введите 9 символов'})
        return phoneNumberError
    }

    const send = async() => {
        // If Sending form is blocked, stop processing
        if (isSendFormBlocked)
            return;

        let phoneNumberError = validatePhoneNumber(phoneNumber);
        if (phoneNumberError.length > 0) {
            Alert.alert(
                "",
                phoneNumberError
            );
        }

        // There is no error, can be submitted
        if (phoneNumberError.length === 0) {
            Keyboard.dismiss();
            // Send SMS code
            setState({
                isSendFormBlocked: true
            })
            const cleaned = MiscHelper.getNumbersFromStr(phoneNumber),
                full = COUNTRY_CALLING_CODE + cleaned
            try {
                setState({
                    submitStatus: STATUS_SENDING
                })
                const res = await Auth().verifyPhoneNumber(full)
                timeout = setTimeout(() => {
                    nextStep(res.verificationId)
                }, 100)
            } catch(e) {
                reset()
                if (FIREBASE_ERRORS.ERR_FIREBASE_RECAPTCHA_CANCEL !== e.code) {
                    // Is not cancelled by user
                    const errorMessage = i18n.t('errors:errorOccured', {defaultValue: 'Произошла ошибка, попробуйте позже'})
                    Alert.alert(
                        "",
                        errorMessage
                    )
                }
            }
        } else {
            setState({
                phoneNumberError
            })
            phoneNumberRef.current.focus();
        }
    }

    const title = getTitle()

    return (
        <DarkPage i18nKey={title.i18nKey} 
            defaultText={title.defaultText}
            displayShadow={true} 
            navigation={navigation}
            isBlocked={isBlocked}
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
                                            <View style={[CssHelper['flexRowCentered'], styles.row]}>
                                                <View style={styles.phoneCountryCode}>
                                                    <TextField animationDuration={25}
                                                        disabled={submitStatus === STATUS_SENDING || isSendFormBlocked ? true : false }
                                                        fontSize={14}
                                                        containerStyle={styles.containerStyle}
                                                        activeLineWidth={1.5}
                                                        errorColor={APP_FORM_COLOR}
                                                        value={COUNTRY_CALLING_CODE}
                                                        editable={false}
                                                    />
                                                </View>
                                                <Text style={styles.divider}>-</Text>
                                                <View style={CssHelper['flex']}>
                                                    <TextField animationDuration={150}
                                                        disabled={submitStatus === STATUS_SENDING || isSendFormBlocked ? true : false }
                                                        ref={phoneNumberRef}
                                                        label={i18n.t('sign_up:phone_number', {defaultValue: 'Номер мобильного'})}
                                                        fontSize={14}
                                                        containerStyle={styles.containerStyle}
                                                        activeLineWidth={1.5}
                                                        errorColor={APP_FORM_COLOR}
                                                        keyboardType='numeric'
                                                        onFocus={onFocus}
                                                        onBlur={onBlur}
                                                        onChangeText={onChange}
                                                        formatText={(text) => {
                                                            return maskHelper.getValue(text);
                                                        }}
                                                        value={phoneNumber}
                                                        error={phoneNumberError}
                                                        maxLength={14}
                                                    />
                                                    { (phoneNumberFocused && phoneNumber.length > 0) &&
                                                        <ClearInput style={styles.clearInput} onPress={clear}/>
                                                    }
                                                </View>
                                            </View>
                                            <ShadowButton style={styles.buttonContainer} 
                                                theme={THEME_DARK_BUTTON} 
                                                status={submitStatus} 
                                                i18nKey="sign_up:sendSMS" 
                                                defaultText="Отправить SMS" 
                                                elevation={1}
                                                onPress={send}
                                            />
                                        </View>
                                    </ScrollView>
                                </View>
                                <View style={styles.socialContainer}>
                                    <SocialLogin navigation={navigation}
                                        onBlockPage={blockPage}
                                        onUnBlockPage={unBlockPage}
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
                    case MODE_SMS_VERIFICATION:
                        return (
                            <SMSVerification verificationId={verificationId} 
                                blockPage={blockPage} 
                                unBlockPage={unBlockPage}
                                navigation={navigation}
                            />
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
    row: {
        marginTop: -10,
        alignItems: 'flex-start'
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
    },
    phoneCountryCode: {
        width: 32
    },
    divider: {
        paddingHorizontal: 10,
        fontWeight: 'bold',
        paddingTop: 33
    }
});

export default SignupContainer;