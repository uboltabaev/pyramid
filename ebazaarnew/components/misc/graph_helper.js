import React from 'react';
import { StyleSheet, View } from 'react-native';
import _ from 'underscore';
import CssHelper from "../../helpers/css_helper";

const CutLineArea = React.memo(({width, height, colors}) => {
    const itemWidth = width / 3;
    return (
        <View style={[CssHelper['flexRowCentered'], {height}]}>
            { colors.map((c, i) => (
                <View key={i} style={{width: itemWidth, height, backgroundColor: c}}></View>
            ))}
        </View>
    );
})

export const CutLine = React.memo(({containerHeight = 100, width = 3, height = 2}) => {
        times = (containerHeight - 8) / (height * 2),
        transparentColors = ['rgba(0, 0, 0, 0.10)', 'rgba(0, 0, 0, 0.10)', 'rgba(0, 0, 0, 0.03)'],
        whiteColors = ['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.5)', 'rgba(255, 255, 255, 0.2)'];
    return (
        <View style={[styles.cutLine, {width, height: containerHeight - 10}]}>
            { _.times(parseInt(times), (n) => {
                return (
                    <View key={n} style={CssHelper['flex']}>
                        <CutLineArea width={width} height={height} colors={transparentColors}/>
                        <CutLineArea width={width} height={height} colors={whiteColors}/>
                    </View>
                );
            })}
        </View>
    );
})

export const CircleLine = React.memo(({containerHeight = 100, position = "L", circleRadius = 9, numberOfCircles = 9}) => {
    let containerStyle = {
        width: circleRadius
    };
    position === 'L' && (containerStyle.left = 0);
    position === 'R' && (containerStyle.right = -(circleRadius/2));
    let circleStyle = {};
    position === 'L' && (circleStyle.left = -(circleRadius/2));
    position === 'R' && (circleStyle.right = -(circleRadius/2));
    let top = 0;
    return (
        <View style={[styles.circleLine, containerStyle, {height: containerHeight}]}>
            { _.times(numberOfCircles, (n) => {
                top += n > 0 ? (circleRadius / 5) + circleRadius : (circleRadius / 4);
                return (
                    <View key={n} style={{position: 'absolute', top}}>
                        <View style={[styles.circleContainer, {width: (circleRadius/2), height: circleRadius}]}>
                            <View style={[styles.circle, circleStyle, {width: circleRadius, height: circleRadius, borderRadius: (circleRadius)}]}/>
                        </View>
                    </View>
                );
            })}
        </View>
    );
})

const styles = StyleSheet.create({
    cutLine: {
        position: 'absolute',
        top: 5,
        left: -1,
    },
    circleLine: {
        position: 'absolute',
        top: 0
    },
    circleContainer: {
        backgroundColor: 'transparent', 
        overflow: 'hidden', 
        position: 'absolute',
    },
    circle: {
        backgroundColor: '#fff',
        position: 'absolute',
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    }
});

export default CircleLine;