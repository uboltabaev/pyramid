import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import PropTypes from 'prop-types';
import i18n from 'i18n-js';
import _ from 'underscore';
import CssHelper from '../../helpers/css_helper';
import ShadowButton from '../../components/ui/shadow_button';

const RefreshPage = React.memo(({ refreshHandler, backgroundColor }) => {

    const refresh = () => {
        if (_.isFunction(refreshHandler))
            refreshHandler()
    }

    return (
        <View style={[CssHelper['flex'], styles.container, {backgroundColor}]}>
            <View style={[CssHelper['flexSingleCentered']]}>
                <View style={[styles.refreshPageInner]}>
                    <Text style={styles.refreshText}>
                        {i18n.t('errors:errorOccured3', {defaultValue: 'Произошла ошибка. Пожалуйста, попробуйте еще раз'})}
                    </Text>
                    <ShadowButton i18nKey="refresh" 
                        defaultText="Обновить" 
                        style={styles.button}
                        onPress={refresh}
                    />
                </View>
            </View>
        </View>
    )
})

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f5f5f5'
    },
    refreshPageInner: {
        marginTop: -20,
        width: '70%'
    },
    refreshText: {
        textAlign: 'center',
        marginBottom: 20,
        color: '#999',
        fontSize: 15
    },
    button: {
        width: '100%'
    }
});

RefreshPage.propTypes = {
    refreshHandler: PropTypes.func,
    backgroundColor: PropTypes.string
}

RefreshPage.defaultProps = {
    backgroundColor: '#f5f5f5'
}

export default RefreshPage;