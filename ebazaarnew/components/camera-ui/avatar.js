import React from 'react';
import { StyleSheet, View, ImageBackground, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import _ from 'underscore';
import { APP_MAIN_COLOR, SCREEN_WIDTH } from "../../constants/app";
import CssHelper from '../../helpers/css_helper';
import MinusIcon from '../icons/minus_icon';

const DELETE_ICON_SIZE = 20;
const MAX_PICTURES_NUM_ON_SCREEN = 5;

const Avatar = React.memo(({ picture, margin, paddingHorizontal, onDelete }) => {
    const deletePicture = (n) => {
        if (_.isFunction(onDelete)) {
            onDelete([])
        }
    }

    const imageSize = (SCREEN_WIDTH - (paddingHorizontal * 2) - ((MAX_PICTURES_NUM_ON_SCREEN - 1) * margin)) / MAX_PICTURES_NUM_ON_SCREEN
    const styleProps = {
        IMAGE_SIZE: imageSize, 
        IMAGE_MARGIN: margin,
        IS_LOADED: _.isObject(picture)
    }

    return (
        <View style={[CssHelper['flexRowCentered'], styles(styleProps).gallery]}>
            <View style={styles(styleProps).galleryInn}/>
            <View style={[_.isObject(picture) ? styles(styleProps).imageContainer : styles(styleProps).imageEmptyContainer]}>
                { _.isObject(picture) &&
                    <View style={[CssHelper['flex'], styles(styleProps).imageInnerContainer]}>
                        <ImageBackground source={{uri: picture.uri}} style={styles(styleProps).image} resizeMode="cover"/>
                        <View style={styles(styleProps).delete}>
                            <TouchableOpacity style={[CssHelper['flex'], CssHelper['standartLink']]} activeOpacity={1} onPress={() => deletePicture(picture.id)}>
                                <View style={[styles(styleProps).deleteInner, CssHelper['flexSingleCentered']]}>
                                    <MinusIcon width={12} height={12} color="#fff"/>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
            </View>
        </View>
    )
})

const styles = (props) => StyleSheet.create({
    gallery: {
        justifyContent: 'center',
        width: (props.IMAGE_SIZE + (props.IMAGE_MARGIN * 2)),
        height: (props.IMAGE_SIZE + (props.IMAGE_MARGIN * 2)),
        paddingHorizontal: props.IMAGE_MARGIN,
        paddingRight: props.IS_LOADED ? 0 : props.IMAGE_MARGIN,
        borderWidth: 1,
        borderColor: '#ddd',
        borderBottomWidth: 0,
        backgroundColor: '#fbfbfb',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },
    galleryInn: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: (props.IMAGE_SIZE + (props.IMAGE_MARGIN * 2)),
        height: 50,
        backgroundColor: '#fbfbfb',
        marginLeft: -1,
        marginRight: -1
    },
    imageEmptyContainer: {
        width: props.IMAGE_SIZE,
        height: props.IMAGE_SIZE,
        borderWidth: 1,
        borderColor: '#979797',
        borderStyle: 'dashed',
        borderRadius: 5,
    },
    imageContainer: {
        width: props.IMAGE_SIZE + props.IMAGE_MARGIN,
        paddingVertical: props.IMAGE_MARGIN / 2
    },
    imageInnerContainer: {
        paddingTop: 0,
        paddingRight: props.IMAGE_MARGIN
    },
    image: {
        width: '100%',
        height: '100%',
    },
    delete: {
        backgroundColor: '#fff',
        width: DELETE_ICON_SIZE,
        height: DELETE_ICON_SIZE,
        borderRadius: (DELETE_ICON_SIZE / 2),
        position: 'absolute',
        top: 0,
        right: (props.IMAGE_MARGIN - (DELETE_ICON_SIZE / 2)),
        padding: 1
    },
    deleteInner: {
        flex: 1,
        backgroundColor: APP_MAIN_COLOR,
        borderRadius: ((DELETE_ICON_SIZE - 2) / 2)
    }
});

Avatar.propTypes = {
    picture: PropTypes.object,
    margin: PropTypes.number,
    paddingHorizontal: PropTypes.number,
    onDelete: PropTypes.func,
}

Avatar.defaultProps = {
    margin: 10,
    paddingHorizontal: 10
}

export default Avatar;