import firestore from '@react-native-firebase/firestore';
import _ from 'underscore';
import i18n from 'i18n-js';
import MiscHelper from '../helpers/misc_helper';

const STATUS = Object.freeze({
    ACTIVE: 'ACTIVE',
    DELETED: 'DELETED'
});

export class UserShippingAddress {
    id = '';
    user_id = '';
    contact_person = '';
    phone_number = '';
    street_address = '';
    apartment_address = null;
    region = null;
    sub_region = null;
    postcode = '';
    as_default = false;
    status = STATUS.ACTIVE;
    creation_time = null;
    update_time = null;
    constructor(data = null) {
        if (data !== null)
            this.setValues(data);
        this.locale = i18n.locale;
    }
    setValues(data) {
        for (let prop in data) {
            if (this.hasOwnProperty(prop))
                this[prop] = data[prop];
        }
    }
    getId() {
        return this.id;
    }
    setId(id) {
        this.id = id;
    }
    getUserId() {
        return this.user_id;
    }
    setUserId(user_id) {
        this.user_id = user_id;
    }
    getContactPerson() {
        return this.contact_person;
    }
    getPhoneNumber() {
        return this.phone_number;
    }
    getStreetAddress() {
        return this.street_address;
    }
    getApartmentAddress() {
        return this.apartment_address;
    }
    getRegionId() {
        return _.isObject(this.region) ? this.region.id : null;
    }
    getRegion() {
        return this.region;
    }
    getRegionName() {
        return _.isObject(this.region) ? this.region[this.locale] : '';
    }
    getSubRegionId() {
        return _.isObject(this.sub_region) ? this.sub_region.id : null;
    }
    getSubRegion() {
        return this.sub_region;
    }
    getSubRegionName() {
        return _.isObject(this.sub_region) ? this.sub_region[this.locale] : '';
    }
    getPostcode() {
        return this.postcode;
    }
    getAsDefault() {
        return this.as_default;
    }
    getStatus() {
        return this.status;
    }
    setStatus(status) {
        this.status = status;
    }
    setCreationTime(creation_time) {
        this.creation_time = creation_time
    }
    setUpdateTime(update_time) {
        this.update_time = update_time;
    }
    toForm() {
        return {
            contactPerson: this.contact_person,
            phoneNumber: this.phone_number,
            streetAddress: this.street_address,
            apartmentAddress: this.apartment_address,
            region: this.region[this.locale],
            subRegion: this.sub_region[this.locale],
            postcode: typeof this.postcode === 'number' ? this.postcode.toString() : this.postcode,
            asDefault: this.as_default
        };
    }
    setFormData(data) {
        if (_.isObject(data)) {
            for (let prop in data) {
                switch(prop) {
                    case 'contactPerson':
                        this.contact_person = data[prop];
                        break;
                    case 'phoneNumber':
                        this.phone_number = data[prop];
                        break;
                    case 'streetAddress':
                        this.street_address = data[prop];
                        break;
                    case 'phoneNumber':
                        this.phone_number = data[prop];
                        break;
                    case 'apartmentAddress':
                        this.apartment_address = data[prop];
                        break;
                    case 'region':
                        this.region = data[prop];
                        break;
                    case 'subRegion':
                        this.sub_region = Object.assign({}, data[prop]);
                        break;
                    case 'postcode':
                        this.postcode = parseInt(data[prop]);
                        break;
                    case 'asDefault':
                        this.as_default = data[prop];
                        break;
                }
            }
        }
    }
    save(data) {
        return new Promise((resolve, reject) => {
            this.setFormData(data);
            delete this.locale;
            if (this.id === '') {
                // Create a new shipping address
                const uuid = MiscHelper.getUUID();
                const date = firestore.FieldValue.serverTimestamp()

                this.setId(uuid)
                this.setUserId(data['user_id'])
                this.setStatus(STATUS.ACTIVE)
                this.setCreationTime(date)
                this.setUpdateTime(date)

                const o = Object.assign({}, this);
                UserShippingAddressesDb.createUserShippingAddress(uuid, o).then((created) => {
                    resolve(created);
                }, (error) => {
                    reject(error);
                });
            } else {
                // Update existing that one
                const o = Object.assign({}, this);
                UserShippingAddressesDb.updateUserShippingAddress(this.id, o).then((updated) => {
                    resolve(updated);
                }, (error) => {
                    reject(error);
                });
            }
        });
    }
}

