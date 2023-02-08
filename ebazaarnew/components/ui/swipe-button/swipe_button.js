import React, { useReducer, useEffect } from 'react';
import { StyleSheet, Text, View, AccessibilityInfo } from 'react-native';
import PropTypes from 'prop-types';
import SwipeThumb from './swipe_thumb';
import {
    DISABLED_RAIL_BACKGROUND_COLOR,
    DISABLED_THUMB_ICON_BACKGROUND_COLOR,
    DISABLED_THUMB_ICON_BORDER_COLOR,
    RAIL_BACKGROUND_COLOR,
    RAIL_BORDER_COLOR,
    RAIL_FILL_BACKGROUND_COLOR,
    RAIL_FILL_BORDER_COLOR,
    SWIPE_SUCCESS_THRESHOLD,
    THUMB_ICON_BACKGROUND_COLOR,
    THUMB_ICON_BORDER_COLOR,
    TITLE_COLOR,
    LOADING_COLOR
} from './constants';

export const SWIPE_BUTTON_STATUS_DEFAULT = 'default';
export const SWIPE_BUTTON_STATUS_LOADING = 'loading'

const SwipeButton = React.forwardRef((props, ref) => {
    const { 
        containerStyles,
        disabled,
        disabledRailBackgroundColor,
        disabledThumbIconBackgroundColor,
        disabledThumbIconBorderColor,
        enableRightToLeftSwipe,
        height,
        onSwipeFail,
        onSwipeStart,
        onSwipeSuccess,
        railBackgroundColor,
        railBorderColor,
        railFillBackgroundColor,
        railFillBorderColor,
        railStyles,
        resetAfterSuccessAnimDelay,
        resetAfterSuccessAnimDuration,
        shouldResetAfterSuccess,
        swipeSuccessThreshold,
        thumbIconBackgroundColor,
        thumbIconBorderColor,
        thumbIconComponent,
        thumbIconImageSource,
        thumbIconStyles,
        title,
        titleColor,
        titleFontSize,
        titleStyles,
        loadingTitle, 
        loadingColor,
        loadingFontSize,
        loadingStyles,
        width,
        status 
    } = props
    const [state, setState] = useReducer(
        (state, newState) => ({...state, ...newState}),
        {
            layoutWidth: 0,
            screenReaderEnabled: false,
            isUnmounting: false
        }
    )

    const { layoutWidth, screenReaderEnabled, isUnmounting } = state

    useEffect(() => {
        setState({
            isUnmounting: false
        })
        AccessibilityInfo.addEventListener(
            'change',
            handleScreenReaderToggled
        )
        AccessibilityInfo.isScreenReaderEnabled().then(isEnabled => {
            if (isUnmounting) {
                return;
            }
            setState({
                screenReaderEnabled: isEnabled
            })
        })

        return () => {
            setState({
                isUnmounting: true
            })
            AccessibilityInfo.removeEventListener(
                'change',
                handleScreenReaderToggled
            )        
        }
    }, [])

    const onLayoutContainer = (e) => {
        if (isUnmounting || layoutWidth) {
            return;
        }
        setState({
            layoutWidth: e.nativeEvent.layout.width,
        })
    }

    const handleScreenReaderToggled = (isEnabled) => {
        if (isUnmounting || screenReaderEnabled === isEnabled) {
            return
        }
        setState({
            screenReaderEnabled: isEnabled
        })
    }

    return (
        <View
            style={[
            styles.container,
            {
                ...containerStyles,
                backgroundColor: disabled
                ? disabledRailBackgroundColor
                : railBackgroundColor,
                borderColor: railBorderColor,
                ...(width ? { width } : {}),
            },
            ]}
            onLayout={onLayoutContainer}
        >
            <Text
                importantForAccessibility={
                    screenReaderEnabled ? 'no-hide-descendants' : ''
                }
                style={[
                    styles.title,
                    {
                    color: titleColor,
                    fontSize: titleFontSize,
                    ...titleStyles,
                    },
                ]}
            >
                {title}
            </Text>
            {layoutWidth > 0 && (
                <SwipeThumb disabled={disabled}
                    disabledThumbIconBackgroundColor={disabledThumbIconBackgroundColor}
                    disabledThumbIconBorderColor={disabledThumbIconBorderColor}
                    enableRightToLeftSwipe={enableRightToLeftSwipe}
                    iconSize={height}
                    layoutWidth={layoutWidth}
                    onSwipeFail={onSwipeFail}
                    onSwipeStart={onSwipeStart}
                    onSwipeSuccess={onSwipeSuccess}
                    railFillBackgroundColor={railFillBackgroundColor}
                    railFillBorderColor={railFillBorderColor}
                    railStyles={railStyles}
                    resetAfterSuccessAnimDelay={resetAfterSuccessAnimDelay}
                    resetAfterSuccessAnimDuration={resetAfterSuccessAnimDuration}
                    screenReaderEnabled={screenReaderEnabled}
                    shouldResetAfterSuccess={shouldResetAfterSuccess}
                    swipeSuccessThreshold={swipeSuccessThreshold}
                    thumbIconBackgroundColor={thumbIconBackgroundColor}
                    thumbIconBorderColor={thumbIconBorderColor}
                    thumbIconComponent={thumbIconComponent}
                    thumbIconImageSource={thumbIconImageSource}
                    thumbIconStyles={thumbIconStyles}
                    title={title}
                    ref={ref}
                />
            )}
            { status === SWIPE_BUTTON_STATUS_LOADING &&
                <Text
                    importantForAccessibility={
                        screenReaderEnabled ? 'no-hide-descendants' : ''
                    }
                    style={[
                        styles.title,
                        {
                        color: loadingColor,
                        fontSize: loadingFontSize,
                        ...loadingStyles,
                        },
                    ]}
                >
                    {loadingTitle}
                </Text>
            }
        </View>
    )
})

