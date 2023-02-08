import React, { useReducer, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity, Keyboard, InteractionManager } from 'react-native';
import { useDispatch } from "react-redux";
import i18n from 'i18n-js';
import _ from 'underscore';
import * as EmailValidator from 'email-validator';
import Modal from "react-native-modal";
import Ripple from 'react-native-material-ripple';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CONFIG from '../config/config';
import { SCREEN_WIDTH, APP_MAIN_COLOR } from '../constants/app';
import { SET_FLASH_MESSAGE } from "../redux/constants/action-types";
import CssHelper from "../helpers/css_helper";
import FileHelper from '../helpers/file_helper';
import DarkPage from "../components/misc/dark_page";
import DropDownMenu, { MODE_DROPDOWN, STATUS_ENABLED, STATUS_DISABLED } from '../components/ui/dropdown_menu';
import ShadowButton, { STATUS_DEFAULT, STATUS_SENDING } from '../components/ui/shadow_button';
import { Position } from '../components/ui/flash_message';
import CameraUI from '../components/ui/camera';
import Gallery from '../components/ui/gallery';
import ThankYou from '../components/contact-us/thank_you';
import Pictures, { MODE_PICTURES_DISPLAY } from '../components/camera-ui/pictures';
import SendGrid from '../sendgrid/sendgrid';

const MODES = {
    DEFAULT: 'default',
    CAMERA: 'camera',
    GALLERY: 'gallery',
    THANK_YOU: 'thankYou'
};

const SORT_ITEMS = [
    {id: 1, i18n: 'report:problem', defaultText: 'Сообщить о неполадке'},
    {id: 2, i18n: 'report:suggest_feature', defaultText: 'Предложить новую функцию'},
    {id: 3, i18n: 'report:order_problem', defaultText: 'Сообщить о проблеме с заказом'},
];

const DEFAULT_SORT = 1;

const IMAGE_MARGIN = 10;
const AVAILABLE_IMAGES_NUM = 5;
const PADDING_HOR = 20;
const IMAGE_SIZE = (SCREEN_WIDTH - (PADDING_HOR * 2) - ((AVAILABLE_IMAGES_NUM - 1) * IMAGE_MARGIN)) / AVAILABLE_IMAGES_NUM;

