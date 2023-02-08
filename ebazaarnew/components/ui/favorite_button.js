import React, { useReducer } from 'react';
import { StyleSheet, View, Text, Animated, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { Surface, Shape, Path, Group } from '@react-native-community/art';
import _ from 'underscore';
import { APP_MAIN_COLOR } from "../../constants/app";

const HEART_SVG = 'M130.4-0.8c25.4 0 46 20.6 46 46.1 0 13.1-5.5 24.9-14.2 33.3L88 153.6 12.5 77.3c-7.9-8.3-12.8-19.6-12.8-31.9 0-25.5 20.6-46.1 46-46.2 19.1 0 35.5 11.7 42.4 28.4C94.9 11 111.3-0.8 130.4-0.8';
const HEART_COLOR = APP_MAIN_COLOR;
const GRAY_HEART_COLOR = "rgb(102,102,102)";

const FILL_COLORS = [
    'rgba(221,70,136,1)',
    'rgba(212,106,191,1)',
    'rgba(204,142,245,1)',
    'rgba(204,142,245,1)',
    'rgba(204,142,245,1)',
    'rgba(0,0,0,0)'
];

const PARTICLE_COLORS = [
    'rgb(158, 202, 250)',
    'rgb(161, 235, 206)',
    'rgb(208, 148, 246)',
    'rgb(244, 141, 166)',
    'rgb(234, 171, 104)',
    'rgb(170, 163, 186)'
];

const AnimatedShape = Animated.createAnimatedComponent(Shape);

const AnimatedCircle = React.memo((props) => {
    const { radius } = props;
    const path = Path().moveTo(0, -radius)
        .arc(0, radius * 2, radius)
        .arc(0, radius * -2, radius)
        .close();
    
    return (
        <AnimatedShape d={path} {...props}/>
    )
})

const FavoriteButton = React.memo(({ scale, style, onPress }) => {
    const [state, setState] = useReducer(
        (state, newState) => ({...state, ...newState}),
        {
            animation: new Animated.Value(0),
            liked: false
        }
    )

    const { animation, liked } = state;

    const getXYParticle = (total, i, radius) => {
        const angle = ( (2*Math.PI) / total ) * i;
        const x = Math.round((radius*2) * Math.cos(angle - (Math.PI/2)));
        const y = Math.round((radius*2) * Math.sin(angle - (Math.PI/2)));
        return {
            x: x,
            y: y
        }
    }

    const getRandomInt = (min, max) => {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;        
    }

    const explode = () => {
        Animated.timing(animation, {
            duration: 1500,
            toValue: 28,
            useNativeDriver: false
        }).start(() => {
            setState({
                liked: true
            });
        })
        setTimeout(() => {
            if (_.isFunction(onPress))
                onPress(true);
        }, 1100);
    }

    const _onPress = () => {
        if (liked) {
            setState({
                liked: false,
                animation: new Animated.Value(0)
            })
            if (_.isFunction(onPress))
                onPress(false);
        } else {
            explode()
        }
    }

    const getSmallExplosions = (radius, offset) => {
        return [0,1,2,3,4,5,6].map((v, i, t) => {
            const scaleOut = animation.interpolate({
                inputRange: [0, 5.99, 6, 13.99, 14, 21],
                outputRange: [0, 0, getScale(1), getScale(1), getScale(1), 0],
                extrapolate: 'clamp'
            });
            const moveUp = animation.interpolate({
                inputRange: [0, 5.99, 14],
                outputRange: [0, 0, getScale(-15)],
                extrapolate: 'clamp'
            });
            const moveDown = animation.interpolate({
                inputRange: [0, 5.99, 14],
                outputRange: [0, 0, getScale(15)],
                extrapolate: 'clamp'
            });
            const color_top_particle = animation.interpolate({
                inputRange: [6, 8, 10, 12, 17, 21],
                outputRange: shuffleArray(PARTICLE_COLORS)
            });
            const color_bottom_particle = animation.interpolate({
                inputRange: [6, 8, 10, 12, 17, 21],
                outputRange: shuffleArray(PARTICLE_COLORS)
            })
            const position = getXYParticle(7, i, radius);
            return (
                <Group 
                    key={i}
                    x={position.x + offset.x } 
                    y={position.y + offset.y} 
                    rotation={getRandomInt(0, 40) * i}
                >
                    <AnimatedCircle 
                        x={moveUp}
                        y={moveUp}
                        radius={15} 
                        scale={scaleOut} 
                        fill={color_top_particle} 
                    />
                    <AnimatedCircle 
                        x={moveDown}
                        y={moveDown}
                        radius={8} 
                        scale={scaleOut} 
                        fill={color_bottom_particle} 
                    />
                </Group>
              )
        })
    }

    const getScale = (value) => {
        return (value * scale);
    }

    const heartScale = animation.interpolate({
        inputRange: [0, .01, 6, 10, 12, 18, 28],
        outputRange: [getScale(1), 0, getScale(.1), getScale(1), getScale(1.2), getScale(1), getScale(1)],
        extrapolate: 'clamp'
    })

    const heartFill = animation.interpolate({
        inputRange: [0, 2],
        outputRange: [liked ? HEART_COLOR : GRAY_HEART_COLOR, HEART_COLOR],
        extrapolate: 'clamp'
    })

    const heartX = heartScale.interpolate({
        inputRange: [0, 1],
        outputRange: [90, 0],
    })

    const heartY = heartScale.interpolate({
        inputRange: [0, 1],
        outputRange: [75, 0],
    })

    const circleScale = animation.interpolate({
        inputRange: [0, 1, 4],
        outputRange: [0, .3, 1],
        extrapolate: 'clamp'
    })

    const circleFillColors = animation.interpolate({
        inputRange: [1, 2, 3, 4, 4.99, 5],
        outputRange: FILL_COLORS,
        extrapolate: 'clamp'
    })

    const circleOpacity = animation.interpolate({
        inputRange: [1,9.99, 10],
        outputRange: [1, 1, 0],
        extrapolate: 'clamp'
    })

    const circleStrokeWidth = animation.interpolate({
        inputRange: [0, 5.99, 6, 7, 10],
        outputRange: [0, 0, getScale(15), getScale(8), 0],
        extrapolate: 'clamp'
    })

    return (
        <View {...style}>
            <TouchableOpacity activeOpacity={1} onPress={_onPress} style={{flex: 1}}>
                <Surface width={getScale(360)} height={getScale(360)}>
                    <Group x={-67} y={-52}>
                        <AnimatedShape 
                            d={HEART_SVG} 
                            x={heartX} 
                            y={heartY} 
                            scale={heartScale} 
                            fill={heartFill}
                        />
                    </Group>
                    <Group x={getScale(80)} y={getScale(110)}>
                        <AnimatedCircle 
                            x={getScale(90)} 
                            y={getScale(75)}
                            radius={getScale(150)}
                            scale={circleScale}
                            strokeWidth={circleStrokeWidth}
                            fill={circleFillColors}
                            opacity={circleOpacity}
                        />
                        {getSmallExplosions(getScale(75), {x: getScale(90), y: getScale(75)})}
                    </Group>
                </Surface>
            </TouchableOpacity>
            <View>
                <Text style={styles.text}>9999+</Text>
            </View>
        </View>
    )
})

const styles = StyleSheet.create({
    text: {
        color: '#999999',
        textAlign: 'center',
        marginTop: -10,
        fontSize: 12
    }
});

FavoriteButton.propTypes = {
    scale: PropTypes.number,
    style: PropTypes.object,
    onPress: PropTypes.func
}

FavoriteButton.defaultProps = {
    scale: 1
}

export default FavoriteButton;