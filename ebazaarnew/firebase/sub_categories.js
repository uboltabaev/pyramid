import firestore from '@react-native-firebase/firestore';
import _ from 'underscore';

export const SUB_CATEGORIES_TYPE = Object.freeze({
    CATEGORY: 'category',
    POPULAR_CATEGORY: 'popular_category',
    BRAND: 'brand'
});

class SubCategory {
    id = null;
    category_id = null;
    name = null;
    ru = null;
    uz = null;
    uz_latin = null;
    sub_sub_categories = null;
    image_storage_uri = null;
    type = SUB_CATEGORIES_TYPE.CATEGORY;
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
    getCategoryId() {
        return this.category_id;
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
    getSubSubCategories() {
        return this.sub_sub_categories;
    }
    getImageStorageUri() {
        return this.image_storage_uri;
    }
    getType() {
        return this.type;
    }
}

class SubCategoriesDb {
    /**
     * Gets Sub-categories by category id
     * 
     * @param {Integer} category_id
     * @returns Promise 
     */
    static getSubCategories(category_id) {
        return new Promise(async (resolve, reject) => {
            try {
                const collection = await firestore()
                    .collection('sub_categories')
                    .where("category_id", "==", category_id)
                    .orderBy('id', 'asc')
                    .get();

                const subCategories = [];
                collection.forEach((documentSnapshot) => {
                    const category = new SubCategory(documentSnapshot.data());
                    subCategories.push(category)
                })

                resolve(subCategories);
            } catch (error) {
                reject(error);
            }
        });
    }
}

export default SubCategoriesDb;