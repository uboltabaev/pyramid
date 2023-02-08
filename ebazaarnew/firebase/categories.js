import firestore from '@react-native-firebase/firestore';
import _ from 'underscore';

class Category {
    id = null;
    name = null;
    ru = null;
    uz = null;
    uz_latin = null;
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
    getName() {
        return this.name;
    }
    getRu() {
        return this.ru;
    }
    getUz() {
        return this.uz;
    }
    getUzLatin() {
        return this.uz_latin;
    }
}

class CategoriesDb {
    /**
     * Gets categories list
     * @returns Promise
     */
    static getCategories() {
        return new Promise(async (resolve, reject) => {
            try {
                const collection = await firestore()
                    .collection('categories')
                    .orderBy('id', 'asc')
                    .get();

                const categories = [];
                collection.forEach((documentSnapshot) => {
                    const category = new Category(documentSnapshot.data());
                    categories.push(category)
                })

                resolve(categories);
            } catch (error) {
                reject(error);
            }
        });
    }
}

export default CategoriesDb;