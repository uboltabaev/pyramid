import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView} from 'react-native';
import i18n from 'i18n-js';
import _ from 'underscore';
import { STATUS_BAR_HEIGHT } from "../../constants/app";
import CssHelper from "../../helpers/css_helper";
import Modal, { ANIMATION_FADI_IN, ANIMATION_FADI_OUT } from "../ui/modal";

const FEATURES = [
    {name: "Бренд", value: "Samsung"},
    {name: "Аккумуятор", value: "Несъёмный"},
    {name: "Бренд", value: "Samsung"},
    {name: "Аккумуятор", value: "Несъёмный"},
    {name: "Бренд", value: "Samsung"},
    {name: "Аккумуятор", value: "Несъёмный"},
    {name: "Бренд", value: "Samsung"},
    {name: "Аккумуятор", value: "Несъёмный"},
    {name: "Бренд", value: "Samsung"},
    {name: "Аккумуятор", value: "Несъёмный"},
    {name: "Бренд", value: "Samsung"},
    {name: "Аккумуятор", value: "Несъёмный"},
    {name: "Бренд", value: "Samsung"},
    {name: "Аккумуятор", value: "Несъёмный"},
    {name: "Бренд", value: "Samsung"},
    {name: "Аккумуятор", value: "Несъёмный"},
    {name: "Бренд", value: "Samsung"},
    {name: "Аккумуятор", value: "Несъёмный"},
];

const Features = React.memo(() => {
    const [isModalVisible, setIsModalVisible] = useState(false)

    const toggleModal = () => {
        setIsModalVisible(v => !v)
    }

    const modalTitle = i18n.t('product_description', {defaultValue: 'Описание товара'})
    
    return (
        <TouchableOpacity onPress={toggleModal} activeOpacity={1}>
            <Text style={[CssHelper['productSectionTitle2']]}>
                {i18n.t('features', {defaultValue: 'Характеристика'})}
            </Text>
            <Modal isVisible={isModalVisible} 
                animationIn={ANIMATION_FADI_IN} 
                animationOut={ANIMATION_FADI_OUT} 
                closeModal={toggleModal} 
                marginTop={(80 - STATUS_BAR_HEIGHT)} 
                title={modalTitle}
                backdropTransitionInTiming={300}
                backdropTransitionOutTiming={300}
            >
                <ScrollView showsVerticalScrollIndicator={false}>
                    { FEATURES.map((feature, index) =>
                        <View key={index} style={[CssHelper['flexRowCentered'], styles.row]}>
                            <View style={CssHelper['flex']}>
                                <Text style={styles.greyText}>
                                    {feature.name}
                                </Text>
                            </View>
                            <View style={CssHelper['flex']}>
                                <Text>
                                    {feature.value}
                                </Text>
                            </View>
                        </View>
                    )}
                </ScrollView>
            </Modal>
        </TouchableOpacity>
    )
})

const styles = StyleSheet.create({
    row: {
        borderBottomColor: '#e1e1e1',
        borderBottomWidth: 1,
        paddingTop: 10,
        paddingBottom: 10
    },
    greyText: {
        color: '#adadad'
    }
});

export default Features;