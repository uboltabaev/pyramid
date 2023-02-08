import React from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import CssHelper from '../../helpers/css_helper';

const ImagePlaceholder = React.memo(({ display, size, children }) => {
    return (
        <View style={styles.container}>
            <View style={styles.box}>
                { display &&
                    <View style={CssHelper['flexSingleCentered']}>
                        <View style={{width: size, height: size}}>
                            <FastImage source={require('../../../assets/images/grey-logo-smaller.png')} 
                                resizeMode={FastImage.resizeMode.contain} 
                                style={[CssHelper['image']]} 
                            />
                        </View>
                    </View>
                }
            </View>
            { !display &&
                children
            }
        </View>
    )
})

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    box: {
        position: 'absolute',
        width: '100%',
        height: '100%'
    },
    boxInner: {
        width: '50%',
        height: '50%',
    }
});

ImagePlaceholder.propTypes = {
    display: PropTypes.bool,
    size: PropTypes.string
}

ImagePlaceholder.defaultProps = {
    display: true,
    size: '50%'
}

export default ImagePlaceholder;