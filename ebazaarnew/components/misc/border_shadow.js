import React from 'react';
import { View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import PropTypes from 'prop-types';

export const POSITION_TOP = 'top';
export const POSITION_BOTTOM = 'bottom';

const BorderShadow = React.memo(({ position, color, border, style, children }) => {
    return (
        <View style={style}>
            {((p) => {
                switch(p) {
                    case POSITION_TOP:
                        return (
                            <View style={{flex: 1}}>
                                <View style={[styles[p], {top: -(border)}]}>
                                    <LinearGradient colors={['rgba(255, 255, 255, 0)', color]} style={{flex: 1, height: border}}/>
                                </View>
                                {children}
                            </View>
                        );
                    case POSITION_BOTTOM:
                        return (
                            <View style={{flex: 1}}>
                                {children}
                                <View style={[styles[p], {bottom: -(border)}]}>
                                    <LinearGradient colors={[color, 'rgba(255, 255, 255, 0)']} style={{flex: 1, height: border}}/>
                                </View>
                            </View>
                        );
                }
            })(position)}
        </View>
    )
})

const styles = StyleSheet.create({
    top: {
        position: 'absolute',
        width: '100%',
        zIndex: 999999
    },
    bottom: {
        position: 'absolute',
        width: '100%',
        zIndex: 999999
    }
});

BorderShadow.propTypes = {
    position: PropTypes.string,
    color: PropTypes.string, 
    border: PropTypes.number,
    style: PropTypes.object
}

BorderShadow.defaultProps = {
    position: POSITION_BOTTOM,
    color: 'rgba(0, 0, 0, 0.15)',
    border: 5
}

export default BorderShadow;