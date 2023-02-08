import React, { useReducer, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableWithoutFeedback } from 'react-native';
import i18n from 'i18n-js';
import { observer, inject } from 'mobx-react';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import _ from 'underscore';
import UserProfilesDb from '../../firebase/user_profiles';
import CssHelper from "../../helpers/css_helper";
import DateHelper from '../../helpers/date_helper';
import MiscHelper from '../../helpers/misc_helper';
import DarkPage from "../../components/misc/dark_page";
import ShadowButton from '../../components/ui/shadow_button';

const BirthdayContainer = inject('mobxStore')(observer(({ mobxStore, navigation }) => {
    const [state, setState] = useReducer(
        (state, newState) => ({...state, ...newState}),
        {
            birthday: null,
            date: new Date(),
            isDatePickerVisible: false,
            error: false,
            isBlocked: false        
        }
    )
    
    const { birthday, date, isDatePickerVisible, error, isBlocked } = state
    const dateHelper = new DateHelper(i18n.locale)

    useEffect(() => {
        // Set default date
        const userProfile = mobxStore.userStore.userProfile
        if (!_.isNull(userProfile) && !_.isNull(userProfile.birthday)) {
            const birthday = userProfile.birthday.toDate()
            setState({
                birthday,
                date: birthday
            })
        } else {
            const d = new Date();
            d.setFullYear(1980);
            d.setMonth(0);
            d.setDate(1);
            setState({
                date: d
            })
        }
    }, [])

    const toggleBlockPage = () => {
        setState({
            isBlocked: !isBlocked
        })
    }

    const handleConfirm = (date) => {
        setState({
            error: false,
            birthday: date,
            isDatePickerVisible: false
        })
    }

    const showDatePicker = () => {
        setState({
            isDatePickerVisible: true
        })
    }

    const hideDatePicker = () => {
        setState({
            isDatePickerVisible: false
        })
    }

    const save = () => {
        if (birthday === null) {
            setState({
                error: true
            })
        } else {
            toggleBlockPage()
            // Save birthday into database...
            const uid = mobxStore.userStore.uid,
                data = {
                    birthday
                };
            UserProfilesDb.updateUserProfile(uid, data).then((userProfile) => {
                // Unblock page
                toggleBlockPage()
                mobxStore.userStore.setValues({
                    userProfile
                })
                navigation.navigate('SettingsProfile')
            }, (error) => {
                toggleBlockPage()
                MiscHelper.alertError()
            })
        }
    }

    return (
        <DarkPage i18nKey="settings:profile:birthday" 
            defaultText="Дата рождения" 
            navigation={navigation}
            isBlocked={isBlocked}
        >
            <View style={CssHelper['flex']}>
                <View style={styles.content}>
                    <View style={styles.section}>
                        <Text style={CssHelper['menu.button.text']}>
                            {i18n.t('settings:profile:birthday', {defaultValue: 'Дата рождения'})}
                        </Text>
                        <TouchableWithoutFeedback onPress={showDatePicker}>
                            <View style={styles.textInput}>
                                <Text>{dateHelper.getDateShort(birthday)}</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        { error &&
                            <View style={styles.errorContainer}>
                                <Text style={CssHelper['error']}>
                                    {i18n.t('errors:enterBirthday', {defaultValue: 'Укажите дату своего рождения'})}
                                </Text>
                            </View>
                        }
                    </View>
                    <View style={CssHelper['flex']}/>
                    <View style={styles.footer}>
                        <ShadowButton i18nKey="save" 
                            defaultText="Сохранить" 
                            elevation={1} 
                            style={styles.button}
                            onPress={save}
                        />
                    </View>
                </View>
                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                    date={date}
                />
            </View>
        </DarkPage>
    )
}))

const styles = StyleSheet.create({
    content: {
        backgroundColor: '#ebebeb',
        flex: 1,
        padding: 0
    },
    section: {
        backgroundColor: '#fff',
        paddingHorizontal: 15,
        paddingVertical: 25
    },
    button: {
        width: 'auto'
    },
    footer: {
        marginHorizontal: 15,
        marginBottom: 15
    },
    textInput: {
        borderBottomColor: '#7f7f7f',
        borderBottomWidth: 1,
        paddingTop: 15
    },
    errorContainer: {
        marginTop: 5
    }
});

export default BirthdayContainer;