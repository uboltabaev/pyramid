import React, { useMemo, useReducer, useEffect, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import { Animated, Image, PanResponder, TouchableNativeFeedback, View, } from 'react-native';
import _ from 'underscore';
import styles, { borderWidth, margin } from './styles';
import { TRANSPARENT_COLOR } from './constants';

const SwipeThumb = React.forwardRef((props, ref) => {
    const { 
        disabled, 
        disabledThumbIconBackgroundColor,
        disabledThumbIconBorderColor,
        iconSize,
        thumbIconBackgroundColor,
        thumbIconBorderColor,
        thumbIconComponent: ThumbIconComponent,
        thumbIconImageSource,
        thumbIconStyles,    
        enableRightToLeftSwipe, 
        swipeSuccessThreshold, 
        railFillBackgroundColor, 
        railFillBorderColor, 
        layoutWidth, 
        railStyles,
        screenReaderEnabled,
        title,
        resetAfterSuccessAnimDuration, 
        onSwipeStart, 
        onSwipeFail, 
        onSwipeSuccess, 
        shouldResetAfterSuccess
    } = props
    const [state, setState] = useReducer(
        (state, newState) => ({...state, ...newState}),
        {
            animatedWidth: new Animated.Value(0),
            backgroundColor: TRANSPARENT_COLOR,
            borderColor: TRANSPARENT_COLOR,
        }
    )

    const { animatedWidth, backgroundColor, borderColor } = state
    
    const { defaultContainerWidth, maxWidth } = useMemo(() => ({
        defaultContainerWidth: iconSize,
        maxWidth: layoutWidth - (borderWidth + 2 * margin),
    }))

    const panResponder = React.useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
            onPanResponderGrant: (evt, gestureState) => {},
            onPanResponderStart: (evt, gestureState) => {
                if (disabled) {
                    return
                }
                if (onSwipeStart) {
                    onSwipeStart()
                }        
            },
            onPanResponderMove: (evt, gestureState) => {
                if (disabled) {
                    return
                }
                const rtlMultiplier = enableRightToLeftSwipe ? -1 : 1;
                const newWidth = defaultContainerWidth + rtlMultiplier * gestureState.dx;
                if (newWidth < defaultContainerWidth) {
                    // Reached starting position
                    reset()
                } else if (newWidth > maxWidth) {
                    // Reached end position
                    setBackgroundColors()
                    animatedWidth.setValue(maxWidth)
                } else {
                    setBackgroundColors()
                    animatedWidth.setValue(newWidth)
                }        
            },
            onPanResponderTerminationRequest: (evt, gestureState) => true,
            onPanResponderRelease: (evt, gestureState) => {
                if (disabled) {
                    return
                }
                const rtlMultiplier = enableRightToLeftSwipe ? -1 : 1
                const newWidth = defaultContainerWidth + rtlMultiplier * gestureState.dx
                const successThresholdWidth = maxWidth * (swipeSuccessThreshold / 100)
                if (newWidth < successThresholdWidth) {
                    onSwipeNotMetSuccessThreshold()
                    return
                }
                onSwipeMetSuccessThreshold(newWidth)        
            },
            onPanResponderTerminate: (evt, gestureState) => {
            },
            onShouldBlockNativeResponder: (evt, gestureState) => {
              return true;
            }
        })        
    ).current

    useEffect(() => {
        reset()
    }, [])

    useImperativeHandle(ref, () => ({ 
        reset: reset
    }))

    const onSwipeNotMetSuccessThreshold = () => {
        Animated.timing(animatedWidth, {
            toValue: defaultContainerWidth,
            duration: 200,
            useNativeDriver: false
        }).start(() => {
            reset()
        })
        if (onSwipeFail) {
            onSwipeFail()
        }
    }

    const onSwipeMetSuccessThreshold = (newWidth) => {
        if (newWidth !== maxWidth) {
            finishRemainingSwipe()
            return
        }
        if (onSwipeSuccess) {
            onSwipeSuccess()
        }
        reset()
    }
    
    const setBackgroundColors = () => {
        // Set backgroundColor only if not already set
        if (backgroundColor === TRANSPARENT_COLOR) {
            setState({
                backgroundColor: railFillBackgroundColor,
                borderColor: railFillBorderColor,
            })
        }
    }
    
    const finishRemainingSwipe = () => {
        // Animate to final position
        Animated.timing(animatedWidth, {
            toValue: maxWidth,
            duration: 200,
            useNativeDriver: false
        }).start(() => {
            if (onSwipeSuccess) {
                onSwipeSuccess()
            }
  
            //Animate back to initial position
            if (shouldResetAfterSuccess) {
                Animated.timing(animatedWidth, {
                    toValue: defaultContainerWidth,
                    duration: resetAfterSuccessAnimDuration,
                    useNativeDriver: false
                }).start(() => reset())
            }
        });
    }

    const reset = () => {
        animatedWidth.setValue(defaultContainerWidth)
        if (backgroundColor !== TRANSPARENT_COLOR) {
            setState({
                backgroundColor: TRANSPARENT_COLOR,
                borderColor: TRANSPARENT_COLOR,
            })
        }
    }
    
    const renderThumbIcon = () => {
          const dynamicStyles = {
              ...thumbIconStyles,
              height: iconSize,
              width: iconSize,
              backgroundColor: disabled
                ? disabledThumbIconBackgroundColor
                : thumbIconBackgroundColor,
              borderColor: disabled
                ? disabledThumbIconBorderColor
                : thumbIconBorderColor,
              overflow: 'hidden',
        };
        return (
          <View style={[styles.icon, { ...dynamicStyles }]}>
              {!ThumbIconComponent && thumbIconImageSource && (
                  <Image resizeMethod="resize" source={thumbIconImageSource} />
              )}
              {ThumbIconComponent && (
                  <View>
                      <ThumbIconComponent />
                  </View>
              )}
              {!ThumbIconComponent && !thumbIconImageSource && (
                  <View style={styles.defaultThumbIcon} />
              )}
          </View>
        );
    }

    const panStyle = {
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        width: animatedWidth,
        ...railStyles,
        ...(enableRightToLeftSwipe ? styles.containerRTL : styles.container),
    }

    if (screenReaderEnabled) {
        return (
            <TouchableNativeFeedback
                accessibilityLabel={`${title}. ${
                  disabled ? 'Disabled' : 'Double-tap to activate'
                }`}
                disabled={disabled}
                onPress={onSwipeSuccess}
                accessible
            >
                <View style={[panStyle, { width: defaultContainerWidth }]}>
                    {renderThumbIcon()}
                </View>
            </TouchableNativeFeedback>
        );
    }

    return (
        <Animated.View style={[panStyle]} {...panResponder.panHandlers}>
            {renderThumbIcon()}
        </Animated.View>
    )
})

