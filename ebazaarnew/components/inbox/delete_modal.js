import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import Ripple from 'react-native-material-ripple';
import Modal from "react-native-modal";
import _ from 'underscore';
import i18n from 'i18n-js';
import CssHelper from '../../helpers/css_helper';

const DeleteModal = React.memo(({ isModalVisible, closeModal, deleteHandle }) => {
    const _closeModal = () => {
        if (_.isFunction(closeModal))
            closeModal()
    }

    const _delete = () => {
        if (_.isFunction(deleteHandle))
            deleteHandle()
    }

    return (
        <Modal statusBarTranslucent isVisible={isModalVisible} useNativeDriver={true} animationIn="fadeIn" animationOut="fadeOut" backdropOpacity={0.6} onBackdropPress={_closeModal} transparent={true}>
            <View style={[CssHelper['flexSingleCentered']]}>
                <View style={CssHelper['modalMenuContainer']}>
                    <Ripple rippleCentered={false} rippleSequential={true} rippleFades={false} rippleOpacity={0.15} rippleDuration={200} onPress={_delete}>
                        <View style={CssHelper['modalMenuButton']}>
                            <Text style={CssHelper['modalMenuButtonText']}>
                                {i18n.t('action:delete', {defaultValue: 'Удалить'})}
                            </Text>
                        </View>
                    </Ripple>
                </View>
            </View>
        </Modal>
    )
})

DeleteModal.propTypes = {
    isModalVisible: PropTypes.bool,
    closeModal: PropTypes.func,
    deleteHandle: PropTypes.func
}

DeleteModal.defaultProps = {
    isModalVisible: false
}

export default DeleteModal;