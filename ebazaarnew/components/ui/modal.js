import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import RNModal from "react-native-modal";
import _ from 'underscore';
import { STATUS_BAR_HEIGHT } from '../../constants/app';
import CssHelper from "../../helpers/css_helper";
import XIcon from "../icons/x2_icon";

export const ANIMATION_FADI_IN = 'fadeIn';
export const ANIMATION_FADI_OUT = 'fadeOut';

const Modal = React.memo(({ isVisible, closeModal, marginTop, title, children, animationIn, animationOut, backdropTransitionInTiming, backdropTransitionOutTiming, animationInTiming, animationOutTiming }) => {
    const _closeModal = () => {
        if (_.isFunction(closeModal))
            closeModal();
    }

    return (
        <RNModal useNativeDriver={true} 
            animationIn={animationIn} 
            animationOut={animationOut} 
            backdropTransitionInTiming={backdropTransitionInTiming} 
            backdropTransitionOutTiming={backdropTransitionOutTiming} 
            animationInTiming={animationInTiming}
            animationOutTiming={animationOutTiming}
            isVisible={isVisible}
            style={{margin: 0, marginTop}}
        >
            <View style={[CssHelper['modal']]}>
                <View style={styles.header}>
                    <TouchableOpacity activeOpacity={1} onPress={_closeModal} style={CssHelper['modalX']}>
                        <XIcon width={15} height={15}/>
                    </TouchableOpacity>
                    <Text style={styles.text}>
                        {title}
                    </Text>
                </View>
                <View style={styles.content}>
                    {children}
                </View>
            </View>
        </RNModal>
    )
})

const styles = StyleSheet.create({
    text: {
        textAlign: "center",
        fontWeight: 'bold',
        fontSize: 18
    },
    header: {
        marginTop: 15
    },
    content: {
        padding: 15,
        flex: 1
    },
    statusBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: "#000",
        height: STATUS_BAR_HEIGHT,
        borderWidth: 1,
        borderColor: 'red'
    }
});

Modal.propTypes = {
    isVisible: PropTypes.bool,
    marginTop: PropTypes.number,
    title: PropTypes.string,
    closeModal: PropTypes.func,
    animationIn: PropTypes.string,
    animationOut: PropTypes.string,
    backdropTransitionInTiming: PropTypes.number,
    backdropTransitionOutTiming: PropTypes.number,
    animationInTiming: PropTypes.number,
    animationOutTiming: PropTypes.number
}

Modal.defaultProps = {
    isVisible: false,
    marginTop: 0,
    title: "",
    animationIn: "slideInUp",
    animationOut: "slideOutDown",
    backdropTransitionInTiming: 600,
    backdropTransitionOutTiming: 500,
    animationInTiming: 300,
    animationOutTiming: 300
}

export default Modal;