import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, ScrollView, TouchableWithoutFeedback } from 'react-native';
import i18n from 'i18n-js';
import Modal from "react-native-modal";
import _ from 'underscore';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import { APP_FORM_COLOR } from "../../constants/app";
import CssHelper from '../../helpers/css_helper';
import TouchableHighlight from '../../components/ui/touchable_highlight';

const RadioModal = React.memo(({ selected, isVisible, radioData, height, titleI18nKey, titleDefaultText, hideModal, onPress }) => {
    const [_selected, setSelected] = useState(null)

    let timeout = null, timeout2 = null

    useEffect(() => {
        const locale = i18n.locale;
        setSelected(locale)

        return () => {
            clearTimeout(timeout)
            clearTimeout(timeout2)    
        }
    }, [])

    useEffect(() => {
        if (selected) {
            setSelected(selected)
        }
    }, [selected])

    const _hideModal = () => {
        if (_.isFunction(hideModal))
            hideModal()
    }

    const select = (val) => {
        setSelected(val)
        timeout = setTimeout(() => {
            _hideModal();
            if (_.isFunction(onPress))
                onPress(val)
        }, 1)
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
            <View style={[styles.container, {height}]}>
                <Text style={styles.title}>
                    {i18n.t(titleI18nKey, {defaultValue: titleDefaultText})}
                </Text>
                <ScrollView style={styles.content}>
                    <View style={CssHelper['flex']}>
                        <RadioForm
                            formHorizontal={false}
                            animation={true}
                        >
                            { radioData.map((obj, i) => (
                                <RadioButton labelHorizontal={true} key={i} >
                                    <RadioButtonInput obj={obj}
                                        index={i}
                                        isSelected={_selected === obj.value}
                                        borderWidth={2}
                                        buttonInnerColor={APP_FORM_COLOR}
                                        buttonOuterColor={_selected === i ? APP_FORM_COLOR : "#757575"} 
                                        buttonSize={13}
                                        buttonOuterSize={24}
                                        buttonWrapStyle={styles.buttonWrapStyle}
                                        onPress={select}
                                    />
                                    <TouchableHighlight onPress={() => select(obj.value)}>
                                        <RadioButtonLabel obj={obj}
                                            index={i}
                                            labelStyle={styles.labelStyle}
                                        />                                            
                                    </TouchableHighlight>    
                                </RadioButton>
                            ))}
                        </RadioForm>
                    </View>
                </ScrollView>
                <View style={styles.footer}>
                    <View style={styles.footerInner}>
                        <TouchableWithoutFeedback onPress={_hideModal}>
                            <Text style={styles.buttonText}>
                                {i18n.t('cancel2', {defaultValue: 'Отмена'})}
                            </Text>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            </View>
        </Modal>
    )
})

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 2,
        height: 210,
        paddingHorizontal: 18,
        paddingVertical: 20
    },
    title: {
        fontSize: 17,
        color: '#212121'
    },
    content: {
        marginVertical: 10,
        marginBottom: 15,
        flex: 1
    },
    footer: {
        height: 30
    },
    footerInner: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    buttonText: {
        textAlign: 'center',
        textTransform: 'uppercase',
        color: APP_FORM_COLOR,
        paddingVertical: 5,
        paddingHorizontal: 7
    },
    buttonWrapStyle: {
        marginRight: 5,
        paddingVertical: 8
    },
    labelStyle: {
        textTransform: 'uppercase',
        color: '#757575',
        fontSize: 15,
        marginVertical: 10,
        flex: 1,
        marginLeft: 5
    }
});

RadioModal.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    height: PropTypes.number,
    hideModal: PropTypes.func,
    titleI18nKey: PropTypes.string.isRequired,
    titleDefaultText: PropTypes.string.isRequired,
    radioData: PropTypes.array,
    onPress: PropTypes.func,
    selected: PropTypes.string
}

RadioModal.defaultProps = {
    isVisible: false,
    height: 210,
    radioData: [],
    selected: null
}

export default RadioModal;