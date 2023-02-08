import React, { useState } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import PropTypes from 'prop-types';
import CssHelper from '../../helpers/css_helper';

const DECREASE_VALUE = 10;

function ScrollViewI({children, style}) {
    const [wholeWidth, setWholeWidth] = useState(1);
    const [visibleWidth, setVisibleWidth] = useState(0);
    const [indicator] = useState(new Animated.Value(0));
    const indicatorSize = wholeWidth > visibleWidth ? visibleWidth * visibleWidth / wholeWidth : visibleWidth;
    const difference = visibleWidth > indicatorSize ? visibleWidth - indicatorSize : 1;
    const translateX = Animated.multiply(indicator, visibleWidth / wholeWidth).interpolate({
        inputRange: [0, difference],
        outputRange: [0, difference],
        extrapolate: 'clamp'
    });

    const onContentSizeChange = (width) => {
        setWholeWidth(width);
    }

    const onLayout = (e) => {
        const { width } = e.nativeEvent.layout;
        setVisibleWidth(width);
    }

    return (
        <View style={[styles.container, style]}>
            <Animated.ScrollView horizontal
                showsHorizontalScrollIndicator={false}
                canCancelContentTouches={true}
                onContentSizeChange={onContentSizeChange}
                onLayout={onLayout}
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{nativeEvent: { contentOffset: { x: indicator }}}],
                    {useNativeDriver: true}
                )}
            >
                {children}
            </Animated.ScrollView>
            <View style={styles.indicatorContainer}>
                <View style={CssHelper['flexSingleCentered']}>
                    <View style={styles.indicatorRails}>
                        <Animated.View style={[
                            styles.indicator,
                            {
                                width: indicatorSize / DECREASE_VALUE,
                                transform: [{
                                    translateX: Animated.divide(translateX, DECREASE_VALUE).interpolate({
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
    );
}

const styles = StyleSheet.create({
    container: {
        width: 'auto'
    },
    indicatorContainer: {
        marginTop: 5,
        marginBottom: 12
    },
    indicatorRails: {
        width: '10%',
        backgroundColor: '#d8d8d8',
        borderRadius: 2,
        height: 3
    },
    indicator: {
        backgroundColor: '#000',
        borderRadius: 2,
        height: 3
    }
});

ScrollViewI.propTypes = {
    children: PropTypes.node.isRequired,
    style: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object
    ]),
    languaga: PropTypes.string
}

export default React.memo(ScrollViewI);