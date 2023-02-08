import firestore from '@react-native-firebase/firestore';
import _ from 'underscore';

export const USER_TYPE = Object.freeze({
    USER: 'user',
    SELLER: 'seller'
});

export const SEX = Object.freeze({
    MALE: 'MALE',
    FEMALE: 'FEMALE'
});

export class UserProfile {
    user_id = null;
    avatar = null;
    contact_person = null;
    sex = null;
    birthday = null;
    creation_time = null;
    update_time = null;
    constructor(data) {
        this.setValues(data);
    }
    setValues(data) {
        for (let prop in data) {
            if (this.hasOwnProperty(prop))
                this[prop] = data[prop];
        }
    }
    getUserId() {
        return this.user_id;
    }
    getAvatarPublicUrl() {
        if (_.isObject(this.avatar))
            return this.avatar.public_url;
        return null;
    }
    getAvatarFilename() {
        if (_.isObject(this.avatar))
            return this.avatar.filename;
        return null;
    }
    getAvatarStorageLocation() {
        if (_.isObject(this.avatar))
            return this.avatar.storage_location;
        return null;
    }
    getAvatarBase64() {
        if (_.isObject(this.avatar))
            return this.avatar.base64;
        return null;
    }
    getContactPerson() {
        return this.contact_person;
    }
    setContactPerson(contact_person) {
        this.contact_person = contact_person;
    }
    getSex() {
        return this.sex;
    }
    getBirthday() {
        return this.birthday;
    }
    getData() {
        return {
            user_id: this.user_id,
            avatar: this.avatar,
            contact_person: this.contact_person,
            sex: this.sex,
            birthday: this.birthday,
            creation_time: this.creation_time,
            update_time: this.update_time,
        };
    }
}

class UserProfilesDb {
    /**
     * Gets user profile data
     * 
     * @param {String} uid 
     * @returns Promise
     */
    static getUserProfile(uid) {
        return new Promise(async (resolve, reject) => {
            try {
                const docRef = firestore()
                    .collection("user_profiles")
                    .doc(uid)

                const doc = await docRef.get()

                if (doc.exists) {
                    const userProfile = new UserProfile(doc.data())
                    resolve(userProfile)
                } else {
                    const date = firestore.FieldValue.serverTimestamp()
                    const data = {
                        user_id: uid,
                        creation_time: date,
                        update_time: date
                    }
                    await docRef.set(data)

                    const userProfile = new UserProfile(data)
                    resolve(userProfile)
                }    
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Updates User Profile by giving 
     * 
     * @param {String} uid 
     * @param {Object} data
     * @param {Boolean} returnUpdated
     * @returns Promise 
     */
    static updateUserProfile(uid, data, returnUpdated = true) {
        return new Promise(async (resolve, reject) => {
            try {
                const date = firestore.FieldValue.serverTimestamp()
                const docRef = firestore()
                    .collection("user_profiles")
                    .doc(uid)

                const doc = await docRef.get()
                
                if (doc.exists) {
                    data.update_time = date
                    await docRef.update(data)
                } else {
                    data.user_id = uid;
                    data.creation_time = date
                    data.update_time = date
                    await docRef.set(data)
                }
                if (returnUpdated) {
                    const get = await docRef.get()
                    const userProfile = new UserProfile(get.data())
                    resolve(userProfile)
                } else {
                    resolve(date)
                }
            } catch (error) {
                reject(error);
            }
        });
    }
}

export default UserProfilesDb;