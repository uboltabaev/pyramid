import Auth from '@react-native-firebase/auth';
//import * as Facebook from 'expo-facebook';
//import * as Google from 'expo-google-app-auth';
import i18n from 'i18n-js';
import _ from 'underscore';
import CONFIG from '../config/config';

export const AUTH_SUCCESS = 'success';
export const AUTH_CANCEL = 'cancel';

class AuthHelper {
    /**
     * Check if user is signed-in Firebase
     * @returns Promise 
     */
    static isUserSignedInFirebase() {
        return new Promise((resolve, reject) => {
            Auth().onAuthStateChanged(function(user) {
                if (user)
                    resolve(user);
                else
                    resolve(false);
            });    
        });
    }
    /**
     * Firebase Logout 
     * @returns Promise
     */
    static firebaseLogout() {
        return new Promise((resolve, reject) => {
            Auth().signOut().then(() => {
                resolve({
                    firebaseAuth: 'success'
                });
            },  (error) => {
                reject(error);
            });
        })
    }
    /**
     * Log in Facebook
     * @returns Promise
     */
    /*static facebookLogin() {
        return new Promise((resolve, reject) => {
            Promise.all([
                Facebook.initializeAsync({
                    appId: CONFIG.FACEBOOK.appID
                }),
                Facebook.logInWithReadPermissionsAsync({permissions: ['public_profile']})
            ]).then(v => {
                resolve(v[1]);
            }, (error) => {
                reject(error);
            });
        });
    }*/
    /**
     * Firebase Facebook Auth
     * @param {string} token 
     * @returns Promise
     */
    /*static firebaseFacebookAuth(token) {
        return new Promise((resolve, reject) => {
            const credential = FirebaseStatic.auth.FacebookAuthProvider.credential(token);
            Promise.all([
                Firebase.auth().setPersistence(FirebaseStatic.auth.Auth.Persistence.LOCAL),
                Firebase.auth().signInWithCredential(credential)
            ]).then(() => {
                resolve({
                    firebaseAuth: 'success'
                });
            }, (error) => {
                reject(error);
            });
        })
    }*/
    /**
     * Firebase Google Auth
     * @param {string} accessToken
     * @param {string} idToken 
     * @returns Promise
     */
    /*static firebaseGoogleAuth(accessToken, idToken) {
        return new Promise((resolve, reject) => {
            const credential = FirebaseStatic.auth.GoogleAuthProvider.credential(idToken, accessToken);
            Promise.all([
                Firebase.auth().setPersistence(FirebaseStatic.auth.Auth.Persistence.LOCAL),
                Firebase.auth().signInWithCredential(credential)
            ]).then(() => {
                resolve({
                    firebaseAuth: 'success'
                });
            }, (error) => {
                reject(error);
            });
        });
    }*/
    /**
     * Log in Google
     * @returns Promise
     */
    /*static googleLogin() {
        return new Promise((resolve, reject) => {
            Google.logInAsync({
                iosClientId: CONFIG.OAuth2.iOSExpoClientID,
                androidClientId: CONFIG.OAuth2.googleExpoClientID,
                scopes: ['profile', 'email']
            }).then(({type, accessToken, user, idToken}) => {
                let res = {
                    type
                };
                if (type === AUTH_SUCCESS) {
                    res.accessToken = accessToken;
                    res.idToken = idToken
                }
                resolve(res);
            }, (error) => {
                reject(error);
            });
        });
    }*/
    /**
     * Sign-up with email and address
     * 
     * @param {string} email 
     * @param {string} password
     * @returns Promise 
     */
    static emailRegistration(email, password) {
        return new Promise((resolve, reject) => {
            Auth().createUserWithEmailAndPassword(email, password).then((res) => {
                resolve(res);
            }, (error) => {
                reject(error);
            });
        });
    }
    /**
     * Log in with email address
     * 
     * @param {string} email 
     * @param {string} password 
     * @returns Promise
     */
    static emailLogin(email, password) {
        return new Promise((resolve, reject) => {
            Auth().signInWithEmailAndPassword(email, password).then((res) => {
                resolve(AUTH_SUCCESS);
            }, (error) => {
                reject(error);
            });
        });
    }
    /**
     * Send email verification to the user
     * @param {object} user 
     */
    static sendEmailVerification(user) {
        if (user) {
            const locale = i18n.locale,
                actionCodeSettings = {
                    url: 'https://ebazaarnew.page.link/ZCg5',
                    iOS: {
                        bundleId: 'com.ebazaarnew'
                    },
                    android: {
                        packageName: 'com.ebazaarnew',
                        installApp: false,
                    },
                    handleCodeInApp: false
                };
            Auth().setLanguageCode(locale);
            user.sendEmailVerification(actionCodeSettings);
        }
    }
    /**
     * Send Password Reset email
     * 
     * @param {string} email 
     * @returns Promise
     */
    static sendPasswordResetEmail(email) {
        return new Promise((resolve, reject) => {
            const locale = i18n.locale;
            Auth().setLanguageCode(locale);
            Auth().sendPasswordResetEmail(email).then((res) => {
                resolve(AUTH_SUCCESS);
            }, (error) => {
                reject(error);
            });
        });
    }
    /**
     * Firebase phone authentication
     * 
     * @param {string} verificationId 
     * @param {string} verificationCode
     * @returns Promise 
     */
    static firebasePhoneAuth(verificationId, verificationCode) {
        return new Promise((resolve, reject) => {
            const credential = Auth.PhoneAuthProvider.credential(
                verificationId,
                verificationCode
            );
            Auth().signInWithCredential(credential).then(() => {
                resolve(AUTH_SUCCESS);
            }, (error) => {
                reject(error);
            });
        });
    }
}

export default AuthHelper;