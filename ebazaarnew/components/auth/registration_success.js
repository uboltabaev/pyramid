import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import i18n from 'i18n-js';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { GET_GREEN_COLOR } from "../../constants/app";
import CssHelper from '../../helpers/css_helper';
import ShadowButton from '../ui/shadow_button';

const ThankYou = React.memo(({ navigation }) => {
    const goHome = () => {
        navigation.navigate('BottomTabs')
    }

    return (
        <View style={[styles.container, CssHelper['flexSingleCentered']]}>
            <View style={styles.iconContainer}>
                <SimpleLineIcons name="emotsmile" size={60} color={GET_GREEN_COLOR()}/>
            </View>
            <Text style={styles.text1}>
                {i18n.t('sign_up:successTitle', {defaultValue: 'Спасибо, что выбрали нас'})}
            </Text>
            <Text style={styles.text2}>
                {i18n.t('messages:verification_email_sent', {defaultValue: 'Мы отправили письмо с ссылкой для подтверждения на ваш адрес электронной почты. Чтобы завершить процесс регистрации, нажмите на ссылку подтверждения.'})}
            </Text>
            <View style={styles.buttonContainer}>
                <ShadowButton i18nKey="back_to_home" defaultText="Вернуться на главная" onPress={goHome} style={styles.button}/>
            </View>
        </View>
    )
})

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ebebeb',
        paddingHorizontal: 50
    },
    iconContainer: {
        minHeight: 60
    },
    text1: {
        fontWeight: 'bold',
        color: '#3a3e4a',
        fontSize: 16,
        marginTop: 25,
        textAlign: 'center'
    },
    text2: {
        color: '#888b92',
        marginTop: 10,
        textAlign: 'center',
        lineHeight: 20
    },
    buttonContainer: {
        marginTop: 30,
        marginBottom: 100
    },
    button: {
        width: '100%',
    }
});

export default ThankYou;