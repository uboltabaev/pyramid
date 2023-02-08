import i18n from 'i18n-js';
import _ from 'underscore';
import CONFIG from '../config/config';
import FBStorage from '@react-native-firebase/storage';
import MiscHelper from '../helpers/misc_helper';
import FileHelper from '../helpers/file_helper';

export const STORAGE_FOLDERS = Object.freeze({
    USER_AVATARS: 'user_avatars',
    CHAT_IMAGE_FILES: 'chat_files/images',
    CHAT_AUDIO_FILES: 'chat_files/audio'
});

const errorMessage = (error) => {
    let errorMessage = '';
    switch(error.code) {
        case 'storage/unauthorized':
            errorMessage = i18n.t('errors:userNoPermission', {defaultValue: 'У пользователя нет прав доступа к объекту'});
            break;
        case 'storage/canceled':
            errorMessage = i18n.t('errors:userCanceledUpload', {defaultValue: 'Пользователь отменил загрузку'});
            break;
        case 'storage/unknown':
            errorMessage = i18n.t('errors:errorOccured', {defaultValue: 'Произошла ошибка, попробуйте позже'});
            break;
    }
    return errorMessage;
};

class Storage {
    /**
     * Converts Firestore URI to public URI
     * 
     * @param {string} storageUri 
     * @returns {string}
     */
    /*static async getStorageUrl(storageUri) {
        const imageRef = Firebase.storage().refFromURL(storageUri),
            imageUri = await imageRef.getDownloadURL();
        return imageUri;
    }*/
    /**
     * Makes Firestore public URI
     * 
     * @param {string} storageUri 
     * @returns {string}
     */
    static makeStoragePublicUrl(storageUri) {
        if (storageUri === undefined || storageUri === '')
            return '';
        const bucket = CONFIG.FIREBASE.storageBucket,
            cleared = storageUri.replace(/^gs(s?):\/\//i, ""),
            publicUri = [
                'https://firebasestorage.googleapis.com/v0/b/',
                bucket,
                '/o/',
                cleared.indexOf('/') !== -1 ? encodeURIComponent(cleared.substring(cleared.indexOf('/') + 1), cleared.length) : '',
                '?alt=media'
            ];
        return publicUri.join('');
    }
    /**
     * Deletes file from storage
     * 
     * @param {String} folder 
     * @param {String} filename 
     */
    static async deleteFile(folder, filename) {
        return new Promise(async (resolve, reject) => {
            try {
                const a = [
                    folder,
                    '/',
                    filename
                ]
                const storageRef = FBStorage().ref(),
                    fileRef = storageRef.child(a.join(''))
                
                const result = await fileRef.delete()
                resolve(result)
            } catch (e) {
                reject(e)
            }
        })
    }
    /**
     * Uploads photo into storage
     * 
     * @param {Object} picture
     * @param {String} folder
     * @param {Function} callback
     * @returns Promise
     */
    static async uploadPhoto(picture, folder, callback) {
        return new Promise(async (resolve, reject) => {
            const { uri } = picture
            const uuid = MiscHelper.getUUID(),
                filename = uuid + '.jpg',
                fullPath = [
                    folder,
                    '/',
                    filename
                ],
                storageRef = FBStorage().ref(fullPath.join('')),
                uploadTask = storageRef.putFile(uri, {
                    cacheControl: 'private, max-age=15552000'
                })
    
            // Listen for state changes, errors, and completion of the upload.
            uploadTask.on(FBStorage.TaskEvent.STATE_CHANGED, function(snapshot) {
                const progress = parseInt((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                if (_.isFunction(callback))
                    callback(progress);
            }, function(error) {
                const errMessage = errorMessage(error);
                reject(errMessage);
            }, function() {
                // Return download URL
                uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                    const data = {
                        filename,
                        downloadURL,
                        storageLocation: 'gs://' + uploadTask.snapshot.ref.bucket + '/' + uploadTask.snapshot.ref.fullPath
                    }
                    resolve(data);
                });
            });    
        });
    }
    /**
     * Uploads audio into storage
     * 
     * @param {String} uri
     * @param {String} folder
     * @param {Function} callback
     * @returns Promise
     */
    /*static async uploadAudio(uri, folder, callback) {
        return new Promise(async (resolve, reject) => {
            // Convert file URI into blob
            const fetchResponse = await fetch(uri);
            const blob = await fetchResponse.blob();

            const uuid = MiscHelper.getUUID(),
                {ext} = FileHelper.getFileNameExt(uri),
                filename = uuid + '.' + ext,
                contentType = ext === 'caf' ? 'audio/x-caf' : 'audio/3gpp',
                fullPath = [
                    folder,
                    '/',
                    filename
                ],
                storageRef = Firebase.storage().ref(),
                metadata = {
                    contentType
                },
                uploadTask = storageRef.child(fullPath.join('')).put(blob, metadata);

            // Listen for state changes, errors, and completion of the upload.
            uploadTask.on(Firebase.storage.TaskEvent.STATE_CHANGED, function(snapshot) {
                const progress = parseInt((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                if (_.isFunction(callback))
                    callback(progress);
            }, function(error) {
                const errMessage = errorMessage(error);
                reject(errMessage);
            }, function() {
                const data = {
                    filename,
                    storageLocation: 'gs://' + uploadTask.snapshot.ref.bucket + '/' + uploadTask.snapshot.ref.fullPath
                }
                resolve(data);
            });
        });
    }*/
}

export default Storage;