import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import i18n from 'i18n-js';
import _ from 'underscore';
import CssHelper from "../../helpers/css_helper";
import DarkPage from "../../components/misc/dark_page";
import TouchableHighlight from '../../components/ui/touchable_highlight';
import EmailModal from '../../components/profile/email_modal';

function AccountContainer({ navigation }) {
    const [isDialogueVisible, setDisplayDialogue] = useState(false)

    const displayDialogue = () => {
        setDisplayDialogue(true)
    }

    const hideDialogue = () => {
        setDisplayDialogue(false)
    }

    return (
        <DarkPage i18nKey="settings:profile:about_account" 
            defaultText="Об аккаунте" 
            navigation={navigation}
        >
            <View style={styles.content}>
                <View style={styles.section}>
                    <View style={styles.menuButton}>
                        <View style={[CssHelper['flexRowCentered'], styles['menu.button.inner']]}>
                            <Text style={CssHelper['menu.button.text']}>
                                {i18n.t('account_info:user_id', {defaultValue: 'ID пользователя'})}
                            </Text>
                            <Text style={CssHelper['menu.button.text.value']}>
                                {'EU-20-ADJG-651244'}
                            </Text>
                        </View>
                    </View>
                    <View style={[styles.menuButton]}>
                        <TouchableHighlight onPress={displayDialogue}>
                            <View style={[CssHelper['flexRowCentered'], styles['menu.button.inner'], styles.noBorder]}>
                                <Text style={CssHelper['menu.button.text']}>
                                    {i18n.t('account_info:email', {defaultValue: 'Адрес эл. почты'})}
                                </Text>
                                <Text style={CssHelper['menu.button.text.value']}>
                                    {'umid.boltabaev@gmail.com'}
                                </Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>
                <EmailModal isVisible={isDialogueVisible}
                    hideModal={hideDialogue}
                    titleI18nKey="account_info:addEmail"
                    titleDefaultText="Добавить email"
                />
            </View>
        </DarkPage>
    )
}

const styles = StyleSheet.create({
    content: {
        backgroundColor: '#ebebeb',
        flex: 1,
        padding: 0
    },
    section: {
        marginTop: 10,
        backgroundColor: '#fff'
    },
    menuButton: {
        minHeight: 54
    },
    noBorder: {
        borderBottomWidth: 0
    },
    'menu.button.inner': {
        marginHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ebebeb'
    }
});

export default AccountContainer;