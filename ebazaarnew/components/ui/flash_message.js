import React, { useReducer, useEffect, useImperativeHandle } from 'react';
import { StyleSheet, Text, Keyboard } from 'react-native';
import PropTypes from 'prop-types';
import { useSelector } from "react-redux";
import posed from 'react-native-pose';
import _ from 'underscore';
import {SCREEN_WIDTH, SCREEN_HEIGHT, TEXT_SHADOW} from '../../constants/app';

export const Position = Object.freeze({
    CENTER: "CENTER",
    TOP: "TOP",
    BOTTOM: "BOTTOM"
});

const STATES = {
    IS_READY: 'IS_READY',
    CALCULATED: 'CALCULATED',
    HIDDEN: 'HIDDEN',
    SHOWN: 'SHOWN'
};

const Flash = posed.View({
    open: {
        opacity: 1,
        transition: {
            opacity: {duration: 300}
        }
    },
    closed: {
        opacity: 0,
        transition: {
            opacity: {duration: 300}
        }
    }
});

const FlashMessage = React.forwardRef((props, ref) => {
    const { position, duration, backgroundColor, bottom, containerWidth } = props;
    const flashMessage = useSelector(state => state.main.flashMessage);

    const [state, setState] = useReducer(
        (state, newState) => ({...state, ...newState}),
        {
            position, 
            flashState: STATES.HIDDEN,
            flashLeft: 0,
            flashTop: 0,
            flashWidth: 0,
            flashHeight: 0,
            isPoseOpened: false,
            text: '',
            isKeyboardShown: false,
            keyboardHeight: 0
        }
    )

    const { flashState, flashLeft, flashTop, flashHeight, flashWidth, isPoseOpened, text, isKeyboardShown, keyboardHeight } = state;
    
    let timerA = null;
    let timerB = null;
    
    useEffect(() => {
        const { action, text } = flashMessage
        if (action === 'display') {
            if (!_.isNull(text)) {
                setState({
                    position: flashMessage.position
                })
                show(text)
            }    
        } else if (action === 'hide') {
            hide()
        }
    }, [flashMessage])

    useEffect(() => {
        Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
        Keyboard.addListener('keyboardDidHide', _keyboardDidHide);

        return() => {
            clearInterval(timerA);
            clearInterval(timerB);
    
            Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
            Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);
        }
    }, [])

    useEffect(() => {
        const windowWidth = containerWidth > 0 ? containerWidth : SCREEN_WIDTH,
            left = (windowWidth / 2) - (flashWidth / 2);
        setState({
            flashLeft: left
        })
    }, [containerWidth])

    useEffect(() => {
        switch (flashState) {
            case STATES.SHOWN:
                _hide()
                break;
            case STATES.CALCULATED:
                setState({
                    flashState: STATES.IS_READY,
                    isPoseOpened: true
                });
                break;
        }
    }, [flashState]);

    useEffect(() => {
        if (!isPoseOpened) {
            timerB = setTimeout(() => {
                setState({
                    flashState: STATES.HIDDEN
                });
            }, 300);
        }
    }, [isPoseOpened])

    useEffect(() => {
        const top = isKeyboardShown ? _getTop(flashHeight, keyboardHeight) : _getTop(flashHeight, 1);
        setState({
            flashTop: top
        })    
    }, [isKeyboardShown])

    const show = (text) => {
        if (!isPoseOpened) {
            setState({
                flashState: STATES.SHOWN,
                text
            })
        }
    }

    const hide = () => {
        clearInterval(timerA);
        clearInterval(timerB);
        setState({
            isPoseOpened: false,
            flashState: STATES.SHOWN
        })
    }

    useImperativeHandle(ref, () => ({ show, hide }));

    const _getTop = (height, kHeight = 0) => {
        let top = 0, visibleHeight = SCREEN_HEIGHT;
        visibleHeight = kHeight === 0 ? SCREEN_HEIGHT - keyboardHeight : SCREEN_HEIGHT - kHeight;
        state.position === Position.CENTER && (top = (visibleHeight / 2) - (height / 2));
        state.position === Position.TOP && (top = (visibleHeight / 4) - (height / 2));
        state.position === Position.BOTTOM && (top = (visibleHeight / 8 * 7) - (height / 2));
        !_.isUndefined(bottom) && state.position === Position.BOTTOM && (top = visibleHeight - height - bottom);
        return top;
    }

    const _keyboardDidShow = (e) => {
        setState({
            isKeyboardShown: true, 
            keyboardHeight: e.endCoordinates.height
        })
    }
    
    const _keyboardDidHide = (e) => {
        setState({
            isKeyboardShown: false, 
            keyboardHeight: 0
        })
    }

    const _hide = () => {
        timerA = setTimeout(() => {
            setState({
                isPoseOpened: false
            });
        }, duration);
    }

    const _onFlashLayout = (event) => {
        const { width, height } = event.nativeEvent.layout;
        const windowWidth = containerWidth > 0 ? containerWidth : SCREEN_WIDTH;
        let top = _getTop(height), left = (windowWidth / 2) - (width / 2);
        if (flashState === STATES.SHOWN) {
            setState({
                flashState: STATES.CALCULATED,
                flashLeft: left,
                flashTop: top,
                flashWidth: width,
                flashHeight: height
            });
        }
    }

    if (flashState !== STATES.HIDDEN) {
        return(
            <Flash style={[styles.flash, {backgroundColor}, {top: flashTop, left: flashLeft}, !flashState &&({top: -10000})]} pose={isPoseOpened ? "open" : "closed"} {...({onLayout: (e) => {_onFlashLayout(e)}})}>
                <Text style={[styles.text, TEXT_SHADOW]}>
                    {text}
                </Text>
            </Flash>
        );    
    } else
        return null;
})

const styles = StyleSheet.create({
    flash: {
        position: 'absolute',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 25,
        zIndex: 9999999
    },
    text: {
        flex: 1,
        textAlign: 'center',
        color: '#fff',
        lineHeight: 16
    },
    hiddenContainer: {
        opacity: 0
    }
});

FlashMessage.propTypes = {
    position: PropTypes.string,
    duration: PropTypes.number,
    backgroundColor: PropTypes.string,
    bottom: PropTypes.number,
    containerWidth: PropTypes.number
}

FlashMessage.defaultProps = {
    position: Position.BOTTOM,
    duration: 2000,
    backgroundColor: 'rgba(80, 80, 80, 0.9)',
    containerWidth: 0
}

export default FlashMessage;