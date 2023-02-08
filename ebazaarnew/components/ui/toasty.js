import React, { useReducer, useEffect, useImperativeHandle } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback } from 'react-native';
import PropTypes from 'prop-types';
import posed from 'react-native-pose';
import _ from 'underscore';
import {SCREEN_WIDTH, SCREEN_HEIGHT, STATUS_BAR_HEIGHT} from '../../constants/app';

export const MODE_AUTOHIDE = 'autoHide';
export const MODE_STICKY = 'sticky';

const PADDING = 15;

const STATES = {
    IS_READY: 'IS_READY',
    CALCULATED: 'CALCULATED',
    HIDDEN: 'HIDDEN'
};

export const Position = Object.freeze({
    TOP: "TOP",
    BOTTOM: "BOTTOM"
});

const PositionStyle = Object.freeze({
    TOP: {
        top: -1000
    },
    TOP_ZERO: {
        top: 0
    },
    BOTTOM: {
        bottom: -1000
    },
    BOTTOM_ZERO: {
        bottom: 0
    }
});

const Toast = posed.View({
    open: {
        y: 0,
        transition: {
            y: {duration: 300},
        }, 
        delay: ({ xDelay }) => xDelay
    },
    closed: {
        y: ({ xHeight, xPosition }) => xPosition === Position.TOP ? -(xHeight) : +(xHeight + 2),
        transition: {
            y: {duration: 300}
        }
    }
});

const Overlay = posed.View({
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

const Toasty = React.forwardRef((props, ref) => {
    const { children, position, mode, duration, opacity, backgroundColor, style, onHide } = props;

    const [state, setState] = useReducer(
        (state, newState) => ({...state, ...newState}),
        {
            toastState: STATES.HIDDEN,
            isPoseOpened: false,
            isAvailable: true,
            toast: {
                left: 0,
                top: 0,
                width: 0,
                height: 0
            },
            positionStyle: PositionStyle[position]
        }
    )

    let timerA = null;
    let timerB = null;

    useEffect(() => {
        return () => {
            clearInterval(timerA);
            clearInterval(timerB);    
        }
    }, [])

    useEffect(() => {
        const { isPoseOpened } = state;
        if (isPoseOpened && mode === MODE_AUTOHIDE) {
            _autoHide();
        }
        if (!isPoseOpened) {
            _onHide();
            timerB = setTimeout(() => {
                setState({
                    isAvailable: true,
                    positionStyle: PositionStyle[position]
                })
            }, 500);
        }
    }, [state.isPoseOpened])

    useEffect(() => {
        const { toastState } = state;
        if (toastState === STATES.CALCULATED) {
            setState({
                toastState: STATES.IS_READY
            });        
        }
    }, [state.toastState])

    const _onHide = () => {
        if (_.isFunction(onHide))
            onHide();
    }

    useImperativeHandle(ref, () => ({
        show() {
            const {isAvailable} = state;
            if (!isAvailable)
                return null;
            setState({
                isPoseOpened: true,
                isAvailable: false,
                positionStyle: PositionStyle[position + '_ZERO']
            });
        },
        hide() {
            setState({
                isPoseOpened: false
            });
        }
    }));

    const _hide = () => {
        setState({
            isPoseOpened: false
        });
    }

    const _autoHide = () => {
        timerA = setTimeout(() => {
            _hide();
        }, duration);
    }

    const _onMenuLayout = (event) => {
        const { width, height } = event.nativeEvent.layout;
        const { toastState, toast } = state;
        let top = 0;
        position === Position.TOP && (top = 0 - height);
        position === Position.BOTTOM && (top = SCREEN_HEIGHT);
        if (toastState === STATES.HIDDEN) {
            setState({
                toastState: STATES.CALCULATED,
                toast: {
                    ...toast, 
                    width, 
                    height,
                    top
                }
            });
        }
    }

    const _autoHideToast = () => {
        const propsStyle = {opacity, backgroundColor};
        const {toast, toastState, isPoseOpened, positionStyle} = state,
            extraStyle = position === Position.TOP ? {paddingTop: PADDING + STATUS_BAR_HEIGHT}: {};
        return (
            <View style={[styles.container, positionStyle]}>
                { (toastState === STATES.CALCULATED || toastState === STATES.IS_READY) &&
                    <Toast style={[styles.toastContainer, propsStyle, style, extraStyle]} pose={isPoseOpened ? "open" : "closed"} xPosition={position} xHeight={toast.height} xDelay={500}>
                        {children}
                    </Toast>
                }
                <View style={[styles.hiddenContainer, extraStyle]} {...({onLayout: (e) => {_onMenuLayout(e)}})}>
                    {children}
                </View>
            </View>
        );
    }

    const _stickyToast = () => {
        const {toast, toastState, isPoseOpened, positionStyle} = state;
        let propsStyle = {backgroundColor};
        position === Position.TOP && (propsStyle.top = 0);
        position === Position.BOTTOM && (propsStyle.bottom = 0);
        return (
            <TouchableWithoutFeedback onPress={_hide}>
                <Overlay style={[styles.container, positionStyle, styles.overlay]} pose={isPoseOpened ? "open" : "closed"}>
                    { (toastState === STATES.CALCULATED || toastState === STATES.IS_READY) &&
                        <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
                            <Toast style={[styles.stickyContainer, propsStyle, style]} pose={isPoseOpened ? "open" : "closed"} xPosition={position} xHeight={toast.height} xDelay={0}>
                                {children}
                            </Toast>
                        </TouchableWithoutFeedback>
                    }
                    <View style={[styles.hiddenContainer]} {...({onLayout: (e) => {_onMenuLayout(e)}})}>
                        {children}
                    </View>
                </Overlay>
            </TouchableWithoutFeedback>
        );
    }

    if (mode === MODE_STICKY)
        return _stickyToast();
    else
        return _autoHideToast();
})

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        zIndex: 9999,
        width: '100%'
    },
    toastContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        paddingHorizontal: PADDING,
        paddingVertical: PADDING 
    },
    hiddenContainer: {
        opacity: 0,
        paddingHorizontal: PADDING,
        paddingVertical: PADDING
    },
    overlay: {
        position: 'absolute',
        zIndex: 9999,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        backgroundColor: 'rgba(0, 0, 0, 0.7)'
    },
    stickyContainer: {
        position: 'absolute',
        width: '100%',
        paddingHorizontal: PADDING,
        paddingVertical: PADDING
    }
});

Toasty.propTypes = {
    children: PropTypes.node.isRequired,
    position: PropTypes.string,
    mode: PropTypes.string,
    duration: PropTypes.number,
    opacity: PropTypes.number,
    backgroundColor: PropTypes.string,
    style: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array
    ]),
    onHide: PropTypes.func
}

Toasty.defaultProps = {
    position: Position.BOTTOM,
    mode: MODE_AUTOHIDE,
    duration: 5000,
    opacity: 1,
    backgroundColor: '#000'
}

export default Toasty;