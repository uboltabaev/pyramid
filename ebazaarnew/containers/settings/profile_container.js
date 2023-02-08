import React, { useReducer, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, ScrollView, Alert, Image } from 'react-native';
import i18n from 'i18n-js';
import Ripple from 'react-native-material-ripple';
import { observer, inject } from 'mobx-react';
import _ from 'underscore';
import { Surface } from 'react-native-paper';
import Storage, { STORAGE_FOLDERS } from '../../firebase/storage';
import CssHelper from "../../helpers/css_helper";
import MiscHelper from '../../helpers/misc_helper';
import DateHelper from '../../helpers/date_helper';
import ImageHelper from '../../helpers/image_helper';
import FileHelper from '../../helpers/file_helper';
import DarkPage from "../../components/misc/dark_page";
import UserAvatar, { USER_AVATAR_MODE, USER_AVATAR_SIZE } from '../../components/ui/user_avatar';
import RadioModal from '../../components/ui/radio_modal';
import ContactPersonModal from '../../components/profile/contact_person_modal';
import Gallery, { GALLERY_MODE } from "../../components/ui/gallery";
import CameraUI, { CAMERA_MODE } from '../../components/ui/camera';
import UserProfilesDb, { SEX } from '../../firebase/user_profiles';

const MODES = {
    DEFAULT: 'default',
    CAMERA: 'camera',
    GALLERY: 'gallery'
}

