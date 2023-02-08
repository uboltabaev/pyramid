import AsyncStorage from '@react-native-async-storage/async-storage';
import _ from 'underscore';

export const ASYNC_STORAGE_STATUS = {
    SUCCESS: 'success',
    FAILURE: 'failure'
};
export const ASYNC_STORAGE_KEYS = {
    LANGUAGE: '@language'
};

class AsyncStorageHelper {
    /**
     * Stores data into Async Storage
     * @param {String | Object} value 
     */
    static storeData(key, value) {
        return new Promise(async (resolve, reject) => {
            try {
                if (_.isObject(value))
                    value = JSON.stringify(value);
                await AsyncStorage.setItem(key, value);
                resolve(ASYNC_STORAGE_STATUS.SUCCESS);
            } catch (error) {
                reject(error);
            }
        });
    }
    /**
     * Gets data from Async Storage
     * 
     * @param {String} key
     * @returns String | Object
     */
    static getData(key) {
        return new Promise(async (resolve, reject) => {
            try {
                const value = await AsyncStorage.getItem(key);
                if (value !== null) {
                    if (_.isObject(value))
                        value = JSON.parse(value);
                    resolve(value);
                } else
                    resolve(null);
            } catch (error) {
                reject(error);
            }
        });
    }
}

export default AsyncStorageHelper;