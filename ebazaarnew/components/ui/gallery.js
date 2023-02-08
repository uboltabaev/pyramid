import React, { useReducer, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, ScrollView, ImageBackground, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import _ from 'underscore';
import * as MediaLibrary from 'expo-media-library';
import Ionicons from 'react-native-vector-icons/Ionicons';
import i18n from 'i18n-js';
import { Viewport } from '@skele/components';
import * as Animatable from 'react-native-animatable';
import { APP_MAIN_COLOR, SCREEN_WIDTH, TOAST_BG_COLOR } from "../../constants/app";
import CssHelper from '../../helpers/css_helper';
import Pictures, { MODE_PICTURES_GALLERY, PICTURE_TYPE_ATTACHED } from '../camera-ui/pictures';
import Avatar from '../camera-ui/avatar';
import CheckIcon from '../icons/check_icon';
import Checkbox, {STATUS_CHECKED, STATUS_UNCHECKED, CHECKBOX_MODE_SVG} from './checkbox';
import Toasty from './toasty';
import ImagePlaceholder from './image_placeholder';
import Ripple from '../ui/ripple';

export const GALLERY_MODE = Object.freeze({
    DEFAULT: 'default',
    AVATAR: 'avatar'
});

const ViewportAwareView = Viewport.Aware(View);
let VISIBLE_VIEWPORT_PICTURES = [];

const VAImage = React.memo(({ picture, selectPicture, index, styleProps, isSelected, isAttached }) => {
    const [state, setState] = useReducer(
        (state, newState) => ({...state, ...newState}),
        {
            displayPicture: false,
            delay: 0
        }
    )

    const { displayPicture, delay } = state
    const id = picture.id
    
    const _selectPicture = (item) => {
        if (_.isFunction(selectPicture))
            selectPicture(item);
    }

    const onEnter = () => {
        VISIBLE_VIEWPORT_PICTURES.push(id);
        const index = _.indexOf(VISIBLE_VIEWPORT_PICTURES, id);
        setState({
            displayPicture: true,
            delay: displayPicture ? 0 : (index * 60)
        });
    }

    const onLeave = () => {
        VISIBLE_VIEWPORT_PICTURES = _.without(VISIBLE_VIEWPORT_PICTURES, id)
        setState({
            displayPicture: false,
            delay: 0
        })
    }

    return (
        <ViewportAwareView style={[styles(styleProps).imageContainer, (index + 1) % 3 && ({marginRight: styleProps.MARGIN})]} 
            onViewportEnter={onEnter} 
            onViewportLeave={onLeave}
        >
            <ImagePlaceholder display={!displayPicture}>
                { displayPicture &&
                    <TouchableWithoutFeedback onPress={() => _selectPicture(picture)}>
                        <Animatable.View style={CssHelper['flex']}
                            animation="fadeIn"
                            duration={350}
                            delay={delay}
                            useNativeDrive
                        >
                            <ImageBackground source={{uri: picture.uri}} style={[styles(styleProps).image]} resizeMode="cover"/>
                        </Animatable.View>
                    </TouchableWithoutFeedback>
                }
                <View style={styles(styleProps).checkboxContainer}>
                    <Checkbox status={isSelected || isAttached ? STATUS_CHECKED : STATUS_UNCHECKED} mode={CHECKBOX_MODE_SVG} backgroundColor="transparent" borderColor="rgba(213,214,218,0.8)"/>
                </View>
            </ImagePlaceholder>
        </ViewportAwareView>
    )
})

const PIC_MARGIN = 15;
const PIC_PADDING_HOR = 15;
const MAX_PICTURES_NUM_ON_SCREEN = 5;

const Gallery = React.memo(({ mode, attachedPictures, submit, switchCamera, allowedImagesNum, picturesHorNum, picturesVerNum, margin, paddingHorizontal }) => {
    const [state, setState] = useReducer(
        (state, newState) => ({...state, ...newState}),
        {
            hasPermission: null,
            selectedPictures: [],
            galleryPictures: [],
            hasNextPage: true,
            page: 0,
            cursor: null
        }
    )

    const { hasPermission, selectedPictures, galleryPictures, hasNextPage, page, cursor } = state

    const toastyRef = useRef()
    
    const calculatedPicNum = allowedImagesNum < MAX_PICTURES_NUM_ON_SCREEN ? MAX_PICTURES_NUM_ON_SCREEN : allowedImagesNum
    const picHeight = (SCREEN_WIDTH - (PIC_PADDING_HOR * 2) - ((calculatedPicNum - 1) * PIC_MARGIN)) / calculatedPicNum
    const pictureSize = (SCREEN_WIDTH - (paddingHorizontal * 2) - ((picturesHorNum - 1) * margin)) / picturesHorNum
    const picturesNumPerPage = picturesHorNum * picturesVerNum
    
    useEffect(() => {
        async function initialize() {
            const { status } = await MediaLibrary.requestPermissionsAsync()
            setState({
                hasPermission: status === 'granted'
            })        
            pickupPictures();    
        }

        initialize()
    }, [])

    const pickupPictures = async () => {
        if (hasNextPage) {
            const result = await MediaLibrary.getAssetsAsync({
                first: picturesNumPerPage,
                sortBy: [[MediaLibrary.SortBy.modificationTime, false]],
                after: cursor
            });
            if (_.isObject(result)) {
                const pics = _.isArray(result.assets) ? _.union(galleryPictures, result.assets) : galleryPictures
                setState({
                    galleryPictures: pics,
                    hasNextPage: result.hasNextPage,
                    cursor: result.endCursor,
                    page: (page + 1)
                })
            }
        }
    }

    const isAvailable = () => {
        const allPictures = _.union(attachedPictures, selectedPictures);
        return allPictures.length < allowedImagesNum;
    }

    const selectPicture = (item) => {
        if (isAttached(item.id)) 
            return
        const addSelected = () => {
            let s = selectedPictures;
            if (isSelected(item.id)) {
                s = _.reject(selectedPictures, {id: item.id});
            } else {
                if (mode === GALLERY_MODE.AVATAR)
                    s = [];
                s.push(item);
            }
            setState({
                selectedPictures: s
            })
        }
        switch (mode) {
            case GALLERY_MODE.DEFAULT:
                if (isAvailable() || isSelected(item.id))
                    addSelected();
                else
                    toastyRef.current.show();
                break;
            case GALLERY_MODE.AVATAR:
                addSelected();
                break;                
        }
    }

    const isSelected = (id) => {
        return _.find(selectedPictures, {id})
    }

    const isAttached = (id) => {
        return _.find(attachedPictures, {id})
    }

    const deletePicture = (newPictures) => {
        setState({
            selectedPictures: newPictures
        })
    }

    const ok = () => {
        if (_.isFunction(submit)) {
            let response = mode === GALLERY_MODE.AVATAR ? null : [];
            if (mode === GALLERY_MODE.DEFAULT) {
                _.each(selectedPictures, (n) => {
                    n.type = PICTURE_TYPE_ATTACHED;
                    return n;
                });
                response = _.union(attachedPictures, selectedPictures);    
            } else if (mode === GALLERY_MODE.AVATAR) {
                if (selectedPictures.length > 0)
                    response = selectedPictures[0];
            }
            submit(response);
        }
    }

    const goCamera = () => {
        if (_.isFunction(switchCamera))
            switchCamera();
    }

    const onScroll = (event) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
        if ((layoutMeasurement.height + contentOffset.y) >= (contentSize.height - pictureSize)) {
            const containerContentHeight = page * ((pictureSize + margin) * picturesVerNum);
            if (contentSize.height > (containerContentHeight - pictureSize))
                pickupPictures()
        }
    }

    const styleProps = {
        IMAGE_SIZE: pictureSize, 
        PADDING_HOR: paddingHorizontal,
        MARGIN: margin,
        MODE: mode,
        PIC_HEIGHT: picHeight
    }

    return (
        <View style={styles(styleProps).container}>
            <Viewport.Tracker>
                <ScrollView style={CssHelper['flex']} 
                    scrollEventThrottle={16} 
                    removeClippedSubviews={true} 
                    onScroll={onScroll}
                >
                    <View style={styles(styleProps).galleryPictures}>
                        { galleryPictures.map((picture, index) =>
                            <VAImage key={index} 
                                picture={picture} 
                                index={index} 
                                styleProps={styleProps} 
                                selectPicture={selectPicture} 
                                isSelected={isSelected(picture.id)}
                                isAttached={isAttached(picture.id)}
                            />
                        )}
                        { hasNextPage && cursor !== null &&
                            <View style={styles(styleProps).loadingIndicator}>
                                <View style={CssHelper['flexSingleCentered']}>
                                    <ActivityIndicator size="large" color={APP_MAIN_COLOR}/>
                                </View>
                            </View>
                        }
                    </View>
                </ScrollView>
            </Viewport.Tracker>
            <View style={styles(styleProps).bottom}>
                { mode === GALLERY_MODE.DEFAULT &&
                    <View style={styles(styleProps).picContainer}>
                        <Pictures pictures={selectedPictures} 
                            attachedPictures={attachedPictures} 
                            onDelete={deletePicture} 
                            mode={MODE_PICTURES_GALLERY} 
                            picturesNum={allowedImagesNum} 
                            margin={PIC_MARGIN} 
                            paddingHorizontal={PIC_PADDING_HOR}
                        />
                    </View>
                }
                <View style={[CssHelper['flexRowCentered'], styles(styleProps).actions]}>
                    <Ripple style={[styles(styleProps).ac]} onPress={goCamera}>
                        <View style={CssHelper['flexSingleCentered']}>
                            <Ionicons name="md-camera" size={24} color="#4b4b4b"/>
                        </View>
                    </Ripple>
                    <Ripple style={[styles(styleProps).ac]} onPress={ok}>
                        <View style={CssHelper['flexSingleCentered']}>
                            <CheckIcon width={18} height={18} color="#888b92"/>
                        </View>
                    </Ripple>
                </View>
            </View>
            { mode === GALLERY_MODE.AVATAR &&
                <View style={styles(styleProps).avatarContainer}>
                    <View style={CssHelper['flexSingleCentered']}>
                        <View style={styles(styleProps).avatarContainerInner}>
                            <Avatar picture={selectedPictures.length > 0 ? selectedPictures[0] : null} onDelete={deletePicture}/>
                        </View>
                    </View>
                </View>
            }
            <Toasty backgroundColor={TOAST_BG_COLOR} duration={3000} ref={toastyRef}>
                <Text style={styles(styleProps).errorText}>
                    {i18n.t("choose_up", {defaultValue: 'Выберите до 5 фотографий'})}
                </Text>
            </Toasty>
        </View>
    )
})

