import _ from 'underscore';
import AuthHelper from '../../helpers/auth_helper';
import UserProfileDb from '../user_profiles';
import Storage from '../storage';
import FileHelper from '../../helpers/file_helper';

class UserProfileHelper {
    /**
     * Gets user profile
     * @returns Promise
     */
    static getUserProfile() {
        return new Promise(async (resolve, reject) => {
            let userProfileData = null;
            try {
                const user = await AuthHelper.isUserSignedInFirebase();
                if (_.isObject(user)) {
                    userProfileData = {
                        uid: user.uid,
                        fullName: user.displayName,
                        profileImage: !_.isNull(user.photoURL) ? user.photoURL : null
                    };
                    const userProfile = await UserProfileDb.getUserProfile(user.uid);
                    if (_.isObject(userProfile)) {
                        userProfileData.userProfile = userProfile;
                        const storageLocation = userProfile.getAvatarStorageLocation();
                        if (!_.isNull(storageLocation)) {
                            const filename = FileHelper.getImageStorage200x200(storageLocation);
                            userProfileData.profileImage = Storage.makeStoragePublicUrl(filename);
                            userProfileData.profileImageBase64 = userProfile.getAvatarBase64();
                        }
                    }
                }
                resolve(userProfileData);    
            } catch (error) {
                reject(error);
            }
        });
    }
}

export default UserProfileHelper;