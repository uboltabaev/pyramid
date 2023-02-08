import React, { useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, TextInput, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import i18n from 'i18n-js';
import { observer, inject } from 'mobx-react';
import Modal from "react-native-modal";
import _ from 'underscore';
import * as EmailValidator from 'email-validator';
import { APP_FORM_COLOR, LINK_COLOR } from "../../constants/app";
import CssHelper from '../../helpers/css_helper';
import XIcon from '../icons/x2_icon';

const EmailModal = inject('mobxStore')(observer(({ mobxStore, isVisible, height, titleI18nKey, titleDefaultText, hideModal, toggleBlockPage }) => {
    const [state, setState] = useReducer(
        (state, newState) => ({...state, ...newState}),
        {
            email: '',
            emailError: '',
            emailFocused: false
        }
    )
    
    const { email, emailError, emailFocused } = state
    let timeOut = null, timeout2 = null, timeout3 = null

    useEffect(() => {
        const userProfile = mobxStore.userStore.userProfile
        if (!_.isNull(userProfile)) {
            const { email } = userProfile
            /*if (_.isObject(contact_person)) {
                this.email = contact_person.first_name
            }*/    
        }

        return () => {
            clearTimeout(timeOut)
            clearTimeout(timeout2)
            clearTimeout(timeout3)    
        }
    }, [])

    const _hideModal = () => {
        if (_.isFunction(hideModal)) {
            hideModal();
            timeout2 = setTimeout(() => {
                setState({
                    email: '',
                    emailError: '',
                    emailFocused: false,
                })
            }, 50)
        }
    }

    const onChange = (e) => {
        const { text } = e.nativeEvent;
        setState({
            email: text
        })
    }

    const onFocus = () => {
        setState({
            emailFocused: true
        })
    }

    const onBlur = () => {
        setState({
            emailFocused: false
        })
    }

    const _toggleBlockPage = () => {
        if (_.isFunction(toggleBlockPage))
            toggleBlockPage();
    }

    const save = () => {
        if (!EmailValidator.validate(email)) {
            setState({
                emailError: i18n.t('errors:enterEmail', {defaultValue: 'Укажите ваш email'})
            })
        } else {
            // Hide modal
            timeOut = setTimeout(() => {
                _hideModal()
                Keyboard.dismiss()
            }, 1)

            // Block page while data saving...
            timeout2 = setTimeout(() => {
                _toggleBlockPage();
                timeout3 = setTimeout(() => {
                    _toggleBlockPage();
                }, 1000)
            }, 200)
        }
    }

    return (
        <Modal isVisible={isVisible}
            animationIn="fadeIn"
            animationOut="fadeOut"
            animationInTiming={200}
            animationOutTiming={50}
            backdropOpacity={0.50}
            useNativeDriver={true}
            onBackdropPress={_hideModal}
        >
            <View style={[styles.container, {height}]}>
                <View style={styles.header}>
                    <View style={CssHelper['flexRowCentered']}>
                        <TouchableOpacity onPress={_hideModal} style={CssHelper['standartLink']} activeOpacity={1}>
                            <XIcon width={15} height={15} color="#000"/>
                        </TouchableOpacity>
                        <Text style={styles.title} numberOfLines={1}>
                            {i18n.t(titleI18nKey, {defaultValue: titleDefaultText})}
                        </Text>
                        <TouchableWithoutFeedback onPress={save}>
                            <Text style={styles.buttonText}>
                                {i18n.t('save', {defaultValue: 'Сохранить'})}
                            </Text>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
                <View style={styles.content}>
                    <Text style={styles.note}>
                        {i18n.t('account_info:note', {defaultValue: 'Добавьте адрес электронной почты, чтобы входить в свой аккаунт было ещё удобнее.'})}
                    </Text>
                    <View style={[styles.textInputContainer, emailFocused && (styles.focused)]}>
                        <TextInput style={styles.textInput}
                            placeholder={i18n.t('account_info:email', {defaultValue: 'Email'})}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChange={onChange}
                            onFocus={onFocus}
                            onBlur={onBlur}
                        />
                    </View>
                    { emailError.length > 0 &&
                        <Text style={styles.errorText}>
                            {emailError}
                        </Text>
                    }
                </View>
            </View>
        </Modal>
    )
}))

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 2,
        paddingHorizontal: 18,
        paddingVertical: 12,
        paddingBottom: 5
    },
    title: {
        fontSize: 18,
        lineHeight: 21,
        color: '#212121',
        paddingHorizontal: 15,
        flex: 1
    },
    content: {
        marginBottom: 10,
        paddingBottom: 15,
        flex: 1
    },
    note: {
        fontSize: 14,
        color: '#757575',
        lineHeight: 19
    },
    header: {
        height: 50
    },
    buttonText: {
        textAlign: 'center',
        textTransform: 'uppercase',
        color: LINK_COLOR,
        paddingVertical: 5,
        paddingHorizontal: 7,
        marginLeft: 10
    },
    textInputContainer: {
        marginTop: 10,
        paddingBottom: 0.5,
        borderBottomColor: '#7f7f7f',
        borderBottomWidth: 1,
    },
    focused: {
        paddingBottom: 0,
        borderBottomColor: APP_FORM_COLOR,
        borderBottomWidth: 1.5,
    },
    textInput: {
        fontSize: 15,
        paddingTop: 15,
        marginTop: 5,
        marginRight: 10
    },
    textInputFocused: {
        paddingBottom: 7.5
    },
    errorText: {
        color: APP_FORM_COLOR,
        fontSize: 12,
        paddingTop: 3
    }
});

EmailModal.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    height: PropTypes.number,
    hideModal: PropTypes.func,
    titleI18nKey: PropTypes.string.isRequired,
    titleDefaultText: PropTypes.string.isRequired,
    toggleBlockPage: PropTypes.func
}

EmailModal.defaultProps = {
    isVisible: false,
    height: 224
}

export default EmailModal;