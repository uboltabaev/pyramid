import React, { useReducer } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import PropTypes from 'prop-types';
import _ from 'underscore';
import CssHelper from '../../helpers/css_helper';

const DECREASE_VALUE = 1;

const ScrollViewHorizontal = React.memo(({ children, style, scrollbarVisibility }) => {
    const [state, setState] = useReducer(
        (state, newState) => ({...state, ...newState}),
        {
            wholeHeight: 1,
            visibleHeight: 0,
            indicator: new Animated.Value(0)
        }
    )

    const { wholeHeight, visibleHeight, indicator } = state

    const onContentSizeChange = (width, height) => {
        setState({
            wholeHeight: height
        })
    }

    const onLayout = (e) => {
        const { height } = e.nativeEvent.layout
        setState({
            visibleHeight: height
        })
    }

    const indicatorSize = wholeHeight > visibleHeight ? visibleHeight * visibleHeight / wholeHeight : visibleHeight,
        difference = visibleHeight > indicatorSize ? visibleHeight - indicatorSize : 1,
        translateY = Animated.multiply(indicator, visibleHeight / wholeHeight).interpolate({
            inputRange: [0, difference],
            outputRange: [0, difference],
            extrapolate: 'clamp'
        })
    
    return (
        <View style={[CssHelper['flexRowCentered'], style]}>
            <Animated.ScrollView showsVerticalScrollIndicator={false}
                canCancelContentTouches={false}
                onContentSizeChange={onContentSizeChange}
                onLayout={onLayout}
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{nativeEvent: { contentOffset: { y: indicator }}}],
                    {useNativeDriver: true}
                )}
                style={CssHelper['flex']}
                removeClippedSubviews={true}
            >
                {children}
            </Animated.ScrollView>
            <View style={[styles.indicatorContainer, {opacity: scrollbarVisibility ? 1 : 0}]}>
                <View style={CssHelper['flexSingleCentered']}>
                    <View style={styles.indicatorRails}>
                        <Animated.View style={[
                            styles.indicator,
                            {
                                height: indicatorSize / DECREASE_VALUE,
                                transform: [{
                                    translateY: Animated.divide(translateY, DECREASE_VALUE).interpolate({
                                        inputRange: [0, difference],
                                        outputRange: [0, difference],
                                        extrapolate: 'clamp'
                                    })
                                }]
                            }
                        ]}/>
                    </View>
                </View>
            </View>
        </View>
    )
})

const styles = StyleSheet.create({
    container: {
        width: 'auto'
    },
    indicatorContainer: {
        marginRight: 5,
        height: '100%',
    },
    indicatorRails: {
        height: '100%',
        backgroundColor: '#b4b4b4',
        borderRadius: 2,
        width: 3
    },
    indicator: {
        backgroundColor: '#3a3e4a',
        borderRadius: 2,
        width: 3
    }
});

ScrollViewHorizontal.propTypes = {
    children: PropTypes.node.isRequired,
    style: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object
    ]),
    scrollbarVisibility: PropTypes.bool
}

export default ScrollViewHorizontal;