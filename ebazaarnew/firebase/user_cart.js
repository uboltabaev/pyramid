import firestore from '@react-native-firebase/firestore';
import _ from 'underscore';
import MiscHelper from '../helpers/misc_helper';

export const STATUS = Object.freeze({
    PENDING: 'pending',
    COMPLETED: 'completed'
});

export class UserCart {
    id = null;
    user_id = null;
    seller = {
        id: null,
        name: null
    };
    product = {
        id: null,
        name: null,
        price: null,
        color: null,
        size: null,
        model: null,
        image_200x200: null
    };
    quantity = null;
    free_shipment = null;
    shipment_price = null;
    status = null;
    creation_date = null;
    constructor(data) {
        this.setValues(data);
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
    getSellerId() {
        return this.seller.id;
    }
    getSellerName() {
        return this.seller.name;
    }
    getProductId() {
        return this.product.id;
    }
    getProductName() {
        return this.product.name;
    }
    getProductPrice() {
        return this.product.price;
    }
    getProductColor() {
        return this.product.color;
    }
    getProductSize() {
        return this.product.size;
    }
    getProductModel() {
        return this.product.model;
    }
    getProductImage200x200() {
        return this.product.image_200x200;
    }
    getQuantity() {
        return this.quantity;
    }
    setQuantity(quantity) {
        this.quantity = quantity;
    }
    isFreeShipment() {
        return this.free_shipment;
    }
    getShipmentPrice() {
        return this.shipment_price;
    }
    getStatus() {
        return this.status;
    }
    getCreationDate() {
        return this.creation_date;
    }
    setCreationDate(creation_date) {
        this.creation_date = creation_date;
    }
}

class UserCartDb {
    /**
     * Gets user cart
     * 
     * @param {String} uid
     * @returns Promise
     */
    static getUserCart(uid) {
        return new Promise(async (resolve, reject) => {
            try {
                const collection = await firestore()
                    .collection('user_cart')
                    .orderBy('creation_date', 'desc')
                    .where("user_id", "==", uid)
                    .where("status", "==", STATUS.PENDING)
                    .get();

                const items = []
                collection.forEach((documentSnapshot) => {
                    const userCart = new UserCart(documentSnapshot.data())
                    items.push(userCart)
                })

                resolve(items);
            } catch (error) {
                reject(error);
            }
        });
    }
    /**
     * Saves user cart
     * 
     * @param {UserCart} userCart
     * @returns Promise
     */
    /*static saveCart(userCart) {
        return new Promise(async (resolve, reject) => {
            try {
                const uuid = MiscHelper.getUUID(),
                    docRef = db.collection("user_history").doc(uuid),
                    date = Firebase.firestore.FieldValue.serverTimestamp();
                userCart.setId(uuid);
                userCart.setCreationDate(date);
                // Save user cart
                const data = Object.assign({}, userHistory);
                await docRef.set(data);
                // Get stored user history
                const get = await docRef.withConverter(UserCartConverter).get();
                resolve(get.data());
            } catch (error) {
                reject(error);
            }
        });
    }*/
    /**
     * Changes user cart quantity
     * 
     * @param {String} id 
     * @param {Integer} quantity
     * @returns Promise 
     */
    static changeQuantity(id, quantity) {
        return new Promise(async (resolve, reject) => {
            try {
                await firestore()
                    .collection("user_cart")
                    .doc(id)
                    .update({
                        quantity
                    })
                resolve(true);
            } catch (error) {
                reject(error);
            }
        });
    }
    /**
     * Deletes user cart
     * 
     * @param {String} id
     * @returns Promised 
     */
    /*static delete(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const db = Firebase.firestore(),
                    result = await db.collection("user_cart").doc(id).delete();
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    }*/
}

export default UserCartDb;