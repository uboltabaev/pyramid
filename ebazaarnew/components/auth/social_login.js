import React, { useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import CssHelper from '../../helpers/css_helper';
import MiscHelper from '../../helpers/misc_helper';
//import AuthHelper, { AUTH_SUCCESS, AUTH_CANCEL } from '../../helpers/auth_helper';
import UserProfileHelper from '../../firebase/helpers/user_profile';
import { observer, inject } from 'mobx-react';
import _ from 'underscore';
import FacebookIcon from '../icons/social/facebook_icon';
import GoogleIcon from '../icons/social/google_icon';

const SocialLogin = inject('mobxStore')(observer(({ mobxStore, navigation, onBlockPage, onUnBlockPage, onCancel }) => {
    let timer = null, timer2 = null

    useEffect(() => {
        return () => {
            clearTimeout(timer)
            clearTimeout(timer2)    
        }
    }, [])

    const onError = () => {
        MiscHelper.alertError()
        onUnBlockPage()
    }

    const _onBlockPage = () => {
        if (_.isFunction(onBlockPage))
            onBlockPage()
    }

    const _onUnBlockPage = () => {
        if (_.isFunction(onUnBlockPage))
            onUnBlockPage()
    }

    const storeAndRedirect = () => {
        UserProfileHelper.getUserProfile().then((data) => {
            _onUnBlockPage()
            mobxStore.userStore.setIsSignedIn(true)
            mobxStore.userStore.setValues(data)

            // Redirect user to My Profile page
            navigation.navigate('MyProfile')
        }, (error) => {
            onError()
        })
    }

    const facebookLogin = () => {
        timer = setTimeout(() => {
            _onBlockPage()
            /*AuthHelper.facebookLogin().then(({type, token, expires, permissions, declinedPermissions}) => {
                if (type === 'success') {
                    AuthHelper.firebaseFacebookAuth(token).then(({firebaseAuth}) => {
                        // If Firebase auth is success, redirect user
                        if (firebaseAuth === AUTH_SUCCESS)
                            storeAndRedirect()
                    }, (error) => {
                        onError()
                    });
                }
            }, ({error}) => {
                onUnBlockPage()
            })*/
        }, 200)
    }

    const googleLogin = () => {
        _onBlockPage()
        timer = setTimeout(() => {
            /*AuthHelper.googleLogin().then((res) => {
                const { type } = res
                if (type === AUTH_SUCCESS) {
                    const {accessToken, idToken} = res
                    AuthHelper.firebaseGoogleAuth(accessToken, idToken).then(({firebaseAuth}) => {
                        // If Firebase auth is success, redirect user
                        if (firebaseAuth === AUTH_SUCCESS)
                            storeAndRedirect()
                    }, (error) => {
                        onError()
                    })
                } else if (type === AUTH_CANCEL) {
                    if (_.isFunction(onCancel))
                        onCancel()
                }
            }, (error) => {
                onError()
            })*/
        }, 300)
    }

    return (
        <View style={styles.iconContainer}>
            <View style={[CssHelper['flexRowCentered'], {justifyContent: 'center'}]}>
                <TouchableOpacity onPress={facebookLogin} style={styles.social} activeOpacity={0.5}>
                    <FacebookIcon width={44} height={44}/>
                </TouchableOpacity>
                <View style={styles.divider}/>
                <TouchableOpacity onPress={googleLogin} style={styles.social} activeOpacity={0.5}>
                    <GoogleIcon width={44} height={44}/>
                </TouchableOpacity>
            </View>
        </View>
    )
}))

const styles = StyleSheet.create({
    iconContainer: {
        height: 45,
        marginHorizontal: 30
    },
    divider: {
        width: 25
    }
});

SocialLogin.propTypes = {
    onBlockPage: PropTypes.func,
    onUnBlockPage: PropTypes.func,
    onCancel: PropTypes.func
};

export default SocialLogin;