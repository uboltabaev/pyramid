import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import PropTypes from 'prop-types';
import CssHelper from '../../helpers/css_helper';

export const THEME_DARK_COUNTDOWN = 'dark';
export const THEME_LIGHT_COUNTDOWN = 'light';

const startEv = (countDownDate) => {
    const now = new Date().getTime(),
        distance = countDownDate - now;
    let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds = Math.floor((distance % (1000 * 60)) / 1000);
    if (hours < 10)
        hours = `0${hours}`;            
    if (minutes < 10)
        minutes = `0${minutes}`;
    if (seconds < 10)
        seconds = `0${seconds}`;
    return {
        hours,
        minutes,
        seconds
    }
}

function Countdown({start, theme, style}) {
    const [data, setData] = useState({
        hours: '00',
        minutes: '00',
        seconds: '00'
    });

    useEffect(() => {
        const date = new Date();
        date.setDate(date.getDate() + 1);
        const countDownDate = date;
        let interval = null;

        if (start) {
            interval = setInterval(() => {
                const calculated = startEv(countDownDate);
                setData(calculated);
            }, 1000);
        }

        return () => {
            clearInterval(interval);
        }
    }, [start])

    return (
        <View style={[styles.container, style]}>
            <View style={[styles.timeBox, theme === THEME_DARK_COUNTDOWN ? styles.timeBoxDark : styles.timeBoxLight]}>
                <View style={CssHelper['flexSingleCentered']}>
                    <Text style={styles.timeText}>
                        {data.hours}
                    </Text>
                </View>
            </View>
            <View style={styles.timeDivider}>
                <View style={CssHelper['flexSingleCentered']}>
                    <Text style={styles.timeDividerText}>:</Text>
                </View>
            </View>
            <View style={[styles.timeBox, theme === THEME_DARK_COUNTDOWN ? styles.timeBoxDark : styles.timeBoxLight]}>
                <View style={CssHelper['flexSingleCentered']}>
                    <Text style={styles.timeText}>
                        {data.minutes}
                    </Text>
                </View>
            </View>
            <View style={styles.timeDivider}>
                <View style={CssHelper['flexSingleCentered']}>
                    <Text style={styles.timeDividerText}>:</Text>
                </View>
            </View>
            <View style={[styles.timeBox, theme === THEME_DARK_COUNTDOWN ? styles.timeBoxDark : styles.timeBoxLight]}>
                <View style={CssHelper['flexSingleCentered']}>
                    <Text style={styles.timeText}>
                        {data.seconds}
                    </Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row'
    },
    timeBox: {
        width: 16,
        height: 16,
        borderRadius: 2
    },
    timeBoxDark: {
        backgroundColor: '#333',
    },
    timeBoxLight: {
        backgroundColor: 'transparent',
    },
    timeText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 10,
        fontWeight: 'bold'
    },
    timeDivider: {
        width: 5,
        height: 16
    },
    timeDividerText: {
        color: '#333',
        textAlign: 'center',
        fontSize: 10,
        fontWeight: 'bold'
    }
});

Countdown.propTypes = {
    style: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array
    ]),
    theme: PropTypes.string,
    start: PropTypes.bool
}

Countdown.defaultProps = {
    theme: THEME_LIGHT_COUNTDOWN,
    start: true
}

export default Countdown;