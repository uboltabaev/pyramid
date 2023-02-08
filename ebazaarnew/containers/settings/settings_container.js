import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, Alert } from 'react-native';
import Constants from 'expo-constants';
import i18n from 'i18n-js';
import Ripple from 'react-native-material-ripple';
import { observer, inject } from 'mobx-react';
import { LANGS } from "../../constants/app";
import CssHelper from "../../helpers/css_helper";
import DarkPage from "../../components/misc/dark_page";
import ShadowButton from '../../components/ui/shadow_button';
import RadioModal from '../../components/ui/radio_modal';
import AuthHelper from '../../helpers/auth_helper';
import AsyncStorage, {ASYNC_STORAGE_KEYS} from '../../library/async_storage';
import MiscHelper from '../../helpers/misc_helper';

const SettingsContainer = inject('mobxStore')(observer(({ mobxStore, navigation }) => {
    const [isLangModalVisible, setIsLangModalVisible] = useState(false)
    const [lang, setLanguage] = useState(i18n.locale)

    const { language } = mobxStore.userStore

    useEffect(() => {
        setLanguage(language)
    }, [language])

    const languageData = [
        {label: i18n.t('language:uzbek', {defaultValue: 'Ўзбекча'}), value: LANGS.UZ},
        {label: i18n.t('language:russian', {defaultValue: 'Русский'}), value: LANGS.RU}
    ]

    const goBack = () => {
        navigation.navigate('MyProfile')
    }

    const displayLangModal = () => {
        setIsLangModalVisible(true)
    }

    const hideLangModal = () => {
        setIsLangModalVisible(false)
    }

    const changeLanguage = async (val) => {
        const locale = i18n.locale;
        if (val !== locale) {
            i18n.locale = val;
            mobxStore.userStore.setLanguage(val);
            try {
                await AsyncStorage.storeData(ASYNC_STORAGE_KEYS.LANGUAGE, val);
            } catch (e) {
                MiscHelper.alertError();
            }
        }
    }

    const logout = () => {
        Alert.alert(
            i18n.t('logout', {defaultValue: 'Выйти'}),
            i18n.t('warning:logout', {defaultValue: 'Вы уверены, что хотите выйти?'}),
            [
                {
                    text: i18n.t('cancel2', {defaultValue: 'Отмена'}),
                    style: "cancel"
                },
                {
                    text: 'OK',
                    onPress: () => {
                        AuthHelper.firebaseLogout().then(() => {
                            mobxStore.userStore.clearStorage()
                            navigation.navigate('Home')
                        })
                    }
                }
            ]
        )
    }

    const version = '1.00' /*Constants.manifest.version*/,
        isSignedIn = mobxStore.userStore.isSignedIn;

    return (
        <DarkPage i18nKey="settings" 
            defaultText="Настройки"
            displayShadow={true} 
            navigation={navigation}
            closeHandler={goBack}
            language={lang}
        >
            <View style={CssHelper['flex']}>
                <ScrollView style={[styles.content]}>
                    <View style={CssHelper['section']}>
                        <Ripple style={CssHelper['flex']} rippleCentered={false} rippleSequential={true} rippleFades={false} rippleOpacity={0.12} rippleDuration={200} onPress={() => navigation.navigate('SettingsProfile')}>
                            <View style={[CssHelper["menu.button"], styles['menu.button']]}>
                                <Text style={CssHelper['menu.button.text']}>
                                    {i18n.t('settings:profile:title', {defaultValue: 'Профиль'})}
                                </Text>
                            </View>
                        </Ripple>
                        <Ripple style={CssHelper['flex']} rippleCentered={false} rippleSequential={true} rippleFades={false} rippleOpacity={0.12} rippleDuration={200} onPress={() => navigation.navigate('SettingsShippingAddresses')}>
                            <View style={[CssHelper["menu.button"], styles['menu.button']]}>
                                <Text style={CssHelper['menu.button.text']}>
                                    {i18n.t('settings:delivery_addresses', {defaultValue: 'Адреса доставки'})}
                                </Text>
                            </View>
                        </Ripple>
                        <Ripple style={CssHelper['flex']} rippleCentered={false} rippleSequential={true} rippleFades={false} rippleOpacity={0.12} rippleDuration={200} onPress={() => navigation.navigate('WaitingShipment')}>
                            <View style={[CssHelper["menu.button"], styles['menu.button']]}>
                                <Text style={CssHelper['menu.button.text']}>
                                    {i18n.t('settings:my_preferences', {defaultValue: 'Мои предпочтения'})}
                                </Text>
                            </View>
                        </Ripple>
                        <Ripple style={CssHelper['flex']} rippleCentered={false} rippleSequential={true} rippleFades={false} rippleOpacity={0.12} rippleDuration={200} onPress={displayLangModal}>
                            <View style={[CssHelper["menu.button"], styles['menu.button']]}>
                                <Text style={CssHelper['menu.button.text']}>
                                    {i18n.t('settings:language', {defaultValue: 'Язык'})}
                                </Text>
                            </View>
                        </Ripple>
                    </View>
                    <View style={CssHelper['section']}>
                        <Ripple style={CssHelper['flex']} rippleCentered={false} rippleSequential={true} rippleFades={false} rippleOpacity={0.12} rippleDuration={200} onPress={() => navigation.navigate('WaitingShipment')}>
                            <View style={[CssHelper["menu.button"], styles['menu.button']]}>
                                <Text style={CssHelper['menu.button.text']}>
                                    {i18n.t('settings:setup_notifications', {defaultValue: 'Настройка уведомлений'})}
                                </Text>
                            </View>
                        </Ripple>
                        <Ripple style={CssHelper['flex']} rippleCentered={false} rippleSequential={true} rippleFades={false} rippleOpacity={0.12} rippleDuration={200} onPress={() => navigation.navigate('WaitingShipment')}>
                            <View style={[CssHelper["menu.button"], styles['menu.button']]}>
                                <Text style={CssHelper['menu.button.text']}>
                                    {i18n.t('history', {defaultValue: 'История'})}
                                </Text>
                            </View>
                        </Ripple>
                        <Ripple style={CssHelper['flex']} rippleCentered={false} rippleSequential={true} rippleFades={false} rippleOpacity={0.12} rippleDuration={200} onPress={() => navigation.navigate('WaitingShipment')}>
                            <View style={[CssHelper["menu.button"], styles['menu.button']]}>
                                <Text style={CssHelper['menu.button.text']}>
                                    {i18n.t('settings:image_quality', {defaultValue: 'Качество картинок'})}
                                </Text>
                            </View>
                        </Ripple>
                    </View>
                    <View style={CssHelper['section']}>
                        <Ripple style={CssHelper['flex']} rippleCentered={false} rippleSequential={true} rippleFades={false} rippleOpacity={0.12} rippleDuration={200} onPress={() => navigation.navigate('WaitingShipment')}>
                            <View style={[CssHelper["menu.button"], styles['menu.button']]}>
                                <Text style={CssHelper['menu.button.text']}>
                                    {i18n.t('settings:rate_the_app', {defaultValue: 'Оценить приложение'})}
                                </Text>
                            </View>
                        </Ripple>
                        <Ripple style={CssHelper['flex']} rippleCentered={false} rippleSequential={true} rippleFades={false} rippleOpacity={0.12} rippleDuration={200} onPress={() => navigation.navigate('WaitingShipment')}>
                            <View style={[CssHelper["menu.button"], styles['menu.button']]}>
                                <Text style={CssHelper['menu.button.text']}>
                                    {i18n.t('settings:privacy_policy', {defaultValue: 'Политика конфиденциальности'})}
                                </Text>
                            </View>
                        </Ripple>
                        <Ripple style={CssHelper['flex']} rippleCentered={false} rippleSequential={true} rippleFades={false} rippleOpacity={0.12} rippleDuration={200} onPress={() => navigation.navigate('WaitingShipment')}>
                            <View style={[CssHelper["menu.button"], styles['menu.button']]}>
                                <Text style={CssHelper['menu.button.text']}>
                                    {i18n.t('settings:legal_information', {defaultValue: 'Правовая информация'})}
                                </Text>
                            </View>
                        </Ripple>
                        <Ripple style={CssHelper['flex']} rippleCentered={false} rippleSequential={true} rippleFades={false} rippleOpacity={0.12} rippleDuration={200} onPress={() => navigation.navigate('WaitingShipment')}>
                            <View style={[CssHelper["menu.button"], styles['menu.button']]}>
                                <Text style={CssHelper['menu.button.text']}>
                                    {i18n.t('settings:version', {defaultValue: 'Версия'})}
                                </Text>
                                <Text style={CssHelper['menu.button.text.value']}>
                                    {version}
                                </Text>
                            </View>
                        </Ripple>
                    </View>
                    <View style={styles.footer}>
                        { isSignedIn &&
                            <ShadowButton i18nKey="logout" defaultText="Выйти" elevation={1} onPress={logout}/>
                        }
                        <View style={styles.logoContainer}>
                            <Image source={require('../../../assets/images/logo.png')} style={CssHelper['image']} resizeMode="contain"/>
                        </View>
                        <Text style={styles.version}>
                            {i18n.t('settings:version', {defaultValue: 'Версия'})} {version}
                        </Text>
                        <Text style={styles.copyright}>
                            &copy; 2020 {/*Constants.manifest.name*/}{"\n"}
                            {i18n.t('all_rights_reserved', {defaultValue: 'Все права защищены'})}
                        </Text>
                    </View>
                </ScrollView>
                <RadioModal isVisible={isLangModalVisible}
                    hideModal={hideLangModal}
                    titleI18nKey="settings:language"
                    titleDefaultText="Язык"
                    radioData={languageData}
                    onPress={changeLanguage}
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
    footer: {
        marginHorizontal: 15
    },
    logoContainer: {
        marginVertical: 15,
        marginBottom: 12,
        height: 30
    },
    version: {
        color: '#999',
        fontSize: 13,
        textAlign: 'center'
    },
    copyright: {
        paddingTop: 10,
        paddingBottom: 20,
        fontSize: 13,
        lineHeight: 16,
        textAlign: 'center'
    },
    "menu.button": {
        paddingTop: 14,
        paddingBottom: 14
    }
});

export default SettingsContainer;