const styles = StyleSheet.create({
    container: {
        borderRadius: 100 / 2,
        borderWidth: 1,
        justifyContent: 'center',
        margin: 5,
    },
    title: {
        alignSelf: 'center',
        position: 'absolute',
    },
});

SwipeButton.propTypes = {
    containerStyles: {},
    disabled: false,
    disabledRailBackgroundColor: DISABLED_RAIL_BACKGROUND_COLOR,
    disabledThumbIconBackgroundColor: DISABLED_THUMB_ICON_BACKGROUND_COLOR,
    disabledThumbIconBorderColor: DISABLED_THUMB_ICON_BORDER_COLOR,
    height: 50,
    railBackgroundColor: RAIL_BACKGROUND_COLOR,
    railBorderColor: RAIL_BORDER_COLOR,
    railFillBackgroundColor: RAIL_FILL_BACKGROUND_COLOR,
    railFillBorderColor: RAIL_FILL_BORDER_COLOR,
    swipeSuccessThreshold: SWIPE_SUCCESS_THRESHOLD,
    thumbIconBackgroundColor: THUMB_ICON_BACKGROUND_COLOR,
    thumbIconBorderColor: THUMB_ICON_BORDER_COLOR,
    thumbIconStyles: {},
    title: 'Swipe to submit',
    titleColor: TITLE_COLOR,
    titleFontSize: 20,
    titleStyles: {},
    loadingTitle: 'Loading...',
    loadingColor: LOADING_COLOR,
    loadingFontSize: 20,
    loadingStyles: {},
    status: SWIPE_BUTTON_STATUS_DEFAULT
}

SwipeButton.propTypes = {
    containerStyles: PropTypes.object,
    disable: PropTypes.bool,
    disabledRailBackgroundColor: PropTypes.string,
    disabledThumbIconBackgroundColor: PropTypes.string,
    disabledThumbIconBorderColor: PropTypes.string,
    enableRightToLeftSwipe: PropTypes.bool,
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    onSwipeFail: PropTypes.func,
    onSwipeStart: PropTypes.func,
    onSwipeSuccess: PropTypes.func,
    railBackgroundColor: PropTypes.string,
    railBorderColor: PropTypes.string,
    railFillBackgroundColor: PropTypes.string,
    railFillBorderColor: PropTypes.string,
    railStyles: PropTypes.object,
    resetAfterSuccessAnimDelay: PropTypes.number,
    resetAfterSuccessAnimDuration: PropTypes.number,
    shouldResetAfterSuccess: PropTypes.bool,
    swipeSuccessThreshold: PropTypes.number, // Ex: 70. Swipping 70% will be considered as successful swipe
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
    titleColor: PropTypes.string,
    titleFontSize: PropTypes.number,
    titleStyles: PropTypes.object,
    loadingTitle: PropTypes.string,
    loadingColor: PropTypes.string,
    loadingFontSize: PropTypes.number,
    loadingStyles: PropTypes.object,
    status: PropTypes.string,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

export default SwipeButton;