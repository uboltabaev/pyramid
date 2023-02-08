import React, { useReducer, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import i18n from 'i18n-js';
import { useDispatch } from "react-redux";
import { observer, inject } from 'mobx-react';
import Modal from "react-native-modal";
import _ from 'underscore';
import UserProfilesDb from '../../firebase/user_profiles';
import { APP_FORM_COLOR } from "../../constants/app";
import { Position } from '../ui/flash_message';
import { SET_FLASH_MESSAGE } from '../../redux/constants/action-types';
import ClearInput from '../ui/clear_input';
import MiscHelper from '../../helpers/misc_helper';

const ContactPersonModal = inject('mobxStore')(observer(({ mobxStore, isVisible, height, titleI18nKey, titleDefaultText, hideModal, setIsBlockPage }) => {
    const [state, setState] = useReducer(
        (state, newState) => ({...state, ...newState}),
        {
            firstName: '',
            lastName: '',
            firstNameFocused: false,
            lastNameFocused: false,
            firstNameFocusTriggered: false,
            lastNameFocusTriggered: false,
            contactPerson: null,
            modalWidth: 0
        }
    )

    const { firstName, lastName, firstNameFocused, lastNameFocused, firstNameFocusTriggered, lastNameFocusTriggered, contactPerson, modalWidth } = state
    let timeOut = null, timeOut2 = null, timeOut3 = null

    const lastNameRef = useRef(null)

    const dispatch = useDispatch()

    useEffect(() => {
        const userProfile = mobxStore.userStore.userProfile;
        if (!_.isNull(userProfile)) {
            const { contact_person } = userProfile;
            if (_.isObject(contact_person)) {
                setState({
                    firstName: contact_person.first_name,
                    lastName: contact_person.last_name,
                    contactPerson: {
                        firstName: contact_person.first_name,
                        lastName: contact_person.last_name
                    }
                })
            }
        }

        return () => {
            clearTimeout(timeOut)
            clearTimeout(timeOut2)
            clearTimeout(timeOut3)
        }
    }, [])

    useEffect(() => {
        if (isVisible) {
            const data = {}
            if (_.isNull(contactPerson)) {
                data.firstName = ''
                data.lastName = ''
            } else {
                data.firstName = contactPerson.firstName,
                data.lastName = contactPerson.lastName
            }
            setState(data)
        }
    }, [isVisible])

    const _hideModal = () => {
        if (_.isFunction(hideModal)) {
            hideModal()
            timeOut2 = setTimeout(() => {
                const data = {
                    firstNameFocused: false,
                    lastNameFocused: false,
                    firstNameFocusTriggered: false,
                    lastNameFocusTriggered: false
                };
                setState(data)
            }, 50);
        }
    }

    const onChange = (name, e) => {
        const { text } = e.nativeEvent,
            values = {}
        values[name] = text;
        setState(values)
    }

    const onFocus = (name) => {
        switch(name) {
            case 'firstName':
                setState({
                    firstNameFocused: true,
                    firstNameFocusTriggered: true
                })
                break
            case 'lastName':
                setState({
                    lastNameFocused: true,
                    lastNameFocusTriggered: true
                })
                break
        }
    }

    const onBlur = (name) => {
        switch(name) {
            case 'firstName':
                setState({
                    firstNameFocused: false
                })
                break
            case 'lastName':
                setState({
                    lastNameFocused: false
                })
                break    
        }
    }

    const clearInput = (name) => {
        switch (name) {
            case 'firstName':
                setState({
                    firstName: ''
                })
                break
            case 'lastName':
                setState({
                    lastName: ''
                })
                break
        }
    }

    const _setIsBlockPage = (val) => {
        if (_.isFunction(setIsBlockPage))
            setIsBlockPage(val)
    }

    const onLayout = (e) => {
        const { width } = e.nativeEvent.layout;
        setState({
            modalWidth: width
        })
    }

    const save = () => {
        if (firstName === '') {
            Keyboard.dismiss()
            dispatch({
                type: SET_FLASH_MESSAGE,
                payload: {
                    text: i18n.t('errors:enterFirstName', {defaultValue: 'Введите ваше имя'}),
                    position: Position.CENTER
                }
            })
        } else if (lastName === '') {
            Keyboard.dismiss()
            dispatch({
                type: SET_FLASH_MESSAGE,
                payload: {
                    text: i18n.t('errors:enterSurname', {defaultValue: 'Введите свою фамилию'}),
                    position: Position.CENTER
                }
            })
        } else {
            // Hide modal
            timeOut = setTimeout(() => {
                _hideModal()
                Keyboard.dismiss()
            }, 1)

            const first_name = firstName.trim(),
                last_name = lastName.trim(),
                userProfile = mobxStore.userStore.userProfile

            let isEqual = false;
            if (userProfile) {
                const { contact_person } = userProfile
                if (_.isObject(contact_person)) {
                    if (first_name === userProfile.contact_person.first_name && last_name === userProfile.contact_person.last_name)
                        isEqual = true
                }
            }
            
            // Block page while data saving...
            if (!isEqual) {
                timeOut3 = setTimeout(() => {
                    _setIsBlockPage(true)
                    //Save data
                    const uid = mobxStore.userStore.uid,
                        data = {
                            contact_person: {
                                first_name,
                                last_name
                            }
                        } 
                        console.log(data) 
                    UserProfilesDb.updateUserProfile(uid, data, false).then((date) => {
                        // Unblock page
                        _setIsBlockPage(false)
                        mobxStore.userStore.updateUserProfile('contact_person', data.contact_person, date);
                        setState({
                            contactPerson: {
                                firstName: first_name,
                                lastName: last_name
                            }
                        })
                    }, (error) => {
                        MiscHelper.alertError();
                        _setIsBlockPage(false)
                    });
                }, 200);    
            }
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
            <View style={[styles.container, {height}]} onLayout={onLayout}>
                <Text style={styles.title}>
                    {i18n.t(titleI18nKey, {defaultValue: titleDefaultText})}
                </Text>
                <View style={styles.content}>
                    <View style={[styles.textInputContainer, firstNameFocused && (styles.focused)]}>
                        <TextInput style={styles.textInput}
                            placeholder={i18n.t('contact_person:first_name', {defaultValue: 'Имя'})}
                            value={firstName}
                            onChange={(e) => onChange('firstName', e)}
                            onFocus={() => onFocus('firstName')}
                            onBlur={() => onBlur('firstName')}
                            onSubmitEditing={() => lastNameRef.current.focus()}
                            blurOnSubmit={false}
                            returnKeyType="next"
                        />
                        { (!firstNameFocusTriggered || firstNameFocused) && 
                            <ClearInput style={styles.clearInput}
                                onPress={() => clearInput('firstName')}
                            />
                        }
                    </View>
                    <View style={[styles.textInputContainer, lastNameFocused && (styles.focused)]}>
                        <TextInput style={styles.textInput}
                            ref={lastNameRef}
                            placeholder={i18n.t('contact_person:last_name', {defaultValue: 'Фамилия'})}
                            value={lastName}
                            onChange={(e) => onChange('lastName', e)}
                            onFocus={() => onFocus('lastName')}
                            onBlur={() => onBlur('lastName')}
                        />
                        { (!lastNameFocusTriggered || lastNameFocused) && 
                            <ClearInput style={styles.clearInput}
                                onPress={() => clearInput('lastName')}
                            />
                        }
                    </View>
                </View>
                <View style={styles.footer}>
                    <View style={styles.footerInner}>
                        <TouchableWithoutFeedback onPress={_hideModal}>
                            <Text style={styles.buttonText}>
                                {i18n.t('cancel2', {defaultValue: 'Отмена'})}
                            </Text>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={save}>
                            <Text style={styles.buttonText}>
                                {i18n.t('save', {defaultValue: 'Сохранить'})}
                            </Text>
                        </TouchableWithoutFeedback>
                    </View>
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
        paddingVertical: 20,
        paddingBottom: 5
    },
    title: {
        fontSize: 17,
        color: '#212121'
    },
    content: {
        marginBottom: 10,
        paddingBottom: 15,
        flex: 1
    },
    footer: {
        height: 55,
        borderTopColor: '#ebebeb',
        borderTopWidth: 0.5,
        marginHorizontal: -18,
        paddingHorizontal: 18
    },
    footerInner: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    buttonText: {
        textAlign: 'center',
        textTransform: 'uppercase',
        color: APP_FORM_COLOR,
        paddingVertical: 5,
        paddingHorizontal: 7,
        marginLeft: 15
    },
    textInputContainer: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        flexDirection: 'row',
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
        fontSize: 16,
        paddingTop: 15,
        paddingBottom: 8,
        marginTop: 5,
        flex: 1,
        marginRight: 10
    },
    textInputFocused: {
        paddingBottom: 7.5
    },
    clearInput: {
        marginBottom: 6,
        padding: 5
    }
});

ContactPersonModal.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    height: PropTypes.number,
    hideModal: PropTypes.func,
    titleI18nKey: PropTypes.string.isRequired,
    titleDefaultText: PropTypes.string.isRequired,
    setIsBlockPage: PropTypes.func
}

ContactPersonModal.defaultProps = {
    isVisible: false,
    height: 224
}

export default ContactPersonModal;