import React, { useState, useEffect, useCallback } from 'react';
import { TouchableWithoutFeedback, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import posed from 'react-native-pose';
import _ from 'underscore';
import CssHelper from '../../helpers/css_helper';

const Highlight = posed.View({
    highlight: { 
        opacity: 1,
        transition: { 
            opacity: {duration: 100},
        },
     },
     unhighlight: { 
        opacity: 0,
        transition: { 
            opacity: {duration: 300},
         }
    }
});

const styles = StyleSheet.create({
    highlight: {
        flex: 1,
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    }
});

function TouchableHighlight({ bgColor, style, onPress, children }) {
    const [status, setStatus] = useState(false)

    let timeOut = null

    useEffect(() => {
        return () => {
            clearTimeout(timeOut)
        }
    }, [])

    useEffect(() => {
        if (status) {
            timeOut = setTimeout(() => {
                onPress();
            }, 100);
        }
    }, [status])

    const _onPressOut = useCallback(() => {
        setStatus(false)
    }, [status])

    const _onPress = useCallback(() => {
        if (_.isFunction(onPress)) {
            setStatus(true)
        }
    }, [status])
    
    return (
        <TouchableWithoutFeedback onPress={_onPress} onPressOut={_onPressOut} delayPressOut={200}>
            <View style={[CssHelper['flex'], style]}>
                {children}
                <Highlight style={[styles.highlight, {backgroundColor: bgColor}]} pose={status ? "highlight" : "unhighlight"}/>
            </View>
        </TouchableWithoutFeedback>
    )
}

TouchableHighlight.propTypes = {
    bgColor: PropTypes.string,
    style: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array
    ]),
    onPress: PropTypes.func
}

TouchableHighlight.defaultProps = {
    bgColor: 'rgba(0, 0, 0, 0.10)'
}

export default TouchableHighlight;