const ProfileContainer = inject('mobxStore')(observer(({ mobxStore, navigation }) => {
    const [state, setState] = useReducer(
        (state, newState) => ({...state, ...newState}),
        {
            contactPerson: '',
            sex: '',
            sexText: '',
            birthday: '',
            isVisibleContactPersonModal: false,
            isVisibleSexModal: false,
            mode: MODES.DEFAULT,
            isBlocked: false,
            picture: null
        }
    )

    const { contactPerson, sex, sexText, birthday, isVisibleContactPersonModal, isVisibleSexModal, mode, isBlocked, picture } = state
    const { uid, userProfile, updateTime } = mobxStore.userStore
    
    const userAvatar = useRef(null)
    const sexData = [
        {label: i18n.t('sex:male', {defaultValue: 'Мужчина'}), value: SEX.MALE},
        {label: i18n.t('sex:female', {defaultValue: 'Женщина'}), value: SEX.FEMALE}
    ]
    let timeout = null, timeout2 = null

    useEffect(() => {
        fill()

        return () => {
            clearTimeout(timeout)
            clearTimeout(timeout2)    
        }
    }, [])

    useEffect(() => {
        if (!_.isNull(userProfile)) {
            fill()
        }
    }, [userProfile])

    useEffect(() => {
        if (!_.isNull(updateTime)) {
            fill()
        }
    }, [updateTime])

    useEffect(() => {
        if (picture) {
            userAvatar.current.startUpload()

            Storage.uploadPhoto(picture, STORAGE_FOLDERS.USER_AVATARS, (progress) => {
                userAvatar.current.changeProgress(progress);
            }).then(async ({filename, downloadURL, storageLocation}) => {
                try {
                    /**
                     * To-do
                     * Move user avatar deletion to cloud functions
                     */
                    const profile = mobxStore.userStore.userProfile,
                        avatarFilename = profile.getAvatarFilename();
                    // Delete old avatar from storage
                    if (!_.isNull(avatarFilename) && '' !== avatarFilename) {
                        const files = [
                            avatarFilename,
                            FileHelper.getImageStorage200x200(avatarFilename),
                            FileHelper.getImageStorage400x400(avatarFilename),
                            FileHelper.getImageStorage800x800(avatarFilename)    
                        ];
                        for await (let file of files)
                            await Storage.deleteFile(STORAGE_FOLDERS.USER_AVATARS, file);
                    }
                    // Save avatar into db
                    const thumbnail = await ImageHelper.cropImage(picture),
                        data = {
                            avatar: {
                                base64: thumbnail.base64,
                                filename: filename,
                                storage_location: storageLocation,
                                public_url: downloadURL
                            }
                        }
                    const userProfile = await UserProfilesDb.updateUserProfile(uid, data)
                    mobxStore.userStore.setValues({
                        userProfile
                    })
                    // Complete upload
                    Image.prefetch(downloadURL).then(() => {
                        mobxStore.userStore.setValues({
                            profileImage: downloadURL,
                            profileImageBase64: thumbnail.base64
                        })
                        userAvatar.current.completeUpload()
                    })
                } catch (error) {
                    Alert.alert(
                        "", 
                        i18n.t('errors:errorOccured', {defaultValue: 'Произошла ошибка, попробуйте позже'})
                    );
                    userAvatar.current.completeUpload()
                }
            }, (error) => {
                console.log(error)
                Alert.alert(
                    "", 
                    error
                );
                userAvatar.current.completeUpload()
            })    
        }
    }, [picture])

    const fill = () => {
        setContactPerson()
        setSex()
        setBirthday()
    }

    const setContactPerson = () => {
        if (!_.isNull(userProfile)) {
            const { contact_person } = userProfile
            if (!_.isNull(contact_person)) {
                const a = [
                    contact_person.first_name,
                    contact_person.last_name
                ]
                setState({
                    contactPerson: a.join(' ')
                })
            }
        }
    }

    const setSex = () => {
        if (!_.isNull(userProfile)) {
            const { sex } = userProfile
            if (!_.isNull(sex)) {
                const i18nKey = [
                    'sex',
                    ':',
                    sex.toLowerCase()
                ]
                setState({
                    sex,
                    sexText: i18n.t(i18nKey.join(''), {defaultValue: sex})
                })
            }
        }
    }

    const setBirthday = () => {
        if (!_.isNull(userProfile)) {
            let { birthday } = userProfile
            if (!_.isNull(birthday)) {
                const dateHelper = new DateHelper(i18n.locale)
                birthday = birthday.toDate()
                setState({
                    birthday: dateHelper.getDateShort(birthday)
                })
            }
        }
    }

    const changeMode = (mode) => {
        if (mode === MODES.DEFAULT) {
            timeout2 = setTimeout(() => {
                setState({
                    mode
                })
            }, 50)    
        } else {
            setState({
                mode
            })
        }
    }

    const getTitle = () => {
        let title = {
            i18nKey: 'settings:profile:title',
            defaultText: 'Профиль'
        };
        switch(mode) {
            case MODES.GALLERY:
                title.i18nKey = 'gallery';
                title.defaultText = 'Галерия';
                break;
            case MODES.CAMERA:
                title.i18nKey = 'take_photo';
                title.defaultText = 'Сделать фото';
                break;
        }
        return title;
    }

    const goBack = () => {
        switch(mode) {
            case MODES.DEFAULT: 
                setTimeout(() => {
                    navigation.goBack();
                }, 300);
                break;
            case MODES.CAMERA:
            case MODES.GALLERY:
                changeMode(MODES.DEFAULT);
                break;
        }
    }

    const displayContactPersonModal = () => {
        setState({
            isVisibleContactPersonModal: true
        })
    }

    const hideContactPersonModal = () => {
        setState({
            isVisibleContactPersonModal: false
        })
    }

    const displaySexModal = () => {
        setState({
            isVisibleSexModal: true
        })
    }

    const hideSexModal = () => {
        setState({
            isVisibleSexModal: false
        })
    }

    const uploadAvatar = (picture) => {
        if (null === picture) {
            if (mode === MODES.GALLERY) {
                Alert.alert(
                    "", 
                    i18n.t('errors:selectPhoto', {defaultValue: 'Пожалуйста, выберите фото'})
                );
            } else if (mode === MODES.CAMERA) {
                Alert.alert(
                    "", 
                    i18n.t('errors:photoNotTaken', {defaultValue: 'Фотография не была сделана'})
                );
            }
        } else if (_.isObject(picture)) {
            timeout = setTimeout(() => {
                setState({
                    mode: MODES.DEFAULT,
                    picture
                })    
            }, 50)
        }
    }

    const setIsBlockPage = (val) => {
        setState({
            isBlocked: val
        })
    }

    const saveSex = (newSex) => {
        if (sex !== newSex) {
            setIsBlockPage(true)
            // Save data
            const data = {
                sex: newSex
            }
            UserProfilesDb.updateUserProfile(uid, data, false).then((date) => {
                setIsBlockPage(false)
                mobxStore.userStore.updateUserProfile('sex', newSex, date)
            }, (error) => {
                MiscHelper.alertError()
                setIsBlockPage(false)
            });    
        }
    }

    const title = getTitle()

    return (
        <DarkPage i18nKey={title.i18nKey}
            defaultText={title.defaultText}
            navigation={navigation}
            displayMoreIcon={mode === MODES.DEFAULT ? true : false}
            closeHandler={goBack}
            isBlocked={isBlocked}
        >
            <View style={[CssHelper['flex'], styles.content]}>
                {((m) => {
                    switch(m) {
                        case MODES.DEFAULT:
                            return (
                                <View style={CssHelper['flex']}>
                                    <ScrollView style={styles.content}>
                                        <Surface style={CssHelper['section']} elevation={2}>
                                            <Ripple style={CssHelper['flex']} rippleCentered={false} rippleSequential={true} rippleFades={false} rippleOpacity={0.12} rippleDuration={200} onPress={() => changeMode(MODES.GALLERY)}>
                                                <View style={CssHelper["menu.button"]}>
                                                    <Text style={CssHelper['menu.button.text']}>
                                                        {i18n.t('settings:profile:my_picture', {defaultValue: 'Моя фотография'})}
                                                    </Text>
                                                    <UserAvatar mode={USER_AVATAR_MODE.UPLOAD} 
                                                        size={USER_AVATAR_SIZE.BIG}
                                                        ref={userAvatar}
                                                    />
                                                </View>
                                            </Ripple>
                                        </Surface>
                                        <Surface style={CssHelper['section']} elevation={2}>
                                            <Ripple style={CssHelper['flex']} rippleCentered={false} rippleSequential={true} rippleFades={false} rippleOpacity={0.12} rippleDuration={200} onPress={displayContactPersonModal}>
                                                <View style={CssHelper["menu.button"]}>
                                                    <Text style={CssHelper['menu.button.text']}>
                                                        {i18n.t('settings:profile:the_contact_person', {defaultValue: 'Контактное лицо'})}
                                                    </Text>
                                                    <Text style={CssHelper['menu.button.text.value']}>
                                                        {contactPerson}
                                                    </Text>
                                                </View>
                                            </Ripple>
                                            <Ripple style={CssHelper['flex']} rippleCentered={false} rippleSequential={true} rippleFades={false} rippleOpacity={0.12} rippleDuration={200} onPress={() => navigation.navigate('SettingsAccount')}>
                                                <View style={CssHelper["menu.button"]}>
                                                    <Text style={CssHelper['menu.button.text']}>
                                                        {i18n.t('settings:profile:about_account', {defaultValue: 'Об аккаунте'})}
                                                    </Text>
                                                </View>
                                            </Ripple>
                                            <Ripple style={CssHelper['flex']} rippleCentered={false} rippleSequential={true} rippleFades={false} rippleOpacity={0.12} rippleDuration={200} onPress={displaySexModal}>
                                                <View style={CssHelper["menu.button"]}>
                                                    <Text style={CssHelper['menu.button.text']}>
                                                        {i18n.t('settings:profile:sex', {defaultValue: 'Пол'})}
                                                    </Text>
                                                    <Text style={[CssHelper['menu.button.text.value'], CssHelper['uppercase']]}>
                                                        {sexText}
                                                    </Text>
                                                </View>
                                            </Ripple>
                                            <Ripple style={CssHelper['flex']} rippleCentered={false} rippleSequential={true} rippleFades={false} rippleOpacity={0.12} rippleDuration={200} onPress={() => navigation.navigate('SettingsBirthday')}>
                                                <View style={CssHelper["menu.button"]}>
                                                    <Text style={CssHelper['menu.button.text']}>
                                                        {i18n.t('settings:profile:year_of_birth', {defaultValue: 'Год рождения'})}
                                                    </Text>
                                                    <Text style={CssHelper['menu.button.text.value']}>
                                                        {birthday}
                                                    </Text>
                                                </View>
                                            </Ripple>
                                        </Surface>
                                        <Surface style={CssHelper['section']} elevation={2}>
                                            <Ripple style={CssHelper['flex']} rippleCentered={false} rippleSequential={true} rippleFades={false} rippleOpacity={0.12} rippleDuration={200} onPress={() => navigation.navigate('SettingsShippingAddresses')}>
                                                <View style={CssHelper["menu.button"]}>
                                                    <Text style={CssHelper['menu.button.text']}>
                                                        {i18n.t('settings:delivery_addresses', {defaultValue: 'Адреса доставки'})}
                                                    </Text>
                                                </View>
                                            </Ripple>
                                        </Surface>
                                    </ScrollView>
                                    <ContactPersonModal isVisible={isVisibleContactPersonModal}
                                        hideModal={hideContactPersonModal}
                                        titleI18nKey="settings:profile:the_contact_person"
                                        titleDefaultText="Контактное лицо"
                                        setIsBlockPage={setIsBlockPage}
                                    />
                                    <RadioModal isVisible={isVisibleSexModal}
                                        hideModal={hideSexModal}
                                        titleI18nKey="settings:profile:sex"
                                        titleDefaultText="Пол"
                                        radioData={sexData}
                                        onPress={saveSex}
                                        selected={sex}
                                    />
                                </View>
                            );
                        case MODES.GALLERY:
                            return (
                                <Gallery mode={GALLERY_MODE.AVATAR} 
                                    allowedImagesNum={1}
                                    switchCamera={() => changeMode(MODES.CAMERA)}
                                    submit={uploadAvatar}
                                />
                            );
                        case MODES.CAMERA: 
                            return (
                                <CameraUI mode={CAMERA_MODE.AVATAR}
                                    allowedImagesNum={1}
                                    switchGallery={() => changeMode(MODES.GALLERY)}
                                    submit={uploadAvatar}
                                />
                            );
                    }
                })(mode)}
            </View>
        </DarkPage>
    )
}))

const styles = StyleSheet.create({
    content: {
        backgroundColor: '#ebebeb',
        flex: 1,
        padding: 0
    }
});

export default ProfileContainer;