SwipeThumb.defaultProps = {
    disabled: false,
    layoutWidth: 0,
    resetAfterSuccessAnimDuration: 200,
    screenReaderEnabled: false,
    thumbIconStyles: {},
};

SwipeThumb.propTypes = {
    disabled: PropTypes.bool,
    disabledThumbIconBackgroundColor: PropTypes.string,
    disabledThumbIconBorderColor: PropTypes.string,
    enableRightToLeftSwipe: PropTypes.bool,
    iconSize: PropTypes.number,
    layoutWidth: PropTypes.number,
    onSwipeFail: PropTypes.func,
    onSwipeStart: PropTypes.func,
    onSwipeSuccess: PropTypes.func,
    railFillBackgroundColor: PropTypes.string,
    railFillBorderColor: PropTypes.string,
    railStyles: PropTypes.object,
    resetAfterSuccessAnimDuration: PropTypes.number,
    screenReaderEnabled: PropTypes.bool,
    shouldResetAfterSuccess: PropTypes.bool,
    swipeSuccessThreshold: PropTypes.number,
    thumbIconBackgroundColor: PropTypes.string,
    thumbIconBorderColor: PropTypes.string,
    thumbIconComponent: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.node,
        PropTypes.func,
    ]),
    thumbIconImageSource: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    thumbIconStyles: PropTypes.object,
    title: PropTypes.string,
};

export default SwipeThumb;