const styles = (props) => StyleSheet.create({
    container: {
        flex: 1
    },
    bottom: {
        height: props.MODE === GALLERY_MODE.DEFAULT ? 50 + (props.PIC_HEIGHT + (PIC_MARGIN * 2)) : 50
    },
    picContainer: {
        height: (props.PIC_HEIGHT + (PIC_MARGIN * 2))
    },
    avatarContainer: {
        position: 'absolute',
        width: '100%',
        bottom: 0
    },
    avatarContainerInner: {
        height: (props.PIC_HEIGHT + 20),
        width: (props.PIC_HEIGHT + 20)
    },
    actions: {
        height: 50,
        backgroundColor: '#fbfbfb',
        borderTopWidth: 1,
        borderTopColor: '#dddddd'
    },
    ac: {
        paddingLeft: 20,
        paddingRight: 20,
        height: '100%'
    },
    galleryPictures: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: props.PADDING_HOR,
    },
    imageContainer: {
        width: props.IMAGE_SIZE, 
        height: props.IMAGE_SIZE,
        marginTop: props.MARGIN,
        backgroundColor: '#fff'
    },
    image: {
        width: '100%',
        height: '100%'
    },
    checkboxContainer: {
        position: 'absolute',
        top: 5,
        right: 5
    },
    errorText: {
        color: '#fff'
    },
    loadingIndicator: {
        height: 60,
        width: '100%'
    }
});

Gallery.propTypes = {
    attachedPictures: PropTypes.array,
    submit: PropTypes.func,
    switchCamera: PropTypes.func,
    allowedImagesNum: PropTypes.number,
    picturesHorNum: PropTypes.number,
    picturesVerNum: PropTypes.number,
    margin: PropTypes.number,
    paddingHorizontal: PropTypes.number,
    mode: PropTypes.string
}

Gallery.defaultProps = {
    attachedPictures: [],
    allowedImagesNum: 5,
    picturesHorNum: 3,
    picturesVerNum: 7,
    margin: 4,
    paddingHorizontal: 5,
    mode: GALLERY_MODE.DEFAULT
}

export default Gallery;