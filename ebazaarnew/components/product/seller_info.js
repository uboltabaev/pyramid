import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import PropTypes from 'prop-types';
import i18n from 'i18n-js';
import CssHelper from "../../helpers/css_helper";
import RedButton from "../ui/red_button";
import ConnectButton from "../ui/connect_button";

const SELLER = {
    name: "Solnishka"
};

const SellerInfo = React.memo(({ product, navigation }) => {
    const goChat = () => {
        const params = {
            productId: product.getId(),
            sellerId: product.getSellerId(),
            sellerName: product.getSellerName(),
            image: product.getImage200x200(),
            title: product.getName(),
            price: product.getPrice()
        };
        navigation.navigate('Chat', params)
    }
    
    const goShop = () => {

    }

    return (
        <View>
            <Text style={[CssHelper['productSectionTitle'], {paddingTop: 5}]}>
                {SELLER.name}
            </Text>
            <View style={CssHelper['flexRowCentered']}>
                <View style={styles.info}>
                    <Text>98.5%</Text>
                    <Text style={styles.infoText}>
                        {i18n.t('good_reviews', {defaultValue: "хороших отзывов"})}
                    </Text>
                </View>
                <View style={styles.info}>
                    <Text style={styles.centered}>40</Text>
                    <Text style={[styles.infoText, styles.centered]}>
                        {i18n.t('product(s)', {defaultValue: "товар(ов)"})}
                    </Text>
                </View>
                <View style={styles.info}>
                    <Text style={styles.right}>1202</Text>
                    <Text style={[styles.infoText, styles.right]}>
                        {i18n.t('followers', {defaultValue: "Подписчиков"})}
                    </Text>
                </View>
            </View>
            <View style={[CssHelper['flexRowCentered'], styles.storeBtn]}>
                <RedButton i18nKey="go_to_the_store" 
                    defaultText="Перейти к магазину" 
                    style={{marginRight: 12}}
                />
                <ConnectButton i18nKey="contact_the_seller" 
                    defaultText="Онлайн-чат" 
                    onPress={goChat}
                />
            </View>
        </View>
    )
})

const styles = StyleSheet.create({
    info: {
        flex: 1
    },
    infoText: {
        color: "#999999",
        fontSize: 12
    },
    centered: {
        textAlign: 'center'
    },
    right: {
        textAlign: "right"
    },
    storeBtn: {
        paddingTop: 15,
        paddingBottom: 7,
        justifyContent: 'flex-start'
    }
});

SellerInfo.propTypes = {
    product: PropTypes.object.isRequired
}

export default SellerInfo;