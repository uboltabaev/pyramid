import React, { useState, useReducer, useEffect, useImperativeHandle } from 'react';
import { StyleSheet, View, Text, Animated, Image } from 'react-native';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import { Surface } from 'react-native-paper';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import CssHelper from '../../helpers/css_helper';
import UserIcon from '../icons/user2_icon';

export const USER_AVATAR_MODE = Object.freeze({
    DEFAULT: 'default',
    UPLOAD: 'upload'
});

export const USER_AVATAR_SIZE = Object.freeze({
    SMALL: 'small',
    BIG: 'big'
});

function Avatar({isSignedIn, profileImage, profileImageBase64, isBlocked, progress, size, elevation}) {
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        if (profileImage) {
            Image.prefetch(profileImage).then(() => {
                setIsLoaded(true)
            });
        }
    }, [])

    return (
        <Surface style={[styles.cardStyle, size === USER_AVATAR_SIZE.SMALL && (styles.cardStyleSmall), {elevation}]}>
            <View style={[styles.inner, size === USER_AVATAR_SIZE.SMALL && (styles.innerSmall)]}>
                { (isSignedIn && profileImage !== null) ? (
                    <View style={[styles.inner, size === USER_AVATAR_SIZE.SMALL && (styles.innerSmall)]}>
                        <Animated.Image source={{uri: profileImage}} 
                            style={[CssHelper['image'], styles.profileImage, size === USER_AVATAR_SIZE.SMALL && (styles.profileImageSmall)]} 
                            fadeDuration={0}
                        />
                        { !isLoaded &&
                            <Animated.Image source={{uri: 'data:image/png;base64,' + profileImageBase64}} 
                                style={[CssHelper['image'], styles.profileImage, size === USER_AVATAR_SIZE.SMALL && (styles.profileImageSmall)]} 
                                fadeDuration={0} 
                                blurRadius={3}
                            />
                        }
                    </View>
                ) : (
                    <UserIcon width={size === USER_AVATAR_SIZE.SMALL ? 38 : 54} 
                        height={size === USER_AVATAR_SIZE.SMALL ? 38 : 54} 
                        color="#f7f7f7"
                    />
                )}
                { isBlocked &&
                    <View style={styles.blocked}>
                        <View style={CssHelper['flexSingleCentered']}> 
                            <Text style={styles.blockedText} style={styles.blockedText}>
                                {progress}%
                            </Text>
                        </View>
                    </View>
                }
            </View>
        </Surface>
    )
}

Avatar.propTypes = {
    isSignedIn: PropTypes.bool,
    profileImage: PropTypes.string,
    isBlocked: PropTypes.bool,
    progress: PropTypes.number,
    size: PropTypes.string,
    elevation: PropTypes.number
}

Avatar.defaultProps = {
    isBlocked: false,
    progress: 0,
    elevation: 1
}

const UserAvatar = inject('mobxStore')(observer(React.forwardRef((props, ref) => {
    const { mode, size, elevation } = props
    const [state, setState] = useReducer(
        (state, newState) => ({...state, ...newState}),
        {
            uploadStarted: false,
            progress: -1,
            duration: 600,
            count: 0
        }
    )
    
    const { uploadStarted, progress, duration, count } = state
    const { isSignedIn, profileImage, profileImageBase64 } = props.mobxStore.userStore

    let timeout = null, timeout2 = null

    useEffect(() => {
        if (duration === 0) {
            timeout2 = setTimeout(() => {
                setState({
                    duration: 600
                })
            }, 500);
        }
    }, [duration])

    useEffect(() => {
        setState({
            count: (count + 1)
        })
    }, [profileImage])

    useEffect(() => {
        return () => {
            clearTimeout(timeout);
            clearTimeout(timeout2);    
        }
    }, [])

    useImperativeHandle(ref, () => ({ 
        changeProgress(progress) {
            setState({
                progress
            })
        },
        startUpload() {
            setState({
                progress: 0,
                uploadStarted: true
            })
        },
        completeUpload() {
            setState({
                duration: 0,
                progress: 0,
                uploadStarted: false
            })
        }
    }))

    return (
        ((m) => {
            switch(m) {
                case USER_AVATAR_MODE.DEFAULT:
                    return (
                        <Avatar isSignedIn={isSignedIn} 
                            profileImage={profileImage} 
                            size={size}
                            profileImageBase64={profileImageBase64}
                            elevation={elevation}
                        />
                    );
                case USER_AVATAR_MODE.UPLOAD:
                    return (
                        <AnimatedCircularProgress
                            size={60}
                            width={4}
                            fill={progress}
                            duration={duration}
                            rotation={0}
                            tintColor={'#5b9bd5'}
                            backgroundColor={progress > 0 ? "#e7e6e6" : 'rgba(255, 255, 255, 0)'}
                        >
                            { (fill) => (
                                <Avatar isSignedIn={isSignedIn} 
                                    profileImage={profileImage} 
                                    isBlocked={uploadStarted ? true : false} 
                                    progress={progress}
                                    profileImageBase64={profileImageBase64}
                                    elevation={elevation}
                                />
                            )}
                        </AnimatedCircularProgress>
                    );
                    break;
            }
        })(mode)
    )
})))

const styles = StyleSheet.create({
    cardStyle: {
        height: 56,
        width: 56,
        borderRadius: 28,
        padding: 0.5,
        paddingBottom: 0,
        marginTop: 0.5
    },
    cardStyleSmall: {
        width: 40,
        height: 40,
        borderRadius: 20,
        padding: 0,
        margin: 0
    },
    inner: {
        borderRadius: 28,
        height: 56, 
        width: 56,
        backgroundColor: '#ebebeb',
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    innerSmall: {
        borderRadius: 20,
        height: 40, 
        width: 40
    },
    profileImage: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: 28
    },
    profileImageSmall: {
        borderRadius: 20
    },
    blocked: {
        position: 'absolute', 
        width: 56, 
        height: 56, 
        backgroundColor: 'rgba(91, 155, 213, .5)'
    },
    blockedText: {
        color: '#fff', 
        fontSize: 12, 
        lineHeight: 14
    }
});

UserAvatar.propTypes = {
    mode: PropTypes.string,
    size: PropTypes.string,
    elevation: PropTypes.number,
    onRef: PropTypes.func
}

UserAvatar.defaultProps = {
    mode: USER_AVATAR_MODE.DEFAULT,
    size: USER_AVATAR_SIZE.BIG,
    elevation: 1
}

export default UserAvatar;