function ContactUsContainer({ navigation }) {
    const _subject = _.find(SORT_ITEMS, {id: DEFAULT_SORT});
    const defaultState = {
        mode: MODES.DEFAULT,
        sending: false,
        subject: _subject.defaultText,
        suggestion: '',
        email: '',
        suggestionFocused: false,
        emailFocused: false,
        isModalVisible: false,
        attachedPictures: []
    }
    const [state, setState] = useReducer(
        (state, newState) => ({...state, ...newState}),
        defaultState
    )

    const { mode, sending, subject, isModalVisible, attachedPictures } = state
    let { suggestion, email, suggestionFocused, emailFocused } = state;
    let timerA = null

    const cameraRef = useRef(null)
    const suggestionRef = useRef(null)
    const emailRef = useRef(null)

    const dispatch = useDispatch()

    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            setState(defaultState)
        })
        return () => {
            clearInterval(timerA)
            unsubscribe()    
        }
    }, [])

    useEffect(() => {
        if (sending) {
            timerA = setTimeout(() => {
                // Send an email to administrator
                const params = {
                    to: CONFIG.ADMINISTRATOR_EMAIL, 
                    from: email,
                    subject, 
                    text: suggestion
                };
                if (attachedPictures.length > 0) {
                    Promise.all(attachedPictures.map(i => FileHelper.getFileBase64(i.uri, i))).then((data) => {
                        let attachments = [];
                        data.map((d) => {
                            let attachment = {
                                content: d.base64,
                                type: 'image/jpeg',
                                filename: d.file.filename,
                                disposition: 'attachment'
                            };
                            attachments.push(attachment);
                        });
                        params.attachments = attachments;
                        sendMail(params);
                    });
                } else 
                    sendMail(params);
            }, 300);    
        }
    }, [sending])

    const setFlashMessage = (m) => {
        dispatch({
            type: SET_FLASH_MESSAGE,
            payload: {
                text: m,
                position: Position.BOTTOM
            }
        })
    }

    const changeMode = (mode) => {
        setState({
            isModalVisible: false
        })
        InteractionManager.runAfterInteractions(() => {
            setState({
                mode 
            })    
        })
    }

    const onSubjectSelect = (id, value) => {
        setState({
            subject: value
        })
    }

    const handleInputChange = (value, name) => {
        if (name === 'suggestion')
            suggestion = value;
        else if (name === 'email')
            email = value;
        setState({
            suggestion,
            email
        })
    }

    const onInputFocus = (name) => {
        if (name === 'suggestion')
            suggestionFocused = true;
        else if (name === 'email')
            emailFocused = true;
        setState({
            suggestionFocused,
            emailFocused
        })
    }

    const onInputBlur = (name) => {
        if (name === 'suggestion')
            suggestionFocused = false;
        else if (name === 'email')
            emailFocused = false;
        setState({
            suggestionFocused,
            emailFocused
        })
    }

    const sendMail = (params) => {
        SendGrid.send(params, (response) => {
            if (response) {
                changeMode(MODES.THANK_YOU);
            } else {
                const eError = i18n.t('errors:mailSent', {defaultValue: 'Произошла ошибка при отправке электронного письма'});
                setFlashMessage(eError)
            }
        });
    }

    const onSubmit = () => {
        if (_.isEmpty(suggestion)) {
            const sError = i18n.t('errors:emptySuggestion', {defaultValue: 'Напишите ваше предложение'})
            setFlashMessage(sError)
            suggestionRef.current.focus()
        } else if (_.isEmpty(email)) {
            const eError = i18n.t('errors:emptyEmail', {defaultValue: 'Введите e-mail'})
            setFlashMessage(eError)
            emailRef.current.focus()
        } else if (!_.isEmpty(email) && !EmailValidator.validate(email)) {
            const eError = i18n.t('errors:invalidEmail', {defaultValue: 'Недействительная электронная почта'})
            setFlashMessage(eError)
            emailRef.current.focus()
        } else {
            // Hide keyboard
            Keyboard.dismiss();
            setState({
                sending: true
            })
        }
    }

    const toggleModal = () => {
        if (!sending) {
            setState({ 
                isModalVisible: !isModalVisible 
            })    
        }
    }

    const goBack = () => {
        if (sending)
            return null;
        switch(mode) {
            case MODES.DEFAULT: 
                setTimeout(() => {
                    navigation.goBack();
                }, 300);
                break;
            case MODES.CAMERA:
                (cameraRef.current.isAvailable())
                    changeMode(MODES.DEFAULT);
                break;
            case MODES.GALLERY:
                changeMode(MODES.DEFAULT);
                break;
        }
    }

    const confirmPictures = (pictures) => {
        let s = {
            mode: MODES.DEFAULT
        };
        pictures.length > 0 && (s.attachedPictures = pictures);
        setState(s)
    }

    const deletePicture = (newPictures) => {
        setState({
            attachedPictures: newPictures
        })
    }

    const placeholder = i18n.t('your_suggestion', {defaultValue: 'Ваше предложение'}),
        email_placeholder = i18n.t('your_email_address', {defaultValue: 'Ваш адрес электронной почты'});

    return (
        <DarkPage i18nKey="feedback" defaultText="Обратная связь" navigation={navigation} fontSize={18} closeHandler={goBack}>
            <View style={styles.container}>
                {((m) => {
                    switch(m) {
                        case MODES.DEFAULT:
                            return (
                                <ScrollView style={[styles.container, styles.scrollContainer]} keyboardShouldPersistTaps="always">
                                    <View style={styles.content}>
                                        <Text style={styles.desc}>
                                            {i18n.t('what_would_like', {defaultValue: 'Что бы вы хотели сделать?'})}
                                        </Text>
                                        <DropDownMenu iconColor="#85858d" 
                                            sort={DEFAULT_SORT} 
                                            sortItems={SORT_ITEMS} 
                                            mode={MODE_DROPDOWN} 
                                            textStyle={styles.inputText} 
                                            optionStyle={styles.optionText} 
                                            triggerStyle={styles.section}
                                            onSelect={onSubjectSelect}
                                            status={sending ? STATUS_DISABLED : STATUS_ENABLED}
                                        />
                                        <View style={[styles.section, styles.sectionInput, suggestionFocused && (styles.sectionFocused)]}>
                                            <TextInput placeholder={placeholder} 
                                                style={styles.inputText} 
                                                placeholderTextColor="#b1b2b6"
                                                value={suggestion}
                                                multiline={true}
                                                onChangeText={(t) => handleInputChange(t, 'suggestion')}
                                                onFocus={() => onInputFocus('suggestion')}
                                                onBlur={() => onInputBlur('suggestion')}
                                                ref={suggestionRef}
                                                editable={sending ? false : true}
                                            />
                                        </View>
                                        <Text style={[styles.desc, styles.desc2]}>
                                            {i18n.t('describe_suggest', {defaultValue: 'Опишите своё предложение. Мы не сможем ответить вам лично, но непременно учтём ваши пожелания.'})}
                                        </Text>
                                    </View>
                                    <View style={[CssHelper['flexRowCentered'], styles.images]}>
                                        <View>
                                            <Pictures mode={MODE_PICTURES_DISPLAY} 
                                                pictures={attachedPictures} 
                                                margin={IMAGE_MARGIN} 
                                                picturesNum={AVAILABLE_IMAGES_NUM} 
                                                paddingHorizontal={PADDING_HOR} 
                                                onDelete={deletePicture}
                                                isLocked={sending ? true : false}
                                            />
                                        </View>
                                        { attachedPictures.length < 5 &&
                                            <TouchableOpacity onPress={toggleModal} activeOpacity={1} style={styles.camera}>
                                                <View style={[CssHelper['flexSingleCentered']]}>
                                                    <Ionicons name="md-camera" size={36}/>
                                                </View>
                                            </TouchableOpacity>
                                        }
                                    </View>
                                    <View style={styles.content}>
                                        <View style={[styles.section, styles.sectionInput, emailFocused && (styles.sectionFocused)]}>
                                            <TextInput placeholder={email_placeholder} 
                                                style={styles.inputText} 
                                                placeholderTextColor="#b1b2b6"
                                                value={email}
                                                multiline={false}
                                                onChangeText={(t) => handleInputChange(t, 'email')}
                                                onFocus={() => onInputFocus('email')}
                                                onBlur={() => onInputBlur('email')}
                                                ref={emailRef}
                                                editable={sending ? false : true}
                                                autoCompleteType='email'
                                                keyboardType='email-address'
                                                autoCapitalize='none'
                                            />
                                        </View>
                                        <View style={styles.buttonContainer}>
                                            <ShadowButton i18nKey="ok" defaultText="OK" onPress={onSubmit} status={sending ? STATUS_SENDING : STATUS_DEFAULT}/>
                                        </View>
                                        <Text style={[styles.desc, styles.desc2]}>
                                            {i18n.t('contactus_desc', {defaultValue: 'Эта страница предназначена для отзывов и предложений по работе приложений. Если вы хотите открыть спор, перейдите в Мои заказы.'})}
                                        </Text>
                                    </View>
                                </ScrollView>
                            );
                        case MODES.CAMERA:
                            return(
                                <CameraUI attachedPictures={attachedPictures} 
                                    submit={confirmPictures} 
                                    ref={cameraRef} 
                                    switchGallery={() => changeMode(MODES.GALLERY)}
                                />
                            );
                        case MODES.GALLERY:
                            return (
                                <Gallery attachedPictures={attachedPictures} 
                                    submit={confirmPictures} 
                                    switchCamera={() => changeMode(MODES.CAMERA)}
                                />
                            );
                        case MODES.THANK_YOU:
                            return (
                                <ThankYou navigation={navigation}/>
                            );
                    }
                })(mode)}
                <Modal isVisible={isModalVisible} useNativeDriver={true} animationIn="fadeIn" animationOut="fadeOut" backdropOpacity={0.6} onBackdropPress={toggleModal}>
                    <View style={[CssHelper['flexSingleCentered']]}>
                        <View style={CssHelper['modalMenuContainer']}>
                            <Ripple rippleCentered={false} rippleSequential={true} rippleFades={false} rippleOpacity={0.15} rippleDuration={200} onPress={() => changeMode(MODES.CAMERA)}>
                                <View style={CssHelper['modalMenuButton']}>
                                    <Text style={CssHelper['modalMenuButtonText']}>
                                        {i18n.t('take_photo', {defaultValue: 'Сделать фото'})}
                                    </Text>
                                </View>
                            </Ripple>
                            <Ripple rippleCentered={false} rippleSequential={true} rippleFades={false} rippleOpacity={0.15} rippleDuration={200} onPress={() => changeMode(MODES.GALLERY)}>
                                <View style={CssHelper['modalMenuButton']}>
                                    <Text style={CssHelper['modalMenuButtonText']}>
                                        {i18n.t('choose_available', {defaultValue: 'Выбрать имеющееся'})}
                                    </Text>
                                </View>
                            </Ripple>
                            <Ripple rippleCentered={false} rippleSequential={true} rippleFades={false} rippleOpacity={0.15} rippleDuration={200} onPress={toggleModal}>
                                <View style={CssHelper['modalMenuButton']}>
                                    <Text style={CssHelper['modalMenuButtonText']}>
                                        {i18n.t('cancel2', {defaultValue: 'Отмена'})}
                                    </Text>
                                </View>
                            </Ripple>
                        </View>
                    </View>
                </Modal>
            </View>
        </DarkPage>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ebebeb',
    },
    scrollContainer: {
        paddingVertical: 15,
    },
    content: {
        paddingHorizontal: 20
    },
    desc: {
        color: '#888b92',
        fontSize: 15
    },
    desc2: {
        marginTop: 10
    },
    inputText: {
        fontSize: 16,
    },
    optionText: {
        fontSize: 16
    },
    section: {
        borderBottomColor: '#3b3c41',
        borderBottomWidth: 1,
        paddingBottom: 5,
        paddingTop: 5,
        marginTop: 20
    },
    sectionInput: {
        marginTop: 30
    },
    sectionFocused: {
        borderBottomWidth: 2,
        borderBottomColor: APP_MAIN_COLOR,
        paddingBottom: 4
    },
    images: {
        paddingLeft: 20,
        marginTop: 15,
        justifyContent: 'flex-start'
    },
    camera: {
        backgroundColor: '#eeeeee',
        borderRadius: 3,
        width: IMAGE_SIZE,
        height: IMAGE_SIZE + IMAGE_MARGIN,
    },
    buttonContainer: {
        paddingTop: 40,
        paddingBottom: 15
    },
    buttonText: {
        fontSize: 16
    }
});

export default ContactUsContainer;