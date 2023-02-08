import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import _ from 'underscore';
import Storage from '../../firebase/storage';
import ImagePlaceholder from './image_placeholder';

const ImageStorage = React.memo(({ imageStyle, storageUri, resizeMode, brightness }) => {
    const [placeHolder, setPlaceHolder] = useState(true);

    const publicUri = Storage.makeStoragePublicUrl(storageUri);

    useEffect(() => {
        if (publicUri) {
            Image.prefetch(publicUri).then(() => {
                setPlaceHolder(false)
            })
        }
    }, [])

    const onLoad = () => {
        setPlaceHolder(false)
    }

    return (
        <View style={styles.container}>
            <ImagePlaceholder display={placeHolder}>
                <Image source={{uri: publicUri}} 
                    style={[styles.image, imageStyle]} 
                    resizeMode={resizeMode}
                    onLoad={onLoad}
                    fadeDuration={50}
                />
                { (brightness && !placeHolder) &&
                    <View style={styles.brightness}/>
                }
            </ImagePlaceholder>
        </View>
    )
})

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%'
    },
    image: {
        width: '100%',
        height: '100%'
    },
    brightness: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, .02)',
        borderRadius: 5
    }
});

ImageStorage.propTypes = {
    imageStyle: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object
    ]),
    storageUri: PropTypes.string,
    resizeMode: PropTypes.string,
    brightness: PropTypes.bool
}

ImageStorage.defaultProps = {
    resizeMode: FastImage.resizeMode.contain,
    brightness: false
}

export default ImageStorage;