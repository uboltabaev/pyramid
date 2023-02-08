import React, { useState } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import i18n from 'i18n-js';
import { STATUS_BAR_HEIGHT } from '../../constants/app';
import CssHelper from "../../helpers/css_helper";
import DarkPage, { ICON_CLOSE } from '../../components/misc/dark_page';
import ShadowButton, { THEME_DARK_BUTTON, THEME_LIGHT_BUTTON } from '../../components/ui/shadow_button';
import SocialLogin from '../../components/auth/social_login';

function IndexContainer({ navigation }) {
    const [isLoading, setIsLoading] = useState(false)
    let timeout = null

    const onBlockPage = () => {
        setIsLoading(true)
    }

    const onUnBlockPage = () => {
        setIsLoading(false)
    }

    const cancelHandler = () => {
        timeout = setTimeout(() => {
            setIsLoading(false)
        }, 500)
    }

    return (
        <DarkPage i18nKey="login" 
            defaultText="Войти"
            displayShadow={true} 
            navigation={navigation}
            icon={ICON_CLOSE}
            isBlocked={isLoading}
            loadingText={i18n.t('loading', {defaultValue: 'Загрузка...'})}
            cancelHandler={cancelHandler}
        >
            <View style={CssHelper['flex']}>
                <View style={[CssHelper['frontend.container'], styles.container]}>
                    <View style={styles.content}>
                        <View style={CssHelper['flex']}>
                            <View style={styles.logoContainer}>
                                <Image source={require('../../../assets/images/logo.png')} style={styles.logo} resizeMode="contain"/>
                            </View>
                        </View>
                        <View>
                            <View style={styles.buttonContainer}>
                                <ShadowButton theme={THEME_DARK_BUTTON} 
                                    onPress={() => navigation.navigate('Signup')}
                                    i18nKey="registration" 
                                    defaultText="Регистрация" 
                                    elevation={1}
                                    style={{marginTop: 20}}
                                /> 
                            </View>
                            <View style={styles.buttonContainer}>
                                <ShadowButton theme={THEME_LIGHT_BUTTON} 
                                    onPress={() => navigation.navigate('Signin')}
                                    i18nKey="login" 
                                    defaultText="Войти" 
                                    elevation={1}
                                />
                            </View>
                        </View>
                        <View style={styles.socialContainer}>
                            <Text style={styles.txt}>
                                {i18n.t('or_log_in_with', {defaultValue: 'Или войти в систему с'})}
                            </Text>
                            <SocialLogin navigation={navigation}
                                onBlockPage={onBlockPage}
                                onUnBlockPage={onUnBlockPage}
                                onCancel={cancelHandler}
                            />
                        </View>
                    </View>
                </View>
            </View>
        </DarkPage>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        marginTop: STATUS_BAR_HEIGHT
    },
    content: {
        flex: 1,
        paddingHorizontal: 15,
        paddingVertical: 15,
        backgroundColor: '#fff'
    },
    logoContainer: {
        marginTop: 10,
        height: 50
    },
    logo: {
        width: '100%',
        height: '100%'
    },
    buttonContainer: {
        marginBottom: 3
    },
    socialContainer: {
        marginTop: 25,
        marginBottom: 10
    },
    txt: {
        textAlign: 'center',
        marginBottom: 15,
        color: '#989898'
    }
});

export default IndexContainer;