class UserShippingAddressesDb {
    /**
     * Gets list of User Shipping Addresses data
     * 
     * @param {String} uid 
     * @returns Promise
     */
    static getUserShippingAddresses(uid) {
        return new Promise(async (resolve, reject) => {
            try {
                const collection = await firestore()
                    .collection('user_shipping_addresses')
                    .where("user_id", "==", uid)
                    .where("status", "==", STATUS.ACTIVE)
                    .orderBy("creation_time")
                    .get();

                const shippingAddresses = []

                collection.forEach((documentSnapshot) => {
                    const shippingAddress = new UserShippingAddress(documentSnapshot.data())
                    shippingAddresses.push(shippingAddress)
                })

                resolve(shippingAddresses)
            } catch (error) {
                reject(error);
            }
        });
    }
    /**
     * Gets UserShippingAddress by ID
     * 
     * @param {String} id 
     * @returns Promise
     */
    static async getById(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const get = await firestore()
                    .collection('user_shipping_addresses')
                    .doc(id)
                    .get()
                const shippingAddress = new UserShippingAddress(get.data())
                resolve(shippingAddress)
            } catch (error) {
                reject(error)
            }
        })
    }
    /**
     * Creates User Shipping Address
     * 
     * @param {String} id
     * @param {Object} data
     * @returns Promise 
     */
    static async createUserShippingAddress(id, data) {
        return new Promise(async (resolve, reject) => {
            try {
                // If as default is sert true, make current is false
                if (data.as_default) {
                    await UserShippingAddressesDb.setAsDefaultFalse();
                }
                const doc = await firestore()
                    .collection('user_shipping_addresses')
                    .doc(id)
                    .set(data)
                const shippingAddress = await UserShippingAddressesDb.getById(id)
                resolve(shippingAddress)
            } catch(error) {
                reject(error);
            }
        });
    }
    /**
     * Updates User Shipping Address by given id
     * 
     * @param {String} id 
     * @param {Object} data
     * @returns Promise 
     */
    static async updateUserShippingAddress(id, data) {
        return new Promise(async (resolve, reject) => {
            try {
                // If as default is set true, make current is false
                if (data.as_default) {
                    await UserShippingAddressesDb.setAsDefaultFalse();
                }
                const docRef = firestore().collection("user_shipping_addresses").doc(id),
                    doc = await docRef.get(),
                    date = firestore.FieldValue.serverTimestamp();
                if (doc.exists) {
                    data.update_time = date;
                    await docRef.update(data);
                }
                const shippingAddress = await UserShippingAddressesDb.getById(id)
                resolve(shippingAddress);
            } catch (error) {
                reject(error);
            }
        });
    }
    /**
     * Deletes User Shipping Address by given id
     * @param {String} id 
     * @returns Promise
     */
    static delete(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await firestore().collection("user_shipping_addresses").doc(id).delete();
                resolve(result);
            } catch (error) {
                reject(error);
            }
        })
    }
    /**
     * Sets false marked as true as_default field
     * @returns Promise
     */
    static setAsDefaultFalse() {
        return new Promise(async (resolve, reject) => {
            try {
                const activeRef = await firestore().collection("user_shipping_addresses")
                        .where("as_default", "==", true)
                        .get();
                for (let doc of activeRef.docs) {
                    const userShippingAddress = new UserShippingAddress(doc.data());
                    if (_.isObject(userShippingAddress) && userShippingAddress.getAsDefault()) {
                        const updateData = {
                            as_default: false
                        }
                        doc.ref.update(updateData);
                    }
                }
                resolve(true);
            } catch (error) {
                reject(error);
            }
        });
    }
    /**
     * Sets User Shipping Address as default by given id
     * 
     * @param {String} id
     * @returns Promise 
     */
    static setAsDefault(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const data = {
                    as_default: true
                };
                const shippingAddress = await UserShippingAddressesDb.updateUserShippingAddress(id, data);
                resolve(shippingAddress);
            } catch (error) {
                reject(error);
            }
        });
    }
}

export default UserShippingAddressesDb;