import firestore from '@react-native-firebase/firestore';
import _ from 'underscore';
import moment from 'moment';
import MiscHelper from '../helpers/misc_helper';

export class UserHistory {
    id = null;
    user_id = null;
    seller_id = null;
    product_id = null;
    name = null;
    image_200x200 = null;
    price = null;
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
        return this.seller_id;
    }
    getProductId() {
        return this.product_id;
    }
    getName() {
        return this.name;
    }
    getImage() {
        return this.image_200x200;
    }
    getPrice() {
        return this.price;
    }
    getCreationDate() {
        return this.creation_date;
    }
    setCreationDate(creation_date) {
        this.creation_date = creation_date;
    }
}

class UserHistoryDb {
    /**
     * Gets user last 30 days history
     * 
     * @param {String} uid
     * @param {String | null} sellerId
     * @returns Promise
     */
    static getHistory(uid, sellerId = null) {
        return new Promise(async (resolve, reject) => {
            try {
                let today = moment(),
                    past = moment().subtract(30, 'days');

                // Set up today date 
                today = today.toDate();
                today.setHours(23); 
                today.setMinutes(59); 
                today.setSeconds(59);

                // Set up past date
                past = past.toDate();
                past.setHours(0); 
                past.setMinutes(0); 
                past.setSeconds(0);

                const q = firestore()
                    .collection('user_history')
                    .orderBy("creation_date", "desc")
                    .where("user_id", "==", uid)
                    .where("creation_date", "<=", today)
                    .where("creation_date", ">=", past);                

                // If sellerId is not null
                if (!_.isNull(sellerId))
                    q = q.where("seller_id", "==", sellerId);
                
                const products = [];                
                const collection = await q.get();

                collection.forEach((documentSnapshot) => {
                    const history = new UserHistory(documentSnapshot.data())
                    products.push(history)
                })

                resolve(products)
            } catch (error) {
                reject(error);
            }
        });
    }
    /**
     * Saves user history
     * 
     * @param {UserHistory} userHistory 
     * @returns Promise
     */
    static saveHistory(userHistory) {
        return new Promise(async (resolve, reject) => {
            try {
                // Check the product is not seen in the same day by user
                const startToday = new Date(),
                    endToday = new Date()

                // Set up start date
                startToday.setHours(0)
                startToday.setMinutes(0)
                startToday.setSeconds(0)

                // Set up end date
                endToday.setHours(23)
                endToday.setMinutes(59)
                endToday.setSeconds(59)

                const querySnapshot = await firestore().collection('user_history')
                    .where("user_id", "==", userHistory.getUserId())
                    .where("product_id", "==", userHistory.getProductId())
                    .where("creation_date", ">=", startToday)
                    .where("creation_date", "<=", endToday)
                    .get()

                if (querySnapshot.size === 0) {
                    const uuid = MiscHelper.getUUID(),
                        docRef = firestore().collection("user_history").doc(uuid),
                        date = firestore.FieldValue.serverTimestamp()

                    // Set id and creation date
                    userHistory.setId(uuid)
                    userHistory.setCreationDate(date)

                    // Save user history
                    const data = Object.assign({}, userHistory)
                    await docRef.set(data)

                    // Get stored user history
                    const get = await docRef.get()
                    const history = new UserHistory(get.data())
                    resolve(history)
                } else {
                    resolve(null);
                }
            } catch (error) {
                reject(error);
            }
        });
    }
}

export default UserHistoryDb;