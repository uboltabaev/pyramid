import React, { useReducer, useEffect, useRef, useImperativeHandle } from 'react';
import { StyleSheet, View, TouchableOpacity, Platform } from 'react-native';
import PropTypes from 'prop-types';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as ScreenOrientation from 'expo-screen-orientation';
import * as ImageManipulator from 'expo-image-manipulator';
import _ from 'underscore';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CONFIG from '../../config/config';
import { APP_MAIN_COLOR } from "../../constants/app";
import CssHelper from '../../helpers/css_helper';
import Pictures, { PICTURE_TYPE_TOKEN, PICTURE_TYPE_ATTACHED } from '../camera-ui/pictures';
import CheckIcon from '../icons/check_icon';
import GalleryIcon from '../icons/gallery_icon';
import MiscHelper from '../../helpers/misc_helper';
import Ripple from '../ui/ripple';

export const CAMERA_MODE = Object.freeze({
    DEFAULT: 'default',
    AVATAR: 'avatar'
});

const DESIRED_RATIO = "16:9";

const CameraUI = React.forwardRef(({ mode, attachedPictures, allowedImagesNum, switchGallery, submit }, ref) => {
    const [state, setState] = useReducer(
        (state, newState) => ({...state, ...newState}),
        {
            isProcessing: false,
            hasPermission: null,
            type: Camera.Constants.Type.back,
            flashMode: Camera.Constants.FlashMode.off,
            ratio: null,
            tokenPictures: []
        }
    )
    
    const { isProcessing, hasPermission, type, flashMode, ratio, tokenPictures } = state;
    const camera = useRef(null);

    useEffect(() => {
        async function initialize() {
            const { status } = await Camera.requestPermissionsAsync();
            setState({
                hasPermission: status === 'granted'
            })
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT)    
        }
        initialize()
        return () => {
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
        }
    }, [])

    const pausePreview = () => {
        camera.current.pausePreview();
    }

    const prepareRatio = async () => {
        if (Platform.OS === 'android' && camera) {
            const ratios = await camera.current.getSupportedRatiosAsync();
            const hasDesiredRatio = _.contains(ratios, DESIRED_RATIO);
            if (hasDesiredRatio) {
                setState({
                    ratio: DESIRED_RATIO
                })
            }
        }
    }
    
    const takePicture = async () => {
        if (camera && isAvailable()) {
            
            // Disable action if process is not ended
            setState({
                isProcessing: true
            })

            let picture = await new Promise(async resolve => {
                await camera.current.takePictureAsync({
                    quality: 0, 
                    base64: false, 
                    skipProcessing: true, 
                    onPictureSaved : resolve
                })
                camera.current.pausePreview()
            })

            if (_.isObject(picture)) {
                // If camera type is front, flip an image
                if (type === Camera.Constants.Type.front) {
                    let flippedPicture = await ImageManipulator.manipulateAsync(
                        picture.uri,
                        [{ flip: ImageManipulator.FlipType.Horizontal }],
                        { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
                    );
                    picture = flippedPicture;
                }
                camera.current.resumePreview();

                // Create asset
                let asset = await MediaLibrary.createAssetAsync(picture.uri);
                // Save image into Album
                let album = await MediaLibrary.getAlbumAsync(CONFIG.APP_NAME);
                if (_.isNull(album)) {
                    let albumCreated = await MediaLibrary.createAlbumAsync(CONFIG.APP_NAME, asset, false);
                    if (albumCreated) {
                        asset = await getAssetFromAlbum(albumCreated);
                    }
                } else {
                    let assetAdded = await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
                    if (assetAdded)
                        asset = await getAssetFromAlbum(album);
                }

                // Save image into state
                asset.id = MiscHelper.getUUID();
                asset.type = PICTURE_TYPE_TOKEN;
                if (mode === CAMERA_MODE.DEFAULT) {
                    tokenPictures.push(asset);
                } else if (mode === CAMERA_MODE.AVATAR) {
                    tokenPictures = [asset];
                }

                setState({
                    tokenPictures,
                    isProcessing: false
                })
            } else {
                camera.current.resumePreview();
            }
        }
    }

    const getAssetFromAlbum = async (album) => {
        const assetResult = await MediaLibrary.getAssetsAsync({
            first: 1,
            album: album,
            sortBy: MediaLibrary.SortBy.modificationTime,
        });
        const asset = await assetResult.assets[0];
        return asset;
    }

    const isAvailable = () => {
        return !isProcessing;
    }

    const deletePicture = (newPictures) => {
        if (!isAvailable())
            return null;
        setState({
            tokenPictures: newPictures
        })
    }

    const flipCamera = () => {
        if (!isAvailable())
            return null;
        setState({
            type: type === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back
        })
    }

    const changeFlash = () => {
        let v = flashMode
        switch(flashMode) {
            case Camera.Constants.FlashMode.off:
                v = Camera.Constants.FlashMode.torch;
                break;
            case Camera.Constants.FlashMode.torch:
                v = Camera.Constants.FlashMode.auto;
                break;
            case Camera.Constants.FlashMode.auto:
                v = Camera.Constants.FlashMode.off;
                break;
        }
        setState({
            flashMode: v
        })
    }

    const ok = () => {
        if (!isAvailable())
            return null;
        if (_.isFunction(submit)) {
            let response = mode === CAMERA_MODE.AVATAR ? null : [];
            if (mode === CAMERA_MODE.DEFAULT) {
                _.each(tokenPictures, (n) => {
                    n.type = PICTURE_TYPE_ATTACHED;
                    return n;
                });
                response = _.union(attachedPictures, tokenPictures);    
            } else if (mode === CAMERA_MODE.AVATAR) {
                if (tokenPictures.length > 0)
                    response = tokenPictures[0];
            }
            submit(response);
        }
    }

    const goGallery = () => {
        if (!isAvailable())
            return null;
        if (_.isFunction(switchGallery))
            switchGallery();
    }

    useImperativeHandle(ref, () => ({
        isAvailable() {
            return !isProcessing;
        }
    }))

    const allImages = _.union(attachedPictures, tokenPictures),
        isSubmitAvailable = allImages.length < allowedImagesNum ? true : false;

    return (
        <View style={[CssHelper['flex'], styles.container]}>
            <Camera style={[CssHelper['flex']]} 
                ratio={ratio} 
                type={type} 
                flashMode={flashMode} 
                autoFocus={Camera.Constants.AutoFocus.on} 
                ref={camera} 
                onCameraReady={prepareRatio}
            >
                <View style={styles.top}>
                    <View style={CssHelper['flexRowCentered']}>
                        <View style={type === Camera.Constants.Type.front ? styles.hidden : {}}>
                            <TouchableOpacity activeOpacity={1} style={[styles.flash, CssHelper['standartLink']]} onPress={changeFlash}>
                                {((f) => {
                                    switch(f) {
                                        case Camera.Constants.FlashMode.off:
                                            return (
                                                <MaterialIcons name="flash-off" size={24} color="#fff"/>
                                            );
                                        case Camera.Constants.FlashMode.torch:
                                            return (
                                                <MaterialIcons name="flash-on" size={24} color="#fff"/>
                                            );
                                        case Camera.Constants.FlashMode.auto:
                                            return (
                                                <MaterialIcons name="flash-auto" size={24} color="#fff"/>
                                            );    
                                    }
                                })(flashMode)}
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={CssHelper['standartLink']} activeOpacity={1} onPress={flipCamera}>
                            <Ionicons name="camera-reverse" size={24} color="#fff"/>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.bottom}>
                    <Pictures picturesNum={allowedImagesNum}
                        pictures={tokenPictures} 
                        attachedPictures={attachedPictures} 
                        onDelete={deletePicture}
                    />
                    <View style={[styles.actions, CssHelper['flexRowCentered']]}>
                        <Ripple style={[styles.ac]} onPress={goGallery}>
                            <View style={CssHelper['flexSingleCentered']}>
                                <GalleryIcon width={24} height={24} color="#fff"/>
                            </View>
                        </Ripple>
                        <View style={styles.cameraContainer}>
                            <TouchableOpacity disabled={!isSubmitAvailable} 
                                style={[styles.cameraInner, !isSubmitAvailable && (styles.cameraDisabled)]} 
                                activeOpacity={0.9} 
                                onPress={takePicture}
                            >
                                <Ionicons name="md-camera" size={28} color="#fff"/>
                            </TouchableOpacity>
                        </View>
                        <Ripple style={[styles.ac]} onPress={ok}>
                            <View style={CssHelper['flexSingleCentered']}>
                                <CheckIcon width={20} height={20} color="#fff"/>
                            </View>
                        </Ripple>
                    </View>
                </View>
            </Camera>
        </View>
    )
})

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    top: {
        position: 'absolute',
        top: 10,
        right: 0,
        paddingHorizontal: 20,
    },
    flash: {
        marginRight: 30
    },
    hidden: {
        position: 'absolute', 
        top: -100
    },
    bottom: {
        position: 'absolute',
        bottom: 0,
        width: '100%'
    },
    actions: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        height: 70
    },
    ac: {
        paddingLeft: 25,
        paddingRight: 25,
        height: '100%',
    },
    cameraContainer: {
        backgroundColor: "#000",
        borderRadius: 4,
        marginVertical: 15
    },
    cameraInner: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: APP_MAIN_COLOR,
        paddingVertical: 5,
        paddingHorizontal: 30,
        borderRadius: 4
    },
    cameraDisabled: {
        backgroundColor: '#999999'
    }
});

CameraUI.propTypes = {
    allowedImagesNum: PropTypes.number,
    attachedPictures: PropTypes.array,
    submit: PropTypes.func,
    switchGallery: PropTypes.func,
    onRef: PropTypes.func,
    mode: PropTypes.string
}

CameraUI.defaultProps = {
    allowedImagesNum: 5,
    attachedPictures: [],
    mode: CAMERA_MODE.DEFAULT
}

export default CameraUI;