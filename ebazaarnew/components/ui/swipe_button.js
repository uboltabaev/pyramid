import React, { useReducer, useEffect, useImperativeHandle, useRef } from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import i18n from 'i18n-js';
import _ from 'underscore';
import Feather from 'react-native-vector-icons/Feather';
import { APP_MAIN_COLOR } from '../../constants/app'; 
import MySwipeButton, { SWIPE_BUTTON_STATUS_DEFAULT, SWIPE_BUTTON_STATUS_LOADING } from './swipe-button/swipe_button';

export const STATUS_DEFAULT = 'default';
export const STATUS_PROCESSING = 'processing';

const chevronIcon = () => (
    <Feather name="chevrons-right" size={28} color="#dbdbdb"/>
);

const activeIndicator = () => (
    <ActivityIndicator size="small" color={APP_MAIN_COLOR}/>
);

const SwipeButton = React.forwardRef((props, ref) => {
    const [state, setState] = useReducer(
        (state, newState) => ({...state, ...newState}),
        {
            status: STATUS_DEFAULT,
            swipeStatus: SWIPE_BUTTON_STATUS_DEFAULT,
            disabled: false
        }
    )
    
    const { status, swipeStatus, disabled } = state
    const swipeButton = useRef(null)

    useEffect(() => {
        setState({
            status: props.status, 
            disabled: props.disabled
        })
    }, [props.status, props.disabled])

    const onSwipeSuccess = () => {
        if (_.isFunction(props.onSwipeSuccess))
            props.onSwipeSuccess()
    }

    useImperativeHandle(ref, () => ({ 
        startLoading() {
            setState({
                status: STATUS_PROCESSING,
                disabled: true,
                swipeStatus: SWIPE_BUTTON_STATUS_LOADING
            })
        }, 
        reset() {
            setState({
                status: STATUS_DEFAULT, 
                disabled: false,
                swipeStatus: SWIPE_BUTTON_STATUS_DEFAULT
            })
            swipeButton.current.reset()
        } 
    }))

    return (
        <MySwipeButton containerStyles={styles.containerStyles}
            disabled={disabled}
            height={44}
            railBackgroundColor="#ddd"
            railBorderColor="#d9d9d9"
            railFillBackgroundColor="#78c430"
            railFillBorderColor="#78c430"
            title={i18n.t('swipe_right', {defaultValue: 'Проведите вправо'})}
            titleColor="#aaa"
            titleStyles={{lineHeight:18}}
            titleFontSize={16}
            loadingTitle={i18n.t('loading', {defaultValue: 'Загрузка...'})}
            loadingColor='#fff'
            loadingFontSize={14}
            loadingStyles={{lineHeight:18}}
            thumbIconComponent={status === STATUS_PROCESSING ? activeIndicator : chevronIcon}
            thumbIconBackgroundColor="#FFFFFF"
            thumbIconBorderColor="#FFFFFF"
            disabledThumbIconBackgroundColor="#FFFFFF"
            disabledThumbIconBorderColor="#FFFFFF"
            onSwipeSuccess={onSwipeSuccess}
            ref={swipeButton}
            status={swipeStatus}
        />
    )
})

const styles = StyleSheet.create({
    containerStyles: {
        backgroundColor: '#dddddd',
        shadowRadius: 5, 
        shadowOpacity: 0.5, 
        shadowOffset:{ width: 0, height: 5 },
        elevation: 5
    }
});

SwipeButton.propTypes = {
    onSwipeSuccess: PropTypes.func
}

export default SwipeButton;