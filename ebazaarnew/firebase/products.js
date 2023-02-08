import firestore from '@react-native-firebase/firestore';
import _ from 'underscore';

class Product {
    id = null;
    seller = null;
    category_id = null;
    sub_category_id = null;
    name = null;
    price = null;
    image_200x200 = null;
    image_400x400 = null;
    image_800x800 = null;
    slider_images = [];
    sold_quantity = null;
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
    getSellerId() {
        if (_.isObject(this.seller))
            return this.seller.id;
        return null;
    }
    getSellerName() {
        if (_.isObject(this.seller))
            return this.seller.name;
        return null;
    }
    getCategoryId() {
        return this.category_id;
    }
    getSubCategoryId() {
        return this.sub_category_id;
    }
    getName() {
        return this.name;
    }
    getPrice() {
        return this.price;
    }
    getImage200x200() {
        return this.image_200x200;
    }
    getImage400x400() {
        return this.image_400x400;
    }
    getImage800x800() {
        return this.image_800x800;
    }
    getSliderImages() {
        return this.slider_images;
    }
    getSoldQuantity() {
        return this.sold_quantity;
    }
}

class ProductsDb {
    /**
     * Gets especially products
     * @returns Promise
     */
    static getEspeciallyProducts() {
        return new Promise(async (resolve, reject) => {
            try {
                const collection = await firestore()
                    .collection('products')
                    .orderBy('id', 'asc')
                    .get();

                const products = [];
                collection.forEach((documentSnapshot) => {
                    const product = new Product(documentSnapshot.data());
                    products.push(product)
                })

                resolve(products);
            } catch (error) {
                reject(error);
            }
        });
    }
    /**
     * Gets product by given id
     * 
     * @param {String} id 
     * @returns Promise
     */
    static getProductById(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const snapshot = await firestore()
                    .collection("products")
                    .where("id", "==", id)
                    .get();
                    
                if (snapshot.empty && snapshot.metadata.fromCache) {
                    throw new Error('Failed to fetch product');
                } else {
                    if (snapshot.size > 0) {
                        const product = new Product(snapshot.docs[0].data())
                        resolve(product)
                    }
                    else
                        resolve(null);
                }
            } catch (error) {
                reject(error);
            }            
        });
    }
}

export default ProductsDb;